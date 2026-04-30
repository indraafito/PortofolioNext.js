import { useState, useEffect } from 'react';
import { Palette, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/ThemeContext';

const defaultThemeOptions = [
  { name: 'Purple', value: 'purple', color: '#a78bfa' },
  { name: 'Blue', value: 'blue', color: '#60a5fa' },
  { name: 'Pink', value: 'pink', color: '#f472b6' },
  { name: 'Green', value: 'green', color: '#4ade80' },
  { name: 'Orange', value: 'orange', color: '#fb923c' },
  { name: 'Cyan', value: 'cyan', color: '#22d3ee' },
  { name: 'Red', value: 'red', color: '#f87171' },
  { name: 'Yellow', value: 'yellow', color: '#facc15' },
];

export const ThemeSwitcher = () => {
  const { currentColor, changeTheme } = useTheme();
  const [customColor, setCustomColor] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newColorName, setNewColorName] = useState('');
  const [newColorValue, setNewColorValue] = useState('#a78bfa');
  const [previewColor, setPreviewColor] = useState('#a78bfa');

  // Load custom color from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('portfolio-custom-color');
    if (saved) {
      try {
        setCustomColor(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load custom color');
      }
    }
  }, []);

  // Save custom color to localStorage
  const saveCustomColor = (color) => {
    setCustomColor(color);
    if (color) {
      localStorage.setItem('portfolio-custom-color', JSON.stringify(color));
    } else {
      localStorage.removeItem('portfolio-custom-color');
    }
  };

  const allThemeOptions = customColor 
    ? [...defaultThemeOptions, customColor]
    : defaultThemeOptions;

  const handleAddCustomColor = () => {
    if (newColorName.trim()) {
      const customColorId = 'custom';
      const newColor = {
        name: newColorName.trim(),
        value: customColorId,
        color: newColorValue,
        isCustom: true,
      };
      
      saveCustomColor(newColor);
      changeTheme(customColorId, newColorValue);
      
      // Reset form
      setNewColorName('');
      setNewColorValue('#a78bfa');
      setPreviewColor('#a78bfa');
      setIsDialogOpen(false);
    }
  };

  const handleRemoveCustomColor = () => {
    saveCustomColor(null);
    
    if (currentColor === 'custom') {
      changeTheme('purple');
    }
  };

  // Live preview while dragging color picker
  const handleColorChange = (newColor) => {
    setNewColorValue(newColor);
    setPreviewColor(newColor);
    
    // Apply live preview to theme
    changeTheme('preview', newColor);
  };

  const handleSelectTheme = (option) => {
    if (option.isCustom) {
      changeTheme(option.value, option.color);
    } else {
      changeTheme(option.value);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-lg h-9 w-9 text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300 focus:outline-none focus-visible:ring-0"
          aria-label="Change theme color"
        >
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-2"
      >
        <DropdownMenuLabel className="text-white/90 px-3 py-2">Choose Theme Color</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        
        {allThemeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSelectTheme(option)}
            className="flex items-center gap-3 cursor-pointer rounded-xl px-3 py-2.5 text-white/80 hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white transition-colors"
          >
            <div 
              className="w-5 h-5 rounded-full border-2 border-white/20 shadow-lg" 
              style={{ backgroundColor: option.color }}
            />
            <span className="flex-1">{option.name}</span>
            {currentColor === option.value && (
              <span className="text-sm text-primary">✓</span>
            )}
            {option.isCustom && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveCustomColor();
                }}
                className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                title="Remove custom color"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator className="bg-white/10" />
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                if (customColor) {
                  // Edit existing custom color
                  setNewColorName(customColor.name);
                  setNewColorValue(customColor.color);
                  setPreviewColor(customColor.color);
                } else {
                  // Create new custom color
                  setNewColorName('');
                  setNewColorValue('#a78bfa');
                  setPreviewColor('#a78bfa');
                }
                setIsDialogOpen(true);
              }}
              className="flex items-center gap-3 cursor-pointer rounded-xl px-3 py-2.5 text-white/80 hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{customColor ? 'Edit Custom Color' : 'Add Custom Color'}</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-white">{customColor ? 'Edit' : 'Add'} Custom Color</DialogTitle>
              <DialogDescription className="text-white/60">
                {customColor ? 'Update your custom theme color' : 'Create your own custom theme color'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="colorName" className="text-sm font-medium text-white/90">
                  Color Name
                </label>
                <Input
                  id="colorName"
                  placeholder="e.g., Teal, Violet"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddCustomColor();
                    }
                  }}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:border-white/20"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="colorPicker" className="text-sm font-medium text-white/90">
                  Pick Color
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    id="colorPicker"
                    type="color"
                    value={newColorValue}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-16 h-10 rounded-lg cursor-pointer border border-white/10 bg-transparent"
                  />
                  <Input
                    type="text"
                    value={newColorValue}
                    onChange={(e) => handleColorChange(e.target.value)}
                    placeholder="#a78bfa"
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:border-white/20"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsDialogOpen(false);
                    // Restore previous theme if was previewing
                    if (currentColor !== 'preview') {
                      if (customColor && currentColor === 'custom') {
                        changeTheme('custom', customColor.color);
                      } else {
                        changeTheme(currentColor);
                      }
                    }
                  }}
                  className="rounded-full text-white/70 hover:text-white hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCustomColor}
                  disabled={!newColorName.trim()}
                  className="rounded-full bg-primary hover:bg-primary/90"
                >
                  {customColor ? 'Update' : 'Add'} Color
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};