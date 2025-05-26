import { useState } from 'react';
import { AuthProvider } from './hooks/useAuth';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Roadmaps } from './pages/Roadmaps';
import { Resources } from './pages/Resources';
import { Videos } from './pages/Videos';
import { Problems } from './pages/Problems';
import { Community } from './pages/Community';
import { Studio } from './pages/Studio';
import { Sandbox } from './pages/Sandbox';
import { Mentor } from './pages/Mentor';
import { SphereMap } from './pages/SphereMap';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Section } from './types';

function App() {
  const [currentSection, setCurrentSection] = useState<Section>('dashboard');

  const renderSection = () => {
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
        return <Community />;
      case 'studio':
        return <Studio />;
      case 'sandbox':
        return <Sandbox />;
      case 'mentor':
        return <Mentor />;
      case 'sphere-map':
        return <SphereMap />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onSectionChange={setCurrentSection} />;
    }
  };

  return (
    <AuthProvider>
      <Layout 
        currentSection={currentSection} 
        onSectionChange={setCurrentSection}
      >
        {renderSection()}
      </Layout>
    </AuthProvider>
  );
}

export default App;
