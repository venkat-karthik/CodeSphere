import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  BookOpen, 
  Target, 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Award, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  User,
  Play,
  Bot,
  Download
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AssignmentManager } from '@/components/AssignmentManager';
import { AssistantManagement } from './AssistantManagement';
import { AdminAnalytics } from '@/components/AdminAnalytics';
import { ContentManagement } from './ContentManagement';

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
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [studentsState, setStudentsState] = useState([
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
  ]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '' });
  const [addError, setAddError] = useState('');
  
  const companyGrowthData = [
    { month: 'Jan', revenue: 12000, students: 150, courses: 8 },
    { month: 'Feb', revenue: 15000, students: 200, courses: 12 },
    { month: 'Mar', revenue: 18000, students: 280, courses: 15 },
    { month: 'Apr', revenue: 22000, students: 350, courses: 18 },
    { month: 'May', revenue: 28000, students: 420, courses: 22 },
    { month: 'Jun', revenue: 35000, students: 520, courses: 28 }
  ];

  const exportAnalytics = () => {
    const csvData = [
      ['Metric', 'Value'],
      ['Total Students', '520'],
      ['Active Students', '384'],
      ['Average Study Time', '4.2 hours'],
      ['Course Completion Rate', '78%'],
      ['Monthly Revenue', '$35,000'],
      ['Student Satisfaction', '4.8/5'],
      ['Platform Uptime', '99.9%']
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codesphere-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const analytics: AnalyticsData = {
    totalStudents: 1247,
    activeStudents: 892,
    averageStudyTime: 156,
    completionRate: 78,
    topPerformers: studentsState.slice(0, 3),
    weeklyEngagement: [65, 72, 68, 85, 90, 88, 92]
  };

  const filteredStudents = studentsState.filter(student =>
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

  const handleAddStudent = () => {
    if (!newStudent.name.trim() || !newStudent.email.trim()) {
      setAddError('Name and email are required.');
      return;
    }
    setStudentsState(prev => [
      ...prev,
      {
        id: Date.now(),
        name: newStudent.name,
        email: newStudent.email,
        level: 1,
        xp: 0,
        streak: 0,
        coursesCompleted: 0,
        problemsSolved: 0,
        lastActive: new Date(),
        totalStudyTime: 0,
        subscriptionType: 'free',
      },
    ]);
    setNewStudent({ name: '', email: '' });
    setAddError('');
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-8 px-8 py-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage students and analyze learning analytics
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportAnalytics}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Add Student Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">Name</label>
              <Input
                id="name"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right">Email</label>
              <Input
                id="email"
                type="email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            {addError && <div className="text-red-500 text-sm col-span-4 text-center">{addError}</div>}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddStudent}>Add Student</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Company Growth Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span>CodeSphere Business Growth</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">$35,000</div>
              <div className="text-sm text-muted-foreground">Monthly Revenue</div>
              <div className="text-xs text-green-500 mt-1">+27% from last month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">520</div>
              <div className="text-sm text-muted-foreground">Total Students</div>
              <div className="text-xs text-blue-500 mt-1">+85 new this month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">28</div>
              <div className="text-sm text-muted-foreground">Active Courses</div>
              <div className="text-xs text-purple-500 mt-1">6 launched recently</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
            <h4 className="font-semibold mb-3">6-Month Growth Trend</h4>
            <div className="space-y-2">
              {companyGrowthData.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <span className="text-sm">{data.month}</span>
                  <div className="flex space-x-4 text-sm">
                    <span className="text-green-600">${data.revenue.toLocaleString()}</span>
                    <span className="text-blue-600">{data.students} students</span>
                    <span className="text-purple-600">{data.courses} courses</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Analytics Overview */}
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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Student Management</TabsTrigger>
          <TabsTrigger value="assignments">Assignment Management</TabsTrigger>
          <TabsTrigger value="assistants">Assistant Management</TabsTrigger>
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
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setSelectedTab('content')}>
              <CardContent className="p-6 text-center">
                <Plus className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Upload Content</h3>
                <p className="text-sm text-muted-foreground">Add new PDFs, videos, or problems</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setSelectedTab('analytics')}>
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Generate Report</h3>
                <p className="text-sm text-muted-foreground">Create detailed analytics report</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setSelectedTab('students')}>
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

        <TabsContent value="assignments" className="space-y-6 w-full">
          <AssignmentManager />
        </TabsContent>

        <TabsContent value="assistants" className="space-y-6 w-full">
          <AssistantManagement />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AdminAnalytics />
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <ContentManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}