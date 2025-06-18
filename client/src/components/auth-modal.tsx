import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const { toast } = useToast();

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(loginForm.email, loginForm.password);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'Please make sure your passwords match.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      await register({
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        email: registerForm.email,
        password: registerForm.password,
      });
      toast({
        title: 'Welcome to CodeSphere!',
        description: 'Your account has been created successfully.',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Failed to create account',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForms = () => {
    setLoginForm({ email: '', password: '' });
    setRegisterForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    resetForms();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">CS</span>
          </div>
          <DialogTitle className="text-2xl text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </DialogTitle>
          <p className="text-slate-400">
            {mode === 'login' 
              ? 'Sign in to your CodeSphere account'
              : 'Enter your information to create your CodeSphere account'
            }
          </p>
        </DialogHeader>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={loginForm.email}
                onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                required
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                required
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-violet-600 hover:bg-violet-700"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-slate-300">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  value={registerForm.firstName}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                  className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-slate-300">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  value={registerForm.lastName}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                  className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="registerEmail" className="text-slate-300">Email</Label>
              <Input
                id="registerEmail"
                type="email"
                placeholder="Enter your email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                required
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="registerPassword" className="text-slate-300">Password</Label>
              <Input
                id="registerPassword"
                type="password"
                placeholder="Create a password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                required
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-violet-600 hover:bg-violet-700"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        )}

        <div className="text-center">
          <p className="text-slate-400">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              className="text-violet-400 hover:text-violet-300 font-semibold"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
