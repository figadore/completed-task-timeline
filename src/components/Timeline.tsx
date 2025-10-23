import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, CheckCircle, Trash2, Calendar as CalendarIcon, Download, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface TimelineItem {
  id: string;
  title: string;
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
      date: new Date('2024-01-15'),
    },
    {
      id: '2', 
      title: 'Finished Advanced TypeScript Course',
      date: new Date('2024-01-20'),
    },
    {
      id: '3',
      title: 'Deployed Personal Portfolio',
      date: new Date('2024-01-25'),
    }
  ];
};

export function Timeline() {
  const [items, setItems] = useState<TimelineItem[]>(getInitialItems);

  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
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
      date: new Date(),
    };

    setItems(prev => [item, ...prev]);
    setNewItem({ title: '' });
    setShowForm(false);
    
    toast({
      title: "🎉 Task Added!",
      description: `"${newItem.title}" has been added to your timeline.`,
    });
  };

  const handleDeleteItem = (id: string) => {
    const itemToDelete = items.find(item => item.id === id);
    setItems(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "Task Deleted",
      description: `"${itemToDelete?.title}" has been removed from your timeline.`,
    });
  };

  const handleUpdateDate = (id: string, newDate: Date) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, date: newDate } : item
    ));
    
    toast({
      title: "Date Updated",
      description: `Task date has been updated to ${format(newDate, "PPP")}.`,
    });
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Title', 'Date'],
      ...items.map(item => [item.title, item.date.toISOString()])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timeline-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Exported",
      description: "Timeline exported to CSV successfully.",
    });
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').slice(1); // Skip header
        const imported: TimelineItem[] = lines
          .filter(line => line.trim())
          .map(line => {
            const [title, dateStr] = line.split(',').map(cell => cell.replace(/^"|"$/g, '').trim());
            return {
              id: Date.now().toString() + Math.random(),
              title,
              date: new Date(dateStr)
            };
          });

        setItems(prev => {
          // Filter out duplicates based on title and date
          const uniqueImported = imported.filter(newItem => 
            !prev.some(existingItem => 
              existingItem.title === newItem.title && 
              existingItem.date.toDateString() === newItem.date.toDateString()
            )
          );
          
          const skipped = imported.length - uniqueImported.length;
          
          toast({
            title: "Imported",
            description: `${uniqueImported.length} tasks imported${skipped > 0 ? `, ${skipped} duplicates skipped` : ''}.`,
          });
          
          return [...uniqueImported, ...prev];
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to parse CSV file. Please check the format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
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
      <div className="flex justify-center gap-2 flex-wrap">
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-success hover:bg-success/90 shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Completed Task
        </Button>
        <Button 
          onClick={handleExportCSV}
          variant="outline"
          size="lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
        <Button 
          variant="outline"
          size="lg"
          onClick={() => document.getElementById('csv-import')?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Import CSV
        </Button>
        <input
          id="csv-import"
          type="file"
          accept=".csv"
          onChange={handleImportCSV}
          className="hidden"
        />
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
        <div className="absolute left-22 top-0 bottom-0 w-0.5 bg-border"></div>

        {/* Timeline Items */}
        <div className="space-y-8">
          {sortedItems.map((item, index) => (
            <div key={item.id} className="relative animate-slide-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              {/* Timeline Dot */}
              <div className="absolute left-22 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 border-success bg-background z-10 shadow-[0_0_0_4px_hsl(var(--success)/0.2)]">
                <CheckCircle className="w-3 h-3 text-success absolute -top-0.5 -left-0.5" />
              </div>

              {/* Date on Left - Minimal width */}
              <div className="absolute left-0 w-20 text-right">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-muted/30 border border-border/50 rounded px-2 py-1 h-auto hover:bg-muted/50"
                    >
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      <span className="text-xs font-medium text-muted-foreground leading-tight">
                        {item.date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={item.date}
                      onSelect={(date) => date && handleUpdateDate(item.id, date)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Task Card on Right - Takes most space */}
              <div className="absolute left-24 right-0">
                <Card className="p-4 transition-all duration-300 hover:shadow-lg border-l-4 border-l-success bg-gradient-to-r from-success/5 to-transparent hover:from-success/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Spacer for absolute positioning */}
              <div className="h-16"></div>
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