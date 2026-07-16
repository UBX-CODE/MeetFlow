import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
} from "lucide-react";

import { socket } from "../socket";

type MeetingState = {
  name?: string;
  isMicOn?: boolean;
  isCameraOn?: boolean;
};

export default function MeetingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId } = useParams();

  const state = location.state as MeetingState | null;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Record<string, RTCPeerConnection>>({});

  const [isMicOn, setIsMicOn] = useState(state?.isMicOn ?? true);
  const [isCameraOn, setIsCameraOn] = useState(state?.isCameraOn ?? true);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
  const [isMediaReady, setIsMediaReady] = useState(false);

  const name = state?.name ?? "Guest";

  const createPeerConnection = (targetUserId: string) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          target: targetUserId,
          candidate: event.candidate,
        });
      }
    };

    peerConnection.ontrack = (event) => {
      setRemoteStreams((prev) => ({
        ...prev,
        [targetUserId]: event.streams[0],
      }));
    };

    peerConnectionsRef.current[targetUserId] = peerConnection;

    return peerConnection;
  };


  useEffect(() => {
  if (!roomId || !isMediaReady) return;

  socket.connect();

  const handleConnect = () => {
    console.log("Connected to server:", socket.id);
    socket.emit("join-room", roomId);
  };

  const handleUserJoined = async (userId: string) => {
  console.log("New user joined:", userId);

  if (!streamRef.current) {
    console.log("Media stream not ready");
    return;
  }

  const peerConnection = createPeerConnection(userId);

  streamRef.current.getTracks().forEach((track) => {
    peerConnection.addTrack(track, streamRef.current!);
    });

  const offer = await peerConnection.createOffer();

  await peerConnection.setLocalDescription(offer);

  socket.emit("offer", {
    target: userId,
    offer,
  });
};
const handleOffer = async ({sender, offer}: {sender: string, offer: RTCSessionDescriptionInit}) => {
  console.log("Offer received from:", sender);
  if (!streamRef.current) {
  console.log("Media stream not ready");
  return;
}
  const peerConnection = createPeerConnection(sender);
  streamRef.current.getTracks().forEach((track) => {
    peerConnection.addTrack(track, streamRef.current!);
  });

  await peerConnection.setRemoteDescription(offer);

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  socket.emit("answer", {
    target: sender,
    answer,
  });
}

const handleAnswer = async ({ sender, answer }: { sender: string; answer: RTCSessionDescriptionInit }) => {
  console.log("Answer received from:", sender);
  const peerConnection = peerConnectionsRef.current[sender];
  if (peerConnection) {
    await peerConnection.setRemoteDescription(answer);
  }
};

const handleIceCandidate = async ({ sender, candidate }: { sender: string; candidate: RTCIceCandidateInit }) => {
  const peerConnection = peerConnectionsRef.current[sender];
  if (peerConnection) {
    try {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (e) {
      console.error("Error adding received ice candidate", e);
    }
  }
};

  socket.on("connect", handleConnect);
  socket.on("user-joined", handleUserJoined);
  socket.on("offer", handleOffer);
  socket.on("answer", handleAnswer);
  socket.on("ice-candidate", handleIceCandidate);

  // Important:
  // socket pehle se connected ho sakta hai
  if (socket.connected) {
    handleConnect();
  }

  return () => {
    socket.off("connect", handleConnect);
    socket.off("user-joined", handleUserJoined);
    socket.off("offer", handleOffer);
    socket.off("answer", handleAnswer);
    socket.off("ice-candidate", handleIceCandidate);
    socket.disconnect();
  };
}, [roomId, isMediaReady]);

  useEffect(() => {
    const startMeetingMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

        streamRef.current = stream;

        // PreJoin state apply karo
        const audioTrack = stream.getAudioTracks()[0];
        const videoTrack = stream.getVideoTracks()[0];

        if (audioTrack) {
          audioTrack.enabled = isMicOn;
        }

        if (videoTrack) {
          videoTrack.enabled = isCameraOn;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        setIsMediaReady(true);
      } catch (error) {
        console.error("Meeting media error:",error);
      }
    };

    startMeetingMedia();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const toggleMic = () => {
    const audioTrack = streamRef.current?.getAudioTracks()[0];

    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;
    setIsMicOn(audioTrack.enabled);
  };

  const toggleCamera = () => {
    const videoTrack = streamRef.current?.getVideoTracks()[0];

    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;
    setIsCameraOn(videoTrack.enabled);
  };

  const leaveMeeting = () => {
    streamRef.current
      ?.getTracks()
      .forEach((track) => track.stop());

    navigate("/");
  };

  const remoteCount = Object.keys(remoteStreams).length;

  return (
    <main className="flex h-screen flex-col bg-[#F4F0E6] text-[#111111] overflow-hidden selection:bg-[#FF3300] selection:text-white">

      {/* Header */}
      <header className="flex items-center justify-between border-b-[4px] border-black bg-white px-6 py-4 md:px-12 z-10 relative">
        <h1 className="font-display text-3xl tracking-wide uppercase">
          MeetFlow
        </h1>

        <div className="flex items-center gap-4">
          <div className="bg-black text-white px-4 py-2 font-bold uppercase tracking-wider text-sm">
            Room: {roomId}
          </div>
        </div>
      </header>

      {/* Video Area */}
      <section className="flex flex-1 flex-col items-center justify-center p-4 md:p-8 relative z-0 min-h-0 w-full">

        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>

        <div className={`relative w-full h-full max-w-[1400px] overflow-y-auto overflow-x-hidden border-[6px] border-black bg-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] group rounded-3xl ${remoteCount >= 2 ? "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4 items-center" : "flex items-center justify-center"}`}>

          {/* Remote Streams */}
          {Object.entries(remoteStreams).map(([id, stream]) => (
            <div key={id} className={`relative overflow-hidden bg-zinc-900 ${remoteCount === 1 ? "absolute inset-0 w-full h-full z-0" : "w-full aspect-video rounded-2xl border-[4px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]"}`}>
              <video
                autoPlay
                playsInline
                ref={(el) => {
                  if (el) el.srcObject = stream;
                }}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-white border-[2px] border-black px-3 py-1 text-sm font-bold uppercase shadow-[2px_2px_0_0_rgba(0,0,0,1)] z-10">
                Remote User
              </div>
            </div>
          ))}

          {/* Local Stream */}
          <div className={`relative overflow-hidden bg-black transition-all duration-300 ${
            remoteCount === 0 ? "w-full h-full z-0" : 
            remoteCount === 1 ? "absolute bottom-32 right-8 w-1/4 min-w-[200px] max-w-[320px] aspect-video z-20 border-[4px] border-white shadow-[8px_8px_0_0_rgba(255,255,255,1)] rounded-2xl" : 
            "w-full aspect-video border-[4px] border-white shadow-[8px_8px_0_0_rgba(255,255,255,1)] rounded-2xl z-10"
          }`}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />

            {!isCameraOn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FF0055] text-black m-[-2px]">
                {/* Decorative Geometric Elements */}
                {remoteCount === 0 && (
                  <div className="absolute top-6 left-6 flex gap-3 z-20">
                    <div className="w-6 h-6 bg-black rounded-full"></div>
                    <div className="w-6 h-6 bg-black rounded-full"></div>
                    <div className="w-6 h-6 bg-black rounded-full"></div>
                  </div>
                )}

                <div className="text-center z-10">
                  <div className={`mx-auto flex ${remoteCount > 0 ? "h-16 w-16 text-3xl" : "h-40 w-40 text-7xl"} items-center justify-center rounded-full bg-white font-display uppercase border-[4px] border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)]`}>
                    {name.charAt(0)}
                  </div>

                  {remoteCount === 0 && (
                    <p className="mt-10 font-display text-5xl uppercase tracking-wider bg-black text-white px-8 py-3 border-[4px] border-black -rotate-2 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                      {name}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* User Name Badge */}
            {isCameraOn && (
              <div className={`absolute ${remoteCount > 0 ? "top-3 left-3 text-sm px-3 py-1" : "top-6 left-6 text-lg px-5 py-3"} bg-white border-[3px] border-black font-bold uppercase tracking-wider shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center gap-3 z-20`}>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-black"></div>
                {name} (You)
              </div>
            )}
          </div>

          {/* Floating Controls */}
          <div className="absolute bottom-0 left-0 w-full flex items-center justify-center gap-6 p-8 z-30 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-6">
              <button
                onClick={toggleMic}
                className={`flex h-16 w-16 items-center justify-center rounded-full border-[4px] border-black transition-all hover:scale-105 active:scale-95 shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 ${isMicOn
                    ? "bg-white text-black"
                    : "bg-[#FF3300] text-white"
                  }`}
              >
                {isMicOn ? (
                  <Mic size={28} strokeWidth={3} />
                ) : (
                  <MicOff size={28} strokeWidth={3} />
                )}
              </button>

              <button
                onClick={toggleCamera}
                className={`flex h-16 w-16 items-center justify-center rounded-full border-[4px] border-black transition-all hover:scale-105 active:scale-95 shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 ${isCameraOn
                    ? "bg-white text-black"
                    : "bg-[#0055FF] text-white"
                  }`}
              >
                {isCameraOn ? (
                  <Video size={28} strokeWidth={3} />
                ) : (
                  <VideoOff size={28} strokeWidth={3} />
                )}
              </button>

              <div className="h-10 w-1 bg-white/50 rounded-full mx-2 hidden sm:block"></div>

              <button
                onClick={leaveMeeting}
                className="flex items-center gap-3 h-16 px-8 items-center justify-center rounded-full border-[4px] border-black bg-black text-white hover:bg-[#FF3300] hover:text-white transition-colors font-bold uppercase tracking-widest shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
              >
                <PhoneOff size={24} strokeWidth={3} />
                <span className="hidden sm:inline">Leave</span>
              </button>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}