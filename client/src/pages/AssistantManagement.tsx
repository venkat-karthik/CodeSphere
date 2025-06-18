import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Activity, 
  Users, 
  MessageSquare, 
  Zap,
  Brain,
  Shield,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  X
} from 'lucide-react';

interface Assistant {
  id: string;
  name: string;
  description: string;
  type: 'mentor' | 'tutor' | 'helper' | 'reviewer';
  status: 'active' | 'inactive' | 'maintenance';
  model: string;
  capabilities: string[];
  responseTime: number;
  accuracy: number;
  totalInteractions: number;
  activeUsers: number;
  lastUpdated: Date;
  isEnabled: boolean;
}

interface AssistantMetrics {
  totalAssistants: number;
  activeAssistants: number;
  totalInteractions: number;
  averageResponseTime: number;
  userSatisfaction: number;
  uptime: number;
}

export function AssistantManagement() {
  const [assistants, setAssistants] = useState<Assistant[]>([
    {
      id: '1',
      name: 'Code Mentor AI',
      description: 'Advanced AI mentor for programming guidance and code review',
      type: 'mentor',
      status: 'active',
      model: 'GPT-4',
      capabilities: ['Code Review', 'Debugging', 'Best Practices', 'Architecture'],
      responseTime: 1.2,
      accuracy: 94.5,
      totalInteractions: 15420,
      activeUsers: 892,
      lastUpdated: new Date('2024-01-20'),
      isEnabled: true
    },
    {
      id: '2',
      name: 'Problem Solver',
      description: 'Specialized assistant for algorithm and problem-solving help',
      type: 'tutor',
      status: 'active',
      model: 'Claude-3',
      capabilities: ['Algorithm Design', 'Problem Analysis', 'Step-by-step Solutions'],
      responseTime: 0.8,
      accuracy: 96.2,
      totalInteractions: 8920,
      activeUsers: 456,
      lastUpdated: new Date('2024-01-21'),
      isEnabled: true
    },
    {
      id: '3',
      name: 'Learning Helper',
      description: 'General learning assistant for course materials and concepts',
      type: 'helper',
      status: 'maintenance',
      model: 'GPT-3.5',
      capabilities: ['Concept Explanation', 'Study Tips', 'Resource Recommendations'],
      responseTime: 2.1,
      accuracy: 88.7,
      totalInteractions: 2340,
      activeUsers: 123,
      lastUpdated: new Date('2024-01-19'),
      isEnabled: false
    }
  ]);

  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Create Assistant Form State
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    type: 'mentor' as 'mentor' | 'tutor' | 'helper' | 'reviewer',
    model: 'GPT-4',
    capabilities: [''],
    responseTime: 1.0,
    accuracy: 90.0,
    isEnabled: true,
    status: 'active' as 'active' | 'inactive' | 'maintenance'
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const metrics: AssistantMetrics = {
    totalAssistants: assistants.length,
    activeAssistants: assistants.filter(a => a.status === 'active').length,
    totalInteractions: assistants.reduce((sum, a) => sum + a.totalInteractions, 0),
    averageResponseTime: assistants.reduce((sum, a) => sum + a.responseTime, 0) / assistants.length,
    userSatisfaction: 4.6,
    uptime: 99.8
  };

  const filteredAssistants = assistants.filter(assistant => {
    const matchesSearch = assistant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assistant.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || assistant.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-600';
      case 'inactive': return 'bg-gray-500/20 text-gray-600';
      case 'maintenance': return 'bg-yellow-500/20 text-yellow-600';
      default: return 'bg-gray-500/20 text-gray-600';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mentor': return 'bg-blue-500/20 text-blue-600';
      case 'tutor': return 'bg-purple-500/20 text-purple-600';
      case 'helper': return 'bg-green-500/20 text-green-600';
      case 'reviewer': return 'bg-orange-500/20 text-orange-600';
      default: return 'bg-gray-500/20 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'inactive': return <XCircle className="h-4 w-4" />;
      case 'maintenance': return <AlertCircle className="h-4 w-4" />;
      default: return <XCircle className="h-4 w-4" />;
    }
  };

  const handleToggleAssistant = (assistantId: string) => {
    setAssistants(prev => 
      prev.map(a => 
        a.id === assistantId ? { ...a, isEnabled: !a.isEnabled } : a
      )
    );
  };

  const handleEditAssistant = (assistant: Assistant) => {
    setSelectedAssistant(assistant);
    setIsEditDialogOpen(true);
  };

  const handleDeleteAssistant = (assistantId: string) => {
    if (confirm('Are you sure you want to delete this assistant?')) {
      setAssistants(prev => prev.filter(a => a.id !== assistantId));
    }
  };

  // Create Assistant Functions
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!createForm.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!createForm.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (createForm.capabilities.length === 0 || createForm.capabilities.some(cap => !cap.trim())) {
      errors.capabilities = 'At least one capability is required';
    }
    
    if (createForm.responseTime <= 0) {
      errors.responseTime = 'Response time must be greater than 0';
    }
    
    if (createForm.accuracy < 0 || createForm.accuracy > 100) {
      errors.accuracy = 'Accuracy must be between 0 and 100';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateAssistant = () => {
    if (!validateForm()) return;

    const newAssistant: Assistant = {
      id: Date.now().toString(),
      name: createForm.name,
      description: createForm.description,
      type: createForm.type,
      status: createForm.status,
      model: createForm.model,
      capabilities: createForm.capabilities.filter(cap => cap.trim()),
      responseTime: createForm.responseTime,
      accuracy: createForm.accuracy,
      totalInteractions: 0,
      activeUsers: 0,
      lastUpdated: new Date(),
      isEnabled: createForm.isEnabled
    };

    setAssistants(prev => [...prev, newAssistant]);
    
    // Reset form
    setCreateForm({
      name: '',
      description: '',
      type: 'mentor',
      model: 'GPT-4',
      capabilities: [''],
      responseTime: 1.0,
      accuracy: 90.0,
      isEnabled: true,
      status: 'active'
    });
    
    setFormErrors({});
    setIsCreateDialogOpen(false);
  };

  const addCapability = () => {
    setCreateForm(prev => ({
      ...prev,
      capabilities: [...prev.capabilities, '']
    }));
  };

  const removeCapability = (index: number) => {
    setCreateForm(prev => ({
      ...prev,
      capabilities: prev.capabilities.filter((_, i) => i !== index)
    }));
  };

  const updateCapability = (index: number, value: string) => {
    setCreateForm(prev => ({
      ...prev,
      capabilities: prev.capabilities.map((cap, i) => i === index ? value : cap)
    }));
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Assistant Management</h1>
          <p className="text-muted-foreground">
            Manage AI assistants and monitor their performance
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Assistant
        </Button>
      </div>

      {/* Metrics Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Assistants</p>
                <p className="text-3xl font-bold">{metrics.totalAssistants}</p>
              </div>
              <Bot className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-green-500 mt-2">+2 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Assistants</p>
                <p className="text-3xl font-bold">{metrics.activeAssistants}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-green-500 mt-2">All systems operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Interactions</p>
                <p className="text-3xl font-bold">{metrics.totalInteractions.toLocaleString()}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-green-500 mt-2">+15% this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                <p className="text-3xl font-bold">{metrics.averageResponseTime.toFixed(1)}s</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-xs text-green-500 mt-2">-0.3s improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">User Satisfaction</p>
                <p className="text-3xl font-bold">{metrics.userSatisfaction}/5</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-xs text-green-500 mt-2">+0.2 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Uptime</p>
                <p className="text-3xl font-bold">{metrics.uptime}%</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-green-500 mt-2">Excellent performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assistants">Assistants</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <CardContent className="p-6 text-center">
                <Plus className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Add Assistant</h3>
                <p className="text-sm text-muted-foreground">Create new AI assistant</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-6 text-center">
                <Settings className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Configure</h3>
                <p className="text-sm text-muted-foreground">Adjust settings</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-6 text-center">
                <Activity className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Monitor</h3>
                <p className="text-sm text-muted-foreground">View performance</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-6 text-center">
                <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Optimize</h3>
                <p className="text-sm text-muted-foreground">Improve performance</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assistants.slice(0, 3).map((assistant) => (
                  <div key={assistant.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{assistant.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {assistant.totalInteractions.toLocaleString()} interactions today
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(assistant.status)}>
                        {getStatusIcon(assistant.status)}
                        <span className="ml-1">{assistant.status}</span>
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assistants" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search assistants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="all">All Types</option>
                  <option value="mentor">Mentor</option>
                  <option value="tutor">Tutor</option>
                  <option value="helper">Helper</option>
                  <option value="reviewer">Reviewer</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Assistants List */}
          <div className="grid gap-6">
            {filteredAssistants.map((assistant) => (
              <Card key={assistant.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <Bot className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-lg">{assistant.name}</h3>
                          <Badge className={getTypeColor(assistant.type)}>
                            {assistant.type}
                          </Badge>
                          <Badge className={getStatusColor(assistant.status)}>
                            {getStatusIcon(assistant.status)}
                            <span className="ml-1">{assistant.status}</span>
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{assistant.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span>Model: {assistant.model}</span>
                          <span>Accuracy: {assistant.accuracy}%</span>
                          <span>Response: {assistant.responseTime}s</span>
                          <span>Users: {assistant.activeUsers}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={assistant.isEnabled}
                        onCheckedChange={() => handleToggleAssistant(assistant.id)}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditAssistant(assistant)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteAssistant(assistant.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assistants.map((assistant) => (
                    <div key={assistant.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{assistant.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {assistant.accuracy}% accuracy
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${assistant.accuracy}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assistants.map((assistant) => (
                    <div key={assistant.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-medium">{assistant.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {assistant.totalInteractions.toLocaleString()} total interactions
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{assistant.activeUsers}</p>
                        <p className="text-xs text-muted-foreground">active users</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Response Settings</h4>
                  <div className="space-y-2">
                    <Label>Default Response Timeout (seconds)</Label>
                    <Input type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Response Length</Label>
                    <Input type="number" defaultValue="1000" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Performance Settings</h4>
                  <div className="space-y-2">
                    <Label>Concurrent Requests Limit</Label>
                    <Input type="number" defaultValue="100" />
                  </div>
                  <div className="space-y-2">
                    <Label>Cache Duration (minutes)</Label>
                    <Input type="number" defaultValue="60" />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Assistant Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Assistant</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Basic Information</h4>
              
              <div>
                <Label htmlFor="create-name">Assistant Name *</Label>
                <Input 
                  id="create-name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter assistant name"
                />
                {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <Label htmlFor="create-description">Description *</Label>
                <Textarea 
                  id="create-description"
                  value={createForm.description}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this assistant does"
                  rows={3}
                />
                {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="create-type">Type *</Label>
                  <select 
                    id="create-type"
                    value={createForm.type}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="mentor">Mentor</option>
                    <option value="tutor">Tutor</option>
                    <option value="helper">Helper</option>
                    <option value="reviewer">Reviewer</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="create-model">AI Model *</Label>
                  <select 
                    id="create-model"
                    value={createForm.model}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="GPT-4">GPT-4</option>
                    <option value="GPT-3.5">GPT-3.5</option>
                    <option value="Claude-3">Claude-3</option>
                    <option value="Claude-2">Claude-2</option>
                    <option value="Custom">Custom Model</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg">Capabilities *</h4>
                <Button type="button" variant="outline" size="sm" onClick={addCapability}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Capability
                </Button>
              </div>
              
              <div className="space-y-3">
                {createForm.capabilities.map((capability, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={capability}
                      onChange={(e) => updateCapability(index, e.target.value)}
                      placeholder="Enter capability (e.g., Code Review, Debugging)"
                      className="flex-1"
                    />
                    {createForm.capabilities.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCapability(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {formErrors.capabilities && <p className="text-red-500 text-sm">{formErrors.capabilities}</p>}
            </div>

            {/* Performance Settings */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Performance Settings</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="create-response-time">Response Time (seconds) *</Label>
                  <Input 
                    id="create-response-time"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={createForm.responseTime}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, responseTime: parseFloat(e.target.value) || 0 }))}
                  />
                  {formErrors.responseTime && <p className="text-red-500 text-sm mt-1">{formErrors.responseTime}</p>}
                </div>

                <div>
                  <Label htmlFor="create-accuracy">Accuracy (%) *</Label>
                  <Input 
                    id="create-accuracy"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={createForm.accuracy}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, accuracy: parseFloat(e.target.value) || 0 }))}
                  />
                  {formErrors.accuracy && <p className="text-red-500 text-sm mt-1">{formErrors.accuracy}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="create-status">Initial Status</Label>
                  <select 
                    id="create-status"
                    value={createForm.status}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="create-enabled"
                    checked={createForm.isEnabled}
                    onCheckedChange={(checked) => setCreateForm(prev => ({ ...prev, isEnabled: checked }))}
                  />
                  <Label htmlFor="create-enabled">Enable Assistant</Label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAssistant}>
                <Plus className="mr-2 h-4 w-4" />
                Create Assistant
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Assistant Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Assistant</DialogTitle>
          </DialogHeader>
          {selectedAssistant && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={selectedAssistant.name} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" defaultValue={selectedAssistant.description} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" defaultValue={selectedAssistant.model} />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select 
                    id="type" 
                    defaultValue={selectedAssistant.type}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="mentor">Mentor</option>
                    <option value="tutor">Tutor</option>
                    <option value="helper">Helper</option>
                    <option value="reviewer">Reviewer</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 