import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  MapPin, 
  Users, 
  Star, 
  TrendingUp, 
  Award,
  BookOpen,
  Code,
  Zap,
  Target,
  Brain,
  Rocket
} from 'lucide-react';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  progress: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skills: string[];
  estimatedTime: string;
  icon: any;
  color: string;
}

interface GlobalStats {
  totalLearners: number;
  completedProjects: number;
  skillsLearned: number;
  countriesActive: number;
}

export function SphereMap() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const learningPaths: LearningPath[] = [
    {
      id: 'frontend',
      title: 'Frontend Development',
      description: 'Master modern web development with React, Vue, and Angular',
      progress: 65,
      difficulty: 'intermediate',
      skills: ['React', 'JavaScript', 'CSS', 'HTML', 'TypeScript'],
      estimatedTime: '3-6 months',
      icon: Code,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'backend',
      title: 'Backend Engineering',
      description: 'Build scalable server-side applications and APIs',
      progress: 40,
      difficulty: 'advanced',
      skills: ['Node.js', 'Python', 'Databases', 'API Design', 'Cloud'],
      estimatedTime: '4-8 months',
      icon: Brain,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'data-science',
      title: 'Data Science & AI',
      description: 'Explore machine learning, AI, and data analytics',
      progress: 25,
      difficulty: 'advanced',
      skills: ['Python', 'Machine Learning', 'Statistics', 'TensorFlow', 'SQL'],
      estimatedTime: '6-12 months',
      icon: Zap,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'mobile',
      title: 'Mobile Development',
      description: 'Create native and cross-platform mobile applications',
      progress: 80,
      difficulty: 'intermediate',
      skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Firebase'],
      estimatedTime: '4-7 months',
      icon: Rocket,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity',
      description: 'Learn ethical hacking, security analysis, and protection',
      progress: 15,
      difficulty: 'advanced',
      skills: ['Network Security', 'Penetration Testing', 'Cryptography', 'Risk Assessment'],
      estimatedTime: '6-10 months',
      icon: Target,
      color: 'from-gray-600 to-gray-800'
    },
    {
      id: 'devops',
      title: 'DevOps & Cloud',
      description: 'Master infrastructure, deployment, and cloud technologies',
      progress: 55,
      difficulty: 'intermediate',
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'],
      estimatedTime: '3-6 months',
      icon: Globe,
      color: 'from-indigo-500 to-blue-600'
    }
  ];

  const globalStats: GlobalStats = {
    totalLearners: 847293,
    completedProjects: 156847,
    skillsLearned: 2847,
    countriesActive: 195
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          CodeSphere Learning Map
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Navigate your learning journey through interconnected skill paths and track your global progress
        </p>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{globalStats.totalLearners.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Active Learners</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{globalStats.completedProjects.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Projects Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{globalStats.skillsLearned.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Skills Mastered</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Globe className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{globalStats.countriesActive}</div>
            <div className="text-sm text-muted-foreground">Countries Active</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="paths" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          <TabsTrigger value="progress">My Progress</TabsTrigger>
          <TabsTrigger value="global">Global Map</TabsTrigger>
        </TabsList>
        
        <TabsContent value="paths">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths.map((path) => {
              const IconComponent = path.icon;
              return (
                <Card 
                  key={path.id} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={() => setSelectedPath(path.id)}
                >
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${path.color} flex items-center justify-center mb-3`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold">{path.title}</CardTitle>
                    <Badge className={getDifficultyColor(path.difficulty)} variant="secondary">
                      {path.difficulty}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">{path.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span className="font-semibold">{path.progress}%</span>
                        </div>
                        <Progress value={path.progress} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-2">Key Skills:</div>
                        <div className="flex flex-wrap gap-1">
                          {path.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {path.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{path.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{path.estimatedTime}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4" variant={path.progress > 0 ? "default" : "outline"}>
                      {path.progress > 0 ? "Continue Learning" : "Start Path"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Your Learning Journey</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {learningPaths.filter(path => path.progress > 0).map((path) => {
                  const IconComponent = path.icon;
                  return (
                    <div key={path.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${path.color} flex items-center justify-center`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{path.title}</h3>
                          <span className="text-sm font-medium">{path.progress}%</span>
                        </div>
                        <Progress value={path.progress} className="h-2" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="global">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Global Learning Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Globe className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-semibold mb-2">Interactive World Map</h3>
                  <p className="text-muted-foreground max-w-md">
                    Explore real-time learning activity from students around the world. 
                    See popular courses, trending skills, and connect with the global CodeSphere community.
                  </p>
                  <Button className="mt-4">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Explore Global Trends
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
