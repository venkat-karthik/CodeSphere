import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { getProblems, getUserSolutions, saveProblemSolution } from '@/lib/storage';
import { Problem } from '@/types';
import { Code, CheckCircle, Circle, Clock, Star, Flame, Trophy } from 'lucide-react';

export function Problems() {
  const { user, isAuthenticated, updateUserProgress, incrementProblemsSolved } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [userSolutions, setUserSolutions] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const allProblems = getProblems();
    setProblems(allProblems);
    
    if (user) {
      const solutions = getUserSolutions(user.id);
      setUserSolutions(solutions);
    }
  }, [user]);

  const categories = ['all', 'arrays', 'strings', 'dynamic-programming', 'algorithms'];

  const filteredProblems = selectedCategory === 'all' 
    ? problems 
    : problems.filter(problem => problem.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500/20 text-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'hard': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const isProblemSolved = (problemId: number) => {
    return userSolutions.some(s => s.problemId === problemId && s.solved);
  };

  const handleSolveProblem = async (problem: Problem) => {
    if (!user) return;
    
    // Simulate solving the problem
    saveProblemSolution(user.id, problem.id, true);
    setUserSolutions(getUserSolutions(user.id));
    
    // Update user progress
    await updateUserProgress(problem.xpReward);
    await incrementProblemsSolved();
  };

  const todaysProblem = problems.find(p => p.isDaily);

  const solvedProblems = userSolutions.filter(s => s.solved).length;
  const totalProblems = problems.length;
  const easyProblems = problems.filter(p => p.difficulty === 'easy');
  const mediumProblems = problems.filter(p => p.difficulty === 'medium');
  const hardProblems = problems.filter(p => p.difficulty === 'hard');
  
  const easySolved = userSolutions.filter(s => s.solved && easyProblems.find(p => p.id === s.problemId)).length;
  const mediumSolved = userSolutions.filter(s => s.solved && mediumProblems.find(p => p.id === s.problemId)).length;
  const hardSolved = userSolutions.filter(s => s.solved && hardProblems.find(p => p.id === s.problemId)).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Daily Problems</h1>
          <p className="text-slate-400">Sharpen your coding skills with daily challenges</p>
        </div>
        {isAuthenticated && (
          <div className="text-right">
            <div className="text-sm text-slate-400">Problems Solved</div>
            <div className="text-2xl font-bold text-emerald-400">
              {solvedProblems} / {totalProblems}
            </div>
          </div>
        )}
      </div>

      {/* Today's Challenge */}
      {todaysProblem && (
        <Card className="bg-gradient-to-r from-violet-900/50 to-purple-900/50 border-violet-600/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-violet-600 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Today's Challenge</h2>
                  <p className="text-slate-400 text-sm">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <Badge className="bg-violet-600/20 text-violet-400 px-4 py-2 text-base font-semibold">
                +{todaysProblem.xpReward} XP
              </Badge>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{todaysProblem.title}</h3>
            <p className="text-slate-300 text-sm mb-4">{todaysProblem.description}</p>
            <div className="flex gap-2 mb-4">
              <Badge className={getDifficultyColor(todaysProblem.difficulty)}>
                {todaysProblem.difficulty}
              </Badge>
              {todaysProblem.tags.map(tag => (
                <Badge key={tag} variant="outline" className="border-slate-600 text-slate-400">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex gap-4">
              {isAuthenticated ? (
                isProblemSolved(todaysProblem.id) ? (
                  <Badge className="bg-emerald-600/20 text-emerald-400 px-6 py-2">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Solved!
                  </Badge>
                ) : (
                  <Button 
                    onClick={() => handleSolveProblem(todaysProblem)}
                    className="bg-violet-600 hover:bg-violet-700"
                  >
                    Start Challenge
                  </Button>
                )
              ) : (
                <Button className="bg-violet-600 hover:bg-violet-700">
                  Sign in to Start
                </Button>
              )}
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
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
            className={
              selectedCategory === category
                ? "bg-violet-600 text-white"
                : "border-slate-700 text-slate-400 hover:bg-slate-800"
            }
          >
            {category === 'all' ? 'All Problems' : category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      {/* Problems List */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredProblems.map((problem) => {
          const solved = isProblemSolved(problem.id);
          
          return (
            <Card key={problem.id} className="bg-slate-900 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      solved ? 'bg-emerald-600' : 'bg-slate-600'
                    }`}>
                      {solved ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : (
                        <Circle className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{problem.title}</h3>
                      <p className="text-slate-400 text-sm">
                        {solved ? 'Solved!' : 'Not attempted'}
                      </p>
                    </div>
                  </div>
                  <Badge className={getDifficultyColor(problem.difficulty)}>
                    {problem.difficulty}
                  </Badge>
                </div>
                
                <p className="text-slate-300 text-sm mb-4">{problem.description}</p>
                
                <div className="flex gap-2 mb-4">
                  {problem.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="border-slate-600 text-slate-400">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-semibold ${
                    solved ? 'text-emerald-400' : 'text-slate-400'
                  }`}>
                    {solved ? `+${problem.xpReward} XP Earned` : `+${problem.xpReward} XP Available`}
                  </span>
                  {isAuthenticated ? (
                    solved ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-slate-600 text-slate-300 hover:bg-slate-800"
                      >
                        View Solution
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleSolveProblem(problem)}
                        size="sm"
                        className="bg-violet-600 hover:bg-violet-700"
                      >
                        Start Solving
                      </Button>
                    )
                  ) : (
                    <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                      Sign in to Solve
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progress Stats */}
      {isAuthenticated && (
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Your Problem Solving Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">{easySolved}</div>
                <div className="text-slate-400 text-sm">Easy Problems</div>
                <div className="text-xs text-slate-500">
                  {easyProblems.length > 0 ? Math.round((easySolved / easyProblems.length) * 100) : 0}% completion rate
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">{mediumSolved}</div>
                <div className="text-slate-400 text-sm">Medium Problems</div>
                <div className="text-xs text-slate-500">
                  {mediumProblems.length > 0 ? Math.round((mediumSolved / mediumProblems.length) * 100) : 0}% completion rate
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400 mb-1">{hardSolved}</div>
                <div className="text-slate-400 text-sm">Hard Problems</div>
                <div className="text-xs text-slate-500">
                  {hardProblems.length > 0 ? Math.round((hardSolved / hardProblems.length) * 100) : 0}% completion rate
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Streak Information */}
      {isAuthenticated && user && user.streak > 0 && (
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <Flame className="h-6 w-6 text-orange-400" />
                <span className="text-orange-400 font-bold text-xl">{user.streak} Day Streak!</span>
              </div>
              <div className="text-slate-400">
                Keep solving problems daily to maintain your streak
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
