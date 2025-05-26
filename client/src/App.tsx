import { useState } from 'react';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserRoleProvider } from './contexts/UserRoleContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
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
import { Section } from './types';

function App() {
  const [currentSection, setCurrentSection] = useState<Section>('dashboard');

  const renderSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <Dashboard onSectionChange={setCurrentSection} />;
      case 'admin-dashboard':
        return <AdminDashboard />;
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
      default:
        return <Dashboard onSectionChange={setCurrentSection} />;
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <UserRoleProvider>
          <Layout 
            currentSection={currentSection} 
            onSectionChange={setCurrentSection}
          >
            {renderSection()}
          </Layout>
        </UserRoleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
