import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api';

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
    
    if (!formData.name || !formData.category) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      if (editingId) {
        await apiPut(`/skills/${editingId}`, formData, { auth: true });
        toast.success('Skill updated successfully');
      } else {
        await apiPost('/skills', {
          name: formData.name!,
          category: formData.category!,
          icon_name: formData.icon_name || null,
          proficiency: formData.proficiency || null,
          order_index: skills.length,
        }, { auth: true });
        toast.success('Skill added successfully');
      }
      resetForm();
      fetchSkills();
    } catch (error: any) {
      toast.error(error.message ?? (editingId ? 'Failed to update skill' : 'Failed to add skill'));
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setFormData(skill);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

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
      <form onSubmit={handleSubmit} className="glass-card p-6 rounded-lg space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          {editingId ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          {editingId ? 'Edit Skill' : 'Add New Skill'}
        </h3>

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
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category || 'hard'}
              onValueChange={(value: 'hard' | 'soft') => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="neon-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hard">Hard Skill</SelectItem>
                <SelectItem value="soft">Soft Skill</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon_name">Icon Name (Lucide)</Label>
            <Input
              id="icon_name"
              value={formData.icon_name || ''}
              onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
              placeholder="e.g., Code, Palette, Users"
              className="neon-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proficiency">Proficiency (0-100)</Label>
            <Input
              id="proficiency"
              type="number"
              min="0"
              max="100"
              value={formData.proficiency || ''}
              onChange={(e) => setFormData({ ...formData, proficiency: e.target.value ? parseInt(e.target.value) : null })}
              className="neon-border"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="btn-glow">
            {editingId ? 'Update' : 'Add'} Skill
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm} className="neon-border">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="grid md:grid-cols-2 gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="glass-card p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-bold">{skill.name}</h4>
                <p className="text-sm text-muted-foreground capitalize">{skill.category} Skill</p>
                {skill.icon_name && (
                  <p className="text-xs text-muted-foreground">Icon: {skill.icon_name}</p>
                )}
                {skill.proficiency && (
                  <div className="mt-2">
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-primary"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{skill.proficiency}%</p>
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
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(skill.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsManager;
