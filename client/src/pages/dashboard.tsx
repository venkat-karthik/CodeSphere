import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/use-auth';
import { getUserProgress, getRoadmaps } from '@/lib/storage';
import { Star, CheckCircle, Puzzle, Trophy, Flame, Code, Users, Brain } from 'lucide-react';
import { Section } from '@/types';

interface DashboardProps {
  onSectionChange: (section: Section) => void;
}

export function Dashboard({ onSectionChange }: DashboardProps) {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [roadmaps, setRoadmaps] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const progress = getUserProgress(user.id);
      const allRoadmaps = getRoadmaps();
      setUserProgress(progress);
      setRoadmaps(allRoadmaps);
    }
  }, [user]);

  const getCurrentRoadmap = () => {
    if (userProgress.length === 0) return null;
    const currentProgress = userProgress.find(p => p.progressPercentage > 0 && p.progressPercentage < 100);
    if (!currentProgress) return null;
    return roadmaps.find(r => r.id === currentProgress.roadmapId);
  };

  const currentRoadmap = getCurrentRoadmap();
  const currentProgress = currentRoadmap 
    ? userProgress.find(p => p.roadmapId === currentRoadmap.id)
    : null;

  if (!user) {
    return (
      <div className="p-6">
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-white mb-2">Please sign in to view your dashboard</h2>
            <p className="text-slate-400">Track your progress, earn XP, and level up your coding skills!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.firstName}! 👋
          </h1>
          <p className="text-slate-400">Ready to continue your coding journey?</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Current Streak</div>
          <div className="text-2xl font-bold text-orange-400 flex items-center">
            <Flame className="h-6 w-6 mr-1" />
            {user.streak} days
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-sm mb-1">Total XP</div>
                <div className="text-2xl font-bold text-white">{user.totalXP.toLocaleString()}</div>
              </div>
              <div className="w-12 h-12 bg-violet-600/20 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-violet-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-sm mb-1">Courses Completed</div>
                <div className="text-2xl font-bold text-white">{user.coursesCompleted}</div>
              </div>
              <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-sm mb-1">Problems Solved</div>
                <div className="text-2xl font-bold text-white">{user.problemsSolved}</div>
              </div>
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Puzzle className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-sm mb-1">Current Level</div>
                <div className="text-2xl font-bold text-white">{user.level}</div>
              </div>
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <Trophy className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning & Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Continue Learning */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Continue Learning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentRoadmap ? (
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{currentRoadmap.title}</h3>
                    <p className="text-sm text-slate-400">Currently: Module {currentProgress?.completedModules + 1}</p>
                  </div>
                  <span className="text-sm text-violet-400 font-semibold">
                    {currentProgress?.progressPercentage || 0}% Complete
                  </span>
                </div>
                <Progress value={currentProgress?.progressPercentage || 0} className="mb-3" />
                <Button 
                  onClick={() => onSectionChange('roadmaps')}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  Continue Learning
                </Button>
              </div>
            ) : (
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <h3 className="font-semibold text-white mb-2">Start Your Learning Journey</h3>
                <p className="text-sm text-slate-400 mb-4">Choose a roadmap to begin your coding adventure</p>
                <Button 
                  onClick={() => onSectionChange('roadmaps')}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  Browse Roadmaps
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-white">Joined CodeSphere</div>
                <div className="text-xs text-slate-400">
                  {new Date(user.joinDate).toLocaleDateString()}
                </div>
              </div>
              <div className="text-emerald-400 font-semibold text-sm">Welcome!</div>
            </div>
            
            {user.streak > 0 && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <Flame className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white">Started learning streak</div>
                  <div className="text-xs text-slate-400">Keep it up!</div>
                </div>
                <div className="text-orange-400 font-semibold text-sm">{user.streak} days</div>
              </div>
            )}

            {user.totalXP > 0 && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white">Earned XP</div>
                  <div className="text-xs text-slate-400">Total: {user.totalXP} XP</div>
                </div>
                <div className="text-violet-400 font-semibold text-sm">Level {user.level}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Today's Challenge */}
      <Card className="bg-gradient-to-r from-violet-900/50 to-purple-900/50 border-violet-600/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-violet-600 rounded-lg flex items-center justify-center">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Today's Challenge</h2>
                <p className="text-slate-400 text-sm">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <span className="bg-violet-600/20 text-violet-400 px-4 py-2 rounded-full font-semibold">
              +500 XP
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Two Sum Problem</h3>
          <p className="text-slate-300 text-sm mb-4">
            Given an array of integers and a target sum, return indices of two numbers that add up to the target.
          </p>
          <div className="flex gap-2 mb-4">
            <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded text-sm">Medium</span>
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded text-sm">Arrays</span>
            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-sm">Hash Tables</span>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={() => onSectionChange('problems')}
              className="bg-violet-600 hover:bg-violet-700"
            >
              Start Challenge
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              View Solution
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button 
              onClick={() => onSectionChange('mentor')}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 h-20 flex flex-col space-y-2"
            >
              <Brain className="h-6 w-6" />
              <span>Ask AI Mentor</span>
            </Button>
            <Button 
              onClick={() => onSectionChange('community')}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 h-20 flex flex-col space-y-2"
            >
              <Users className="h-6 w-6" />
              <span>Join Discussion</span>
            </Button>
            <Button 
              onClick={() => onSectionChange('resources')}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 h-20 flex flex-col space-y-2"
            >
              <CheckCircle className="h-6 w-6" />
              <span>Browse Resources</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
