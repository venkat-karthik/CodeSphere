import { useState, useEffect } from 'react';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserRoleProvider, useUserRole } from './contexts/UserRoleContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { AssignmentProvider } from './contexts/AssignmentContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Roadmaps } from './pages/Roadmaps';
import { Resources } from './pages/Resources';
import { Videos } from './pages/Videos';
import { Problems } from './pages/Problems';
import { CommunityChannels } from './pages/CommunityChannels';
import { Studio } from './pages/Studio';
import { AdvancedSandbox } from './pages/AdvancedSandbox';
import { Mentor } from './pages/Mentor';
import { SphereMap } from './pages/SphereMap';
import { EnhancedProfile } from './pages/EnhancedProfile';
import { EnhancedSettings } from './pages/EnhancedSettings';
import { PlatformAnalytics } from './pages/PlatformAnalytics';
import { LiveClasses } from './pages/LiveClasses';
import { CodeCoinStore } from './pages/CodeCoinStore';
import { Section } from './types';

function AppContent() {
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const { isAdmin } = useUserRole();

  useEffect(() => {
    // Set initial section based on role
    setCurrentSection(isAdmin ? 'admin-dashboard' : 'dashboard');
  }, [isAdmin]);

  const renderSection = () => {
    if (!currentSection) {
      return null; // or a loading spinner
    }

    switch (currentSection) {
      case 'dashboard':
        return <Dashboard onSectionChange={setCurrentSection} />;
      case 'roadmaps':
        return <Roadmaps />;
      case 'resources':
        return <Resources />;
      case 'videos':
        return <Videos />;
      case 'problems':
        return <Problems />;
      case 'community':
        return <CommunityChannels />;
      case 'studio':
        return <Studio />;
      case 'sandbox':
        return <AdvancedSandbox />;
      case 'mentor':
        return <Mentor />;
      case 'sphere-map':
        return <SphereMap />;
      case 'profile':
        return <EnhancedProfile />;
      case 'settings':
        return <EnhancedSettings />;
      case 'analytics':
        return <PlatformAnalytics />;
      case 'live-classes':
        return <LiveClasses />;
      case 'store':
        return <CodeCoinStore />;
      default:
        return isAdmin ? <PlatformAnalytics /> : <Dashboard onSectionChange={setCurrentSection} />;
    }
  };

  return (
    <NotificationsProvider>
      <AssignmentProvider>
        <Layout 
          currentSection={currentSection} 
          onSectionChange={setCurrentSection}
        >
          {renderSection()}
        </Layout>
      </AssignmentProvider>
    </NotificationsProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserRoleProvider>
          <AppContent />
        </UserRoleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
