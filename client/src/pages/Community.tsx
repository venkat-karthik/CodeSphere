import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { communityData } from '@/data/mockData';
import { useAuth } from '@/hooks/useAuth';
import { 
  Plus,
  ThumbsUp,
  MessageCircle,
  Share,
  Users,
  Eye,
  TrendingUp,
  Calendar
} from 'lucide-react';

export default function Community() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const { auth } = useAuth();

  const categories = [
    { id: 'all', name: 'All Discussions', count: communityData.length },
    { id: 'frontend', name: 'Frontend', count: communityData.filter(p => p.category === 'React').length },
    { id: 'backend', name: 'Backend', count: 0 },
    { id: 'career', name: 'Career Advice', count: communityData.filter(p => p.category === 'Career').length },
    { id: 'showcase', name: 'Project Showcase', count: communityData.filter(p => p.category === 'Showcase').length },
    { id: 'help', name: 'Help & Support', count: 0 },
  ];

  const filteredPosts = communityData.filter(post => {
    if (selectedCategory === 'all') return true;
    const categoryMap: Record<string, string[]> = {
      frontend: ['React', 'JavaScript', 'CSS'],
      career: ['Career'],
      showcase: ['Showcase'],
    };
    return categoryMap[selectedCategory]?.includes(post.category);
  });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  const getAvatarBg = (name: string) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-purple-500',
      'bg-gradient-to-br from-green-500 to-emerald-500',
      'bg-gradient-to-br from-orange-500 to-red-500',
      'bg-gradient-to-br from-purple-500 to-pink-500',
      'bg-gradient-to-br from-yellow-500 to-orange-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleSubmitPost = () => {
    if (newPostTitle.trim() && newPostContent.trim() && auth.user) {
      // In a real app, this would save to the backend
      console.log('New post:', { title: newPostTitle, content: newPostContent });
      setShowNewPost(false);
      setNewPostTitle('');
      setNewPostContent('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Community Lounge</h1>
          <p className="text-gray-400">Connect with fellow developers and share knowledge</p>
        </div>
        <Button 
          onClick={() => setShowNewPost(true)}
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Community Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700 text-center">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-400 mb-1">2,847</div>
            <div className="text-gray-400 text-sm">Active Members</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700 text-center">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-400 mb-1">156</div>
            <div className="text-gray-400 text-sm">Online Now</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700 text-center">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-400 mb-1">1,234</div>
            <div className="text-gray-400 text-sm">Discussions</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700 text-center">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-orange-400 mb-1">98</div>
            <div className="text-gray-400 text-sm">Code Reviews</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Communities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-purple-600/20 border border-purple-500 text-white'
                      : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category.name}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      selectedCategory === category.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      {category.count}
                    </span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Discussion Feed */}
        <div className="lg:col-span-3 space-y-6">
          {/* New Post Form */}
          {showNewPost && auth.isAuthenticated && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Start a Discussion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="What's your discussion about?"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                <Textarea
                  placeholder="Share your thoughts, ask questions, or start a discussion..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-32"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-gray-400">
                    <button className="hover:text-purple-400 transition-colors">
                      <span className="text-lg">📷</span>
                    </button>
                    <button className="hover:text-purple-400 transition-colors">
                      <span className="text-lg">💻</span>
                    </button>
                    <button className="hover:text-purple-400 transition-colors">
                      <span className="text-lg">🔗</span>
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowNewPost(false)}
                      className="border-gray-600 text-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSubmitPost}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Discussion Posts */}
          {filteredPosts.map((post) => (
            <Card key={post.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAvatarBg(post.author.name)}`}>
                    <span className="text-white font-semibold text-sm">
                      {post.author.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">{post.author.name}</span>
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                          Level {post.author.level}
                        </span>
                        <span className="text-gray-400 text-sm">• {formatTimeAgo(post.createdAt)}</span>
                      </div>
                      <div className="flex gap-2">
                        {post.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                    <p className="text-gray-300 mb-4">{post.content}</p>
                    
                    {post.category === 'Showcase' && (
                      <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-400">🔗</span>
                          <span className="text-purple-400">github.com/user/project-name</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <button className="hover:text-purple-400 transition-colors flex items-center space-x-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{post.likes} likes</span>
                        </button>
                        <button className="hover:text-purple-400 transition-colors flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.replies} replies</span>
                        </button>
                        <button className="hover:text-purple-400 transition-colors flex items-center space-x-1">
                          <Share className="h-4 w-4" />
                          <span>Share</span>
                        </button>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                      >
                        Join Discussion
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Load More */}
          <div className="text-center">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Load More Discussions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
