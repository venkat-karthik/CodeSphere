import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getResources } from '@/lib/storage';
import { Resource } from '@/types';
import { Search, Filter, Download, FileText, Calendar, Users } from 'lucide-react';

export function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    const allResources = getResources();
    setResources(allResources);
    setFilteredResources(allResources);
  }, []);

  useEffect(() => {
    let filtered = resources;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // Sort resources
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime());
        break;
      case 'downloads':
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredResources(filtered);
  }, [resources, searchTerm, selectedCategory, sortBy]);

  const categories = ['all', ...Array.from(new Set(resources.map(r => r.category)))];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      javascript: 'bg-yellow-500/20 text-yellow-400',
      react: 'bg-blue-500/20 text-blue-400',
      css: 'bg-purple-500/20 text-purple-400',
      html: 'bg-orange-500/20 text-orange-400',
      nodejs: 'bg-green-500/20 text-green-400',
      typescript: 'bg-blue-600/20 text-blue-300',
      python: 'bg-green-600/20 text-green-300',
    };
    return colors[category as keyof typeof colors] || 'bg-slate-500/20 text-slate-400';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">PDF Resources</h1>
          <p className="text-slate-400">Browse and download educational documents</p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700">
          Upload PDF <FileText className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search PDFs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-700 text-white placeholder-slate-400"
          />
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 bg-slate-900 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="downloads">Most Downloaded</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-slate-700 text-slate-400 hover:bg-slate-800">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 overflow-x-auto">
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
            {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="bg-slate-900 border-slate-700 hover:border-violet-600/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-red-400" />
                </div>
                <Badge className={getCategoryColor(resource.category)}>
                  {resource.category}
                </Badge>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">{resource.title}</h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">{resource.description}</p>
              
              <div className="flex gap-2 mb-4">
                <Badge className={getDifficultyColor(resource.difficulty)}>
                  {resource.difficulty}
                </Badge>
                {resource.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="border-slate-600 text-slate-400">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-between items-center text-sm text-slate-400 mb-4">
                <span>{resource.pages} pages • {resource.fileSize}</span>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{resource.downloads.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>Added {formatDate(resource.uploadDate)}</span>
                </div>
              </div>
              
              <Button className="w-full bg-violet-600 hover:bg-violet-700">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No resources found</h3>
            <p className="text-slate-400">Try adjusting your search terms or filters</p>
          </CardContent>
        </Card>
      )}

      {/* Load More */}
      {filteredResources.length > 0 && (
        <div className="text-center">
          <Button variant="outline" className="border-slate-700 text-slate-400 hover:bg-slate-800">
            Load More Resources
          </Button>
        </div>
      )}
    </div>
  );
}
