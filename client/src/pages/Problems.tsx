import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Star, Zap, TrendingUp, Trophy } from 'lucide-react';
import { mockProblems, todaysProblem } from '@/lib/mockData';
import { useAuth } from '@/hooks/useAuth';

export function Problems() {
  const { user, isAuthenticated } = useAuth();

  const categories = [
    { id: 'all', label: 'All Problems', active: true },
    { id: 'arrays', label: 'Arrays' },
    { id: 'strings', label: 'Strings' },
    { id: 'algorithms', label: 'Algorithms' },
    { id: 'data-structures', label: 'Data Structures' },
    { id: 'dynamic-programming', label: 'Dynamic Programming' },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/20 text-green-400';
      case 'medium':
        return 'bg-orange-500/20 text-orange-400';
      case 'hard':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTagColor = (tag: string) => {
    const colors: { [key: string]: string } = {
      'Array': 'bg-blue-500/20 text-blue-400',
      'Hash Table': 'bg-purple-500/20 text-purple-400',
      'Stack': 'bg-orange-500/20 text-orange-400',
      'Strings': 'bg-green-500/20 text-green-400',
      'Dynamic Programming': 'bg-red-500/20 text-red-400',
      'Trees': 'bg-emerald-500/20 text-emerald-400',
      'Recursion': 'bg-pink-500/20 text-pink-400',
      'Two Pointers': 'bg-cyan-500/20 text-cyan-400',
    };
    return colors[tag] || 'bg-gray-500/20 text-gray-400';
  };

  const solvedCount = mockProblems.filter(p => p.solved).length;
  const totalCount = mockProblems.length;
  const successRate = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  const easyProblems = mockProblems.filter(p => p.difficulty === 'easy');
  const mediumProblems = mockProblems.filter(p => p.difficulty === 'medium');
  const hardProblems = mockProblems.filter(p => p.difficulty === 'hard');

  const easySolved = easyProblems.filter(p => p.solved).length;
  const mediumSolved = mediumProblems.filter(p => p.solved).length;
  const hardSolved = hardProblems.filter(p => p.solved).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Daily Problems</h1>
          <p className="text-muted-foreground">Sharpen your coding skills with daily challenges</p>
        </div>
        {isAuthenticated && user && (
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Problems Solved</div>
            <div className="text-2xl font-bold text-green-400">{user.problemsSolved} / 365</div>
          </div>
        )}
      </div>

      {/* Today's Challenge */}
      <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20 mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>Today's Challenge</CardTitle>
                <CardDescription>January 26, 2025</CardDescription>
              </div>
            </div>
            <Badge className="bg-primary/20 text-primary px-4 py-2 text-base">
              +{todaysProblem.xpReward} XP
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">{todaysProblem.title}</h3>
          <p className="text-muted-foreground text-sm mb-4">{todaysProblem.description}</p>
          <div className="flex gap-2 mb-4">
            <Badge className={getDifficultyColor(todaysProblem.difficulty)}>
              {todaysProblem.difficulty}
            </Badge>
            {todaysProblem.tags.map((tag, index) => (
              <Badge key={index} className={getTagColor(tag)}>
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex gap-4">
            <Button>Start Solving</Button>
            <Button variant="outline">View Solution</Button>
          </div>
        </CardContent>
      </Card>

      {/* Problem Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={category.active ? "default" : "outline"}
            size="sm"
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Problems List */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {mockProblems.map((problem) => (
          <Card key={problem.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    problem.solved 
                      ? 'bg-green-500' 
                      : 'bg-muted'
                  }`}>
                    {problem.solved ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : (
                      <span className="text-sm font-semibold">{problem.id}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{problem.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {problem.solved ? `Solved` : 'Not attempted'}
                    </p>
                  </div>
                </div>
                <Badge className={getDifficultyColor(problem.difficulty)}>
                  {problem.difficulty}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm mb-4">{problem.description}</p>
              <div className="flex gap-2 mb-4 flex-wrap">
                {problem.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm font-semibold ${
                  problem.solved ? 'text-green-400' : 'text-muted-foreground'
                }`}>
                  {problem.solved ? `+${problem.xpReward} XP Earned` : `+${problem.xpReward} XP Available`}
                </span>
                <Button 
                  size="sm" 
                  variant={problem.solved ? "outline" : "default"}
                >
                  {problem.solved ? 'View Solution' : 'Start Solving'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Stats */}
      {isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle>Your Problem Solving Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span className="text-2xl font-bold text-green-400">{easySolved}</span>
                  <span className="text-muted-foreground">/ {easyProblems.length}</span>
                </div>
                <div className="text-muted-foreground text-sm mb-2">Easy Problems</div>
                <Progress value={(easySolved / easyProblems.length) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round((easySolved / easyProblems.length) * 100)}% completion rate
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Zap className="h-5 w-5 text-orange-400" />
                  <span className="text-2xl font-bold text-orange-400">{mediumSolved}</span>
                  <span className="text-muted-foreground">/ {mediumProblems.length}</span>
                </div>
                <div className="text-muted-foreground text-sm mb-2">Medium Problems</div>
                <Progress value={(mediumSolved / mediumProblems.length) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round((mediumSolved / mediumProblems.length) * 100)}% completion rate
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Trophy className="h-5 w-5 text-red-400" />
                  <span className="text-2xl font-bold text-red-400">{hardSolved}</span>
                  <span className="text-muted-foreground">/ {hardProblems.length}</span>
                </div>
                <div className="text-muted-foreground text-sm mb-2">Hard Problems</div>
                <Progress value={(hardSolved / hardProblems.length) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round((hardSolved / hardProblems.length) * 100)}% completion rate
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
