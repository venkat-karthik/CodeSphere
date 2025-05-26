import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/contexts/UserRoleContext';
import { 
  FileText, 
  Download, 
  Search, 
  Filter,
  Upload,
  Plus,
  X,
  File,
  Calendar,
  Eye,
  Star,
  Clock
} from 'lucide-react';
import { storage } from '../lib/storage';

export function Resources() {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newPdf, setNewPdf] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    tags: ''
  });
  
  const [pdfs, setPdfs] = useState(storage.getPDFs());
  
  const categories = [
    { id: 'all', label: 'All', count: pdfs.length },
    { id: 'javascript', label: 'JavaScript', count: pdfs.filter(p => p.category === 'javascript').length },
    { id: 'react', label: 'React', count: pdfs.filter(p => p.category === 'react').length },
    { id: 'nodejs', label: 'Node.js', count: pdfs.filter(p => p.category === 'nodejs').length },
    { id: 'css', label: 'CSS', count: pdfs.filter(p => p.category === 'css').length },
    { id: 'html', label: 'HTML', count: pdfs.filter(p => p.category === 'html').length },
    { id: 'typescript', label: 'TypeScript', count: pdfs.filter(p => p.category === 'typescript').length },
    { id: 'python', label: 'Python', count: pdfs.filter(p => p.category === 'python').length }
  ];

  const filteredPDFs = pdfs.filter(pdf => {
    const matchesSearch = pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pdf.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pdf.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      javascript: 'bg-yellow-500/20 text-yellow-400',
      react: 'bg-blue-500/20 text-blue-400',
      nodejs: 'bg-green-500/20 text-green-400',
      css: 'bg-purple-500/20 text-purple-400',
      html: 'bg-orange-500/20 text-orange-400',
      typescript: 'bg-blue-600/20 text-blue-300',
      python: 'bg-green-600/20 text-green-300'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">PDF Resources</h1>
          <p className="text-muted-foreground">
            Browse and download educational documents
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowUploadModal(true)} className="bg-primary hover:bg-primary/90">
            <Upload className="mr-2 h-4 w-4" />
            Upload PDF
          </Button>
        )}
      </div>

      {/* Admin Upload Modal */}
      {isAdmin && showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Upload New PDF</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploadModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newPdf.title}
                  onChange={(e) => setNewPdf(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter PDF title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newPdf.description}
                  onChange={(e) => setNewPdf(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter PDF description"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={newPdf.category} onValueChange={(value) => setNewPdf(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="nodejs">Node.js</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Difficulty</label>
                <Select value={newPdf.difficulty} onValueChange={(value: any) => setNewPdf(prev => ({ ...prev, difficulty: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Tags (comma-separated)</label>
                <Input
                  value={newPdf.tags}
                  onChange={(e) => setNewPdf(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="fundamentals, guide, reference"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={() => fileInputRef.current?.click()} className="flex-1" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <File className="h-4 w-4 mr-2" />
                      Select PDF File
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && file.type === 'application/pdf') {
            setIsUploading(true);
            setTimeout(() => {
              const newPdfData = {
                id: Date.now(),
                title: newPdf.title || file.name.replace(/\.[^/.]+$/, ""),
                description: newPdf.description,
                category: newPdf.category || 'javascript',
                difficulty: newPdf.difficulty,
                downloadCount: 0,
                uploadDate: new Date().toISOString(),
                size: '2.4 MB',
                pages: 45
              };
              
              setPdfs(prev => [newPdfData, ...prev]);
              setIsUploading(false);
              setShowUploadModal(false);
              setNewPdf({ title: '', description: '', category: '', difficulty: 'beginner', tags: '' });
            }, 2000);
          }
        }}
        accept=".pdf"
        className="hidden"
      />

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Input
                placeholder="Search PDFs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex gap-2">
              <select 
                className="bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="downloads">Most Downloaded</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                {category.label}
                {category.count > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PDF Grid */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
        {filteredPDFs.map((pdf) => (
          <Card key={pdf.id} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-red-500" />
                </div>
                <Badge className={getCategoryColor(pdf.category)}>
                  {pdf.category}
                </Badge>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{pdf.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {pdf.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={getDifficultyColor(pdf.difficulty)}>
                  {pdf.difficulty}
                </Badge>
                {pdf.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                <span>{pdf.pages} pages • {pdf.size}</span>
                <span>{pdf.downloads.toLocaleString()} downloads</span>
              </div>
              
              <div className="text-xs text-muted-foreground mb-4">
                Added {formatDate(pdf.uploadDate)}
              </div>
              
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {filteredPDFs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No PDFs Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or selected category.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center">
          <Button variant="outline">
            Load More PDFs
          </Button>
        </div>
      )}
    </div>
  );
}
