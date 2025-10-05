import React, { useState } from 'react';
import { useApp } from './contexts/AppContext';
import { AppProvider } from './contexts/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
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

type AppState = 'homepage' | 'unified-login' | 'coach-panel' | 'admin-panel' | 'purchase';

function App() {
  const { user } = useApp();
  const [currentState, setCurrentState] = useState<AppState>('homepage');
  const [showCallDrawer, setShowCallDrawer] = useState(false);

  const renderCurrentView = () => {
    switch (currentState) {
      case 'homepage':
        return (
          <Homepage />
        );
      case 'unified-login':
        return (
          <LoginForm
            onBack={() => setCurrentState('homepage')}
            onSuccess={() => {
              if (user?.role === 'admin') {
                setCurrentState('admin-panel');
              } else if (user?.role === 'coach') {
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
        return <PurchaseMainPage onBack={() => setCurrentState('homepage')} />;
      default:
        return <Homepage />;
    }
  };

  const showFloatingButtons = !['admin-panel', 'coach-panel'].includes(currentState);
  return (
    <ErrorBoundary>
      <AppProvider>
        <div className="min-h-screen bg-lightCream">
          {/* Show header on all pages except admin and coach panels */}
          {!['admin-panel', 'coach-panel'].includes(currentState) && (
            <Header 
              onLoginClick={() => setCurrentState('unified-login')}
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
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;