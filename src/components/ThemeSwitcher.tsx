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
        <Button variant="outline" size="icon" className="neon-border">
          <Palette className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-card w-56">
        <DropdownMenuLabel>Choose Theme Color</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {allThemeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSelectTheme(option)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div 
              className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600" 
              style={{ backgroundColor: option.color }}
            />
            <span className="flex-1">{option.name}</span>
            {currentColor === option.value && <span className="text-sm">✓</span>}
            {option.isCustom && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveCustomColor();
                }}
                className="text-xs text-red-500 hover:text-red-700 ml-1 p-1"
                title="Remove custom color"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
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
              className="flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{customColor ? 'Edit Custom Color' : 'Add Custom Color'}</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{customColor ? 'Edit' : 'Add'} Custom Color</DialogTitle>
              <DialogDescription>
                {customColor ? 'Update your custom theme color' : 'Create your own custom theme color'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="colorName" className="text-sm font-medium">
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
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="colorPicker" className="text-sm font-medium">
                  Pick Color
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    id="colorPicker"
                    type="color"
                    value={newColorValue}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-16 h-10 rounded cursor-pointer border border-gray-300"
                  />
                  <Input
                    type="text"
                    value={newColorValue}
                    onChange={(e) => handleColorChange(e.target.value)}
                    placeholder="#a78bfa"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
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
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCustomColor}
                  disabled={!newColorName.trim()}
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