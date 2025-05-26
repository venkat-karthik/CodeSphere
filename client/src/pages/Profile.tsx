import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

export function Profile() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      
      <Card>
        <CardContent className="p-8 text-center">
          <User className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Profile Management Coming Soon</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
