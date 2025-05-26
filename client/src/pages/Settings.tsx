import { Card, CardContent } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

export function Settings() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Card>
        <CardContent className="p-8 text-center">
          <SettingsIcon className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Settings Coming Soon</h2>
          <p className="text-muted-foreground">
            Customize your CodeSphere experience.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
