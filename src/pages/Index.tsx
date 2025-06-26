
import React from 'react';
import Navigation from '../components/Navigation';
import QuickActions from '../components/QuickActions';
import WellnessStats from '../components/WellnessStats';
import MotivationalBanner from '../components/MotivationalBanner';
import ChatInterface from '../components/ChatInterface';
import WellnessTips from '../components/WellnessTips';
import PageHeader from '../components/PageHeader';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-peach-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <PageHeader 
          title="Chat with Fitness Bab 💬"
          subtitle="Your caring wellness companion is here to listen and support you!"
        />

        <MotivationalBanner />
        <WellnessStats />
        <QuickActions />
        <ChatInterface />
        <WellnessTips />
      </div>
    </div>
  );
};

export default Index;
