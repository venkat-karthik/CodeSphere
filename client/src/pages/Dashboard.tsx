import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Section } from '../types';
import { 
  Star, 
  Trophy, 
  Target, 
  Flame, 
  CheckCircle, 
  ArrowRight,
  BookOpen,
  Code,
  Users,
  Bot,
  BarChart3,
  Video
} from 'lucide-react';
import { Leaderboard } from '@/components/Leaderboard';
import { NotificationsPanel } from '@/components/NotificationsPanel';
import { AIMentor } from '@/components/AIMentor';
import { StudentAssignments } from '@/components/StudentAssignments';
import { useEffect, useRef, useState } from 'react';

interface DashboardProps {
  onSectionChange: (section: Section) => void;
}

const tourSteps = [
  {
    title: "Welcome to CodeSphere!",
    content: "This is your personalized learning dashboard. Let's take a quick tour!"
  },
  {
    title: "Today's Focus",
    content: "See your next learning step and upcoming class right at the top.",
    target: 'todayFocusRef'
  },
  {
    title: "Notifications",
    content: "Get reminders for assignments, classes, and important updates.",
    target: 'notificationsRef'
  },
  {
    title: "Quick Actions",
    content: "Jump into coding, ask your mentor, or join a class with one click.",
    target: 'quickActionsRef'
  },
  {
    title: "Sidebar Navigation",
    content: "Use the sidebar to explore all features: learning, collaboration, analytics, and more.",
    target: 'sidebarRef'
  },
  {
    title: "Need Help?",
    content: "Click the ? icon or visit your profile for help and support."
  }
];

interface GetStartedTourProps {
  onClose: () => void;
  targetRef?: React.RefObject<HTMLElement>;
  step: number;
}

function GetStartedTour({ onClose, targetRef, step }: GetStartedTourProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(step);

  const tourDialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (targetRef && targetRef.current && tourDialogRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const dialogRect = tourDialogRef.current.getBoundingClientRect();

      let top = targetRect.top;
      let left = targetRect.right + 20;

      if (left + dialogRect.width > window.innerWidth) {
        left = targetRect.left - dialogRect.width - 20;
      }

      if (left < 0) {
        left = targetRect.right + 20;
      }
      
      if (top + dialogRect.height > window.innerHeight) {
        top = targetRect.bottom - dialogRect.height;
      }

      top = Math.max(0, Math.min(top, window.innerHeight - dialogRect.height));
      left = Math.max(0, Math.min(left, window.innerWidth - dialogRect.width));

      tourDialogRef.current.style.top = `${top}px`;
      tourDialogRef.current.style.left = `${left}px`;
      tourDialogRef.current.style.position = 'fixed';
    } else if (tourDialogRef.current) {
      tourDialogRef.current.style.top = '50%';
      tourDialogRef.current.style.left = '50%';
      tourDialogRef.current.style.transform = 'translate(-50%, -50%)';
      tourDialogRef.current.style.position = 'fixed';
    }
  }, [currentStepIndex, targetRef]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div 
        ref={tourDialogRef}
        className="bg-white dark:bg-card rounded-xl shadow-xl max-w-sm w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-2">{tourSteps[currentStepIndex].title}</h2>
        <p className="mb-4 text-muted-foreground text-sm">{tourSteps[currentStepIndex].content}</p>
        <div className="flex justify-between items-center">
          <button
            className="text-xs text-muted-foreground underline"
            onClick={onClose}
          >
            Skip Tour
          </button>
          <div className="space-x-2">
            {currentStepIndex > 0 && (
              <Button size="sm" variant="outline" onClick={() => setCurrentStepIndex(currentStepIndex - 1)}>
                Back
              </Button>
            )}
            {currentStepIndex < tourSteps.length - 1 ? (
              <Button size="sm" onClick={() => setCurrentStepIndex(currentStepIndex + 1)}>
                Next
              </Button>
            ) : (
              <Button size="sm" onClick={onClose}>
                Finish
              </Button>
            )}
          </div>
        </div>
        <div className="absolute top-3 right-3 text-xs text-muted-foreground">
          Step {currentStepIndex + 1} of {tourSteps.length}
        </div>
      </div>
    </div>
  );
}

export function Dashboard({ onSectionChange }: DashboardProps) {
  const { user, isAuthenticated } = useAuth();
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [currentTourTargetRef, setCurrentTourTargetRef] = useState<React.RefObject<HTMLElement> | undefined>(undefined);
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [nextClass, setNextClass] = useState<any>(null);

  const todayFocusRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  const tourTargets: Record<string, React.RefObject<HTMLElement>> = {
    todayFocusRef: todayFocusRef,
    notificationsRef: notificationsRef,
    quickActionsRef: quickActionsRef,
  };

  useEffect(() => {
    const tourComplete = localStorage.getItem('codesphere_tour_complete');
    if (!tourComplete && isAuthenticated && user) {
      setShowTour(true);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchLiveClasses();
    }
  }, [isAuthenticated, user]);

  const fetchLiveClasses = async () => {
    try {
      const response = await fetch('/api/live-classes');
      if (response.ok) {
        const data = await response.json();
        setLiveClasses(data);
        
        // Find the next upcoming class
        const now = new Date();
        const upcomingClasses = data.filter((cls: any) => {
          const startTime = new Date(cls.startTime);
          return startTime > now && cls.status === 'scheduled';
        }).sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
        
        if (upcomingClasses.length > 0) {
          setNextClass(upcomingClasses[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch live classes:', error);
    }
  };

  useEffect(() => {
    if (showTour) {
      const currentStepTarget = tourSteps[tourStep].target;
      if (currentStepTarget && tourTargets[currentStepTarget]) {
        setCurrentTourTargetRef(tourTargets[currentStepTarget]);
      } else {
        setCurrentTourTargetRef(undefined);
      }
    }
  }, [showTour, tourStep]);

  const handleCloseTour = () => {
    localStorage.setItem('codesphere_tour_complete', 'true');
    setShowTour(false);
    setTourStep(0);
  };

  const handleNextTourStep = () => {
    setTourStep(prevStep => {
      const nextStep = prevStep + 1;
      const totalSteps = tourSteps.length;
      if (nextStep < totalSteps) {
        return nextStep;
      } else {
        handleCloseTour();
        return prevStep;
      }
    });
  };

  const handlePrevTourStep = () => {
    setTourStep(prevStep => Math.max(0, prevStep - 1));
  };

  const handleJoinNextClass = () => {
    if (nextClass) {
      onSectionChange('live-classes');
    } else {
      onSectionChange('live-classes');
    }
  };

  const formatClassTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="gradient-bg rounded-2xl p-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to CodeSphere</h1>
          <p className="text-xl text-muted-foreground mb-8">
            The Ultimate Student Learning Platform
          </p>
          <p className="text-lg mb-8">
            A comprehensive, user-centric platform designed to revolutionize the way 
            coders and developers learn, collaborate, and grow.
          </p>
          
          {/* Feature highlights */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="card-hover cursor-pointer" onClick={() => onSectionChange('roadmaps')}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Curated Learning Paths</h3>
                <p className="text-sm text-muted-foreground">
                  Follow structured roadmaps designed by industry experts
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover cursor-pointer" onClick={() => onSectionChange('problems')}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Gamified Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Earn XP, maintain streaks, and level up your skills
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover cursor-pointer" onClick={() => onSectionChange('community')}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Community Driven</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with peers and learn from experts
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const xpProgress = (user.xp / user.nextLevelXP) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-8">
      {showTour && (
        <GetStartedTour 
          onClose={handleCloseTour} 
          targetRef={currentTourTargetRef} 
          step={tourStep}
        />
      )}
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">
            Welcome back, {user.firstName}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready for a productive day? Stay focused and keep learning!
          </p>
        </div>
        <div className="text-right mt-4 md:mt-0">
          <div className="text-sm text-muted-foreground">Current Streak</div>
          <div className="text-2xl font-bold text-orange-500 flex items-center">
            <Flame className="h-6 w-6 mr-1" />
            {user.streak} days
          </div>
        </div>
      </div>

      {/* Today's Focus */}
      <Card ref={todayFocusRef}>
        <CardHeader>
          <CardTitle>Today's Focus</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="font-semibold text-lg mb-1">Continue: Frontend Developer Roadmap</div>
              <div className="text-sm text-muted-foreground mb-2">Next: ES6+ Features</div>
              <Badge variant="secondary">65% Complete</Badge>
            </div>
            <Button size="lg" className="w-full md:w-auto" onClick={() => onSectionChange('roadmaps')}>
              Start Learning <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
            <div>
              <div className="font-semibold text-lg mb-1">
                {nextClass ? 'Next Class' : 'Live Classes'}
              </div>
              <div className="text-sm text-muted-foreground mb-2">
                {nextClass ? nextClass.title : 'Join upcoming sessions'}
              </div>
              <Badge variant="secondary">
                {nextClass ? formatClassTime(nextClass.startTime) : 'View all classes'}
              </Badge>
            </div>
            <Button 
              size="lg" 
              className="w-full md:w-auto" 
              variant="outline"
              onClick={handleJoinNextClass}
            >
              <Video className="mr-2 h-4 w-4" />
              {nextClass ? 'Join Class' : 'View Classes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Widget */}
      <Card ref={notificationsRef}>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Assignment "React Project" due tomorrow</li>
            <li>Class "JS Live" starts at 4:00 PM</li>
            <li>New message from your mentor</li>
          </ul>
        </CardContent>
      </Card>

      {/* Assignments Section */}
      <Card>
        <CardHeader>
          <CardTitle>My Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentAssignments />
        </CardContent>
      </Card>

      {/* Minimal Stats Row */}
      <div className="flex justify-between items-center bg-card/50 rounded-lg p-4 my-6">
        <div className="flex flex-col items-center flex-1">
          <span className="text-xs text-muted-foreground mb-1">XP</span>
          <span className="text-xl font-bold">{user.xp}</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <span className="text-xs text-muted-foreground mb-1">Streak</span>
          <span className="text-xl font-bold text-orange-500">{user.streak}d</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <span className="text-xs text-muted-foreground mb-1">Level</span>
          <span className="text-xl font-bold text-purple-500">{user.level}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div ref={quickActionsRef} className="flex flex-col md:flex-row gap-4 justify-center">
        <Button size="lg" className="flex-1" onClick={() => onSectionChange('sandbox')}>
          Start Coding
        </Button>
        <Button size="lg" className="flex-1" variant="outline" onClick={() => onSectionChange('mentor')}>
          Ask Mentor
        </Button>
        <Button size="lg" className="flex-1" variant="secondary" onClick={() => onSectionChange('live-classes')}>
          <Video className="mr-2 h-4 w-4" />
          Join Class
        </Button>
      </div>
    </div>
  );
}
