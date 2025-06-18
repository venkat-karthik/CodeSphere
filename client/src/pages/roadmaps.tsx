import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Search,
  Route,
  TrendingUp,
  Users,
  Brain,
  Play,
  Clock,
  Target,
  Zap,
  Star,
  BookOpen,
  Code,
  Database,
  Smartphone,
  Shield,
  Cloud,
  Bot,
  Sparkles
} from 'lucide-react';
import { storage } from '../lib/storage';

interface LearningStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  weeks: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  resources: string[];
  projects: string[];
  estimatedHours: number;
}

interface Roadmap {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  modules: number;
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  color: string;
  skills: LearningStep[];
  totalWeeks: number;
  totalHours: number;
  prerequisites: string[];
  careerOutcomes: string[];
  salary: string;
  demand: 'High' | 'Medium' | 'Low';
}

export function Roadmaps() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
  const [showRoadmapDialog, setShowRoadmapDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [roadmapsData, setRoadmapsData] = useState<Roadmap[]>([]);
  const courses = storage.getCourses();
  const currentCourse = courses[0];

  const initialRoadmaps: Roadmap[] = [
    {
      id: 'frontend',
      title: 'Frontend Developer',
      description: 'Master modern frontend technologies including React, Vue, and advanced CSS',
      icon: '🎨',
      difficulty: 'beginner',
      modules: 12,
      progress: 65,
      status: 'In Progress',
      color: 'from-orange-500 to-red-500',
      totalWeeks: 24,
      totalHours: 480,
      prerequisites: ['Basic computer skills', 'High school math'],
      careerOutcomes: ['Frontend Developer', 'UI/UX Developer', 'React Developer'],
      salary: '$60,000 - $120,000',
      demand: 'High',
      skills: [
        {
          id: 'html-basics',
          title: 'HTML5 Fundamentals',
          description: 'Learn semantic HTML, forms, and accessibility',
          completed: true,
          current: false,
          weeks: 2,
          difficulty: 'beginner',
          resources: ['MDN Web Docs', 'W3Schools', 'freeCodeCamp'],
          projects: ['Personal Portfolio', 'Restaurant Website'],
          estimatedHours: 40
        },
        {
          id: 'css-styling',
          title: 'CSS3 & Responsive Design',
          description: 'Master CSS Grid, Flexbox, and responsive layouts',
          completed: true,
          current: false,
          weeks: 3,
          difficulty: 'beginner',
          resources: ['CSS-Tricks', 'Flexbox Froggy', 'Grid Garden'],
          projects: ['Responsive Blog', 'E-commerce Layout'],
          estimatedHours: 60
        },
        {
          id: 'javascript-es6',
          title: 'JavaScript ES6+',
          description: 'Modern JavaScript with async/await, modules, and APIs',
          completed: true,
          current: false,
          weeks: 4,
          difficulty: 'intermediate',
          resources: ['Eloquent JavaScript', 'You Don\'t Know JS', 'JavaScript.info'],
          projects: ['Weather App', 'Todo List with Local Storage'],
          estimatedHours: 80
        },
        {
          id: 'react-basics',
          title: 'React.js Fundamentals',
          description: 'Component-based UI development with React',
          completed: false,
          current: true,
          weeks: 4,
          difficulty: 'intermediate',
          resources: ['React Documentation', 'React Tutorial', 'Kent C. Dodds Blog'],
          projects: ['Social Media Clone', 'E-commerce Dashboard'],
          estimatedHours: 80
        },
        {
          id: 'state-management',
          title: 'State Management',
          description: 'Redux, Context API, and state management patterns',
          completed: false,
          current: false,
          weeks: 3,
          difficulty: 'intermediate',
          resources: ['Redux Toolkit', 'React Context', 'Zustand'],
          projects: ['Shopping Cart App', 'Task Management System'],
          estimatedHours: 60
        },
        {
          id: 'typescript',
          title: 'TypeScript',
          description: 'Static typing and enhanced developer experience',
          completed: false,
          current: false,
          weeks: 2,
          difficulty: 'intermediate',
          resources: ['TypeScript Handbook', 'TypeScript Deep Dive'],
          projects: ['Typed Todo App', 'API Client Library'],
          estimatedHours: 40
        }
      ]
    },
    {
      id: 'backend',
      title: 'Backend Developer',
      description: 'Learn server-side development with Node.js, Python, databases, and APIs',
      icon: '⚙️',
      difficulty: 'intermediate',
      modules: 15,
      progress: 0,
      status: 'Not Started',
      color: 'from-green-500 to-emerald-500',
      totalWeeks: 30,
      totalHours: 600,
      prerequisites: ['Basic programming knowledge', 'Understanding of web basics'],
      careerOutcomes: ['Backend Developer', 'API Developer', 'DevOps Engineer'],
      salary: '$70,000 - $140,000',
      demand: 'High',
      skills: [
        {
          id: 'node-basics',
          title: 'Node.js & Express',
          description: 'Server-side JavaScript with Express framework',
          completed: false,
          current: false,
          weeks: 4,
          difficulty: 'intermediate',
          resources: ['Node.js Documentation', 'Express.js Guide', 'Node.js Design Patterns'],
          projects: ['REST API', 'Real-time Chat Server'],
          estimatedHours: 80
        },
        {
          id: 'database-design',
          title: 'Database Design (SQL)',
          description: 'Relational databases, SQL, and data modeling',
          completed: false,
          current: false,
          weeks: 3,
          difficulty: 'intermediate',
          resources: ['PostgreSQL Tutorial', 'SQL Zoo', 'Database Design Course'],
          projects: ['E-commerce Database', 'Social Media Schema'],
          estimatedHours: 60
        },
        {
          id: 'mongodb',
          title: 'MongoDB & NoSQL',
          description: 'Document-based databases and MongoDB operations',
          completed: false,
          current: false,
          weeks: 2,
          difficulty: 'intermediate',
          resources: ['MongoDB University', 'MongoDB Documentation'],
          projects: ['Blog API with MongoDB', 'User Management System'],
          estimatedHours: 40
        }
      ]
    },
    {
      id: 'fullstack',
      title: 'Full Stack Developer',
      description: 'Complete path covering both frontend and backend development skills',
      icon: '🚀',
      difficulty: 'intermediate',
      modules: 20,
      progress: 0,
      status: 'Not Started',
      color: 'from-blue-500 to-purple-500',
      totalWeeks: 40,
      totalHours: 800,
      prerequisites: ['Basic programming', 'Web fundamentals'],
      careerOutcomes: ['Full Stack Developer', 'Software Engineer', 'Technical Lead'],
      salary: '$80,000 - $150,000',
      demand: 'High',
      skills: [
        {
          id: 'web-basics',
          title: 'Web Development Basics',
          description: 'HTML, CSS, JavaScript fundamentals',
          completed: false,
          current: false,
          weeks: 4,
          difficulty: 'beginner',
          resources: ['MDN Web Docs', 'freeCodeCamp', 'The Odin Project'],
          projects: ['Personal Website', 'Simple Web App'],
          estimatedHours: 80
        }
      ]
    },
    {
      id: 'mobile',
      title: 'Mobile Developer',
      description: 'Build mobile apps with React Native, Flutter, and native iOS/Android',
      icon: '📱',
      difficulty: 'intermediate',
      modules: 14,
      progress: 0,
      status: 'Not Started',
      color: 'from-indigo-500 to-blue-500',
      totalWeeks: 28,
      totalHours: 560,
      prerequisites: ['JavaScript knowledge', 'Basic programming concepts'],
      careerOutcomes: ['Mobile Developer', 'React Native Developer', 'iOS/Android Developer'],
      salary: '$65,000 - $130,000',
      demand: 'High',
      skills: [
        {
          id: 'react-native',
          title: 'React Native',
          description: 'Cross-platform mobile development with React Native',
          completed: false,
          current: false,
          weeks: 6,
          difficulty: 'intermediate',
          resources: ['React Native Documentation', 'Expo Tutorials'],
          projects: ['Social Media App', 'E-commerce Mobile App'],
          estimatedHours: 120
        }
      ]
    },
    {
      id: 'datascience',
      title: 'Data Science',
      description: 'Master Python, machine learning, data analysis, and visualization tools',
      icon: '📊',
      difficulty: 'advanced',
      modules: 18,
      progress: 0,
      status: 'Not Started',
      color: 'from-pink-500 to-rose-500',
      totalWeeks: 36,
      totalHours: 720,
      prerequisites: ['Strong math background', 'Python basics'],
      careerOutcomes: ['Data Scientist', 'Machine Learning Engineer', 'Data Analyst'],
      salary: '$85,000 - $160,000',
      demand: 'High',
      skills: [
        {
          id: 'python-ml',
          title: 'Python for Machine Learning',
          description: 'NumPy, Pandas, Scikit-learn, and TensorFlow',
          completed: false,
          current: false,
          weeks: 8,
          difficulty: 'advanced',
          resources: ['Python Documentation', 'Kaggle Courses', 'Fast.ai'],
          projects: ['Image Classification', 'Predictive Analytics'],
          estimatedHours: 160
        }
      ]
    },
    {
      id: 'devops',
      title: 'DevOps Engineer',
      description: 'Learn CI/CD, Docker, Kubernetes, cloud platforms, and automation tools',
      icon: '🔧',
      difficulty: 'advanced',
      modules: 16,
      progress: 0,
      status: 'Not Started',
      color: 'from-yellow-500 to-orange-500',
      totalWeeks: 32,
      totalHours: 640,
      prerequisites: ['Linux basics', 'Networking fundamentals'],
      careerOutcomes: ['DevOps Engineer', 'Site Reliability Engineer', 'Cloud Architect'],
      salary: '$90,000 - $170,000',
      demand: 'High',
      skills: [
        {
          id: 'docker-k8s',
          title: 'Docker & Kubernetes',
          description: 'Containerization and orchestration technologies',
          completed: false,
          current: false,
          weeks: 6,
          difficulty: 'advanced',
          resources: ['Docker Documentation', 'Kubernetes.io', 'Katacoda'],
          projects: ['Containerized Web App', 'Microservices Deployment'],
          estimatedHours: 120
        }
      ]
    },
    {
      id: 'ai-ml',
      title: 'AI & Machine Learning',
      description: 'Deep learning, neural networks, and artificial intelligence',
      icon: '🤖',
      difficulty: 'advanced',
      modules: 22,
      progress: 0,
      status: 'Not Started',
      color: 'from-purple-500 to-indigo-500',
      totalWeeks: 44,
      totalHours: 880,
      prerequisites: ['Advanced math', 'Python proficiency', 'Data science basics'],
      careerOutcomes: ['AI Engineer', 'ML Engineer', 'Research Scientist'],
      salary: '$100,000 - $200,000',
      demand: 'High',
      skills: [
        {
          id: 'deep-learning',
          title: 'Deep Learning Fundamentals',
          description: 'Neural networks, TensorFlow, PyTorch, and advanced ML',
          completed: false,
          current: false,
          weeks: 10,
          difficulty: 'advanced',
          resources: ['Deep Learning Book', 'Andrew Ng Courses', 'Fast.ai'],
          projects: ['Image Recognition System', 'Natural Language Processing'],
          estimatedHours: 200
        }
      ]
    }
  ];

  useEffect(() => {
    setRoadmapsData(initialRoadmaps);
  }, []);

  const handleStartLearning = (roadmap: Roadmap) => {
    setSelectedRoadmap(roadmap);
    setShowRoadmapDialog(true);
    setCurrentStep(0);
  };

  const handleContinueLearning = (roadmap: Roadmap) => {
    setSelectedRoadmap(roadmap);
    setShowRoadmapDialog(true);
    // Find the current step
    const currentStepIndex = roadmap.skills.findIndex(skill => skill.current);
    setCurrentStep(currentStepIndex >= 0 ? currentStepIndex : 0);
  };

  const handleNextStep = () => {
    if (selectedRoadmap && currentStep < selectedRoadmap.skills.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCloseDialog = () => {
    setShowRoadmapDialog(false);
    setSelectedRoadmap(null);
    setCurrentStep(0);
  };

  const handleStartThisStep = () => {
    if (!selectedRoadmap) return;
    
    const currentSkill = selectedRoadmap.skills[currentStep];
    
    // Update the roadmap progress
    const updatedRoadmaps = roadmapsData.map(roadmap => {
      if (roadmap.id === selectedRoadmap.id) {
        // Mark current step as in progress
        const updatedSkills = roadmap.skills.map((skill, index) => ({
          ...skill,
          current: index === currentStep,
          completed: index < currentStep
        }));
        
        // Calculate new progress
        const completedCount = updatedSkills.filter(skill => skill.completed).length;
        const newProgress = Math.round((completedCount / updatedSkills.length) * 100);
        
        return {
          ...roadmap,
          skills: updatedSkills,
          progress: newProgress,
          status: newProgress === 100 ? 'Completed' : 'In Progress'
        };
      }
      return roadmap;
    });

    // Update the state
    setRoadmapsData(updatedRoadmaps);
    
    // Update the selected roadmap
    const updatedRoadmap = updatedRoadmaps.find(r => r.id === selectedRoadmap.id);
    if (updatedRoadmap) {
      setSelectedRoadmap(updatedRoadmap);
    }

    // Show success message
    alert(`Starting: ${currentSkill.title}\n\nDuration: ${currentSkill.weeks} weeks\nEstimated Hours: ${currentSkill.estimatedHours}h\n\nResources:\n${currentSkill.resources.join('\n')}\n\nProjects:\n${currentSkill.projects.join('\n')}`);
    
    // Close dialog
    handleCloseDialog();
    
    // In a real application, you would:
    // 1. Save progress to backend
    // 2. Navigate to the actual learning content
    // 3. Update user's learning progress
    // 4. Send notifications
    console.log('Starting learning step:', currentSkill);
  };

  const handleCompleteStep = (stepIndex: number) => {
    if (!selectedRoadmap) return;
    
    const updatedRoadmaps = roadmapsData.map(roadmap => {
      if (roadmap.id === selectedRoadmap.id) {
        const updatedSkills = roadmap.skills.map((skill, index) => ({
          ...skill,
          completed: index <= stepIndex,
          current: index === stepIndex + 1
        }));
        
        const completedCount = updatedSkills.filter(skill => skill.completed).length;
        const newProgress = Math.round((completedCount / updatedSkills.length) * 100);
        
        return {
          ...roadmap,
          skills: updatedSkills,
          progress: newProgress,
          status: newProgress === 100 ? 'Completed' : 'In Progress'
        };
      }
      return roadmap;
    });

    // Update the state
    setRoadmapsData(updatedRoadmaps);
    
    // Update the selected roadmap
    const updatedRoadmap = updatedRoadmaps.find(r => r.id === selectedRoadmap.id);
    if (updatedRoadmap) {
      setSelectedRoadmap(updatedRoadmap);
    }
    
    // Show completion message
    const completedSkill = selectedRoadmap.skills[stepIndex];
    alert(`🎉 Completed: ${completedSkill.title}\n\nGreat job! You've finished this learning step. Ready for the next challenge?`);
  };

  const filteredRoadmaps = roadmapsData.filter(roadmap =>
    roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    roadmap.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'High': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Low': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI-Generated Learning Roadmaps</h1>
          <p className="text-muted-foreground">
            Personalized learning paths powered by AI, inspired by industry standards
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            AI-Powered
          </Badge>
          <Button className="bg-primary hover:bg-primary/90">
            Continue Learning
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Current Progress */}
      <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Continue Your Journey
          </CardTitle>
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
                    <Badge className="ml-auto">Current</Badge>
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search roadmaps..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Available Roadmaps */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Explore AI-Generated Roadmaps</h2>
        
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
          {filteredRoadmaps.map((roadmap) => (
            <Card key={roadmap.id} className="card-hover cursor-pointer" onClick={() => handleStartLearning(roadmap)}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${roadmap.color} rounded-lg flex items-center justify-center text-2xl`}>
                    {roadmap.icon}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge 
                      variant={roadmap.status === 'In Progress' ? 'default' : 'secondary'}
                      className={roadmap.status === 'In Progress' ? 'bg-orange-500' : ''}
                    >
                      {roadmap.status}
                    </Badge>
                    <Badge className={getDemandColor(roadmap.demand)} variant="outline">
                      {roadmap.demand} Demand
                    </Badge>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{roadmap.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{roadmap.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Difficulty</span>
                    <Badge className={getDifficultyColor(roadmap.difficulty)} variant="outline">
                      {roadmap.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{roadmap.totalWeeks} weeks</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Salary Range</span>
                    <span className="font-medium">{roadmap.salary}</span>
                  </div>
                </div>
                
                <Progress value={roadmap.progress} className="mb-4" />
                
                <Button 
                  className="w-full" 
                  variant={roadmap.status === 'In Progress' ? 'default' : 'outline'}
                  onClick={(e) => {
                    e.stopPropagation();
                    roadmap.status === 'In Progress' 
                      ? handleContinueLearning(roadmap)
                      : handleStartLearning(roadmap);
                  }}
                >
                  {roadmap.status === 'In Progress' ? 'Continue' : 'Start Learning'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Roadmap Detail Dialog */}
      <Dialog open={showRoadmapDialog} onOpenChange={setShowRoadmapDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${selectedRoadmap?.color} rounded-lg flex items-center justify-center text-xl`}>
                {selectedRoadmap?.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedRoadmap?.title}</h2>
                <p className="text-muted-foreground">{selectedRoadmap?.description}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedRoadmap && (
            <div className="space-y-6">
              {/* Roadmap Overview */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="text-lg font-semibold">{selectedRoadmap.totalWeeks} weeks</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="text-sm text-muted-foreground">Total Hours</p>
                    <p className="text-lg font-semibold">{selectedRoadmap.totalHours}h</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <p className="text-sm text-muted-foreground">Salary Range</p>
                    <p className="text-lg font-semibold">{selectedRoadmap.salary}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Learning Path */}
              <Tabs defaultValue="path" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="path">Learning Path</TabsTrigger>
                  <TabsTrigger value="career">Career Info</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>
                
                <TabsContent value="path" className="space-y-4">
                  <div className="space-y-4">
                    {selectedRoadmap.skills.map((skill, index) => (
                      <Card 
                        key={skill.id} 
                        className={`${
                          index === currentStep ? 'ring-2 ring-primary' : ''
                        } ${skill.completed ? 'bg-green-50 dark:bg-green-900/20' : ''} cursor-pointer hover:shadow-md transition-all`}
                        onClick={() => setCurrentStep(index)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                {skill.completed ? (
                                  <CheckCircle className="h-6 w-6 text-green-500" />
                                ) : (
                                  <Circle className="h-6 w-6 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold">{skill.title}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{skill.description}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {skill.weeks} weeks
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Target className="h-3 w-3" />
                                    {skill.estimatedHours}h
                                  </span>
                                  <Badge className={getDifficultyColor(skill.difficulty)} variant="outline">
                                    {skill.difficulty}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {index === currentStep && (
                                <Badge className="bg-primary text-primary-foreground">Current</Badge>
                              )}
                              {!skill.completed && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCompleteStep(index);
                                  }}
                                >
                                  Complete
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="career" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Career Outcomes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {selectedRoadmap.careerOutcomes.map((outcome, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Prerequisites</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {selectedRoadmap.prerequisites.map((prereq, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Circle className="h-4 w-4 text-blue-500" />
                              {prereq}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="resources" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recommended Resources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedRoadmap.skills[currentStep]?.resources.map((resource, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 border rounded">
                            <BookOpen className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">{resource}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <DialogFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handlePreviousStep} disabled={currentStep === 0}>
                    Previous
                  </Button>
                  <Button variant="outline" onClick={handleNextStep} disabled={currentStep === selectedRoadmap.skills.length - 1}>
                    Next
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Close
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90" onClick={handleStartThisStep}>
                    <Play className="mr-2 h-4 w-4" />
                    Start This Step
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
