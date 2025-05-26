import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Code, 
  Plus, 
  FolderOpen, 
  Clock, 
  Users,
  GitBranch,
  Play,
  Settings,
  Search,
  Star,
  Trash2
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  framework?: string;
  lastModified: Date;
  status: 'active' | 'completed' | 'paused';
  collaborators: number;
  isStarred: boolean;
  progress: number;
}

export function Studio() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const projects: Project[] = [
    {
      id: '1',
      name: 'E-commerce Dashboard',
      description: 'Modern admin dashboard for managing online store inventory and orders',
      language: 'JavaScript',
      framework: 'React',
      lastModified: new Date('2024-01-20'),
      status: 'active',
      collaborators: 3,
      isStarred: true,
      progress: 75
    },
    {
      id: '2',
      name: 'Weather App',
      description: 'Clean weather application with location-based forecasts',
      language: 'JavaScript',
      framework: 'Vue.js',
      lastModified: new Date('2024-01-18'),
      status: 'completed',
      collaborators: 1,
      isStarred: false,
      progress: 100
    },
    {
      id: '3',
      name: 'Task Manager API',
      description: 'RESTful API for task management with user authentication',
      language: 'Python',
      framework: 'FastAPI',
      lastModified: new Date('2024-01-15'),
      status: 'active',
      collaborators: 2,
      isStarred: true,
      progress: 60
    },
    {
      id: '4',
      name: 'Portfolio Website',
      description: 'Personal portfolio showcasing projects and skills',
      language: 'TypeScript',
      framework: 'Next.js',
      lastModified: new Date('2024-01-10'),
      status: 'paused',
      collaborators: 1,
      isStarred: false,
      progress: 40
    },
    {
      id: '5',
      name: 'Chat Application',
      description: 'Real-time messaging app with rooms and file sharing',
      language: 'JavaScript',
      framework: 'Node.js',
      lastModified: new Date('2024-01-05'),
      status: 'active',
      collaborators: 4,
      isStarred: true,
      progress: 85
    }
  ];

  const projectTemplates = [
    { id: '1', name: 'React Starter', language: 'JavaScript', icon: '⚛️' },
    { id: '2', name: 'Vue.js App', language: 'JavaScript', icon: '💚' },
    { id: '3', name: 'Node.js API', language: 'JavaScript', icon: '🟢' },
    { id: '4', name: 'Python Flask', language: 'Python', icon: '🐍' },
    { id: '5', name: 'Next.js Full-Stack', language: 'TypeScript', icon: '⚫' },
    { id: '6', name: 'Express Server', language: 'JavaScript', icon: '🚀' }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || project.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      JavaScript: 'bg-yellow-500/20 text-yellow-400',
      TypeScript: 'bg-blue-500/20 text-blue-400',
      Python: 'bg-green-500/20 text-green-400',
      Java: 'bg-red-500/20 text-red-400',
      'C++': 'bg-purple-500/20 text-purple-400'
    };
    return colors[language] || 'bg-gray-500/20 text-gray-400';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Project Studio</h1>
          <p className="text-muted-foreground">
            Build and prototype your ideas in our integrated development environment
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-6 gap-4">
            {projectTemplates.map((template) => (
              <Button
                key={template.id}
                variant="outline"
                className="h-20 flex-col"
              >
                <div className="text-2xl mb-1">{template.icon}</div>
                <div className="text-xs font-medium">{template.name}</div>
                <div className="text-xs text-muted-foreground">{template.language}</div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {['all', 'active', 'completed', 'paused'].map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className="capitalize"
              >
                {filter}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center space-x-2">
                      <span>{project.name}</span>
                      {project.isStarred && (
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Modified {formatDate(project.lastModified)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm mb-4">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={getLanguageColor(project.language)}>
                  {project.language}
                </Badge>
                {project.framework && (
                  <Badge variant="outline">
                    {project.framework}
                  </Badge>
                )}
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="progress-bar h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{project.collaborators} collaborator{project.collaborators !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GitBranch className="h-3 w-3" />
                    <span>main</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button className="flex-1">
                  <Play className="mr-2 h-4 w-4" />
                  Open Project
                </Button>
                <Button variant="outline">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Files
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Studio Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {projects.length}
            </div>
            <div className="text-muted-foreground">Total Projects</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {projects.filter(p => p.status === 'active').length}
            </div>
            <div className="text-muted-foreground">Active Projects</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {projects.filter(p => p.status === 'completed').length}
            </div>
            <div className="text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">
              {projects.reduce((acc, p) => acc + p.collaborators, 0)}
            </div>
            <div className="text-muted-foreground">Collaborators</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
