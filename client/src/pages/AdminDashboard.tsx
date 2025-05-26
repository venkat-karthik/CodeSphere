import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Award,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  PieChart,
  Activity,
  User,
  Play,
  Target
} from 'lucide-react';

interface Student {
  id: number;
  name: string;
  email: string;
  level: number;
  xp: number;
  streak: number;
  coursesCompleted: number;
  problemsSolved: number;
  lastActive: Date;
  totalStudyTime: number;
  subscriptionType: string;
}

interface AnalyticsData {
  totalStudents: number;
  activeStudents: number;
  averageStudyTime: number;
  completionRate: number;
  topPerformers: Student[];
  weeklyEngagement: number[];
}

export function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock student data - in real app this would come from your database
  const students: Student[] = [
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex@example.com',
      level: 5,
      xp: 2450,
      streak: 12,
      coursesCompleted: 3,
      problemsSolved: 45,
      lastActive: new Date('2024-01-20'),
      totalStudyTime: 180,
      subscriptionType: 'premium'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      level: 8,
      xp: 4200,
      streak: 25,
      coursesCompleted: 5,
      problemsSolved: 78,
      lastActive: new Date('2024-01-21'),
      totalStudyTime: 320,
      subscriptionType: 'pro'
    },
    {
      id: 3,
      name: 'Mike Rodriguez',
      email: 'mike@example.com',
      level: 3,
      xp: 1200,
      streak: 5,
      coursesCompleted: 1,
      problemsSolved: 23,
      lastActive: new Date('2024-01-19'),
      totalStudyTime: 95,
      subscriptionType: 'free'
    }
  ];

  const analytics: AnalyticsData = {
    totalStudents: 1247,
    activeStudents: 892,
    averageStudyTime: 156,
    completionRate: 78,
    topPerformers: students.slice(0, 3),
    weeklyEngagement: [65, 72, 68, 85, 90, 88, 92]
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSubscriptionColor = (type: string) => {
    switch (type) {
      case 'pro': return 'bg-purple-500/20 text-purple-400';
      case 'premium': return 'bg-gold-500/20 text-yellow-400';
      case 'free': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage students and analyze learning analytics
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold">{analytics.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-green-500 mt-2">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Students</p>
                <p className="text-3xl font-bold">{analytics.activeStudents}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-green-500 mt-2">+8% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Study Time</p>
                <p className="text-3xl font-bold">{formatStudyTime(analytics.averageStudyTime)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-green-500 mt-2">+5% improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-3xl font-bold">{analytics.completionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-xs text-green-500 mt-2">+3% this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Student Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="content">Content Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Top Performers This Week</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topPerformers.map((student, index) => (
                  <div key={student.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">Level {student.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{student.xp} XP</p>
                      <p className="text-sm text-muted-foreground">{student.streak} day streak</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-6 text-center">
                <Plus className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Upload Content</h3>
                <p className="text-sm text-muted-foreground">Add new PDFs, videos, or problems</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Generate Report</h3>
                <p className="text-sm text-muted-foreground">Create detailed analytics report</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Manage Users</h3>
                <p className="text-sm text-muted-foreground">View and edit student accounts</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Students Table */}
          <Card>
            <CardHeader>
              <CardTitle>Student List ({filteredStudents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm font-semibold">Level {student.level}</p>
                        <p className="text-xs text-muted-foreground">{student.xp} XP</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm font-semibold">{student.problemsSolved}</p>
                        <p className="text-xs text-muted-foreground">Problems</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm font-semibold">{formatStudyTime(student.totalStudyTime)}</p>
                        <p className="text-xs text-muted-foreground">Study Time</p>
                      </div>
                      
                      <Badge className={getSubscriptionColor(student.subscriptionType)}>
                        {student.subscriptionType}
                      </Badge>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {analytics.weeklyEngagement.map((value, index) => (
                    <div key={index} className="flex-1 bg-primary/20 rounded-t" style={{ height: `${value}%` }}>
                      <div className="text-xs text-center mt-2">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Progress Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Beginner (Level 1-3)</span>
                    <span className="font-semibold">45%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }} />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Intermediate (Level 4-7)</span>
                    <span className="font-semibold">35%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '35%' }} />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Advanced (Level 8+)</span>
                    <span className="font-semibold">20%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '20%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Upload PDF Resources</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add new learning materials for students
                    </p>
                    <Button className="w-full">Upload PDF</Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <Play className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Add Video Content</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload educational videos and tutorials
                    </p>
                    <Button className="w-full">Add Video</Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Create Problems</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Design coding challenges and exercises
                    </p>
                    <Button className="w-full">New Problem</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}