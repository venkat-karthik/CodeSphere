import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserRole } from '@/contexts/UserRoleContext';
import { LiveClass, VideoCallState } from '../types';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar, Clock, Users, Video, Mic, MicOff, VideoOff, Share, MessageSquare, Settings, Plus, Play, StopCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { VideoCall } from './VideoCall';

export function LiveClasses() {
  const { user, isAuthenticated } = useAuth();
  const { isAdmin, isStudent } = useUserRole();
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<LiveClass | null>(null);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreating, setIsCreating] = useState(false);

  const [newClass, setNewClass] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    maxParticipants: 50,
    tags: ''
  });

  useEffect(() => {
    fetchLiveClasses();
  }, []);

  const fetchLiveClasses = async () => {
    try {
      const response = await fetch('/api/live-classes');
      const data = await response.json();
      setLiveClasses(data);
    } catch (error) {
      console.error('Failed to fetch live classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createLiveClass = async () => {
    // Form validation
    if (!newClass.title.trim()) {
      alert('Please enter a class title');
      return;
    }
    if (!newClass.description.trim()) {
      alert('Please enter a class description');
      return;
    }
    if (!newClass.startTime) {
      alert('Please select a start time');
      return;
    }
    if (!newClass.endTime) {
      alert('Please select an end time');
      return;
    }
    if (new Date(newClass.startTime) >= new Date(newClass.endTime)) {
      alert('End time must be after start time');
      return;
    }
    if (new Date(newClass.startTime) <= new Date()) {
      alert('Start time must be in the future');
      return;
    }
    if (!user?.id) {
      alert('User not authenticated');
      return;
    }

    setIsCreating(true);

    try {
      console.log('Creating live class with data:', {
        ...newClass,
        instructorId: user.id,
        instructorName: `${user.firstName} ${user.lastName}`,
        tags: newClass.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      });

      const response = await fetch('/api/live-classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newClass,
          instructorId: user.id,
          instructorName: `${user.firstName} ${user.lastName}`,
          tags: newClass.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        }),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const createdClass = await response.json();
        console.log('Created class:', createdClass);
        setLiveClasses(prev => [...prev, createdClass]);
        setIsCreateDialogOpen(false);
        setNewClass({
          title: '',
          description: '',
          startTime: '',
          endTime: '',
          maxParticipants: 50,
          tags: ''
        });
        alert('Live class created successfully!');
      } else {
        const errorData = await response.text();
        console.error('Server error:', errorData);
        alert(`Failed to create live class: ${errorData}`);
      }
    } catch (error) {
      console.error('Failed to create live class:', error);
      alert('Failed to create live class. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const joinLiveClass = async (liveClass: LiveClass) => {
    try {
      const response = await fetch(`/api/live-classes/${liveClass.id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          userName: `${user?.firstName} ${user?.lastName}`,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setSelectedClass(liveClass);
        setIsVideoCallOpen(true);
      }
    } catch (error) {
      console.error('Failed to join live class:', error);
    }
  };

  const startLiveClass = async (liveClass: LiveClass) => {
    try {
      await fetch(`/api/live-classes/${liveClass.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'live' }),
      });
      
      setLiveClasses(prev => 
        prev.map(cls => 
          cls.id === liveClass.id ? { ...cls, status: 'live' as const } : cls
        )
      );
    } catch (error) {
      console.error('Failed to start live class:', error);
    }
  };

  const endLiveClass = async (liveClass: LiveClass) => {
    try {
      await fetch(`/api/live-classes/${liveClass.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'ended' }),
      });
      
      setLiveClasses(prev => 
        prev.map(cls => 
          cls.id === liveClass.id ? { ...cls, status: 'ended' as const } : cls
        )
      );
    } catch (error) {
      console.error('Failed to end live class:', error);
    }
  };

  const deleteLiveClass = async (liveClass: LiveClass) => {
    try {
      await fetch(`/api/live-classes/${liveClass.id}`, {
        method: 'DELETE',
      });
      
      setLiveClasses(prev => prev.filter(cls => cls.id !== liveClass.id));
    } catch (error) {
      console.error('Failed to delete live class:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" />Scheduled</Badge>;
      case 'live':
        return <Badge variant="destructive" className="flex items-center gap-1 animate-pulse"><CheckCircle className="h-3 w-3" />Live</Badge>;
      case 'ended':
        return <Badge variant="outline" className="flex items-center gap-1"><AlertCircle className="h-3 w-3" />Ended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const isInstructor = (liveClass: LiveClass) => {
    return user?.id === liveClass.instructorId;
  };

  const canJoin = (liveClass: LiveClass) => {
    return liveClass.status === 'live' && !isInstructor(liveClass);
  };

  const filteredClasses = liveClasses.filter(liveClass => {
    const matchesSearch = liveClass.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         liveClass.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         liveClass.instructorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || liveClass.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Live Classes</h1>
          <p className="text-lg text-muted-foreground">
            {isAdmin 
              ? 'Create and manage live video sessions for your students.'
              : 'Join live video sessions with instructors and fellow students.'
            }
          </p>
        </div>
        
        {/* Only show create button for admins */}
        {isAuthenticated && isAdmin && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Live Class
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Live Class</DialogTitle>
                <DialogDescription>
                  Schedule a new live video session for your students.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newClass.title}
                    onChange={(e) => setNewClass(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter class title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newClass.description}
                    onChange={(e) => setNewClass(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter class description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={newClass.startTime}
                      onChange={(e) => setNewClass(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="datetime-local"
                      value={newClass.endTime}
                      onChange={(e) => setNewClass(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={newClass.maxParticipants}
                    onChange={(e) => setNewClass(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                    min="1"
                    max="100"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={newClass.tags}
                    onChange={(e) => setNewClass(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g., JavaScript, React, Beginner"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isCreating}>
                  Cancel
                </Button>
                <Button onClick={createLiveClass} disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Class'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 items-end">
        <Input
          placeholder="Search by title, description, or instructor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:col-span-2"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="ended">Ended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <h2 className="text-2xl font-bold mb-4">
        {isAdmin ? 'Manage Live Sessions' : 'Available Classes'}
      </h2>

      {/* Live Classes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredClasses.map((liveClass) => (
          <Card key={liveClass.id} className="relative border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200 rounded-lg">
            <CardHeader className="pb-4 px-6 pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <CardTitle className="text-xl font-semibold mb-2 leading-tight">{liveClass.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                    {liveClass.description}
                  </CardDescription>
                </div>
                {getStatusBadge(liveClass.status)}
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span>
                    {new Date(liveClass.startTime).toLocaleDateString()} at {new Date(liveClass.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span>Duration: {((new Date(liveClass.endTime).getTime() - new Date(liveClass.startTime).getTime()) / (1000 * 60)).toFixed(0)} minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 flex-shrink-0" />
                  <span>{liveClass.currentParticipants}/{liveClass.maxParticipants} participants</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Instructor: <span className="font-medium text-foreground">{liveClass.instructorName}</span></span>
                </div>
              </div>
              
              {liveClass.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {liveClass.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5 rounded-full">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border mt-4 w-full">
                {/* Admin/Instructor Controls */}
                {isAdmin && isInstructor(liveClass) ? (
                  <>
                    {liveClass.status === 'scheduled' && (
                      <Button 
                        size="sm" 
                        onClick={() => startLiveClass(liveClass)}
                        className="flex-1 w-full"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    )}
                    {liveClass.status === 'live' && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => endLiveClass(liveClass)}
                        className="flex-1 w-full"
                      >
                        <StopCircle className="h-4 w-4 mr-1" />
                        End
                      </Button>
                    )}
                    {liveClass.status === 'live' && (
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setSelectedClass(liveClass);
                          setIsVideoCallOpen(true);
                        }}
                        className="w-full sm:w-auto"
                      >
                        <Video className="h-4 w-4" />
                      </Button>
                    )}
                    {liveClass.status === 'scheduled' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteLiveClass(liveClass)}
                        className="flex-1 w-full"
                      >
                        Delete
                      </Button>
                    )}
                  </>
                ) : (
                  /* Student/Viewer Controls */
                  <>
                    {canJoin(liveClass) && (
                      <Button 
                        size="sm" 
                        onClick={() => joinLiveClass(liveClass)}
                        className="flex-1 w-full"
                      >
                        <Video className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                    )}
                    {liveClass.status === 'scheduled' && (
                      <Button size="sm" variant="outline" disabled className="flex-1 w-full">
                        Not Started
                      </Button>
                    )}
                    {liveClass.status === 'ended' && (
                      <Button size="sm" variant="outline" disabled className="flex-1 w-full">
                        Ended
                      </Button>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Live Classes Available</h3>
          <p className="text-muted-foreground">
            {isAdmin 
              ? 'Create your first live class to start teaching!'
              : 'Check back later for upcoming live classes.'
            }
          </p>
        </div>
      )}

      {isVideoCallOpen && selectedClass && (
        <VideoCall
          roomId={selectedClass.roomId}
          isHost={isAdmin && isInstructor(selectedClass)}
          onClose={() => {
            setIsVideoCallOpen(false);
            setSelectedClass(null);
          }}
        />
      )}
    </div>
  );
} 