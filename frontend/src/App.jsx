import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0d0f17] text-white flex flex-col justify-center items-center relative overflow-hidden font-sans select-none">
      {/* Background Subtle Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Glass Card Container */}
      <main className="relative z-10 max-w-lg w-[90%] p-8 md:p-12 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl text-center space-y-6 transition-all duration-300 hover:border-white/20">
        

        {/* Core Heading */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Hello Manabu
          </h1>
        </div>


      </main>

    </div>
  );
}