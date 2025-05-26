import { Card, CardContent } from '@/components/ui/card';
import { Globe } from 'lucide-react';

export function SphereMap() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Sphere Map</h1>
      
      <Card>
        <CardContent className="p-8 text-center">
          <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Sphere Map Coming Soon</h2>
          <p className="text-muted-foreground">
            Explore global learning progress and connect with learners worldwide.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
