import { Card, CardContent } from '@/components/ui/card';
import { Laptop } from 'lucide-react';

export function Sandbox() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">App Sandbox</h1>
      
      <Card>
        <CardContent className="p-8 text-center">
          <Laptop className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">App Sandbox Coming Soon</h2>
          <p className="text-muted-foreground">
            Practice building clones of popular apps in a safe environment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
