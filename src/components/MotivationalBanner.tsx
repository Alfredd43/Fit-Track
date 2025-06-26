
import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const MotivationalBanner = () => {
  const quotes = [
    "Every small step counts on your wellness journey! 🌟",
    "You're stronger than you think, and I believe in you! 💪",
    "Progress, not perfection - that's what makes you amazing! ✨",
    "Your body and mind deserve all the love you give them! 💚",
    "Today is a perfect day to take care of yourself! 🌸",
    "You're building healthy habits that will last a lifetime! 🌱"
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 8000); // Change quote every 8 seconds

    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div className="bg-gradient-to-r from-green-400 via-green-500 to-teal-500 rounded-2xl shadow-lg p-6 text-white text-center mb-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 animate-pulse">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="absolute bottom-4 right-4 animate-pulse" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="absolute top-1/2 left-1/4 animate-pulse" style={{ animationDelay: '2s' }}>
          <Sparkles className="w-4 h-4" />
        </div>
      </div>
      
      <div className="relative">
        <div className="text-2xl mb-2">💫</div>
        <p className="text-lg font-medium leading-relaxed transition-all duration-500 ease-in-out">
          {quotes[currentQuote]}
        </p>
        <div className="flex justify-center mt-4 space-x-2">
          {quotes.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentQuote ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MotivationalBanner;
