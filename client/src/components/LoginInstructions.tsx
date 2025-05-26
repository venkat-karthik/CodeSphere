import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Shield, Info } from 'lucide-react';

export function LoginInstructions() {
  return (
    <Card className="mb-6 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
          <Info className="h-5 w-5" />
          <span>Demo Login Accounts</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="font-semibold text-red-700 dark:text-red-300">Admin Account</span>
              <Badge variant="destructive" className="text-xs">ADMIN</Badge>
            </div>
            <div className="text-sm space-y-1">
              <div><strong>Email:</strong> admin@codesphere.com</div>
              <div><strong>Password:</strong> admin123</div>
              <div className="text-red-600 dark:text-red-400 text-xs mt-2">
                Access: Full admin dashboard, student management, analytics, content upload
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-blue-700 dark:text-blue-300 text-lg">Student Account</span>
              <Badge variant="secondary" className="text-xs">STUDENT</Badge>
            </div>
            <div className="text-sm space-y-2">
              <div className="font-medium"><strong>Email:</strong> student@codesphere.com</div>
              <div className="font-medium"><strong>Password:</strong> student123</div>
              <div className="text-blue-600 dark:text-blue-400 text-xs mt-3 p-2 bg-blue-100 dark:bg-blue-800/30 rounded">
                Access: Learning materials, coding sandbox, community, progress tracking
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded">
          <strong>Note:</strong> Admin users see different navigation options and can access the Admin Dashboard. 
          Students see learning-focused navigation with access to courses, sandbox, and community features.
        </div>
      </CardContent>
    </Card>
  );
}