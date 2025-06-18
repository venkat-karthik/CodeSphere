import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/contexts/UserRoleContext';
import { 
  FileText, 
  Download, 
  Search, 
  Upload,
  Plus,
  File,
  Calendar,
  Eye,
  Star,
  Clock,
  Filter,
  X
} from 'lucide-react';
import { storage } from '../lib/storage';

export function Resources() {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newPdf, setNewPdf] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced'
  });
  
  const [pdfs, setPdfs] = useState(storage.getPDFs());
  
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'javascript', label: 'JavaScript' },
    { id: 'react', label: 'React' },
    { id: 'nodejs', label: 'Node.js' },
    { id: 'css', label: 'CSS' },
    { id: 'html', label: 'HTML' },
    { id: 'typescript', label: 'TypeScript' },
    { id: 'python', label: 'Python' }
  ];

  const filteredPDFs = pdfs.filter(pdf => {
    const matchesSearch = pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pdf.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pdf.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      javascript: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      react: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      nodejs: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      css: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      html: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      typescript: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      python: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
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

  const handleUpload = () => {
    if (!newPdf.title || !newPdf.category) {
      alert('Please fill in all required fields');
      return;
    }
    
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setIsUploading(true);
      setTimeout(() => {
        const newPdfData: PDFResource = {
          id: Date.now().toString(),
          title: newPdf.title,
          description: newPdf.description,
          category: newPdf.category,
          difficulty: newPdf.difficulty as 'beginner' | 'intermediate' | 'advanced',
          pages: 45,
          size: '2.4 MB',
          downloads: 0,
          uploadDate: new Date().toISOString().split('T')[0],
          tags: []
        };
        
        setPdfs(prev => [newPdfData, ...prev]);
        setIsUploading(false);
        setShowUploadModal(false);
        setNewPdf({ title: '', description: '', category: '', difficulty: 'beginner' });
        alert('PDF uploaded successfully!');
      }, 2000);
    }
  };

  const handleDownload = (pdf: PDFResource) => {
    // Simulate download
    alert(`Downloading: ${pdf.title}`);
    // In a real app, this would trigger an actual download
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
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

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search PDFs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* PDF Grid */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
        {filteredPDFs.map((pdf) => (
          <Card key={pdf.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <Badge className={getCategoryColor(pdf.category)} variant="outline">
                  {pdf.category}
                </Badge>
              </div>
              
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{pdf.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {pdf.description}
              </p>
              
              <div className="flex items-center gap-2 mb-4">
                <Badge className={getDifficultyColor(pdf.difficulty)} variant="outline">
                  {pdf.difficulty}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {pdf.pages} pages • {pdf.size}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-xs text-muted-foreground mb-4">
                <span>{pdf.downloads} downloads</span>
                <span>{formatDate(pdf.uploadDate)}</span>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => handleDownload(pdf)}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPDFs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No PDFs Found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or selected category.
            </p>
            {isAdmin && (
              <Button onClick={() => setShowUploadModal(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload First PDF
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload New PDF</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <Input
                value={newPdf.title}
                onChange={(e) => setNewPdf(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter PDF title"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newPdf.description}
                onChange={(e) => setNewPdf(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter PDF description"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Category *</label>
              <Select value={newPdf.category} onValueChange={(value) => setNewPdf(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.slice(1).map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload PDF
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf"
        className="hidden"
      />
    </div>
  );
}
