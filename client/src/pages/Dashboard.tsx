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
  Bot
} from 'lucide-react';

interface DashboardProps {
  onSectionChange: (section: Section) => void;
}

export function Dashboard({ onSectionChange }: DashboardProps) {
  const { user, isAuthenticated } = useAuth();

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
            <Card className="card-hover">
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
            
            <Card className="card-hover">
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
            
            <Card className="card-hover">
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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user.firstName}! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to continue your coding journey?
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Current Streak</div>
          <div className="text-2xl font-bold text-orange-500 flex items-center">
            <Flame className="h-6 w-6 mr-1" />
            {user.streak} days
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-muted-foreground text-sm mb-1">Total XP</div>
                <div className="text-2xl font-bold">{user.xp}</div>
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-muted-foreground text-sm mb-1">Courses Completed</div>
                <div className="text-2xl font-bold">{user.completedCourses}</div>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-muted-foreground text-sm mb-1">Problems Solved</div>
                <div className="text-2xl font-bold">{user.problemsSolved}</div>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Code className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-muted-foreground text-sm mb-1">Current Level</div>
                <div className="text-2xl font-bold">{user.level}</div>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Trophy className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Continue Learning */}
        <Card>
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-card/50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">Frontend Developer Roadmap</h3>
                  <p className="text-sm text-muted-foreground">Currently: ES6+ Features</p>
                </div>
                <Badge variant="secondary">65% Complete</Badge>
              </div>
              <Progress value={65} className="mb-3" />
              <Button 
                onClick={() => onSectionChange('roadmaps')}
                className="w-full"
              >
                Continue Learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm">Completed "JavaScript DOM Manipulation"</div>
                <div className="text-xs text-muted-foreground">2 hours ago</div>
              </div>
              <div className="text-green-500 font-semibold text-sm">+250 XP</div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Code className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm">Solved "Two Sum" problem</div>
                <div className="text-xs text-muted-foreground">1 day ago</div>
              </div>
              <div className="text-blue-500 font-semibold text-sm">+100 XP</div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <Flame className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm">Maintained {user.streak}-day streak</div>
                <div className="text-xs text-muted-foreground">Today</div>
              </div>
              <div className="text-orange-500 font-semibold text-sm">Streak!</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Challenge */}
      <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Today's Challenge</CardTitle>
            <Badge className="bg-primary/20 text-primary">+500 XP</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Implement a Binary Search Algorithm</h3>
            <p className="text-muted-foreground text-sm">
              Write a function that performs binary search on a sorted array. 
              Test with various inputs and edge cases.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline">Medium</Badge>
            <Badge variant="outline">Algorithms</Badge>
            <Badge variant="outline">JavaScript</Badge>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => onSectionChange('problems')}>
              Start Challenge
            </Button>
            <Button 
              variant="outline"
              onClick={() => onSectionChange('mentor')}
            >
              <Bot className="mr-2 h-4 w-4" />
              Ask AI Mentor
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => onSectionChange('roadmaps')}
            >
              <BookOpen className="h-6 w-6 mb-2" />
              Browse Roadmaps
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => onSectionChange('resources')}
            >
              <BookOpen className="h-6 w-6 mb-2" />
              Download PDFs
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => onSectionChange('community')}
            >
              <Users className="h-6 w-6 mb-2" />
              Join Community
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => onSectionChange('mentor')}
            >
              <Bot className="h-6 w-6 mb-2" />
              Ask AI Mentor
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
