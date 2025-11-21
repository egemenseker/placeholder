import React, { useState, useEffect } from 'react';
import { useApp } from './contexts/AppContext';
import Header from './components/Header';
import Homepage from './components/Homepage';
import LoginForm from './components/LoginForm';
import CoachPanel from './components/coach/CoachPanel';
import AdminPanel from './components/admin/AdminPanel';
import PurchaseMainPage from './components/PurchaseMainPage';
import CallRequestDrawer from './components/CallRequestDrawer';
import CallRequestButton from './components/CallRequestButton';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';

type AppState = 'homepage' | 'direct-login' | 'coach-panel' | 'admin-panel' | 'purchase';

function App() {
  const { user } = useApp();
  const [currentState, setCurrentState] = useState<AppState>('homepage');
  const [showCallDrawer, setShowCallDrawer] = useState(false);
  const [selectedCoachForPurchase, setSelectedCoachForPurchase] = useState<string | null>(null);

  // Check URL path on component mount
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/login') {
      setCurrentState('direct-login');
    }
  }, []);

  // Listen for navigate to purchase events from coach carousel
  useEffect(() => {
    const handleNavigateToPurchase = (event: any) => {
      const { coachId } = event.detail;
      setSelectedCoachForPurchase(coachId);
      setCurrentState('purchase');
    };

    window.addEventListener('navigateToPurchase', handleNavigateToPurchase);
    return () => window.removeEventListener('navigateToPurchase', handleNavigateToPurchase);
  }, []);

  const renderCurrentView = () => {
    switch (currentState) {
      case 'homepage':
        return (
          <Homepage onPurchaseClick={() => setCurrentState('purchase')} />
        );
      case 'direct-login':
        return (
          <LoginForm
            onBack={() => setCurrentState('homepage')}
            onSuccess={(role) => {
              if (role === 'admin') {
                setCurrentState('admin-panel');
              } else if (role === 'coach') {
                setCurrentState('coach-panel');
              } else {
                setCurrentState('homepage');
              }
            }}
          />
        );
      case 'coach-panel':
        return <CoachPanel onBack={() => setCurrentState('homepage')} />;
      case 'admin-panel':
        return <AdminPanel onBack={() => setCurrentState('homepage')} />;
      case 'purchase':
        return <PurchaseMainPage
          onBack={() => {
            setCurrentState('homepage');
            setSelectedCoachForPurchase(null);
          }}
          preselectedCoachId={selectedCoachForPurchase}
        />;
      default:
        return <Homepage onPurchaseClick={() => setCurrentState('purchase')} />;
    }
  };

  const showFloatingButtons = !['admin-panel', 'coach-panel'].includes(currentState);
  return (
    <div className="min-h-screen bg-lightCream">
      {/* Show header on all pages except admin and coach panels */}
      {!['admin-panel', 'coach-panel'].includes(currentState) && (
        <Header 
          onPurchaseClick={() => setCurrentState('purchase')}
          onLogoClick={() => setCurrentState('homepage')}
        />
      )}
      {renderCurrentView()}
      
      {/* Floating Buttons - Show on all pages except admin and coach panels */}
      {showFloatingButtons && (
        <>
          <CallRequestButton onClick={() => setShowCallDrawer(true)} />
          <WhatsAppButton />
        </>
      )}
      
      {/* Call Request Drawer */}
      <CallRequestDrawer 
        isOpen={showCallDrawer} 
        onClose={() => setShowCallDrawer(false)} 
      />
      
      {/* Footer - Show on all pages except admin and coach panels */}
      {!['admin-panel', 'coach-panel'].includes(currentState) && <Footer />}
    </div>
  );
}

export default App;