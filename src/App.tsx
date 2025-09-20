import React, { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Header';
import Homepage from './components/Homepage';
import LoginForm from './components/LoginForm';
import CoachPanel from './components/coach/CoachPanel';
import AdminPanel from './components/admin/AdminPanel';
import PurchaseMainPage from './components/PurchaseMainPage';

type AppState = 'homepage' | 'coach-login' | 'admin-login' | 'coach-panel' | 'admin-panel' | 'purchase';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('homepage');

  const renderCurrentView = () => {
    switch (currentState) {
      case 'homepage':
        return (
          <Homepage />
        );
      case 'coach-login':
        return (
          <LoginForm
            role="coach"
            onBack={() => setCurrentState('homepage')}
            onSuccess={() => setCurrentState('coach-panel')}
          />
        );
      case 'admin-login':
        return (
          <LoginForm
            role="admin"
            onBack={() => setCurrentState('homepage')}
            onSuccess={() => setCurrentState('admin-panel')}
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

  return (
    <AppProvider>
      <div className="min-h-screen bg-lightCream">
        {/* Show header on all pages except admin and coach panels */}
        {!['admin-panel', 'coach-panel'].includes(currentState) && (
          <Header 
            showDebugButtons={currentState === 'homepage'}
            onCoachPanelClick={() => setCurrentState('coach-login')}
            onAdminPanelClick={() => setCurrentState('admin-login')}
            onPurchaseClick={() => setCurrentState('purchase')}
            onLogoClick={() => setCurrentState('homepage')}
          />
        )}
        {renderCurrentView()}
      </div>
    </AppProvider>
  );
}

export default App;