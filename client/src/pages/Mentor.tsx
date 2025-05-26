import { Card, CardContent } from '@/components/ui/card';
import { Bot } from 'lucide-react';

export function Mentor() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">AI Mentor</h1>
      
      <Card>
        <CardContent className="p-8 text-center">
          <Bot className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">AI Mentor Coming Soon</h2>
          <p className="text-muted-foreground">
            Get personalized coding help from our AI assistant.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
