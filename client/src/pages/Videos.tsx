import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';

export function Videos() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Video Library</h1>
      
      <Card>
        <CardContent className="p-8 text-center">
          <Play className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Video Library Coming Soon</h2>
          <p className="text-muted-foreground">
            Access curated video tutorials and courses.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
