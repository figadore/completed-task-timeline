import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export interface TimelineItem {
  id: string;
  title: string;
  description: string;
  date: Date;
}

const STORAGE_KEY = 'timeline-items';

const getInitialItems = (): TimelineItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((item: any) => ({
        ...item,
        date: new Date(item.date)
      }));
    }
  } catch (error) {
    console.warn('Failed to parse stored timeline items:', error);
  }
  
  // Default items if nothing in localStorage
  return [
    {
      id: '1',
      title: 'Completed React Timeline Project',
      description: 'Built a beautiful timeline component with TypeScript and Tailwind CSS',
      date: new Date('2024-01-15'),
    },
    {
      id: '2', 
      title: 'Finished Advanced TypeScript Course',
      description: 'Learned generics, utility types, and advanced patterns',
      date: new Date('2024-01-20'),
    },
    {
      id: '3',
      title: 'Deployed Personal Portfolio',
      description: 'Successfully launched my portfolio website with custom animations',
      date: new Date('2024-01-25'),
    }
  ];
};

export function Timeline() {
  const [items, setItems] = useState<TimelineItem[]>(getInitialItems);

  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
  });

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const handleAddItem = () => {
    if (!newItem.title.trim()) return;

    const item: TimelineItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      date: new Date(),
    };

    setItems(prev => [item, ...prev]);
    setNewItem({ title: '', description: '' });
    setShowForm(false);
    
    toast({
      title: "🎉 Task Added!",
      description: `"${newItem.title}" has been added to your timeline.`,
    });
  };

  const sortedItems = [...items].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Completed Tasks Timeline
        </h1>
        <p className="text-muted-foreground text-lg">
          Track and visualize your accomplished tasks
        </p>
      </div>

      {/* Add Item Button */}
      <div className="flex justify-center">
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-success hover:bg-success/90 shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Completed Task
        </Button>
      </div>

      {/* Add Item Form */}
      {showForm && (
        <Card className="p-6 animate-slide-in-up shadow-lg max-w-2xl mx-auto">
          <div className="space-y-4">
            <Input
              placeholder="Enter task title..."
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
              <Button onClick={handleAddItem} className="flex-1 bg-success hover:bg-success/90">
                Add Task
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Timeline */}
      <div className="relative max-w-4xl mx-auto">
        {/* Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-px top-0 bottom-0 w-0.5 bg-border"></div>

        {/* Timeline Items */}
        <div className="space-y-8">
          {sortedItems.map((item, index) => (
            <div key={item.id} className="relative animate-slide-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              {/* Timeline Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 border-success bg-background z-10 shadow-[0_0_0_4px_hsl(var(--success)/0.2)]">
                <CheckCircle className="w-3 h-3 text-success absolute -top-0.5 -left-0.5" />
              </div>

              {/* Date on Left */}
              <div className="absolute left-0 right-1/2 pr-6 text-right">
                <div className="inline-block bg-muted/30 border border-border/50 rounded px-2 py-1">
                  <p className="text-xs font-medium text-muted-foreground leading-tight">
                    {item.date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Task Card on Right */}
              <div className="absolute left-1/2 right-0 pl-8">
                <Card className="p-6 transition-all duration-300 hover:shadow-lg border-l-4 border-l-success bg-gradient-to-r from-success/5 to-transparent hover:from-success/10">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                    </div>
                    
                    {item.description && (
                      <p className="text-muted-foreground pl-7">{item.description}</p>
                    )}
                  </div>
                </Card>
              </div>

              {/* Spacer for absolute positioning */}
              <div className="h-24"></div>
            </div>
          ))}
        </div>
      </div>

      {sortedItems.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">No completed tasks yet</h3>
          <p className="text-muted-foreground">Start adding your accomplishments!</p>
        </div>
      )}
    </div>
  );
}