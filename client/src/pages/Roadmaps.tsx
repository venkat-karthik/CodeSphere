import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProgressBar } from '@/components/ProgressBar';
import { roadmapsData } from '@/data/mockData';
import { useAuth } from '@/hooks/useAuth';
import { 
  Search, 
  CheckCircle, 
  Circle, 
  ArrowRight,
  Trophy,
  Target,
  TrendingUp,
  Brain
} from 'lucide-react';

export default function Roadmaps() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { auth, updateUser } = useAuth();

  const filteredRoadmaps = roadmapsData.filter(roadmap => {
    const matchesSearch = roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         roadmap.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || roadmap.category.toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'web development', 'data science', 'mobile development', 'devops'];

  const handleContinueLearning = (roadmapId: number) => {
    if (auth.user) {
      // Add XP for continuing learning
      updateUser({ xp: auth.user.xp + 25 });
    }
  };

  const currentRoadmap = roadmapsData.find(r => r.progress && r.progress > 0);

  // Mock roadmap steps for the current roadmap
  const roadmapSteps = [
    { id: 1, title: 'HTML Fundamentals', completed: true },
    { id: 2, title: 'CSS Basics', completed: true },
    { id: 3, title: 'JavaScript Essentials', completed: true },
    { id: 4, title: 'Responsive Design', completed: true },
    { id: 5, title: 'CSS Frameworks', completed: true },
    { id: 6, title: 'JavaScript DOM Manipulation', completed: true },
    { id: 7, title: 'ES6+ Features', completed: false, current: true },
    { id: 8, title: 'Frontend Build Tools', completed: false },
    { id: 9, title: 'React Fundamentals', completed: false },
    { id: 10, title: 'State Management', completed: false },
    { id: 11, title: 'Testing', completed: false },
    { id: 12, title: 'Deployment', completed: false },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Learning Roadmaps</h1>
          <p className="text-gray-400">Follow structured paths to master different technologies</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
          Continue Learning <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Current Progress */}
      {currentRoadmap && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Continue Your Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 font-semibold">{currentRoadmap.title}</span>
                <span className="text-purple-400 font-semibold">{currentRoadmap.progress}%</span>
              </div>
              <ProgressBar value={currentRoadmap.progress || 0} max={100} className="mb-4" />
              <p className="text-gray-400 text-sm mb-4">{currentRoadmap.description}</p>
            </div>

            {/* Progress Steps */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-green-400 mb-3 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completed
                </h3>
                {roadmapSteps.filter(step => step.completed).map((step) => (
                  <div key={step.id} className="flex items-center space-x-3 text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{step.title}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-yellow-400 mb-3 flex items-center">
                  <Circle className="h-4 w-4 mr-2" />
                  In Progress & Upcoming
                </h3>
                {roadmapSteps.filter(step => !step.completed).map((step) => (
                  <div key={step.id} className={`flex items-center space-x-3 text-sm ${
                    step.current ? 'text-white' : 'text-gray-400'
                  }`}>
                    <Circle className={`h-4 w-4 ${
                      step.current ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'
                    }`} />
                    <span className={step.current ? 'font-semibold' : ''}>{step.title}</span>
                    {step.current && (
                      <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">
                        Current
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={() => handleContinueLearning(currentRoadmap.id)}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              Continue Learning
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Benefits */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Roadmap Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 text-sm">
              <Target className="h-5 w-5 text-purple-400" />
              <span className="text-gray-300">Structured Learning</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span className="text-gray-300">Track Progress</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Trophy className="h-5 w-5 text-blue-400" />
              <span className="text-gray-300">Industry Relevance</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Brain className="h-5 w-5 text-orange-400" />
              <span className="text-gray-300">Avoid Overwhelm</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search roadmaps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'border-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Roadmaps Grid */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
        {filteredRoadmaps.map((roadmap) => {
          const isInProgress = roadmap.progress && roadmap.progress > 0;
          const progressColor = isInProgress ? 'text-orange-400' : 'text-gray-400';
          const statusBg = isInProgress ? 'bg-orange-500/20' : 'bg-gray-600';
          const statusText = isInProgress ? 'In Progress' : 'Not Started';

          return (
            <Card key={roadmap.id} className="bg-gray-800 border-gray-700 hover:border-purple-500/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    roadmap.difficulty === 'beginner' ? 'bg-green-500/20' :
                    roadmap.difficulty === 'intermediate' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                  }`}>
                    <span className={`text-xl ${
                      roadmap.difficulty === 'beginner' ? 'text-green-400' :
                      roadmap.difficulty === 'intermediate' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {roadmap.category === 'Web Development' ? '🌐' :
                       roadmap.category === 'Data Science' ? '📊' :
                       roadmap.category === 'Mobile Development' ? '📱' : '⚙️'}
                    </span>
                  </div>
                  <span className={`${statusBg} ${progressColor} px-3 py-1 rounded-full text-sm font-medium`}>
                    {statusText}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2">{roadmap.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{roadmap.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>{roadmap.totalModules} modules</span>
                  <span className="capitalize">{roadmap.difficulty}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>{roadmap.estimatedDuration}</span>
                  <span>{roadmap.progress || 0}% complete</span>
                </div>
                
                <ProgressBar 
                  value={roadmap.progress || 0} 
                  max={100} 
                  className="mb-4"
                  color={isInProgress ? 'warning' : 'primary'}
                />
                
                <Button 
                  onClick={() => handleContinueLearning(roadmap.id)}
                  className={`w-full ${
                    isInProgress 
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  {isInProgress ? 'Continue' : 'Start Learning'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRoadmaps.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No roadmaps found</h3>
            <p className="text-gray-400">Try adjusting your search terms or filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
