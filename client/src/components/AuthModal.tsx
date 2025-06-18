import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const { login, register } = useAuth();
  const { toast } = useToast();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleLogin = async (data: LoginForm) => {
    const success = await login(data.email, data.password);
    if (success) {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      onClose();
      loginForm.reset();
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    const success = await register({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: 'student',
      level: 1,
      xp: 0,
      nextLevelXP: 100,
      streak: 0,
      completedCourses: 0,
      problemsSolved: 0
    });
    
    if (success) {
      toast({
        title: "Account created!",
        description: "Welcome to CodeSphere! Your learning journey begins now.",
      });
      onClose();
      registerForm.reset();
    } else {
      toast({
        title: "Registration failed",
        description: "An account with this email already exists.",
        variant: "destructive",
      });
    }
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    loginForm.reset();
    registerForm.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">CS</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-400">
            {mode === 'login' 
              ? 'Sign in to your CodeSphere account' 
              : 'Join the CodeSphere community'
            }
          </p>
        </div>

        {mode === 'login' ? (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-600 text-white"
                {...loginForm.register('email')}
              />
              {loginForm.formState.errors.email && (
                <p className="text-red-400 text-sm mt-1">{loginForm.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="bg-gray-800 border-gray-600 text-white"
                {...loginForm.register('password')}
              />
              {loginForm.formState.errors.password && (
                <p className="text-red-400 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              disabled={loginForm.formState.isSubmitting}
            >
              {loginForm.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  className="bg-gray-800 border-gray-600 text-white"
                  {...registerForm.register('firstName')}
                />
                {registerForm.formState.errors.firstName && (
                  <p className="text-red-400 text-sm mt-1">{registerForm.formState.errors.firstName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  className="bg-gray-800 border-gray-600 text-white"
                  {...registerForm.register('lastName')}
                />
                {registerForm.formState.errors.lastName && (
                  <p className="text-red-400 text-sm mt-1">{registerForm.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="registerEmail" className="text-gray-300">Email</Label>
              <Input
                id="registerEmail"
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-600 text-white"
                {...registerForm.register('email')}
              />
              {registerForm.formState.errors.email && (
                <p className="text-red-400 text-sm mt-1">{registerForm.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="registerPassword" className="text-gray-300">Password</Label>
              <Input
                id="registerPassword"
                type="password"
                placeholder="Create a password"
                className="bg-gray-800 border-gray-600 text-white"
                {...registerForm.register('password')}
              />
              {registerForm.formState.errors.password && (
                <p className="text-red-400 text-sm mt-1">{registerForm.formState.errors.password.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="bg-gray-800 border-gray-600 text-white"
                {...registerForm.register('confirmPassword')}
              />
              {registerForm.formState.errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              disabled={registerForm.formState.isSubmitting}
            >
              {registerForm.formState.isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        )}

        <div className="text-center mt-6">
          <span className="text-gray-400">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          </span>
          <Button
            variant="link"
            className="text-purple-400 hover:text-purple-300 p-0"
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
