import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { getPosts } from '@/lib/storage';
import { Post } from '@/types';
import { Users, MessageCircle, Heart, Share, Plus, TrendingUp, Clock, Award } from 'lucide-react';

export function Community() {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const allPosts = getPosts();
    // Add mock author data
    const postsWithAuthors = allPosts.map(post => ({
      ...post,
      author: {
        firstName: post.userId === 1 ? 'Alex' : post.userId === 2 ? 'Maria' : 'David',
        lastName: post.userId === 1 ? 'Smith' : post.userId === 2 ? 'Johnson' : 'Kim',
        level: post.userId === 1 ? 8 : post.userId === 2 ? 12 : 6,
      }
    }));
    setPosts(postsWithAuthors);
  }, []);

  const categories = ['all', 'react', 'javascript', 'career', 'help', 'showcase'];

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      react: 'bg-blue-500/20 text-blue-400',
      javascript: 'bg-yellow-500/20 text-yellow-400',
      career: 'bg-green-500/20 text-green-400',
      help: 'bg-orange-500/20 text-orange-400',
      showcase: 'bg-purple-500/20 text-purple-400',
    };
    return colors[category as keyof typeof colors] || 'bg-slate-500/20 text-slate-400';
  };

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'bg-purple-500/20 text-purple-400';
    if (level >= 5) return 'bg-blue-500/20 text-blue-400';
    return 'bg-green-500/20 text-green-400';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Community Lounge</h1>
          <p className="text-slate-400">Connect with fellow developers and share knowledge</p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700">
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Community Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-violet-400 mb-1">2,847</div>
            <div className="text-slate-400 text-sm">Active Members</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-emerald-400 mb-1">156</div>
            <div className="text-slate-400 text-sm">Online Now</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">1,234</div>
            <div className="text-slate-400 text-sm">Discussions</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">98</div>
            <div className="text-slate-400 text-sm">Code Reviews</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={
              selectedCategory === category
                ? "bg-violet-600 text-white"
                : "border-slate-700 text-slate-400 hover:bg-slate-800"
            }
          >
            {category === 'all' ? 'All Discussions' : category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      {/* New Post Card */}
      {isAuthenticated && (
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Start a Discussion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="What's on your mind?" 
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-violet-600"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Code
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Link
                </Button>
              </div>
              <Button className="bg-violet-600 hover:bg-violet-700">
                Post
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discussion Posts */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="bg-slate-900 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {post.author?.firstName.charAt(0)}{post.author?.lastName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white">
                        {post.author?.firstName} {post.author?.lastName}
                      </span>
                      <Badge className={getLevelColor(post.author?.level || 1)}>
                        Level {post.author?.level}
                      </Badge>
                      <span className="text-slate-400 text-sm">
                        • {formatTimeAgo(post.createdAt)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getCategoryColor(post.category)}>
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                  <p className="text-slate-300 mb-4">{post.content}</p>
                  
                  {/* Code snippet for showcase posts */}
                  {post.category === 'showcase' && (
                    <div className="bg-slate-800/50 rounded-lg p-3 mb-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <MessageCircle className="h-4 w-4 text-slate-400" />
                        <span className="text-violet-400">github.com/user/project</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <button className="hover:text-violet-400 transition-colors flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes} likes</span>
                      </button>
                      <button className="hover:text-violet-400 transition-colors flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.replies} replies</span>
                      </button>
                      <button className="hover:text-violet-400 transition-colors flex items-center space-x-1">
                        <Share className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-violet-400 hover:text-violet-300"
                    >
                      Join Discussion
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No discussions found</h3>
            <p className="text-slate-400">Be the first to start a conversation in this category!</p>
          </CardContent>
        </Card>
      )}

      {/* Load More */}
      {filteredPosts.length > 0 && (
        <div className="text-center">
          <Button variant="outline" className="border-slate-700 text-slate-400 hover:bg-slate-800">
            Load More Discussions
          </Button>
        </div>
      )}

      {/* Trending Topics Sidebar */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">React Hooks</h4>
                <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">Hot</Badge>
              </div>
              <p className="text-sm text-slate-400">1,234 people discussing</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">Python Data Science</h4>
                <Badge className="bg-violet-500/20 text-violet-400 text-xs">Popular</Badge>
              </div>
              <p className="text-sm text-slate-400">987 people discussing</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">CSS Grid</h4>
                <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Rising</Badge>
              </div>
              <p className="text-sm text-slate-400">654 people discussing</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
