import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Star, 
  CheckCircle, 
  Circle, 
  Flame,
  Code,
  Trophy,
  Target,
  Play,
  RotateCcw,
  Lightbulb
} from 'lucide-react';
import { storage } from '../lib/storage';
import { useAuth } from '../hooks/useAuth';

export function Problems() {
  const { user, updateUser } = useAuth();
  const [problems] = useState(storage.getProblems());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentProblem, setCurrentProblem] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const dailyCodeProblems = [
    {
      id: 'snippet-1',
      title: 'Array Method Challenge',
      code: `const numbers = [1, 2, 3, 4, 5];
const result = numbers.map(x => x * 2).filter(x => x > 5);
console.log(result);`,
      question: 'What will be logged to the console?',
      correctAnswer: '[6, 8, 10]',
      explanation: 'First map doubles each number [2,4,6,8,10], then filter keeps only numbers > 5'
    },
    {
      id: 'snippet-2', 
      title: 'Function Scope',
      code: `function test() {
  var a = 1;
  if (true) {
    var a = 2;
    console.log(a);
  }
  console.log(a);
}
test();`,
      question: 'What will be the output?',
      correctAnswer: '2\n2',
      explanation: 'var has function scope, so both console.logs refer to the same variable'
    },
    {
      id: 'snippet-3',
      title: 'Promise Chain',
      code: `Promise.resolve(5)
  .then(x => x * 2)
  .then(x => x + 3)
  .then(console.log);`,
      question: 'What number will be logged?',
      correctAnswer: '13',
      explanation: '5 * 2 = 10, then 10 + 3 = 13'
    }
  ];

  const categories = [
    'all', 'Arrays', 'Strings', 'Dynamic Programming', 'Trees', 'Graphs'
  ];

  const todaysProblem = problems.find(p => p.id === 'two-sum');
  const filteredProblems = problems.filter(p => 
    selectedCategory === 'all' || p.category === selectedCategory
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'hard': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const checkAnswer = () => {
    if (!currentProblem) return;
    
    const correct = userAnswer.trim().toLowerCase() === currentProblem.correctAnswer.toLowerCase();
    setIsCorrect(correct);
    setShowResult(true);
    setShowAnimation(true);
    
    // Hide animation after 3 seconds
    setTimeout(() => setShowAnimation(false), 3000);
    
    if (correct && user) {
      // Award XP for correct answer
      updateUser({ ...user, xp: user.xp + 50 });
    }
  };

  const resetProblem = () => {
    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(false);
    setShowAnimation(false);
  };

  const handleStartProblem = (problemId: string) => {
    if (problemId.startsWith('snippet-')) {
      const problem = dailyCodeProblems.find(p => p.id === problemId);
      setCurrentProblem(problem || null);
      resetProblem();
    } else {
      alert(`Starting algorithmic problem: ${problemId}`);
    }
  };

  const completedProblems = problems.filter(p => p.completed).length;
  const totalProblems = problems.length;
  const successRate = completedProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Daily Problems</h1>
          <p className="text-muted-foreground">
            Sharpen your coding skills with daily challenges
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Problems Solved</div>
          <div className="text-2xl font-bold text-green-400">
            {user?.problemsSolved || 0} / 365
          </div>
        </div>
      </div>

      {/* Today's Challenge */}
      {todaysProblem && (
        <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>Today's Challenge</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              <Badge className="bg-primary/20 text-primary font-semibold">
                +{todaysProblem.xpReward} XP
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">{todaysProblem.title}</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {todaysProblem.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={getDifficultyColor(todaysProblem.difficulty)}>
                {todaysProblem.difficulty}
              </Badge>
              {todaysProblem.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={() => handleStartProblem(todaysProblem.id)}
                disabled={todaysProblem.completed}
              >
                {todaysProblem.completed ? 'Completed' : 'Start Solving'}
              </Button>
              <Button variant="outline">
                View Solution
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Problem Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Problems List */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredProblems.map((problem) => (
          <Card key={problem.id} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    problem.completed 
                      ? 'bg-green-500' 
                      : 'bg-muted'
                  }`}>
                    {problem.completed ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{problem.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {problem.completed 
                        ? `Solved ${problem.attempts} attempt${problem.attempts !== 1 ? 's' : ''} ago`
                        : 'Not attempted'
                      }
                    </p>
                  </div>
                </div>
                <Badge className={getDifficultyColor(problem.difficulty)}>
                  {problem.difficulty}
                </Badge>
              </div>
              
              <p className="text-muted-foreground text-sm mb-4">
                {problem.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {problem.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`text-sm font-semibold ${
                  problem.completed ? 'text-green-400' : 'text-muted-foreground'
                }`}>
                  {problem.completed 
                    ? `+${problem.xpReward} XP Earned` 
                    : `+${problem.xpReward} XP Available`
                  }
                </span>
                <Button
                  size="sm"
                  variant={problem.completed ? "outline" : "default"}
                  onClick={() => handleStartProblem(problem.id)}
                >
                  {problem.completed ? 'View Solution' : 'Start Solving'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <div className="text-3xl font-bold text-primary mb-2">
              {user?.problemsSolved || 0}
            </div>
            <div className="text-muted-foreground">Problems Solved</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Target className="h-6 w-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-500 mb-2">
              {successRate}%
            </div>
            <div className="text-muted-foreground">Success Rate</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-orange-500 mb-2">
              {user?.streak || 0}
            </div>
            <div className="text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
