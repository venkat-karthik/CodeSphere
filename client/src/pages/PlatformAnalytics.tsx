import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign,
  ShoppingCart,
  Activity,
  Download,
  Calendar,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  User,
  CircleDollarSign,
  Loader2
} from 'lucide-react';
import {
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Student } from '@/types';
import api from '@/lib/api';

const revenueData = [
  { month: 'Jan', revenue: 4000, expenses: 2400 },
  { month: 'Feb', revenue: 3000, expenses: 1398 },
  { month: 'Mar', revenue: 5000, expenses: 6800 },
  { month: 'Apr', revenue: 4780, expenses: 3908 },
  { month: 'May', revenue: 6890, expenses: 4800 },
  { month: 'Jun', revenue: 7390, expenses: 3800 },
];

const subscriptionData = [
    { name: 'Jan', Pro: 400, Premium: 240 },
    { name: 'Feb', Pro: 300, Premium: 139 },
    { name: 'Mar', Pro: 200, Premium: 480 },
    { name: 'Apr', Pro: 278, Premium: 390 },
    { name: 'May', Pro: 189, Premium: 480 },
    { name: 'Jun', Pro: 239, Premium: 380 },
];

const kpiData = {
    mrr: { value: 7390, change: 12.5, period: "last month" },
    activeSubscriptions: { value: 619, change: 5.2, period: "last month" },
    arpu: { value: 11.94, change: 2.1, period: "last month" },
    churnRate: { value: 2.3, change: -0.5, period: "last month" },
    ltv: { value: 245, change: 15, period: "last year" },
    cac: { value: 42, change: 3, period: "last month" },
}

export function PlatformAnalytics() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for API-driven data
  const [students, setStudents] = useState<Student[]>([]);
  const [analyticsData, setAnalyticsData] = useState({
    revenueData: [],
    subscriptionData: [],
    kpiData: {
        mrr: { value: 0, change: 0 },
        activeSubscriptions: { value: 0, change: 0 },
        arpu: { value: 0, change: 0 },
        churnRate: { value: 0, change: 0 },
        ltv: { value: 0, change: 0 },
        cac: { value: 0, change: 0 },
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '' });
  const [addError, setAddError] = useState('');
  const [grantCoinsModalOpen, setGrantCoinsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [coinsToGrant, setCoinsToGrant] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsRes, analyticsRes] = await Promise.all([
          api.get('/admin/students'),
          api.get('/admin/analytics')
        ]);
        setStudents(studentsRes.data);
        setAnalyticsData(analyticsRes.data);
      } catch (err) {
        setError('Failed to load platform data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getSubscriptionColor = (type: string) => {
    switch (type) {
      case 'pro': return 'bg-purple-500/20 text-purple-400';
      case 'premium': return 'bg-gold-500/20 text-yellow-400';
      case 'free': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleAddStudent = async () => {
    if (!newStudent.name.trim() || !newStudent.email.trim()) {
      setAddError('Name and email are required.');
      return;
    }
    try {
      const res = await api.post('/admin/students', newStudent);
      setStudents(prev => [...prev, res.data]);
      setNewStudent({ name: '', email: '' });
      setAddError('');
      setAddModalOpen(false);
    } catch (err) {
      setAddError('Failed to add student. Please try again.');
      console.error(err);
    }
  };

  const handleOpenGrantCoinsModal = (student: Student) => {
    setSelectedStudent(student);
    setGrantCoinsModalOpen(true);
    setCoinsToGrant(0);
  };

  const handleGrantCoins = async () => {
    if (!selectedStudent || coinsToGrant <= 0) {
      return;
    }
    try {
      const res = await api.post(`/admin/students/${selectedStudent.id}/grant-coins`, {
        amount: coinsToGrant
      });
      const updatedStudent = res.data;
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student.id === updatedStudent.id ? updatedStudent : student
        )
      );
      alert(`Successfully granted ${coinsToGrant} CodeCoins to ${selectedStudent.name}!`);
      setGrantCoinsModalOpen(false);
      setSelectedStudent(null);
    } catch(err) {
      alert(`Failed to grant coins to ${selectedStudent.name}.`);
      console.error(err);
    }
  };

  const renderTrend = (change: number) => {
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
        {Math.abs(change)}% vs last month
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage your platform, users, and analyze performance.
          </p>
        </div>
        <div className="flex items-center space-x-2">
            <Button>
                <Download className="mr-2 h-4 w-4" />
                Export Report
            </Button>
             <Button onClick={() => setAddModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Student
            </Button>
        </div>
      </div>

      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                type="email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            {addError && <div className="text-red-500 text-sm col-span-4 text-center">{addError}</div>}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddStudent}>Add Student</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={grantCoinsModalOpen} onOpenChange={setGrantCoinsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Grant CodeCoins</DialogTitle>
            <DialogDescription>
              Award CodeCoins to {selectedStudent?.name} for exceptional performance.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="coins" className="text-right">
                Amount
              </Label>
              <Input
                id="coins"
                type="number"
                value={coinsToGrant}
                onChange={(e) => setCoinsToGrant(Number(e.target.value))}
                className="col-span-3"
                placeholder="e.g., 100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGrantCoinsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleGrantCoins}>Grant Coins</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Financial Overview</TabsTrigger>
            <TabsTrigger value="students">Student Management</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${analyticsData.kpiData.mrr.value.toLocaleString()}</div>
                        {renderTrend(analyticsData.kpiData.mrr.change)}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analyticsData.kpiData.activeSubscriptions.value}</div>
                        {renderTrend(analyticsData.kpiData.activeSubscriptions.change)}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Average Revenue Per User</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${analyticsData.kpiData.arpu.value.toFixed(2)}</div>
                        {renderTrend(analyticsData.kpiData.arpu.change)}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analyticsData.kpiData.churnRate.value}%</div>
                        {renderTrend(analyticsData.kpiData.churnRate.change)}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Customer Lifetime Value (LTV)</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${analyticsData.kpiData.ltv.value}</div>
                        {renderTrend(analyticsData.kpiData.ltv.change)}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Customer Acquisition Cost (CAC)</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${analyticsData.kpiData.cac.value}</div>
                        {renderTrend(analyticsData.kpiData.cac.change)}
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6 mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue vs. Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analyticsData.revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Subscriptions Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analyticsData.subscriptionData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Pro" stroke="#8884d8" />
                                <Line type="monotone" dataKey="Premium" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
        <TabsContent value="students" className="mt-6">
            <Card>
                <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                    <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                    </Button>
                </div>
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardHeader>
                <CardTitle>Student List ({filteredStudents.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredStudents.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">{student.name}</h3>
                                <p className="text-sm text-muted-foreground">{student.email}</p>
                            </div>
                            </div>
                            
                            <div className="flex items-center space-x-6">
                            <div className="text-center">
                                <p className="text-sm font-semibold">Level {student.level}</p>
                                <p className="text-xs text-muted-foreground">{student.xp} XP</p>
                            </div>
                            
                            <div className="text-center">
                                <p className="text-sm font-semibold">{student.codeCoins}</p>
                                <p className="text-xs text-muted-foreground">Coins</p>
                            </div>
                            
                            <div className="text-center">
                                <p className="text-sm font-semibold">{student.problemsSolved}</p>
                                <p className="text-xs text-muted-foreground">Problems</p>
                            </div>
                            
                            <div className="text-center">
                                <p className="text-sm font-semibold">{formatStudyTime(student.totalStudyTime)}</p>
                                <p className="text-xs text-muted-foreground">Study Time</p>
                            </div>
                            
                            <Badge className={getSubscriptionColor(student.subscriptionType)}>
                                {student.subscriptionType}
                            </Badge>
                            
                            <div className="flex space-x-2">
                                <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-yellow-500 hover:text-yellow-600" onClick={() => handleOpenGrantCoinsModal(student)}>
                                <CircleDollarSign className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive/80">
                                <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 