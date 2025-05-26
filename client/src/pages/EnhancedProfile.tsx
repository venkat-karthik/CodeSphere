import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Calendar,
  MapPin,
  Link,
  Github,
  Linkedin,
  Twitter,
  Trophy,
  Target,
  Code,
  BookOpen,
  Users,
  Flame,
  Star,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  Edit,
  Share,
  Download,
  BarChart3,
  Zap,
  Heart,
  MessageSquare,
  ExternalLink
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  earned: boolean;
  earnedDate?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  status: 'completed' | 'in-progress' | 'planned';
  completedDate?: Date;
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  likes: number;
  views: number;
}

interface Activity {
  id: string;
  type: 'problem_solved' | 'course_completed' | 'project_created' | 'achievement_earned' | 'streak_milestone';
  title: string;
  description: string;
  timestamp: Date;
  xpGained?: number;
  icon: any;
}

export function EnhancedProfile() {
  const [activeTab, setActiveTab] = useState('overview');

  // User stats
  const userStats = {
    level: 8,
    xp: 4250,
    nextLevelXP: 5000,
    streak: 42,
    longestStreak: 89,
    problemsSolved: 156,
    coursesCompleted: 12,
    projectsBuilt: 8,
    communityRank: 23,
    totalStudyTime: 248, // hours
    joinDate: new Date('2023-08-15'),
    lastActive: new Date('2024-01-20T15:30:00')
  };

  // Achievements data
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first coding problem',
      icon: Target,
      earned: true,
      earnedDate: new Date('2023-08-16'),
      rarity: 'common',
      category: 'Getting Started'
    },
    {
      id: '2',
      title: 'Streak Master',
      description: 'Maintain a 30-day learning streak',
      icon: Flame,
      earned: true,
      earnedDate: new Date('2023-09-15'),
      rarity: 'rare',
      category: 'Consistency'
    },
    {
      id: '3',
      title: 'Code Warrior',
      description: 'Solve 100 coding problems',
      icon: Code,
      earned: true,
      earnedDate: new Date('2023-12-10'),
      rarity: 'epic',
      category: 'Problem Solving'
    },
    {
      id: '4',
      title: 'Full Stack Hero',
      description: 'Complete all full-stack development courses',
      icon: Trophy,
      earned: false,
      rarity: 'legendary',
      category: 'Learning'
    },
    {
      id: '5',
      title: 'Community Champion',
      description: 'Help 50 fellow learners in the community',
      icon: Users,
      earned: true,
      earnedDate: new Date('2024-01-05'),
      rarity: 'epic',
      category: 'Community'
    },
    {
      id: '6',
      title: 'Project Builder',
      description: 'Deploy 5 live projects',
      icon: Star,
      earned: true,
      earnedDate: new Date('2023-11-20'),
      rarity: 'rare',
      category: 'Projects'
    }
  ];

  // Projects data
  const projects: Project[] = [
    {
      id: '1',
      title: 'Task Management App',
      description: 'A full-stack task management application built with React, Node.js, and MongoDB',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT'],
      status: 'completed',
      completedDate: new Date('2024-01-15'),
      liveUrl: 'https://taskapp.example.com',
      githubUrl: 'https://github.com/johndoe/task-app',
      likes: 24,
      views: 156
    },
    {
      id: '2',
      title: 'Weather Dashboard',
      description: 'Real-time weather tracking with beautiful visualizations',
      technologies: ['Vue.js', 'Chart.js', 'Weather API', 'Tailwind CSS'],
      status: 'completed',
      completedDate: new Date('2023-12-08'),
      liveUrl: 'https://weather.example.com',
      githubUrl: 'https://github.com/johndoe/weather-dashboard',
      likes: 18,
      views: 89
    },
    {
      id: '3',
      title: 'E-commerce Platform',
      description: 'Modern e-commerce solution with Stripe integration',
      technologies: ['Next.js', 'Stripe', 'PostgreSQL', 'Prisma'],
      status: 'in-progress',
      likes: 12,
      views: 45
    },
    {
      id: '4',
      title: 'AI Chat Bot',
      description: 'Intelligent chatbot using OpenAI API',
      technologies: ['Python', 'OpenAI API', 'Flask', 'WebSocket'],
      status: 'planned',
      likes: 0,
      views: 0
    }
  ];

  // Recent activity
  const recentActivity: Activity[] = [
    {
      id: '1',
      type: 'problem_solved',
      title: 'Binary Tree Traversal',
      description: 'Solved a medium-level tree algorithm problem',
      timestamp: new Date('2024-01-20T14:30:00'),
      xpGained: 50,
      icon: Target
    },
    {
      id: '2',
      type: 'achievement_earned',
      title: 'Community Champion',
      description: 'Earned achievement for helping fellow learners',
      timestamp: new Date('2024-01-19T16:45:00'),
      xpGained: 100,
      icon: Trophy
    },
    {
      id: '3',
      type: 'course_completed',
      title: 'Advanced React Patterns',
      description: 'Completed the advanced React course',
      timestamp: new Date('2024-01-18T20:15:00'),
      xpGained: 200,
      icon: BookOpen
    },
    {
      id: '4',
      type: 'project_created',
      title: 'Task Management App',
      description: 'Deployed new full-stack project',
      timestamp: new Date('2024-01-15T12:00:00'),
      xpGained: 300,
      icon: Code
    },
    {
      id: '5',
      type: 'streak_milestone',
      title: '40-Day Streak',
      description: 'Maintained learning consistency for 40 days',
      timestamp: new Date('2024-01-10T09:00:00'),
      xpGained: 150,
      icon: Flame
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'rare': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'epic': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'legendary': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400';
      case 'planned': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatStudyTime = (hours: number) => {
    return `${hours}h`;
  };

  const earnedAchievements = achievements.filter(a => a.earned);
  const progressPercentage = (userStats.xp / userStats.nextLevelXP) * 100;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center md:items-start space-y-4">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-3xl font-bold">
                JD
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold">John Doe</h1>
                <p className="text-muted-foreground">Full-Stack Developer</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDate(userStats.joinDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">Level {userStats.level}</div>
                <div className="text-xs text-muted-foreground">Current Level</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-orange-500">{userStats.streak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-500">{userStats.problemsSolved}</div>
                <div className="text-xs text-muted-foreground">Problems Solved</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-500">{userStats.projectsBuilt}</div>
                <div className="text-xs text-muted-foreground">Projects Built</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2">
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
              <Button variant="outline">
                <Share className="mr-2 h-4 w-4" />
                Share Profile
              </Button>
            </div>
          </div>

          {/* XP Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Level {userStats.level} Progress</span>
              <span className="text-sm text-muted-foreground">{userStats.xp} / {userStats.nextLevelXP} XP</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4 mt-4">
            <Button variant="ghost" size="sm">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button variant="ghost" size="sm">
              <Linkedin className="mr-2 h-4 w-4" />
              LinkedIn
            </Button>
            <Button variant="ghost" size="sm">
              <Link className="mr-2 h-4 w-4" />
              Portfolio
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Learning Progress */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Learning Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">JavaScript Fundamentals</span>
                    <span className="text-sm text-muted-foreground">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">React Development</span>
                    <span className="text-sm text-muted-foreground">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Node.js Backend</span>
                    <span className="text-sm text-muted-foreground">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Database Design</span>
                    <span className="text-sm text-muted-foreground">60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Quick Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Study Time</span>
                  <span className="font-semibold">{formatStudyTime(userStats.totalStudyTime)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Courses Completed</span>
                  <span className="font-semibold">{userStats.coursesCompleted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Community Rank</span>
                  <span className="font-semibold">#{userStats.communityRank}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Longest Streak</span>
                  <span className="font-semibold">{userStats.longestStreak} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Achievements</span>
                  <span className="font-semibold">{earnedAchievements.length}/{achievements.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Recent Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {earnedAchievements.slice(0, 6).map((achievement) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div key={achievement.id} className={`p-4 border-2 rounded-lg ${getRarityColor(achievement.rarity)}`}>
                      <div className="flex items-center space-x-3 mb-2">
                        <IconComponent className="h-6 w-6" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{achievement.title}</h4>
                          <p className="text-xs opacity-80">{achievement.description}</p>
                        </div>
                      </div>
                      {achievement.earnedDate && (
                        <p className="text-xs opacity-60">
                          Earned {formatDate(achievement.earnedDate)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5" />
                  <span>All Achievements</span>
                </div>
                <Badge variant="secondary">
                  {earnedAchievements.length}/{achievements.length} Earned
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div 
                      key={achievement.id} 
                      className={`p-4 border-2 rounded-lg ${
                        achievement.earned 
                          ? getRarityColor(achievement.rarity)
                          : 'bg-muted/30 text-muted-foreground border-muted opacity-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <IconComponent className="h-8 w-8 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold">{achievement.title}</h4>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getRarityColor(achievement.rarity)}`}
                            >
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <p className="text-sm opacity-80 mb-2">{achievement.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs opacity-60">{achievement.category}</span>
                            {achievement.earned && achievement.earnedDate && (
                              <span className="text-xs opacity-60">
                                {formatDate(achievement.earnedDate)}
                              </span>
                            )}
                          </div>
                        </div>
                        {achievement.earned && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span>My Projects</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{project.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                      </div>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{project.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{project.views}</span>
                        </div>
                      </div>
                      {project.completedDate && (
                        <span>{formatDate(project.completedDate)}</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {project.liveUrl && (
                        <Button size="sm" variant="outline">
                          <ExternalLink className="mr-2 h-3 w-3" />
                          Live Demo
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button size="sm" variant="outline">
                          <Github className="mr-2 h-3 w-3" />
                          Code
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {activity.timestamp.toLocaleDateString()} at {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {activity.xpGained && (
                            <Badge variant="secondary" className="text-xs">
                              +{activity.xpGained} XP
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}