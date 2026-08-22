import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4a0026] via-[#7a0c41] to-[#2e0018] text-white flex flex-col justify-center items-center relative overflow-hidden font-sans select-none">
      {/* Festive Ambient Glows - Warm Gold, Hot Pink & Magenta */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-pink-500/35 via-rose-500/25 to-amber-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-[400px] h-[400px] bg-fuchsia-600/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-[350px] h-[350px] bg-rose-500/25 rounded-full blur-[90px] pointer-events-none" />

      {/* Main Glass Card Container */}
      <main className="relative z-10 max-w-lg w-[90%] p-8 md:p-12 rounded-3xl bg-white/10 border border-pink-300/30 backdrop-blur-2xl shadow-[0_0_50px_rgba(236,72,153,0.3)] text-center space-y-6 transition-all duration-300 hover:border-pink-300/50">
        
        {/* Core Heading */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-pink-100 to-amber-200 bg-clip-text text-transparent">
            Welcome To Maorii
          </h1>
          <p className="text-lg md:text-xl text-pink-100/90 font-medium">
            Where Every Celebration Comes To Life.
          </p>
        </div>

      </main>
    </div>
  );
}