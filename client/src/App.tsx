import { Switch, Route } from "wouter";
import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";

// Components
import { Sidebar } from "@/components/Sidebar";
import { MobileHeader } from "@/components/MobileHeader";

// Pages
import Dashboard from "@/pages/Dashboard";
import Roadmaps from "@/pages/Roadmaps";
import Resources from "@/pages/Resources";
import Community from "@/pages/Community";
import Problems from "@/pages/Problems";
import Studio from "@/pages/Studio";
import Sandbox from "@/pages/Sandbox";
import Mentor from "@/pages/Mentor";
import SphereMap from "@/pages/SphereMap";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";

function Router() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getPageTitle = (path: string) => {
    const titles: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/roadmaps': 'Learning Roadmaps',
      '/resources': 'PDF Resources',
      '/community': 'Community Lounge',
      '/problems': 'Daily Problems',
      '/studio': 'Project Studio',
      '/sandbox': 'App Sandbox',
      '/mentor': 'AI Mentor',
      '/sphere-map': 'Sphere Map',
      '/profile': 'Profile',
    };
    return titles[path] || 'CodeSphere';
  };

  return (
    <div className="flex min-h-screen bg-[#0F0F23]">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 lg:ml-80 flex flex-col">
        <Switch>
          {(params) => {
            const currentPath = params.path;
            return (
              <>
                <MobileHeader 
                  onMenuClick={() => setSidebarOpen(true)}
                  pageTitle={getPageTitle(currentPath)}
                />
                
                <main className="flex-1 overflow-x-hidden">
                  <Route path="/" component={Dashboard} />
                  <Route path="/dashboard" component={Dashboard} />
                  <Route path="/roadmaps" component={Roadmaps} />
                  <Route path="/resources" component={Resources} />
                  <Route path="/community" component={Community} />
                  <Route path="/problems" component={Problems} />
                  <Route path="/studio" component={Studio} />
                  <Route path="/sandbox" component={Sandbox} />
                  <Route path="/mentor" component={Mentor} />
                  <Route path="/sphere-map" component={SphereMap} />
                  <Route path="/profile" component={Profile} />
                  <Route component={NotFound} />
                </Switch>
              </>
            );
          }}
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
