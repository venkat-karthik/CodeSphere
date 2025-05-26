import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Play, 
  Clock, 
  Search, 
  Filter,
  Bookmark,
  Eye
} from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  views: number;
  thumbnail: string;
  tags: string[];
  isBookmarked?: boolean;
}

export function Videos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const videos: Video[] = [
    {
      id: '1',
      title: 'JavaScript Fundamentals for Beginners',
      description: 'Learn the core concepts of JavaScript including variables, functions, and control structures.',
      instructor: 'Sarah Johnson',
      duration: '2h 45m',
      difficulty: 'beginner',
      category: 'JavaScript',
      views: 15420,
      thumbnail: '/api/placeholder/400/225',
      tags: ['ES6', 'Variables', 'Functions'],
      isBookmarked: true
    },
    {
      id: '2',
      title: 'React Hooks Deep Dive',
      description: 'Master React Hooks with practical examples and real-world applications.',
      instructor: 'Mike Chen',
      duration: '3h 20m',
      difficulty: 'intermediate',
      category: 'React',
      views: 8950,
      thumbnail: '/api/placeholder/400/225',
      tags: ['useState', 'useEffect', 'Custom Hooks']
    },
    {
      id: '3',
      title: 'CSS Grid Layout Mastery',
      description: 'Build responsive layouts with CSS Grid and create stunning web designs.',
      instructor: 'Emma Wilson',
      duration: '1h 50m',
      difficulty: 'intermediate',
      category: 'CSS',
      views: 6780,
      thumbnail: '/api/placeholder/400/225',
      tags: ['Grid', 'Responsive', 'Layout']
    },
    {
      id: '4',
      title: 'Node.js API Development',
      description: 'Build scalable REST APIs using Node.js, Express, and MongoDB.',
      instructor: 'David Rodriguez',
      duration: '4h 15m',
      difficulty: 'advanced',
      category: 'Node.js',
      views: 12300,
      thumbnail: '/api/placeholder/400/225',
      tags: ['Express', 'MongoDB', 'API']
    },
    {
      id: '5',
      title: 'TypeScript for React Developers',
      description: 'Add type safety to your React applications with TypeScript.',
      instructor: 'Lisa Park',
      duration: '2h 30m',
      difficulty: 'intermediate',
      category: 'TypeScript',
      views: 9850,
      thumbnail: '/api/placeholder/400/225',
      tags: ['Types', 'Interfaces', 'Generics']
    },
    {
      id: '6',
      title: 'Python Data Structures',
      description: 'Learn about lists, dictionaries, sets, and tuples in Python.',
      instructor: 'Alex Thompson',
      duration: '3h 00m',
      difficulty: 'beginner',
      category: 'Python',
      views: 7640,
      thumbnail: '/api/placeholder/400/225',
      tags: ['Lists', 'Dictionaries', 'Data Structures']
    }
  ];

  const categories = [
    'all', 'JavaScript', 'React', 'CSS', 'Node.js', 'TypeScript', 'Python'
  ];

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Video Library</h1>
          <p className="text-muted-foreground">
            Access curated video tutorials and courses
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Bookmark className="mr-2 h-4 w-4" />
          My Bookmarks
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Input
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category === 'all' ? 'All Categories' : category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Video Grid */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
        {filteredVideos.map((video) => (
          <Card key={video.id} className="card-hover overflow-hidden">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                <Play className="h-12 w-12 text-primary" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                {video.duration}
              </div>
              {video.isBookmarked && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground p-1 rounded">
                  <Bookmark className="h-4 w-4" />
                </div>
              )}
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {video.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <span>by {video.instructor}</span>
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{video.views.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={getDifficultyColor(video.difficulty)}>
                  {video.difficulty}
                </Badge>
                <Badge variant="outline">{video.category}</Badge>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {video.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <Button className="w-full">
                <Play className="mr-2 h-4 w-4" />
                Watch Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {videos.length}
            </div>
            <div className="text-muted-foreground">Total Videos</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {videos.reduce((acc, video) => acc + parseInt(video.duration.split('h')[0]), 0)}h
            </div>
            <div className="text-muted-foreground">Total Duration</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {Math.floor(videos.reduce((acc, video) => acc + video.views, 0) / 1000)}k
            </div>
            <div className="text-muted-foreground">Total Views</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
