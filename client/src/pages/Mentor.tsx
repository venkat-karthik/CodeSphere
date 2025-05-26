import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bot, 
  Send, 
  User, 
  Code, 
  Lightbulb,
  BookOpen,
  MessageCircle,
  Zap
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface QuickPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  icon: any;
  category: string;
}

export function Mentor() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI coding mentor. I'm here to help you with programming questions, code reviews, debugging, and learning new concepts. What would you like to work on today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts: QuickPrompt[] = [
    {
      id: '1',
      title: 'Code Review',
      description: 'Get feedback on your code',
      prompt: 'Can you review this code and suggest improvements?',
      icon: Code,
      category: 'Review'
    },
    {
      id: '2',
      title: 'Debug Help',
      description: 'Fix bugs and errors',
      prompt: 'I\'m getting an error in my code. Can you help me debug it?',
      icon: Zap,
      category: 'Debug'
    },
    {
      id: '3',
      title: 'Learn Concept',
      description: 'Understand programming concepts',
      prompt: 'Can you explain this programming concept with examples?',
      icon: BookOpen,
      category: 'Learn'
    },
    {
      id: '4',
      title: 'Project Ideas',
      description: 'Get project suggestions',
      prompt: 'Can you suggest some project ideas for my skill level?',
      icon: Lightbulb,
      category: 'Ideas'
    }
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      "That's a great question! Let me help you understand this concept better. Here's how you can approach it step by step...",
      "I see what you're trying to do. This is a common pattern in programming. Let me break it down for you...",
      "Excellent! This is a perfect opportunity to learn something new. Here's what I recommend...",
      "That's an interesting problem. Let's think through this logically. First, we need to consider...",
      "I love helping with debugging! From what you've described, it sounds like the issue might be..."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Mentor</h1>
          <p className="text-muted-foreground">
            Get personalized coding help from your AI assistant
          </p>
        </div>
        <Badge className="bg-green-500/20 text-green-400 flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Online</span>
        </Badge>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Quick Prompts */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Start</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickPrompts.map((prompt) => (
                <Button
                  key={prompt.id}
                  variant="outline"
                  className="w-full justify-start h-auto p-3"
                  onClick={() => handleQuickPrompt(prompt.prompt)}
                >
                  <div className="flex items-start space-x-2">
                    <prompt.icon className="h-4 w-4 mt-0.5 text-primary" />
                    <div className="text-left">
                      <div className="font-medium text-sm">{prompt.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {prompt.description}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Mentor Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Session Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Questions Asked</span>
                <span className="font-semibold">{messages.filter(m => m.type === 'user').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Responses</span>
                <span className="font-semibold">{messages.filter(m => m.type === 'ai').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Session Time</span>
                <span className="font-semibold">12 min</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg">CodeSphere AI Mentor</CardTitle>
                  <p className="text-sm text-muted-foreground">Always ready to help</p>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex space-x-2 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div className={`rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex space-x-2 max-w-[80%]">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Textarea
                  placeholder="Ask me anything about coding..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 min-h-[40px] max-h-[120px]"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
