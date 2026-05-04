'use client';

export function Hero() {
  return (
    <div className="relative">
      <div className="animate-fade-in">
        {/* Background gradient layer */}
        <div className="absolute h-[100vh] w-full bg-gradient-to-br from-[#5e6ad2]/20 via-[#7170ff]/10 to-transparent z-[-1]" />
        <div className="absolute h-[100vh] w-full bg-gradient-to-t from-background to-transparent z-[-1]" />

        <div className="h-[100vh] flex flex-col items-center justify-center text-center px-4 relative">
          <h1 className="text-5xl md:text-7xl font-bold freesekai-gradient mb-4 animate-fade-in-up delay-200">
            SOCIOSEKAI
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up delay-500">
            - Socios n their Freedom -
          </p>

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-fade-in-up delay-1000">
            <button
              onClick={() => document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label="Scroll to dive"
              className="rounded-full animate-bounce-slow hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-all w-12 h-12 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
