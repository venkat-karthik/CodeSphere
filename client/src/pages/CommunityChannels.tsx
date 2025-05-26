import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Hash,
  Volume2,
  Lock,
  Settings,
  UserPlus,
  Send,
  Smile,
  Paperclip,
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Pin,
  Reply,
  Edit,
  Trash2
} from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  description?: string;
  memberCount: number;
  isPrivate: boolean;
  category: string;
}

interface Message {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: 'admin' | 'student' | 'moderator';
    level: number;
  };
  content: string;
  timestamp: Date;
  reactions: { emoji: string; count: number; users: string[] }[];
  replies?: Message[];
  edited?: boolean;
  pinned?: boolean;
}

export function CommunityChannels() {
  const [selectedChannel, setSelectedChannel] = useState<string>('general');
  const [newMessage, setNewMessage] = useState('');
  const [showNewChannelModal, setShowNewChannelModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState<'text' | 'voice'>('text');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock channels data
  const channels: Channel[] = [
    {
      id: 'general',
      name: 'general',
      type: 'text',
      description: 'General discussions',
      memberCount: 245,
      isPrivate: false,
      category: 'General'
    },
    {
      id: 'help',
      name: 'help',
      type: 'text',
      description: 'Get help with coding problems',
      memberCount: 189,
      isPrivate: false,
      category: 'General'
    },
    {
      id: 'announcements',
      name: 'announcements',
      type: 'text',
      description: 'Important updates and news',
      memberCount: 298,
      isPrivate: false,
      category: 'General'
    },
    {
      id: 'javascript',
      name: 'javascript',
      type: 'text',
      description: 'JavaScript discussions',
      memberCount: 156,
      isPrivate: false,
      category: 'Programming'
    },
    {
      id: 'python',
      name: 'python',
      type: 'text',
      description: 'Python programming help',
      memberCount: 134,
      isPrivate: false,
      category: 'Programming'
    },
    {
      id: 'react',
      name: 'react',
      type: 'text',
      description: 'React development',
      memberCount: 98,
      isPrivate: false,
      category: 'Programming'
    },
    {
      id: 'study-group',
      name: 'Study Group',
      type: 'voice',
      description: 'Voice chat for study sessions',
      memberCount: 24,
      isPrivate: false,
      category: 'Study'
    },
    {
      id: 'office-hours',
      name: 'Office Hours',
      type: 'voice',
      description: 'Live help with instructors',
      memberCount: 12,
      isPrivate: false,
      category: 'Study'
    }
  ];

  // Mock messages data
  const messages: Message[] = [
    {
      id: '1',
      author: {
        name: 'Alex Johnson',
        avatar: 'AJ',
        role: 'admin',
        level: 10
      },
      content: 'Welcome to CodeSphere Community! 🎉 This is where we collaborate, share knowledge, and help each other grow as developers.',
      timestamp: new Date('2024-01-20T10:00:00'),
      reactions: [
        { emoji: '👋', count: 12, users: ['user1', 'user2'] },
        { emoji: '🎉', count: 8, users: ['user3', 'user4'] }
      ],
      pinned: true
    },
    {
      id: '2',
      author: {
        name: 'Sarah Chen',
        avatar: 'SC',
        role: 'moderator',
        level: 8
      },
      content: 'Just finished the React roadmap! The project-based learning approach is incredible. Has anyone started the advanced patterns section yet?',
      timestamp: new Date('2024-01-20T14:30:00'),
      reactions: [
        { emoji: '🚀', count: 5, users: ['user5', 'user6'] },
        { emoji: '💪', count: 3, users: ['user7'] }
      ]
    },
    {
      id: '3',
      author: {
        name: 'Mike Rodriguez',
        avatar: 'MR',
        role: 'student',
        level: 3
      },
      content: 'Quick question about the JavaScript fundamentals - can someone explain closures in simple terms? The examples in the course are helpful but I want to make sure I understand it correctly.',
      timestamp: new Date('2024-01-20T15:45:00'),
      reactions: [
        { emoji: '🤔', count: 2, users: ['user8'] }
      ],
      replies: [
        {
          id: '3a',
          author: {
            name: 'Emma Davis',
            avatar: 'ED',
            role: 'student',
            level: 6
          },
          content: 'Think of closures like a backpack that a function carries around. It has access to all the variables from its "home" scope, even when the function travels to other parts of your code!',
          timestamp: new Date('2024-01-20T15:50:00'),
          reactions: [
            { emoji: '💡', count: 4, users: ['user9', 'user10'] }
          ]
        }
      ]
    },
    {
      id: '4',
      author: {
        name: 'Lisa Wang',
        avatar: 'LW',
        role: 'student',
        level: 5
      },
      content: 'Just deployed my first full-stack project using the MERN stack! 🎯 The deployment guide in the resources section was super helpful. Thanks to everyone who helped in the #help channel!',
      timestamp: new Date('2024-01-20T16:20:00'),
      reactions: [
        { emoji: '🎯', count: 7, users: ['user11', 'user12'] },
        { emoji: '🔥', count: 4, users: ['user13'] }
      ]
    }
  ];

  const channelCategories = Array.from(new Set(channels.map(ch => ch.category)));

  const selectedChannelData = channels.find(ch => ch.id === selectedChannel);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-400';
      case 'moderator': return 'text-blue-400';
      case 'student': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400';
      case 'moderator': return 'bg-blue-500/20 text-blue-400';
      case 'student': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Channel Sidebar */}
      <div className="w-64 bg-muted/30 border-r border-border flex flex-col">
        {/* Server Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">CodeSphere Community</h2>
            <Dialog open={showNewChannelModal} onOpenChange={setShowNewChannelModal}>
              <DialogTrigger asChild>
                <Button size="sm" variant="ghost">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Channel</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Channel name"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                  />
                  <div className="flex space-x-2">
                    <Button
                      variant={newChannelType === 'text' ? 'default' : 'outline'}
                      onClick={() => setNewChannelType('text')}
                      className="flex-1"
                    >
                      <Hash className="mr-2 h-4 w-4" />
                      Text
                    </Button>
                    <Button
                      variant={newChannelType === 'voice' ? 'default' : 'outline'}
                      onClick={() => setNewChannelType('voice')}
                      className="flex-1"
                    >
                      <Volume2 className="mr-2 h-4 w-4" />
                      Voice
                    </Button>
                  </div>
                  <Button className="w-full" onClick={() => setShowNewChannelModal(false)}>
                    Create Channel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Channels List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {channelCategories.map((category) => (
              <div key={category} className="mb-4">
                <div className="flex items-center justify-between px-2 py-1 mb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {category}
                  </span>
                </div>
                <div className="space-y-1">
                  {channels
                    .filter((channel) => channel.category === category)
                    .map((channel) => (
                      <button
                        key={channel.id}
                        onClick={() => setSelectedChannel(channel.id)}
                        className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded text-left hover:bg-muted/50 transition-colors ${
                          selectedChannel === channel.id ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {channel.type === 'text' ? (
                          <Hash className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                        <span className="flex-1 text-sm font-medium">{channel.name}</span>
                        {channel.isPrivate && <Lock className="h-3 w-3" />}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* User Info */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
              JD
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">Level 5 Student</p>
            </div>
            <Button size="sm" variant="ghost">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {selectedChannelData?.type === 'text' ? (
                <Hash className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Volume2 className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <h3 className="font-semibold">{selectedChannelData?.name}</h3>
                <p className="text-xs text-muted-foreground">{selectedChannelData?.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                <Users className="mr-1 h-3 w-3" />
                {selectedChannelData?.memberCount} members
              </Badge>
              <Button size="sm" variant="ghost">
                <Search className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="group">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                    {message.author.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline space-x-2 mb-1">
                      <span className={`font-semibold text-sm ${getRoleColor(message.author.role)}`}>
                        {message.author.name}
                      </span>
                      <Badge className={`text-xs px-1.5 py-0.5 ${getRoleBadge(message.author.role)}`}>
                        {message.author.role}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Level {message.author.level}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.edited && (
                        <span className="text-xs text-muted-foreground">(edited)</span>
                      )}
                      {message.pinned && (
                        <Pin className="h-3 w-3 text-yellow-500" />
                      )}
                    </div>
                    <div className="text-sm text-foreground mb-2">{message.content}</div>
                    
                    {/* Reactions */}
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {message.reactions.map((reaction, index) => (
                          <button
                            key={index}
                            className="flex items-center space-x-1 px-2 py-1 bg-muted/50 rounded-full text-xs hover:bg-muted transition-colors"
                          >
                            <span>{reaction.emoji}</span>
                            <span>{reaction.count}</span>
                          </button>
                        ))}
                        <button className="px-2 py-1 bg-muted/30 rounded-full text-xs hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                          <Smile className="h-3 w-3" />
                        </button>
                      </div>
                    )}

                    {/* Replies */}
                    {message.replies && message.replies.length > 0 && (
                      <div className="mt-2 border-l-2 border-muted pl-3 space-y-2">
                        {message.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start space-x-2">
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-semibold">
                              {reply.author.avatar}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-baseline space-x-2 mb-1">
                                <span className={`font-semibold text-xs ${getRoleColor(reply.author.role)}`}>
                                  {reply.author.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(reply.timestamp)}
                                </span>
                              </div>
                              <div className="text-xs text-foreground">{reply.content}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Message Actions */}
                  <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1">
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Reply className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Smile className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <Textarea
                placeholder={`Message #${selectedChannelData?.name}`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="min-h-[40px] max-h-32 resize-none pr-12"
                rows={1}
              />
              <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Paperclip className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Smile className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>

      {/* Members Sidebar */}
      <div className="w-48 bg-muted/30 border-l border-border">
        <div className="p-3">
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">
            ONLINE — {selectedChannelData?.memberCount}
          </h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 p-1 rounded hover:bg-muted/50 cursor-pointer">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                AJ
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium">Alex Johnson</p>
                <p className="text-xs text-red-400">Admin</p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-2 p-1 rounded hover:bg-muted/50 cursor-pointer">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                SC
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium">Sarah Chen</p>
                <p className="text-xs text-blue-400">Moderator</p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-2 p-1 rounded hover:bg-muted/50 cursor-pointer">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                MR
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium">Mike Rodriguez</p>
                <p className="text-xs text-green-400">Student</p>
              </div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}