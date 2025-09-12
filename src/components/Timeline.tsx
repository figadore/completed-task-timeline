import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Plus, Trophy, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export interface TimelineItem {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'accomplishment' | 'todo';
  completed: boolean;
}

export function Timeline() {
  const [items, setItems] = useState<TimelineItem[]>([
    {
      id: '1',
      title: 'Completed React Project',
      description: 'Built a beautiful timeline component with TypeScript and Tailwind CSS',
      date: new Date('2024-01-15'),
      type: 'accomplishment',
      completed: true,
    },
    {
      id: '2', 
      title: 'Learn Advanced TypeScript',
      description: 'Deep dive into generics, utility types, and advanced patterns',
      date: new Date('2024-01-20'),
      type: 'todo',
      completed: false,
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    type: 'todo' as 'accomplishment' | 'todo'
  });

  const handleAddItem = () => {
    if (!newItem.title.trim()) return;

    const item: TimelineItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      date: new Date(),
      type: newItem.type,
      completed: newItem.type === 'accomplishment',
    };

    setItems(prev => [item, ...prev]);
    setNewItem({ title: '', description: '', type: 'todo' });
    setShowForm(false);
    
    toast({
      title: newItem.type === 'accomplishment' ? "🎉 Accomplishment Added!" : "📋 Todo Added!",
      description: `"${newItem.title}" has been added to your timeline.`,
    });
  };

  const handleCompleteItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, completed: true, type: 'accomplishment', date: new Date() }
        : item
    ));
    
    const item = items.find(i => i.id === id);
    toast({
      title: "🎉 Congratulations!",
      description: `"${item?.title}" completed and moved to accomplishments!`,
    });
  };

  const sortedItems = [...items].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          My Achievement Timeline
        </h1>
        <p className="text-muted-foreground text-lg">
          Track your accomplishments and complete your goals
        </p>
      </div>

      {/* Add Item Button */}
      <div className="flex justify-center">
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {/* Add Item Form */}
      {showForm && (
        <Card className="p-6 animate-slide-in-up shadow-lg">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={newItem.type === 'accomplishment' ? 'default' : 'outline'}
                onClick={() => setNewItem(prev => ({ ...prev, type: 'accomplishment' }))}
                className="flex-1"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Accomplishment
              </Button>
              <Button
                variant={newItem.type === 'todo' ? 'default' : 'outline'}
                onClick={() => setNewItem(prev => ({ ...prev, type: 'todo' }))}
                className="flex-1"
              >
                <Target className="w-4 h-4 mr-2" />
                To-Do
              </Button>
            </div>
            
            <Input
              placeholder="Enter title..."
              value={newItem.title}
              onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
            />
            
            <Textarea
              placeholder="Add description (optional)..."
              value={newItem.description}
              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
            
            <div className="flex gap-2">
              <Button onClick={handleAddItem} className="flex-1">
                Add Item
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>

        {/* Timeline Items */}
        <div className="space-y-6">
          {sortedItems.map((item, index) => (
            <div key={item.id} className="relative animate-slide-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              {/* Timeline Dot */}
              <div className={cn(
                "absolute left-6 w-4 h-4 rounded-full border-2 bg-background z-10",
                item.completed 
                  ? "border-success shadow-[0_0_0_4px_hsl(var(--success)/0.2)]" 
                  : "border-warning shadow-[0_0_0_4px_hsl(var(--warning)/0.2)]"
              )}>
                {item.completed && (
                  <CheckCircle className="w-3 h-3 text-success absolute -top-0.5 -left-0.5" />
                )}
              </div>

              {/* Timeline Card */}
              <Card className={cn(
                "ml-16 p-6 transition-all duration-300 hover:shadow-lg border-l-4",
                item.completed 
                  ? "border-l-success bg-gradient-to-r from-success/5 to-transparent hover:from-success/10" 
                  : "border-l-warning bg-gradient-to-r from-warning/5 to-transparent hover:from-warning/10"
              )}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <Badge 
                        variant={item.completed ? "default" : "secondary"}
                        className={cn(
                          "text-xs",
                          item.completed 
                            ? "bg-success/10 text-success border-success/20" 
                            : "bg-warning/10 text-warning-foreground border-warning/20"
                        )}
                      >
                        {item.completed ? (
                          <><Trophy className="w-3 h-3 mr-1" /> Accomplished</>
                        ) : (
                          <><Clock className="w-3 h-3 mr-1" /> Pending</>
                        )}
                      </Badge>
                    </div>
                    
                    {item.description && (
                      <p className="text-muted-foreground">{item.description}</p>
                    )}
                    
                    <p className="text-sm text-muted-foreground">
                      {item.date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  {!item.completed && item.type === 'todo' && (
                    <Button
                      size="sm"
                      onClick={() => handleCompleteItem(item.id)}
                      className="bg-success hover:bg-success/90 animate-pulse-glow"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {sortedItems.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">No items yet</h3>
          <p className="text-muted-foreground">Start building your achievement timeline!</p>
        </div>
      )}
    </div>
  );
}