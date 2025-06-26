import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot } from 'lucide-react';
import Navigation from '../components/Navigation';
import QuickActions from '../components/QuickActions';
import WellnessStats from '../components/WellnessStats';
import MotivationalBanner from '../components/MotivationalBanner';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hey there! I'm your Fitness Buddy 💪 I'm here to support you on your wellness journey. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate API call to /chat
    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const generateBotResponse = (userMessage: string): string => {
    const responses = [
      "That's wonderful! Keep up the great work! 🌟 Remember, every small step counts toward your wellness goals.",
      "I'm so proud of your dedication! 💚 What would you like to focus on next in your wellness journey?",
      "You're doing amazing! ✨ How about we set a small goal for tomorrow to keep the momentum going?",
      "I love your positive energy! 🌸 Remember to celebrate these victories, no matter how small they seem.",
      "That sounds like a great approach! 🎯 I'm here to support you every step of the way.",
      "Your commitment to wellness is inspiring! 🌱 Have you been staying hydrated today?",
      "I believe in you! 💪 Small consistent actions lead to big transformations.",
      "That's the spirit! 🎉 Remember, progress over perfection always wins the day."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-peach-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Chat with Fitness Bab 💬</h2>
          <p className="text-gray-600">Your caring wellness companion is here to listen and support you!</p>
        </div>

        {/* Motivational Banner */}
        <MotivationalBanner />

        {/* Wellness Stats */}
        <WellnessStats />

        {/* Quick Actions */}
        <QuickActions />

        {/* Chat Interface */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 max-w-3xl mx-auto">
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Fitness Bab</h3>
                <p className="text-sm text-green-600">Online • Ready to help</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && (
                      <Bot className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                    )}
                    {message.sender === 'user' && (
                      <User className="w-4 h-4 mt-0.5 text-white/80 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl shadow-sm max-w-xs">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-green-500" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 border-t border-gray-100">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl hover:from-green-500 hover:to-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send • Your wellness companion is here to listen 💚
            </p>
          </div>
        </div>

        {/* Enhanced Tips Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Daily Goals</h3>
            <p className="text-sm text-gray-600 mb-4">Set small, achievable goals and build momentum!</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Drink 8 glasses of water</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Take a 10-minute walk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Practice mindfulness</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
            <div className="text-3xl mb-3">💝</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Self-Care Reminder</h3>
            <p className="text-sm text-gray-600 mb-4">Remember to be gentle with yourself today!</p>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-sm text-green-700 font-medium">
                "You are worthy of love and care - especially from yourself. 💚"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
