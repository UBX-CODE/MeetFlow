import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video, ArrowRight, MonitorUp, Lock, MessageSquare } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");

  const handleStartMeeting = () => {
    const roomId = crypto.randomUUID().slice(0, 8);
    navigate(`/pre-join?room=${roomId}`);
  };

  const handleJoinMeeting = () => {
    const code = meetingCode.trim();
    if (!code) return;
    navigate(`/pre-join?room=${code}`);
  };

  return (
    <main className="min-h-screen bg-[#F4F0E6] text-[#111111] overflow-x-hidden flex flex-col relative selection:bg-[#FF3300] selection:text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-6 md:px-12 relative z-10">
        <div className="flex items-center gap-2 font-display text-3xl tracking-wide uppercase">
          MeetFlow
        </div>

        <div className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-widest">
          <a href="#" className="hover:text-[#FF3300] transition-colors">About</a>
          <a href="#" className="hover:text-[#FF3300] transition-colors">Features</a>
          <a href="#" className="hover:text-[#FF3300] transition-colors">Enterprise</a>
          <a href="#" className="hover:text-[#FF3300] transition-colors">Blog</a>
        </div>

        <button 
          onClick={handleStartMeeting}
          className="bg-white text-black border-[3px] border-black px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
        >
          Start Meeting
        </button>
      </nav>

      {/* Hero Content */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 pt-1 pb-24 relative z-10 w-full max-w-[1400px] mx-auto">
        <div className="w-full text-center mb-16">
          <h1 className="font-display font-medium text-[14vw] md:text-[11vw] leading-[0.95] uppercase text-[#111111] mb-8 tracking-tighter">
            Stop<br />
            Guessing.<br />
            <span className="text-[#FF3300]">Start<br />Meeting.</span>
          </h1>
          <p className="text-xl md:text-3xl font-medium max-w-3xl mx-auto mb-12 text-zinc-800 leading-snug">
            We turn scattered communication into a system that scales. 
            Screen sharing, real-time chat, and full privacy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-2xl mx-auto">
             <button
                onClick={handleStartMeeting}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#FF3300] border-[3px] border-black text-white px-8 py-5 text-xl font-bold uppercase tracking-wider hover:bg-black transition-all shadow-[8px_8px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-2 active:translate-y-2"
              >
                <Video size={28} />
                New Meeting
              </button>

              <div className="w-full sm:w-auto flex border-[3px] border-black bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] focus-within:shadow-[12px_12px_0_0_rgba(0,0,0,1)] transition-all">
                <input
                  type="text"
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleJoinMeeting()}
                  placeholder="Enter code..."
                  className="w-full bg-transparent px-6 py-5 text-xl font-bold outline-none placeholder:text-zinc-400 min-w-[240px]"
                />
                <button
                  onClick={handleJoinMeeting}
                  disabled={!meetingCode.trim()}
                  className="bg-black text-white px-8 py-5 disabled:bg-zinc-300 disabled:text-zinc-500 transition-colors flex items-center justify-center"
                >
                  <ArrowRight size={28} />
                </button>
              </div>
          </div>
        </div>

        {/* Bento Box / Geometric Area */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          
          {/* Card 1: Geometric Face (Pink/Black) */}
          <div className="bg-[#FF0055] rounded-3xl aspect-square relative overflow-hidden border-[4px] border-black group shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
            {/* Browser Header */}
            <div className="absolute top-0 left-0 w-full h-12 bg-[#FF0055] border-b-[4px] border-black flex items-center px-4 gap-2 z-20">
               <div className="w-4 h-4 rounded-full bg-black"></div>
               <div className="w-4 h-4 rounded-full bg-black"></div>
               <div className="w-4 h-4 rounded-full bg-black"></div>
            </div>
            {/* Face Shape */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] h-[80%] bg-black rounded-t-[1000px] transition-transform group-hover:scale-105 duration-500">
               {/* Eye */}
               <div className="absolute top-[30%] left-[20%] w-[35%] aspect-square bg-[#FF0055] rounded-full flex items-center justify-center">
                  <div className="w-[80%] h-[45%] bg-white rounded-[100px] flex items-center justify-center overflow-hidden border-[4px] border-black">
                     <div className="w-[50%] aspect-square bg-black rounded-full translate-y-1"></div>
                  </div>
               </div>
               {/* Small Eye */}
               <div className="absolute top-[30%] right-[-5%] w-[25%] aspect-square bg-white rounded-full flex items-center justify-center border-[5px] border-black">
                  <div className="w-[45%] aspect-square bg-black rounded-full"></div>
               </div>
               {/* Mouth/Nose */}
               <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[20%] bg-[#FF0055] border-[4px] border-black"></div>
               <div className="absolute bottom-[20%] left-[30%] w-[25%] aspect-square bg-[#FF0055] rounded-full border-[4px] border-black"></div>
            </div>
          </div>

          {/* Card 2: Stickers */}
          <div className="bg-[#F4F0E6] rounded-3xl aspect-square relative border-[4px] border-black p-8 flex flex-col items-center justify-center gap-8 shadow-[12px_12px_0_0_rgba(0,0,0,1)] overflow-hidden">
             
             {/* Background Grid Pattern */}
             <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>

             <div className="bg-[#0055FF] text-white font-display text-3xl md:text-4xl px-6 py-3 -rotate-6 border-[4px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] uppercase tracking-wider relative z-10 hover:rotate-0 transition-transform cursor-default text-center">
               Screen Sharing
             </div>
             <div className="bg-white text-black font-display text-4xl md:text-5xl px-6 py-3 rotate-3 border-[4px] border-black uppercase tracking-wider relative z-10 shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-rotate-3 transition-transform cursor-default text-center">
               Real-Time<br />Chat
             </div>
             <div className="bg-[#FF3300] text-white font-display text-3xl md:text-4xl px-6 py-3 -rotate-2 border-[4px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] uppercase tracking-wider relative z-10 hover:rotate-2 transition-transform cursor-default text-center">
               Full Privacy
             </div>
          </div>

          {/* Card 3: Geometric Face (Blue/White) */}
          <div className="bg-white rounded-3xl aspect-square relative overflow-hidden border-[4px] border-black group shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
            {/* Browser Header */}
            <div className="absolute top-0 left-0 w-full h-12 bg-white border-b-[4px] border-black flex items-center px-4 gap-2 z-20">
               <div className="w-4 h-4 rounded-full bg-black"></div>
               <div className="w-4 h-4 rounded-full bg-black"></div>
               <div className="w-4 h-4 rounded-full bg-black"></div>
            </div>
            
            {/* Face Container */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[70%] h-full bg-[#FF0055] rounded-t-[500px] flex flex-col items-center pt-[25%] transition-transform group-hover:scale-105 duration-500 border-x-[4px] border-black">
               <div className="w-full px-6 flex justify-between items-center z-10 relative">
                 <div className="w-16 h-16 bg-[#0055FF] rounded-full border-[5px] border-white shadow-[0_0_0_4px_#000]"></div>
                 <div className="w-14 h-14 bg-white rounded-full border-[5px] border-[#0055FF] flex items-center justify-center shadow-[0_0_0_4px_#000]">
                   <div className="w-5 h-5 bg-[#0055FF] rounded-full"></div>
                 </div>
               </div>
               
               {/* Triangle Nose */}
               <div className="w-0 h-0 border-l-[35px] border-l-transparent border-b-[70px] border-b-[#0055FF] border-r-[35px] border-r-transparent -mt-8 z-0 relative">
                 <div className="absolute -left-[35px] top-[70px] w-[70px] border-b-[4px] border-black"></div>
                 {/* Hack for triangle border, simplified for now just relying on shapes */}
               </div>

               {/* Mouth */}
               <div className="w-[85%] h-[40%] bg-[#0055FF] rounded-b-[150px] mt-6 border-[4px] border-black"></div>
            </div>
          </div>
        </div>

      </section>

      {/* Marquee Banner */}
      <div className="w-full bg-black border-y-[4px] border-black overflow-hidden py-5 whitespace-nowrap flex relative z-10 mt-12">
         <div className="animate-marquee font-display text-5xl text-white uppercase tracking-wider flex items-center gap-12">
            <span>Screen Sharing  </span>
            <span className="w-5 h-5 rounded-full bg-[#0055FF]"></span>
            <span>Real-Time Chat  </span>
            <span className="w-5 h-5 rounded-full bg-[#FF0055]"></span>
            <span>Full Privacy  </span>
            <span className="w-5 h-5 rounded-full bg-[#0055FF]"></span>
            <span>Screen Sharing  </span>
            <span className="w-5 h-5 rounded-full bg-[#FF0055]"></span>
            <span>Real-Time Chat  </span>
            <span className="w-5 h-5 rounded-full bg-[#0055FF]"></span>
            <span>Full Privacy  </span>
            <span className="w-5 h-5 rounded-full bg-[#FF0055]"></span>
            <span>Screen Sharing  </span>
            <span className="w-5 h-5 rounded-full bg-[#0055FF]"></span>
            <span>Real-Time Chat  </span>
            <span className="w-5 h-5 rounded-full bg-[#FF0055]"></span>
         </div>
      </div>

      {/* Features Section */}
      <section className="w-full bg-white border-b-[4px] border-black py-24 px-6 md:px-12 relative z-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col items-center text-center mb-20">
            <h2 className="font-display font-medium text-[10vw] md:text-[7vw] leading-[0.95] uppercase text-[#111111] mb-6 tracking-tighter">
              Built for <span className="text-[#FF3300]">Performance.</span>
            </h2>
            <p className="text-xl md:text-2xl font-medium max-w-2xl text-zinc-800 leading-snug">
              Every tool you need for seamless collaboration, wrapped in a system that gets out of your way.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#F4F0E6] border-[4px] border-black p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all group flex flex-col">
              <div className="w-16 h-16 bg-[#FF3300] rounded-full border-[4px] border-black mb-6 flex items-center justify-center text-white group-hover:-rotate-12 transition-transform">
                <Video size={32} />
              </div>
              <h3 className="font-display text-3xl uppercase tracking-wider mb-4">HD Video</h3>
              <p className="text-zinc-800 font-medium text-lg leading-relaxed flex-1">
                Crystal clear 1080p video with low latency so you never miss a moment or a subtle expression.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#F4F0E6] border-[4px] border-black p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all group flex flex-col">
              <div className="w-16 h-16 bg-[#0055FF] rounded-full border-[4px] border-black mb-6 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <MonitorUp size={32} />
              </div>
              <h3 className="font-display text-3xl uppercase tracking-wider mb-4">Screen Share</h3>
              <p className="text-zinc-800 font-medium text-lg leading-relaxed flex-1">
                Share your entire screen or specific application windows instantly with zero compression artifacts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#F4F0E6] border-[4px] border-black p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all group flex flex-col">
              <div className="w-16 h-16 bg-[#FF0055] rounded-full border-[4px] border-black mb-6 flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
                <Lock size={32} />
              </div>
              <h3 className="font-display text-3xl uppercase tracking-wider mb-4">Secure Rooms</h3>
              <p className="text-zinc-800 font-medium text-lg leading-relaxed flex-1">
                End-to-end encryption with room codes and waiting rooms. Your data stays completely private.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#F4F0E6] border-[4px] border-black p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all group flex flex-col">
              <div className="w-16 h-16 bg-black rounded-full border-[4px] border-white shadow-[0_0_0_4px_#000] mb-6 flex items-center justify-center text-white group-hover:scale-90 transition-transform">
                <MessageSquare size={32} />
              </div>
              <h3 className="font-display text-3xl uppercase tracking-wider mb-4 mt-2">Real-Time Chat</h3>
              <p className="text-zinc-800 font-medium text-lg leading-relaxed flex-1">
                Drop links, notes, and messages seamlessly in the side panel without interrupting the conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Get In Touch / Footer Section */}
      <footer className="w-full bg-[#111111] text-white pt-24 pb-12 px-6 md:px-12 relative z-10 border-t-[4px] border-black mt-[-4px]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
            {/* Left Side */}
            <div>
              <h2 className="font-display text-[12vw] lg:text-[7vw] leading-[0.85] uppercase mb-8 text-white">
                Let's Upgrade<br />
                <span className="text-[#0055FF]">Your Meetings</span>
              </h2>
              <div className="grid grid-cols-2 gap-6 text-sm font-bold uppercase tracking-widest text-zinc-400 max-w-sm mt-12">
                 <a href="#" className="hover:text-white transition-colors">(About)</a>
                 <a href="#" className="hover:text-white transition-colors">(Blog)</a>
                 <a href="#" className="hover:text-white transition-colors">(Careers)</a>
                 <a href="#" className="hover:text-white transition-colors">(Twitter)</a>
                 <a href="#" className="hover:text-white transition-colors">(Creators)</a>
                 <a href="#" className="hover:text-white transition-colors">(LinkedIn)</a>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-col justify-center w-full">
              <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
                <div className="relative border-b-[3px] border-zinc-700 pb-4">
                  <input type="text" placeholder="(NAME)" className="w-full bg-transparent outline-none text-xl font-bold uppercase tracking-wider text-white placeholder:text-zinc-600 focus:placeholder:text-zinc-400 transition-colors" />
                </div>
                <div className="relative border-b-[3px] border-zinc-700 pb-4">
                  <input type="text" placeholder="(COMPANY)" className="w-full bg-transparent outline-none text-xl font-bold uppercase tracking-wider text-white placeholder:text-zinc-600 focus:placeholder:text-zinc-400 transition-colors" />
                </div>
                <div className="relative border-b-[3px] border-zinc-700 pb-4">
                  <input type="email" placeholder="(EMAIL)" className="w-full bg-transparent outline-none text-xl font-bold uppercase tracking-wider text-white placeholder:text-zinc-600 focus:placeholder:text-zinc-400 transition-colors" />
                </div>
                <button type="submit" className="w-full bg-white text-black py-5 mt-4 text-xl font-bold uppercase tracking-widest hover:bg-[#FF0055] hover:text-white transition-colors border-[3px] border-transparent hover:border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2">
                  Submit
                </button>
              </form>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end border-t-[3px] border-zinc-800 pt-8 mt-12 gap-4">
             <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
               (Privacy Policy)
             </div>
             <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
               (Terms of Use)
             </div>
             <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
               (2026)
             </div>
          </div>
          
          <div className="mt-12 w-full flex justify-center border-t-[3px] border-zinc-800 pt-8">
             <h1 className="font-display text-[17vw] leading-none text-white select-none tracking-tight pb-4">
                MEETFLOW
             </h1>
          </div>
        </div>
      </footer>
    </main>
  );
}