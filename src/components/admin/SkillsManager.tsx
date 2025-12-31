import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Icon } from '@iconify/react';

interface Skill {
  id: string;
  name: string;
  category: 'hard' | 'soft';
  icon_name: string | null;
  proficiency: number | null;
  order_index: number;
}

const SkillsManager = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Skill>>({
    category: 'hard',
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await apiGet<Skill[]>('/skills');
      setSkills(data);
    } catch (error: any) {
      toast.error(error.message ?? 'Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      if (editingId) {
        const payload: Partial<Skill> = {
          name: formData.name!,
          icon_name: formData.icon_name || null,
          proficiency: null,
        } as any;
        await apiPut(`/skills/${editingId}`, payload, { auth: true });
        toast.success('Skill updated successfully');
      } else {
        await apiPost('/skills', {
          name: formData.name!,
          category: 'hard',
          icon_name: formData.icon_name || null,
          proficiency: null,
          order_index: skills.length,
        }, { auth: true });
        toast.success('Skill added successfully');
      }
      resetForm();
      setOpen(false);
      fetchSkills();
    } catch (error: any) {
      toast.error(error.message ?? (editingId ? 'Failed to update skill' : 'Failed to add skill'));
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setFormData(skill);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await apiDelete(`/skills/${id}`, { auth: true });
      toast.success('Skill deleted successfully');
      fetchSkills();
    } catch (error: any) {
      toast.error(error.message ?? 'Failed to delete skill');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ category: 'hard' });
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Skills</h3>
        <Button
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
          className="btn-glow"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="space-y-4">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Skill Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="neon-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon_name">Iconify Icon Name</Label>
                <Input
                  id="icon_name"
                  value={formData.icon_name || ''}
                  onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                  placeholder="e.g., logos:react, mdi:language-python"
                  className="neon-border"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Icon Preview</Label>
                <div className="glass-card p-3 rounded-lg flex items-center gap-2">
                  <Icon icon={formData.icon_name || 'lucide:code'} className="h-6 w-6 text-primary" />
                  <span className="text-xs text-muted-foreground">{formData.icon_name || 'lucide:code'}</span>
                </div>
              </div>
            </div>
          
            <div className="flex gap-2">
              <Button type="submit" className="btn-glow">
                {editingId ? 'Update' : 'Add'} Skill
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setOpen(false);
                  }}
                  className="neon-border"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid md:grid-cols-2 gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="glass-card p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-bold">{skill.name}</h4>
                {skill.icon_name && (
                  <div className="flex items-center gap-2 mt-1">
                    <Icon icon={skill.icon_name} className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">{skill.icon_name}</span>
                  </div>
                )}
            </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(skill)}
                  className="neon-border"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Skill?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(skill.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsManager;
