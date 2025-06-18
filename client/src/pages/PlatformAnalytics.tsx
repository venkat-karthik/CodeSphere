import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock, 
  Target, 
  Star,
  BookOpen,
  Code,
  Calendar,
  Activity,
  PieChart,
  LineChart,
  Award,
  Zap,
  Flame,
  CheckCircle,
  AlertCircle,
  Download,
  Filter,
  Eye
} from 'lucide-react';

interface LearningMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
  icon: any;
}

interface CourseProgress {
  id: string;
  name: string;
  progress: number;
  enrolledStudents: number;
  completionRate: number;
  averageScore: number;
  category: string;
}

interface StudentPerformance {
  id: string;
  name: string;
  level: number;
  xp: number;
  coursesCompleted: number;
  problemsSolved: number;
  streak: number;
  lastActive: Date;
  performance: 'excellent' | 'good' | 'average' | 'needs-improvement';
}

interface TimeSeriesData {
  date: string;
  activeUsers: number;
  newRegistrations: number;
  completedLessons: number;
  problemsSolved: number;
}

interface EngagementData {
  category: string;
  value: number;
  percentage: number;
  color: string;
}

export function PlatformAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  const learningMetrics: LearningMetric[] = [
    {
      id: '1',
      name: 'Active Learners',
      value: 1247,
      previousValue: 1189,
      change: 4.9,
      trend: 'up',
      unit: 'users',
      icon: Users
    },
    {
      id: '2',
      name: 'Course Completions',
      value: 89,
      previousValue: 76,
      change: 17.1,
      trend: 'up',
      unit: 'courses',
      icon: BookOpen
    },
    {
      id: '3',
      name: 'Problems Solved',
      value: 2341,
      previousValue: 2187,
      change: 7.0,
      trend: 'up',
      unit: 'problems',
      icon: Code
    },
    {
      id: '4',
      name: 'Average Study Time',
      value: 2.8,
      previousValue: 3.1,
      change: -9.7,
      trend: 'down',
      unit: 'hours/day',
      icon: Clock
    },
    {
      id: '5',
      name: 'Retention Rate',
      value: 87.3,
      previousValue: 85.2,
      change: 2.5,
      trend: 'up',
      unit: '%',
      icon: Target
    },
    {
      id: '6',
      name: 'Satisfaction Score',
      value: 4.6,
      previousValue: 4.5,
      change: 2.2,
      trend: 'up',
      unit: '/5',
      icon: Star
    }
  ];

  const courseProgress: CourseProgress[] = [
    {
      id: '1',
      name: 'JavaScript Fundamentals',
      progress: 92,
      enrolledStudents: 456,
      completionRate: 78.5,
      averageScore: 87.2,
      category: 'Frontend'
    },
    {
      id: '2',
      name: 'React Development',
      progress: 85,
      enrolledStudents: 389,
      completionRate: 72.1,
      averageScore: 84.6,
      category: 'Frontend'
    },
    {
      id: '3',
      name: 'Node.js Backend',
      progress: 78,
      enrolledStudents: 234,
      completionRate: 68.9,
      averageScore: 81.3,
      category: 'Backend'
    },
    {
      id: '4',
      name: 'Database Design',
      progress: 65,
      enrolledStudents: 198,
      completionRate: 61.2,
      averageScore: 79.8,
      category: 'Backend'
    },
    {
      id: '5',
      name: 'Advanced Algorithms',
      progress: 45,
      enrolledStudents: 123,
      completionRate: 52.4,
      averageScore: 76.5,
      category: 'Computer Science'
    }
  ];

  const topPerformers: StudentPerformance[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      level: 15,
      xp: 12500,
      coursesCompleted: 18,
      problemsSolved: 234,
      streak: 89,
      lastActive: new Date('2024-01-21'),
      performance: 'excellent'
    },
    {
      id: '2',
      name: 'Sarah Chen',
      level: 12,
      xp: 10800,
      coursesCompleted: 15,
      problemsSolved: 198,
      streak: 67,
      lastActive: new Date('2024-01-21'),
      performance: 'excellent'
    },
    {
      id: '3',
      name: 'Mike Rodriguez',
      level: 11,
      xp: 9500,
      coursesCompleted: 12,
      problemsSolved: 176,
      streak: 45,
      lastActive: new Date('2024-01-20'),
      performance: 'good'
    },
    {
      id: '4',
      name: 'Emma Wilson',
      level: 10,
      xp: 8200,
      coursesCompleted: 11,
      problemsSolved: 145,
      streak: 52,
      lastActive: new Date('2024-01-21'),
      performance: 'good'
    },
    {
      id: '5',
      name: 'David Kim',
      level: 9,
      xp: 7800,
      coursesCompleted: 10,
      problemsSolved: 132,
      streak: 38,
      lastActive: new Date('2024-01-19'),
      performance: 'average'
    }
  ];

  const timeSeriesData: TimeSeriesData[] = [
    { date: '2024-01-15', activeUsers: 1247, newRegistrations: 23, completedLessons: 156, problemsSolved: 234 },
    { date: '2024-01-16', activeUsers: 1189, newRegistrations: 18, completedLessons: 142, problemsSolved: 198 },
    { date: '2024-01-17', activeUsers: 1321, newRegistrations: 31, completedLessons: 178, problemsSolved: 267 },
    { date: '2024-01-18', activeUsers: 1156, newRegistrations: 15, completedLessons: 134, problemsSolved: 189 },
    { date: '2024-01-19', activeUsers: 1289, newRegistrations: 27, completedLessons: 167, problemsSolved: 245 },
    { date: '2024-01-20', activeUsers: 1345, newRegistrations: 34, completedLessons: 189, problemsSolved: 278 },
    { date: '2024-01-21', activeUsers: 1247, newRegistrations: 22, completedLessons: 145, problemsSolved: 201 }
  ];

  const engagementData: EngagementData[] = [
    { category: 'Active Learning', value: 45, percentage: 45, color: 'bg-blue-500' },
    { category: 'Course Completion', value: 28, percentage: 28, color: 'bg-green-500' },
    { category: 'Problem Solving', value: 18, percentage: 18, color: 'bg-purple-500' },
    { category: 'Social Learning', value: 9, percentage: 9, color: 'bg-orange-500' }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'bg-green-500/20 text-green-400';
      case 'good': return 'bg-blue-500/20 text-blue-400';
      case 'average': return 'bg-yellow-500/20 text-yellow-400';
      case 'needs-improvement': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            <span>Learning Analytics Dashboard</span>
            <Badge className="bg-purple-500/20 text-purple-400">Real-time</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Comprehensive insights into learning patterns, student performance, and platform engagement.
          </p>
        </CardContent>
      </Card>

      {/* Timeframe Selector */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {['day', 'week', 'month', 'quarter'].map((timeframe) => (
            <Button
              key={timeframe}
              variant={selectedTimeframe === timeframe ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeframe(timeframe)}
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </Button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {learningMetrics.map((metric) => {
          const IconComponent = metric.icon;
          return (
            <Card key={metric.id} className="hover:shadow-lg transition-all transform hover:-translate-y-1">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                    <IconComponent className="h-7 w-7 text-primary" />
                  </div>
                  {getTrendIcon(metric.trend)}
                </div>
                
                <div className="flex flex-col mb-4">
                  <div className="text-4xl font-bold mb-1">{metric.value.toLocaleString()}</div>
                  <div className="text-lg text-muted-foreground font-semibold">{metric.name}</div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm mt-auto">
                  <span className={`${getTrendColor(metric.trend)} font-semibold`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}% {metric.trend}
                  </span>
                  <span className="text-muted-foreground">vs last {selectedTimeframe}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Time Series Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <LineChart className="h-5 w-5" />
              <span>Activity Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {timeSeriesData.map((data, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div className="text-xs text-muted-foreground">{data.activeUsers}</div>
                  <div 
                    className="bg-primary rounded-t w-8 transition-all hover:bg-primary/80"
                    style={{ height: `${(data.activeUsers / 1400) * 200}px` }}
                  />
                  <div className="text-xs font-medium">
                    {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-500">
                  {timeSeriesData.reduce((sum, d) => sum + d.newRegistrations, 0)}
                </div>
                <div className="text-xs text-muted-foreground">New Users</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-500">
                  {timeSeriesData.reduce((sum, d) => sum + d.completedLessons, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Lessons Completed</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-500">
                  {timeSeriesData.reduce((sum, d) => sum + d.problemsSolved, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Problems Solved</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Learning Engagement</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  {engagementData.map((item, index) => {
                    const total = engagementData.reduce((sum, d) => sum + d.percentage, 0);
                    const previousPercentages = engagementData
                      .slice(0, index)
                      .reduce((sum, d) => sum + d.percentage, 0);
                    const startAngle = (previousPercentages / total) * 360;
                    const endAngle = ((previousPercentages + item.percentage) / total) * 360;
                    
                    return (
                      <path
                        key={item.category}
                        d={`M 64 64 m -48 0 a 48 48 0 1 1 96 0 a 48 48 0 1 1 -96 0`}
                        fill="none"
                        stroke={item.color.replace('bg-', '').replace('-500', '')}
                        strokeWidth="24"
                        strokeDasharray={`${(item.percentage / total) * 301.59} 301.59`}
                        strokeDashoffset={`${(startAngle / 360) * 301.59}`}
                        className="transition-all"
                      />
                    );
                  })}
                </svg>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {engagementData.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm">{item.category}</span>
                  </div>
                  <span className="text-sm font-semibold">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Course Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courseProgress.map((course) => (
              <div key={course.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{course.name}</h4>
                    <p className="text-sm text-muted-foreground">{course.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{course.progress}%</div>
                    <div className="text-sm text-muted-foreground">
                      {course.enrolledStudents} students
                    </div>
                  </div>
                </div>
                <Progress 
                  value={course.progress} 
                  className="h-2 mb-2"
                  style={{ '--progress-color': getProgressColor(course.progress) } as any}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Completion: {course.completionRate}%</span>
                  <span>Avg Score: {course.averageScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Top Performers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topPerformers.map((student, index) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{student.name}</h4>
                      <Badge className={getPerformanceColor(student.performance)}>
                        {student.performance}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Level {student.level} • {student.xp} XP
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center space-x-1">
                    <BookOpen className="h-3 w-3" />
                    <span>{student.coursesCompleted}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Code className="h-3 w-3" />
                    <span>{student.problemsSolved}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Flame className="h-3 w-3" />
                    <span>{student.streak} days</span>
                  </span>
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 