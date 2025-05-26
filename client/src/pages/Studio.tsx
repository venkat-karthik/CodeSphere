import { Card, CardContent } from '@/components/ui/card';
import { Code } from 'lucide-react';

export function Studio() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Project Studio</h1>
      
      <Card>
        <CardContent className="p-8 text-center">
          <Code className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Project Studio Coming Soon</h2>
          <p className="text-muted-foreground">
            Build and prototype your ideas in our integrated development environment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
