import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/contexts/UserRoleContext';
import { 
  Play, 
  Upload, 
  Search, 
  Filter,
  Clock,
  Eye,
  Heart,
  Share2,
  Download,
  Plus,
  BookOpen,
  Star,
  Users,
  TrendingUp,
  Calendar,
  Tag,
  Video,
  FileVideo,
  X
} from 'lucide-react';

interface VideoData {
  id: string;
  title: string;
  description: string;
  duration: string;
  views: number;
  likes: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructor: string;
  thumbnail: string;
  tags: string[];
  uploadDate: Date;
  url?: string;
}

export function Videos() {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [videos, setVideos] = useState<VideoData[]>([
    {
      id: '1',
      title: 'React Hooks Complete Guide',
      description: 'Master React Hooks with practical examples and real-world applications.',
      duration: '45:30',
      views: 12500,
      likes: 890,
      category: 'React',
      difficulty: 'intermediate',
      instructor: 'Sarah Johnson',
      thumbnail: 'https://img.youtube.com/vi/O6P86uwfdR0/maxresdefault.jpg',
      tags: ['React', 'Hooks', 'useState', 'useEffect'],
      uploadDate: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'JavaScript ES6+ Features',
      description: 'Learn modern JavaScript features that every developer should know.',
      duration: '32:15',
      views: 8900,
      likes: 654,
      category: 'JavaScript',
      difficulty: 'beginner',
      instructor: 'Mike Chen',
      thumbnail: 'https://img.youtube.com/vi/WZQc7RUAg18/maxresdefault.jpg',
      tags: ['JavaScript', 'ES6', 'Arrow Functions', 'Destructuring'],
      uploadDate: new Date('2024-01-10')
    },
    {
      id: '3',
      title: 'CSS Grid Layout Mastery',
      description: 'Build complex layouts with CSS Grid. From basics to advanced techniques.',
      duration: '28:45',
      views: 7200,
      likes: 445,
      category: 'CSS',
      difficulty: 'intermediate',
      instructor: 'Emily Rodriguez',
      thumbnail: 'https://img.youtube.com/vi/jV8B24rSN5o/maxresdefault.jpg',
      tags: ['CSS', 'Grid', 'Layout', 'Responsive'],
      uploadDate: new Date('2024-01-05')
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    tags: ''
  });

  const categories = ['React', 'JavaScript', 'CSS', 'Node.js', 'Python', 'Database'];
  const difficulties = ['beginner', 'intermediate', 'advanced'];

  const handleVideoUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      // Simulate upload process
      setTimeout(() => {
        const newVideoData: VideoData = {
          id: Date.now().toString(),
          title: newVideo.title || file.name.replace(/\.[^/.]+$/, ""),
          description: newVideo.description,
          duration: "00:00", // Would be calculated from actual video
          views: 0,
          likes: 0,
          category: newVideo.category,
          difficulty: newVideo.difficulty,
          instructor: user?.firstName + ' ' + user?.lastName || 'Unknown',
          thumbnail: '/api/placeholder/400/225',
          tags: newVideo.tags.split(',').map(tag => tag.trim()),
          uploadDate: new Date(),
          url: URL.createObjectURL(file)
        };
        
        setVideos(prev => [newVideoData, ...prev]);
        setIsUploading(false);
        setShowUploadModal(false);
        setNewVideo({
          title: '',
          description: '',
          category: '',
          difficulty: 'beginner',
          tags: ''
        });
      }, 2000);
    }
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || video.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      case 'oldest':
        return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
      case 'mostViewed':
        return b.views - a.views;
      case 'mostLiked':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  const formatDuration = (duration: string) => {
    return duration;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Video Library</h1>
          <p className="text-muted-foreground">
            {isAdmin ? 'Manage and upload educational videos' : 'Learn from expert-created video tutorials'}
          </p>
        </div>
        
        {isAdmin && (
          <div className="flex space-x-2">
            <Button onClick={() => setShowUploadModal(true)} className="bg-blue-600 hover:bg-blue-700">
              <Upload className="h-4 w-4 mr-2" />
              Upload Video
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="video/*"
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* Admin Upload Modal */}
      {isAdmin && showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Upload New Video</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploadModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newVideo.title}
                  onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter video title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newVideo.description}
                  onChange={(e) => setNewVideo(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter video description"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={newVideo.category} onValueChange={(value) => setNewVideo(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Difficulty</label>
                <Select value={newVideo.difficulty} onValueChange={(value: any) => setNewVideo(prev => ({ ...prev, difficulty: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Tags (comma-separated)</label>
                <Input
                  value={newVideo.tags}
                  onChange={(e) => setNewVideo(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="React, Hooks, JavaScript"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={handleVideoUpload} className="flex-1" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FileVideo className="h-4 w-4 mr-2" />
                      Select Video File
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search videos, topics, or instructors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="mostViewed">Most Viewed</SelectItem>
                  <SelectItem value="mostLiked">Most Liked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedVideos.map(video => (
          <Card key={video.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
                <Play className="h-12 w-12 text-white opacity-80" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {formatDuration(video.duration)}
              </div>
              <Badge 
                className={`absolute top-2 left-2 ${
                  video.difficulty === 'beginner' ? 'bg-green-500' :
                  video.difficulty === 'intermediate' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
              >
                {video.difficulty}
              </Badge>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{video.description}</p>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <span>{video.instructor}</span>
                <Badge variant="outline">{video.category}</Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{formatViews(video.views)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{video.likes}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{video.uploadDate.toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-3">
                {video.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {video.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{video.tags.length - 3}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedVideos.length === 0 && (
        <Card className="p-12 text-center">
          <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No videos found</h3>
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all'
              ? 'Try adjusting your search criteria'
              : isAdmin 
                ? 'Upload your first video to get started'
                : 'Videos will appear here once uploaded by instructors'
            }
          </p>
        </Card>
      )}
    </div>
  );
}