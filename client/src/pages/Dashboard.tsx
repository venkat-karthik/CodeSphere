import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ProgressBar';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'wouter';
import { 
  Star, 
  CheckCircle, 
  Code, 
  Trophy, 
  Flame,
  ArrowRight,
  BookOpen,
  Users,
  Zap
} from 'lucide-react';

export default function Dashboard() {
  const { auth, updateUser } = useAuth();

  if (!auth.user) return null;

  const user = auth.user;
  const nextLevelXP = (Math.floor(user.xp / 1000) + 1) * 1000;
  const currentLevelProgress = (user.xp % 1000);

  // Mock data for demonstration
  const recentActivities = [
    {
      id: 1,
      type: 'completion',
      title: 'Completed "JavaScript DOM Manipulation"',
      time: '2 hours ago',
      xp: 250,
      icon: CheckCircle,
      color: 'text-green-400',
    },
    {
      id: 2,
      type: 'problem',
      title: 'Solved "Two Sum" problem',
      time: '1 day ago',
      xp: 100,
      icon: Code,
      color: 'text-blue-400',
    },
    {
      id: 3,
      type: 'streak',
      title: `Maintained ${user.streak}-day streak`,
      time: 'Today',
      icon: Flame,
      color: 'text-orange-400',
    },
  ];

  const handleContinueLearning = () => {
    // Add some XP for continuing learning
    updateUser({ xp: user.xp + 50 });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.firstName}! 👋
          </h1>
          <p className="text-gray-400">Ready to continue your coding journey?</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Current Streak</div>
          <div className="text-2xl font-bold text-orange-400 flex items-center">
            <Flame className="h-6 w-6 mr-1" />
            {user.streak} days
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-400 text-sm mb-1">Total XP</div>
                <div className="text-2xl font-bold text-white">{user.xp.toLocaleString()}</div>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-400 text-sm mb-1">Courses Completed</div>
                <div className="text-2xl font-bold text-white">8</div>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-400 text-sm mb-1">Problems Solved</div>
                <div className="text-2xl font-bold text-white">127</div>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Code className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-400 text-sm mb-1">Current Level</div>
                <div className="text-2xl font-bold text-white">{user.level}</div>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Trophy className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Continue Learning */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Continue Learning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-white">Frontend Developer Roadmap</h3>
                  <p className="text-sm text-gray-400">Currently: ES6+ Features</p>
                </div>
                <span className="text-sm text-purple-400 font-semibold">65% Complete</span>
              </div>
              <ProgressBar value={65} max={100} className="mb-3" />
              <Button 
                onClick={handleContinueLearning}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                Continue Learning
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-white">Python for Beginners</h3>
                  <p className="text-sm text-gray-400">Currently: Data Structures</p>
                </div>
                <span className="text-sm text-purple-400 font-semibold">30% Complete</span>
              </div>
              <ProgressBar value={30} max={100} className="mb-3" />
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                Continue Learning
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'completion' ? 'bg-green-500' :
                      activity.type === 'problem' ? 'bg-blue-500' : 'bg-orange-500'
                    }`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-white">{activity.title}</div>
                      <div className="text-xs text-gray-400">{activity.time}</div>
                    </div>
                    {activity.xp && (
                      <div className="text-sm font-semibold text-green-400">+{activity.xp} XP</div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Challenge */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-500/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Today's Challenge</h2>
                <p className="text-gray-400 text-sm">January 26, 2025</p>
              </div>
            </div>
            <span className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full font-semibold">
              +500 XP
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Two Sum Problem</h3>
          <p className="text-gray-300 text-sm mb-4">
            Given an array of integers and a target sum, return indices of two numbers that add up to the target.
          </p>
          <div className="flex gap-2 mb-4">
            <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded text-sm">Medium</span>
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded text-sm">Arrays</span>
            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-sm">Hash Tables</span>
          </div>
          <div className="flex gap-4">
            <Link href="/problems">
              <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                Start Challenge
              </Button>
            </Link>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              View Solution
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/roadmaps">
          <Card className="bg-gray-800 border-gray-700 hover:border-purple-500/50 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Browse Roadmaps</h3>
              <p className="text-gray-400 text-sm">Explore structured learning paths</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/resources">
          <Card className="bg-gray-800 border-gray-700 hover:border-purple-500/50 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Download PDFs</h3>
              <p className="text-gray-400 text-sm">Access educational resources</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/community">
          <Card className="bg-gray-800 border-gray-700 hover:border-purple-500/50 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Join Community</h3>
              <p className="text-gray-400 text-sm">Connect with other learners</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Level Progress */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Level Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-300">Level {user.level}</span>
            <span className="text-gray-300">Level {user.level + 1}</span>
          </div>
          <ProgressBar 
            value={currentLevelProgress} 
            max={1000} 
            showLabel 
            className="mb-2"
          />
          <p className="text-sm text-gray-400 text-center">
            {1000 - currentLevelProgress} XP needed to reach Level {user.level + 1}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
