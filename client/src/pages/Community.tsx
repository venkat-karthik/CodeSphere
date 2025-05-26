import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageCircle, 
  ThumbsUp, 
  Share2, 
  Plus,
  Eye,
  TrendingUp
} from 'lucide-react';
import { storage } from '../lib/storage';

export function Community() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [posts] = useState(storage.getPosts());

  const categories = [
    'all', 'Frontend', 'Backend', 'Career', 'Showcase', 'Help', 'Discussion'
  ];

  const communityStats = [
    { label: 'Active Members', value: '2,847', icon: Users, color: 'text-primary' },
    { label: 'Online Now', value: '156', icon: Eye, color: 'text-green-500' },
    { label: 'Discussions', value: '1,234', icon: MessageCircle, color: 'text-blue-500' },
    { label: 'Code Reviews', value: '98', icon: TrendingUp, color: 'text-orange-500' }
  ];

  const getPostIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Frontend': '🎨',
      'Backend': '⚙️', 
      'Career': '💼',
      'Showcase': '🚀',
      'Help': '❓',
      'Discussion': '💬'
    };
    return icons[category] || '💭';
  };

  const formatTimestamp = (timestamp: string) => {
    // Simple timestamp formatting
    return timestamp;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Community Lounge</h1>
          <p className="text-muted-foreground">
            Connect with fellow developers and share knowledge
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      {/* Community Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        {communityStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'All Discussions' : category}
          </Button>
        ))}
      </div>

      {/* Discussion Posts */}
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-semibold text-sm">
                    {post.author.avatar}
                  </span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{post.author.name}</span>
                      <Badge 
                        variant="secondary" 
                        className="bg-green-500/20 text-green-400"
                      >
                        Level {post.author.level}
                      </Badge>
                      <span className="text-muted-foreground text-sm">
                        • {formatTimestamp(post.timestamp)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Badge 
                        variant="outline"
                        className="bg-primary/20 text-primary border-primary/30"
                      >
                        {getPostIcon(post.category)} {post.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <button className="hover:text-primary transition-colors flex items-center space-x-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.likes} likes</span>
                      </button>
                      <button className="hover:text-primary transition-colors flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.replies} replies</span>
                      </button>
                      <button className="hover:text-primary transition-colors flex items-center space-x-1">
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </div>
                    <Button size="sm" variant="outline">
                      Join Discussion
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">
          Load More Discussions
        </Button>
      </div>
    </div>
  );
}
