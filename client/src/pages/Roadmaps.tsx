import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Search,
  Route,
  TrendingUp,
  Users,
  Brain
} from 'lucide-react';
import { storage } from '../lib/storage';

export function Roadmaps() {
  const [searchTerm, setSearchTerm] = useState('');
  const courses = storage.getCourses();
  const currentCourse = courses[0]; // Frontend Developer Roadmap

  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

  const roadmaps = [
    {
      id: 'frontend',
      title: 'Frontend Developer',
      description: 'Master modern frontend technologies including React, Vue, and advanced CSS',
      icon: '🎨',
      difficulty: 'Beginner to Advanced',
      modules: 12,
      progress: 65,
      status: 'In Progress',
      color: 'from-orange-500 to-red-500',
      skills: [
        { name: 'HTML5 Fundamentals', completed: true, weeks: 2 },
        { name: 'CSS3 & Responsive Design', completed: true, weeks: 3 },
        { name: 'JavaScript ES6+', completed: true, weeks: 4 },
        { name: 'Version Control (Git)', completed: true, weeks: 1 },
        { name: 'React.js Basics', completed: false, weeks: 4, current: true },
        { name: 'State Management', completed: false, weeks: 3 },
        { name: 'TypeScript', completed: false, weeks: 2 },
        { name: 'Testing & Debugging', completed: false, weeks: 2 },
        { name: 'Build Tools & Deployment', completed: false, weeks: 2 },
        { name: 'Performance Optimization', completed: false, weeks: 2 }
      ]
    },
    {
      id: 'backend',
      title: 'Backend Developer',
      description: 'Learn server-side development with Node.js, Python, databases, and APIs',
      icon: '⚙️',
      difficulty: 'Beginner to Advanced',
      modules: 15,
      progress: 0,
      status: 'Not Started',
      color: 'from-green-500 to-emerald-500',
      skills: [
        { name: 'Programming Fundamentals', completed: false, weeks: 3 },
        { name: 'Node.js & Express', completed: false, weeks: 4 },
        { name: 'Database Design (SQL)', completed: false, weeks: 3 },
        { name: 'MongoDB & NoSQL', completed: false, weeks: 2 },
        { name: 'RESTful API Development', completed: false, weeks: 3 },
        { name: 'Authentication & Security', completed: false, weeks: 3 },
        { name: 'Server Deployment', completed: false, weeks: 2 },
        { name: 'Microservices', completed: false, weeks: 4 },
        { name: 'Docker & Containers', completed: false, weeks: 2 },
        { name: 'Cloud Services (AWS)', completed: false, weeks: 3 }
      ]
    },
    {
      id: 'fullstack',
      title: 'Full Stack Developer',
      description: 'Complete path covering both frontend and backend development skills',
      icon: '🚀',
      difficulty: 'Intermediate to Advanced',
      modules: 20,
      progress: 0,
      status: 'Not Started',
      color: 'from-blue-500 to-purple-500',
      skills: [
        { name: 'Web Development Basics', completed: false, weeks: 2 },
        { name: 'Frontend Fundamentals', completed: false, weeks: 6 },
        { name: 'React.js Mastery', completed: false, weeks: 5 },
        { name: 'Backend Development', completed: false, weeks: 6 },
        { name: 'Database Management', completed: false, weeks: 4 },
        { name: 'API Development', completed: false, weeks: 3 },
        { name: 'DevOps & Deployment', completed: false, weeks: 3 },
        { name: 'System Design', completed: false, weeks: 4 },
        { name: 'Project Portfolio', completed: false, weeks: 3 }
      ]
    },
    {
      id: 'mobile',
      title: 'Mobile Developer',
      description: 'Build mobile apps with React Native, Flutter, and native iOS/Android',
      icon: '📱',
      difficulty: 'Intermediate to Advanced',
      modules: 14,
      progress: 0,
      status: 'Not Started',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      id: 'datascience',
      title: 'Data Science',
      description: 'Master Python, machine learning, data analysis, and visualization tools',
      icon: '📊',
      difficulty: 'Beginner to Advanced',
      modules: 18,
      progress: 0,
      status: 'Not Started',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'devops',
      title: 'DevOps Engineer',
      description: 'Learn CI/CD, Docker, Kubernetes, cloud platforms, and automation tools',
      icon: '🔧',
      difficulty: 'Intermediate to Advanced',
      modules: 16,
      progress: 0,
      status: 'Not Started',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Learning Roadmaps</h1>
          <p className="text-muted-foreground">
            Follow structured paths to master different technologies
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          Continue Learning
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Current Progress */}
      <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
        <CardHeader>
          <CardTitle>Continue Your Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{currentCourse.title}</span>
              <Badge variant="secondary">{currentCourse.progress}%</Badge>
            </div>
            <Progress value={currentCourse.progress} className="mb-4" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-500 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Completed
              </h4>
              {currentCourse.modules.filter(m => m.completed).map((module) => (
                <div key={module.id} className="flex items-center space-x-3 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{module.title}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-primary flex items-center">
                <Circle className="h-4 w-4 mr-2" />
                In Progress & Upcoming
              </h4>
              {currentCourse.modules.filter(m => !m.completed).map((module) => (
                <div key={module.id} className={`flex items-center space-x-3 text-sm ${
                  module.current ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}>
                  <Circle className={`h-4 w-4 ${
                    module.current ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <span>{module.title}</span>
                  {module.current && (
                    <Badge className="ml-auto" size="sm">Current</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full mt-6">
            Continue Learning
          </Button>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Roadmap Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <Route className="h-5 w-5 text-primary" />
              <span className="text-sm">Structured Learning</span>
            </div>
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-sm">Track Progress</span>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-sm">Industry Relevance</span>
            </div>
            <div className="flex items-center space-x-3">
              <Brain className="h-5 w-5 text-purple-500" />
              <span className="text-sm">Avoid Overwhelm</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Roadmaps */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Explore Roadmaps</h2>
        
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
          {roadmaps.map((roadmap) => (
            <Card key={roadmap.id} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${roadmap.color} rounded-lg flex items-center justify-center text-2xl`}>
                    {roadmap.icon}
                  </div>
                  <Badge 
                    variant={roadmap.status === 'In Progress' ? 'default' : 'secondary'}
                    className={roadmap.status === 'In Progress' ? 'bg-orange-500' : ''}
                  >
                    {roadmap.status}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{roadmap.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{roadmap.description}</p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>{roadmap.modules} modules • {roadmap.progress}% complete</span>
                  <span>{roadmap.difficulty}</span>
                </div>
                
                <Progress value={roadmap.progress} className="mb-4" />
                
                <Button 
                  className="w-full" 
                  variant={roadmap.status === 'In Progress' ? 'default' : 'outline'}
                >
                  {roadmap.status === 'In Progress' ? 'Continue' : 'Start Learning'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Input
                placeholder="Search roadmaps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
