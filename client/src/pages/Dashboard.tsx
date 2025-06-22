import React from 'react';
import {
  BookOpen,
  Flame,
  Star,
  Zap,
  Award,
  Users
} from "lucide-react";
import { Leaderboard } from "@/pages/Leaderboard";
import { StudentAssignments } from "@/components/StudentAssignments";
import { Section } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DashboardProps {
  onSectionChange: (section: Section) => void;
}

const LandingPage = ({ onSectionChange }: { onSectionChange: (section: Section) => void }) => (
  <div className="bg-black text-white">
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
        Unlock Your <span className="text-blue-400">Coding Potential</span>
      </h1>
      <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
        CodeSphere is the ultimate platform for aspiring developers. Master new skills through guided roadmaps, engaging projects, and a vibrant community.
      </p>
      <div className="flex justify-center gap-4">
        <Button size="lg" onClick={() => onSectionChange('roadmaps')} className="bg-blue-600 hover:bg-blue-700 text-white">
          <BookOpen className="mr-2 h-5 w-5" />
          Explore Learning Paths
        </Button>
      </div>
    </div>
    
    <div className="bg-gray-900/50 py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-900/50 mx-auto mb-4 border-2 border-blue-700">
              <BookOpen className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Curated Learning Paths</h3>
            <p className="text-gray-400">Follow structured roadmaps designed by industry experts to take you from beginner to pro.</p>
          </div>
          <div>
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-900/50 mx-auto mb-4 border-2 border-blue-700">
              <Award className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Gamified Learning</h3>
            <p className="text-gray-400">Earn XP, maintain streaks, unlock achievements, and climb the leaderboard as you learn.</p>
          </div>
          <div>
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-900/50 mx-auto mb-4 border-2 border-blue-700">
              <Users className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
            <p className="text-gray-400">Connect with peers and learn from experts in our community channels and live classes.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

interface StudentDashboardProps {
  user: any;
  onSectionChange: (section: Section) => void;
}

const StudentDashboard = ({ user, onSectionChange }: StudentDashboardProps) => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user?.completedCourses}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">XP Level</CardTitle>
          <Flame className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user?.level}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user?.streak}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">CodeCoins</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user?.codeCoins}</div>
        </CardContent>
      </Card>
    </div>
    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
      <Leaderboard />
      <StudentAssignments onSectionChange={onSectionChange}/>
    </div>
  </div>
);

export function Dashboard({ onSectionChange }: DashboardProps) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <LandingPage onSectionChange={onSectionChange} />;
  }

  return <StudentDashboard user={user} onSectionChange={onSectionChange} />;
}
