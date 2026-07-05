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

  const [isMicOn, setIsMicOn] = useState(
    state?.isMicOn ?? true
  );

  const [isCameraOn, setIsCameraOn] = useState(
    state?.isCameraOn ?? true
  );

  const name = state?.name ?? "Guest";

  useEffect(() => {
  if (!roomId) return;

  socket.connect();

  const handleConnect = () => {
    console.log("Connected to server:", socket.id);

    socket.emit("join-room", roomId);
  };

  const handleUserJoined = (userId: string) => {
    console.log("New user joined:", userId);
  };

  socket.on("connect", handleConnect);
  socket.on("user-joined", handleUserJoined);

  // Important:
  // socket pehle se connected ho sakta hai
  if (socket.connected) {
    handleConnect();
  }

  return () => {
    socket.off("connect", handleConnect);
    socket.off("user-joined", handleUserJoined);
    socket.disconnect();
  };
}, [roomId]);

  useEffect(() => {
    const startMeetingMedia = async () => {
      try {
        const stream =
          await navigator.mediaDevices.getUserMedia({
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
      } catch (error) {
        console.error(
          "Meeting media error:",
          error
        );
      }
    };

    startMeetingMedia();

    return () => {
      streamRef.current
        ?.getTracks()
        .forEach((track) => track.stop());
    };
  }, []);

  const toggleMic = () => {
    const audioTrack =
      streamRef.current?.getAudioTracks()[0];

    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;
    setIsMicOn(audioTrack.enabled);
  };

  const toggleCamera = () => {
    const videoTrack =
      streamRef.current?.getVideoTracks()[0];

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

        <div className="relative w-full h-full max-w-[1400px] overflow-hidden border-[6px] border-black bg-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] group rounded-3xl">

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
              <div className="absolute top-6 left-6 flex gap-3 z-20">
                <div className="w-6 h-6 bg-black rounded-full"></div>
                <div className="w-6 h-6 bg-black rounded-full"></div>
                <div className="w-6 h-6 bg-black rounded-full"></div>
              </div>

              <div className="text-center z-10">
                <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-white text-7xl font-display uppercase border-[6px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                  {name.charAt(0)}
                </div>

                <p className="mt-10 font-display text-5xl uppercase tracking-wider bg-black text-white px-8 py-3 border-[4px] border-black -rotate-2 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                  {name}
                </p>
              </div>
            </div>
          )}

          {/* User Name Badge */}
          {isCameraOn && (
            <div className="absolute top-6 left-6 bg-white border-[3px] border-black px-5 py-3 text-lg font-bold uppercase tracking-wider shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center gap-3 z-20">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-black"></div>
              {name} (You)
            </div>
          )}

          {/* Floating Controls (No separation) */}
          <div className="absolute bottom-0 left-0 w-full flex items-center justify-center gap-6 p-8 z-30 bg-gradient-to-t from-black/50 to-transparent">
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
              className="flex items-center gap-3 h-16 px-8 items-center justify-center rounded-full border-[4px] border-black bg-black text-white hover:bg-white hover:text-black transition-colors font-bold uppercase tracking-widest shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              <PhoneOff size={24} strokeWidth={3} />
              <span className="hidden sm:inline">Leave</span>
            </button>
          </div>

        </div>
      </section>
    </main>
  );
}