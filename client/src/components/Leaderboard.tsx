import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  Flame, 
  Target, 
  Users, 
  Search,
  Filter,
  TrendingUp,
  Award,
  Zap,
  BookOpen
} from 'lucide-react';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  problemsSolved: number;
  coursesCompleted: number;
  rank: number;
  isCurrentUser: boolean;
  badge?: string;
  lastActive: Date;
}

export function Leaderboard() {
  const [selectedCategory, setSelectedCategory] = useState('xp');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeframe, setTimeframe] = useState('all-time');

  const leaderboardData: LeaderboardUser[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      avatar: 'AJ',
      level: 15,
      xp: 12500,
      streak: 89,
      problemsSolved: 234,
      coursesCompleted: 18,
      rank: 1,
      isCurrentUser: false,
      badge: '👑',
      lastActive: new Date('2024-01-21')
    },
    {
      id: '2',
      name: 'Sarah Chen',
      avatar: 'SC',
      level: 12,
      xp: 10800,
      streak: 67,
      problemsSolved: 198,
      coursesCompleted: 15,
      rank: 2,
      isCurrentUser: false,
      badge: '🥈',
      lastActive: new Date('2024-01-21')
    },
    {
      id: '3',
      name: 'Mike Rodriguez',
      avatar: 'MR',
      level: 11,
      xp: 9500,
      streak: 45,
      problemsSolved: 176,
      coursesCompleted: 12,
      rank: 3,
      isCurrentUser: false,
      badge: '🥉',
      lastActive: new Date('2024-01-20')
    },
    {
      id: '4',
      name: 'Emma Wilson',
      avatar: 'EW',
      level: 10,
      xp: 8200,
      streak: 52,
      problemsSolved: 145,
      coursesCompleted: 11,
      rank: 4,
      isCurrentUser: false,
      lastActive: new Date('2024-01-21')
    },
    {
      id: '5',
      name: 'David Kim',
      avatar: 'DK',
      level: 9,
      xp: 7800,
      streak: 38,
      problemsSolved: 132,
      coursesCompleted: 10,
      rank: 5,
      isCurrentUser: false,
      lastActive: new Date('2024-01-19')
    },
    {
      id: '6',
      name: 'Lisa Thompson',
      avatar: 'LT',
      level: 8,
      xp: 4250,
      streak: 42,
      problemsSolved: 156,
      coursesCompleted: 12,
      rank: 6,
      isCurrentUser: true,
      lastActive: new Date('2024-01-21')
    },
    {
      id: '7',
      name: 'James Brown',
      avatar: 'JB',
      level: 8,
      xp: 4100,
      streak: 35,
      problemsSolved: 128,
      coursesCompleted: 9,
      rank: 7,
      isCurrentUser: false,
      lastActive: new Date('2024-01-18')
    },
    {
      id: '8',
      name: 'Maria Garcia',
      avatar: 'MG',
      level: 7,
      xp: 3800,
      streak: 28,
      problemsSolved: 98,
      coursesCompleted: 8,
      rank: 8,
      isCurrentUser: false,
      lastActive: new Date('2024-01-17')
    }
  ];

  const categories = [
    { id: 'xp', label: 'Total XP', icon: Star },
    { id: 'streak', label: 'Current Streak', icon: Flame },
    { id: 'problems', label: 'Problems Solved', icon: Target },
    { id: 'courses', label: 'Courses Completed', icon: BookOpen }
  ];

  const timeframes = [
    { id: 'all-time', label: 'All Time' },
    { id: 'this-month', label: 'This Month' },
    { id: 'this-week', label: 'This Week' }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 2: return 'bg-gray-400/20 text-gray-600 border-gray-400/30';
      case 3: return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
      default: return 'bg-muted/50 border-muted';
    }
  };

  const sortUsers = (users: LeaderboardUser[], category: string) => {
    return [...users].sort((a, b) => {
      switch (category) {
        case 'xp': return b.xp - a.xp;
        case 'streak': return b.streak - a.streak;
        case 'problems': return b.problemsSolved - a.problemsSolved;
        case 'courses': return b.coursesCompleted - a.coursesCompleted;
        default: return b.xp - a.xp;
      }
    }).map((user, index) => ({ ...user, rank: index + 1 }));
  };

  const getCategoryValue = (user: LeaderboardUser, category: string) => {
    switch (category) {
      case 'xp': return user.xp;
      case 'streak': return user.streak;
      case 'problems': return user.problemsSolved;
      case 'courses': return user.coursesCompleted;
      default: return user.xp;
    }
  };

  const filteredAndSortedUsers = sortUsers(
    leaderboardData.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    selectedCategory
  );

  const currentUser = filteredAndSortedUsers.find(user => user.isCurrentUser);
  const topUsers = filteredAndSortedUsers.slice(0, 3);

  return (
    <div className="space-y-4">
      {/* Top 3 Podium */}
      {topUsers.length > 0 && (
        <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <span>Top Performers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-center space-x-4">
              {/* 2nd Place */}
              {topUsers[1] && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-400/20 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-gray-400/30">
                    <span className="text-2xl">🥈</span>
                  </div>
                  <div className="text-sm font-semibold">{topUsers[1].name}</div>
                  <div className="text-xs text-muted-foreground">
                    {getCategoryValue(topUsers[1], selectedCategory).toLocaleString()}
                  </div>
                </div>
              )}
              
              {/* 1st Place */}
              {topUsers[0] && (
                <div className="text-center">
                  <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-yellow-500/30">
                    <span className="text-3xl">🥇</span>
                  </div>
                  <div className="text-lg font-bold">{topUsers[0].name}</div>
                  <div className="text-sm text-muted-foreground">
                    {getCategoryValue(topUsers[0], selectedCategory).toLocaleString()}
                  </div>
                </div>
              )}
              
              {/* 3rd Place */}
              {topUsers[2] && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-orange-500/30">
                    <span className="text-2xl">🥉</span>
                  </div>
                  <div className="text-sm font-semibold">{topUsers[2].name}</div>
                  <div className="text-xs text-muted-foreground">
                    {getCategoryValue(topUsers[2], selectedCategory).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded text-sm"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border rounded text-sm"
          >
            {timeframes.map(tf => (
              <option key={tf.id} value={tf.id}>
                {tf.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leaderboard List */}
      <Card>
        <CardContent className="p-0">
          <div className="space-y-1">
            {filteredAndSortedUsers.map((user) => {
              const categoryValue = getCategoryValue(user, selectedCategory);
              const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
              const IconComponent = selectedCategoryData?.icon || Star;
              
              return (
                <div
                  key={user.id}
                  className={`p-4 border-b last:border-b-0 transition-all hover:bg-muted/50 ${
                    user.isCurrentUser ? 'bg-primary/5 border-primary/20' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Rank */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                      getRankColor(user.rank)
                    }`}>
                      {getRankIcon(user.rank)}
                    </div>
                    
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold">
                      {user.avatar}
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{user.name}</h4>
                        {user.badge && <span className="text-lg">{user.badge}</span>}
                        {user.isCurrentUser && (
                          <Badge className="bg-primary/20 text-primary">You</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Level {user.level}</span>
                        <span>•</span>
                        <span>{user.lastActive.toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {/* Category Value */}
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4 text-primary" />
                        <span className="font-semibold">
                          {categoryValue.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {selectedCategoryData?.label}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current User Stats */}
      {currentUser && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-primary" />
              <span>Your Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">#{currentUser.rank}</div>
                <div className="text-sm text-muted-foreground">Your Rank</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{currentUser.xp}</div>
                <div className="text-sm text-muted-foreground">Total XP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{currentUser.streak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{currentUser.problemsSolved}</div>
                <div className="text-sm text-muted-foreground">Problems Solved</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 