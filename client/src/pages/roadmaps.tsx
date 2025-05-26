import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { getRoadmaps, getUserProgress, saveUserProgress } from '@/lib/storage';
import { Roadmap, UserProgress } from '@/types';
import { Search, CheckCircle, Circle, Clock, Users, TrendingUp, Target, Brain } from 'lucide-react';

export function Roadmaps() {
  const { user, isAuthenticated } = useAuth();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const allRoadmaps = getRoadmaps();
    setRoadmaps(allRoadmaps);
    
    if (user) {
      const progress = getUserProgress(user.id);
      setUserProgress(progress);
    }
  }, [user]);

  const filteredRoadmaps = roadmaps.filter(roadmap =>
    roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    roadmap.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    roadmap.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoadmapProgress = (roadmapId: number) => {
    if (!user) return null;
    return userProgress.find(p => p.roadmapId === roadmapId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'frontend': return '🎨';
      case 'backend': return '⚙️';
      case 'fullstack': return '🚀';
      case 'mobile': return '📱';
      case 'data': return '📊';
      default: return '💻';
    }
  };

  const currentRoadmap = userProgress.find(p => p.progressPercentage > 0 && p.progressPercentage < 100);
  const currentRoadmapData = currentRoadmap ? roadmaps.find(r => r.id === currentRoadmap.roadmapId) : null;

  const roadmapSteps = [
    { title: 'HTML Fundamentals', completed: true },
    { title: 'CSS Basics', completed: true },
    { title: 'JavaScript Essentials', completed: true },
    { title: 'Responsive Design', completed: true },
    { title: 'CSS Frameworks', completed: true },
    { title: 'JavaScript DOM Manipulation', completed: true },
    { title: 'ES6+ Features', completed: false, current: true },
    { title: 'Frontend Build Tools', completed: false },
    { title: 'React Fundamentals', completed: false },
    { title: 'State Management', completed: false },
    { title: 'Testing', completed: false },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Learning Roadmaps</h1>
          <p className="text-slate-400">Follow structured paths to master different technologies</p>
        </div>
        {currentRoadmapData && (
          <Button className="bg-violet-600 hover:bg-violet-700">
            Continue Learning →
          </Button>
        )}
      </div>

      {/* Current Progress */}
      {isAuthenticated && currentRoadmapData && currentRoadmap && (
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Continue Your Journey</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-medium">{currentRoadmapData.title}</span>
              <span className="text-violet-400 font-semibold">{currentRoadmap.progressPercentage}%</span>
            </div>
            <Progress value={currentRoadmap.progressPercentage} className="h-3" />
            
            {/* Progress Steps */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-emerald-400 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completed
                </h3>
                {roadmapSteps.filter(step => step.completed).map((step, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span className="text-slate-300">{step.title}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-yellow-400 flex items-center">
                  <Circle className="h-4 w-4 mr-2" />
                  In Progress & Upcoming
                </h3>
                {roadmapSteps.filter(step => !step.completed).map((step, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm">
                    {step.current ? (
                      <>
                        <Circle className="h-4 w-4 text-yellow-500" />
                        <span className="text-white font-semibold">{step.title}</span>
                        <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Current</Badge>
                      </>
                    ) : (
                      <>
                        <Circle className="h-4 w-4 text-slate-600" />
                        <span className="text-slate-400">{step.title}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button className="bg-violet-600 hover:bg-violet-700">
              Continue Learning
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Roadmap Benefits */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Roadmap Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 text-sm">
              <Target className="h-5 w-5 text-violet-400" />
              <span className="text-slate-300">Structured Learning</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <span className="text-slate-300">Track Progress</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Users className="h-5 w-5 text-blue-400" />
              <span className="text-slate-300">Industry Relevance</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Brain className="h-5 w-5 text-purple-400" />
              <span className="text-slate-300">Avoid Overwhelm</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search roadmaps..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-900 border-slate-700 text-white placeholder-slate-400"
        />
      </div>

      {/* Available Roadmaps */}
      <div className="grid lg:grid-cols-3 gap-6">
        {filteredRoadmaps.map((roadmap) => {
          const progress = getRoadmapProgress(roadmap.id);
          const progressPercentage = progress?.progressPercentage || 0;
          const isStarted = progressPercentage > 0;
          const isCompleted = progressPercentage >= 100;

          return (
            <Card key={roadmap.id} className="bg-slate-900 border-slate-700 hover:border-violet-600/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl">{getCategoryIcon(roadmap.category)}</div>
                  <Badge className={getDifficultyColor(roadmap.difficulty)}>
                    {roadmap.difficulty}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2">{roadmap.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{roadmap.description}</p>
                
                <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{roadmap.estimatedHours}h</span>
                  </div>
                  <span>{roadmap.totalModules} modules</span>
                </div>

                {isAuthenticated && isStarted && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-violet-400 font-semibold">{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                )}

                <Button 
                  className={
                    isCompleted 
                      ? "w-full bg-emerald-600 hover:bg-emerald-700"
                      : isStarted 
                        ? "w-full bg-violet-600 hover:bg-violet-700"
                        : "w-full bg-slate-700 hover:bg-slate-600"
                  }
                  onClick={() => {
                    if (isAuthenticated && user) {
                      // Simulate starting/continuing roadmap
                      const newProgress = isStarted ? progressPercentage + 5 : 5;
                      saveUserProgress(user.id, roadmap.id, {
                        completedModules: Math.floor((newProgress / 100) * roadmap.totalModules),
                        progressPercentage: Math.min(newProgress, 100),
                      });
                      // Refresh progress
                      setUserProgress(getUserProgress(user.id));
                    }
                  }}
                >
                  {isCompleted 
                    ? "Completed ✓" 
                    : isStarted 
                      ? "Continue" 
                      : "Start Learning"
                  }
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRoadmaps.length === 0 && (
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">No roadmaps found</h3>
            <p className="text-slate-400">Try adjusting your search terms</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
