
import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Heart, Droplets, Dumbbell, Apple } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface WellnessData {
  foodLogs: { id: string; meal: string; calories: number; time: string }[];
  waterIntake: { id: string; amount: number; time: string }[];
  exerciseHistory: { id: string; activity: string; duration: number; time: string }[];
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm your Fitness Buddy 💪 I'm here to help you on your wellness journey. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('food');
  const [wellnessData, setWellnessData] = useState<WellnessData>({
    foodLogs: [
      { id: '1', meal: 'Avocado Toast', calories: 320, time: '8:30 AM' },
      { id: '2', meal: 'Greek Salad', calories: 280, time: '12:45 PM' },
      { id: '3', meal: 'Grilled Salmon', calories: 450, time: '7:00 PM' }
    ],
    waterIntake: [
      { id: '1', amount: 500, time: '9:00 AM' },
      { id: '2', amount: 350, time: '11:30 AM' },
      { id: '3', amount: 400, time: '2:15 PM' }
    ],
    exerciseHistory: [
      { id: '1', activity: 'Morning Yoga', duration: 30, time: '7:00 AM' },
      { id: '2', activity: 'Evening Walk', duration: 45, time: '6:30 PM' }
    ]
  });

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
      "That sounds like a great approach! 🎯 I'm here to support you every step of the way."
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
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Fitness Bab</h1>
                <p className="text-sm text-gray-600">Your caring wellness companion</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Hi! I'm your Fitness Buddy 💪</p>
              <p className="text-xs text-gray-500">Let's make today amazing together</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-green-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Bot className="w-5 h-5 mr-2 text-green-500" />
                Chat with your Fitness Buddy
              </h2>
              <p className="text-sm text-gray-600 mt-1">I'm here to support and motivate you! 🌟</p>
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
                        <Bot className="w-4 h-4 mt-0.5 text-green-500" />
                      )}
                      {message.sender === 'user' && (
                        <User className="w-4 h-4 mt-0.5 text-white/80" />
                      )}
                      <div>
                        <p className="text-sm">{message.content}</p>
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
                  placeholder="Type your message here..."
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
            </div>
          </div>

          {/* Dashboard */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Wellness Dashboard</h3>
              
              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-4">
                {[
                  { id: 'food', label: 'Food', icon: Apple },
                  { id: 'water', label: 'Water', icon: Droplets },
                  { id: 'exercise', label: 'Exercise', icon: Dumbbell }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-md transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-green-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-3">
                {activeTab === 'food' && wellnessData.foodLogs.map((log) => (
                  <div key={log.id} className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{log.meal}</p>
                        <p className="text-sm text-gray-600">{log.calories} calories</p>
                      </div>
                      <span className="text-xs text-gray-500">{log.time}</span>
                    </div>
                  </div>
                ))}

                {activeTab === 'water' && wellnessData.waterIntake.map((log) => (
                  <div key={log.id} className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{log.amount}ml</p>
                        <p className="text-sm text-gray-600">Water intake</p>
                      </div>
                      <span className="text-xs text-gray-500">{log.time}</span>
                    </div>
                  </div>
                ))}

                {activeTab === 'exercise' && wellnessData.exerciseHistory.map((log) => (
                  <div key={log.id} className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{log.activity}</p>
                        <p className="text-sm text-gray-600">{log.duration} minutes</p>
                      </div>
                      <span className="text-xs text-gray-500">{log.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Motivational Quote */}
            <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">✨ Daily Motivation ✨</p>
                <p className="text-sm opacity-90">
                  "Every step you take is a step towards a healthier, happier you. Keep going!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
