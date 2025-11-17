import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api';

interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_year: number;
  end_year: number | null;
  description: string | null;
  achievements: string | null;
  order_index: number;
}

const EducationManager = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Education>>({});

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const data = await apiGet<Education[]>('/education');
      setEducation(data);
    } catch (error: any) {
      toast.error(error.message ?? 'Failed to load education');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.institution || !formData.degree || !formData.start_year) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      if (editingId) {
        await apiPut(`/education/${editingId}`, formData, { auth: true });
        toast.success('Education updated successfully');
      } else {
        await apiPost('/education', {
          institution: formData.institution!,
          degree: formData.degree!,
          start_year: formData.start_year!,
          field_of_study: formData.field_of_study || null,
          end_year: formData.end_year || null,
          description: formData.description || null,
          achievements: formData.achievements || null,
          order_index: education.length,
        }, { auth: true });
        toast.success('Education added successfully');
      }
      resetForm();
      fetchEducation();
    } catch (error: any) {
      toast.error(error.message ?? (editingId ? 'Failed to update education' : 'Failed to add education'));
    }
  };

  const handleEdit = (edu: Education) => {
    setEditingId(edu.id);
    setFormData(edu);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;

    try {
      await apiDelete(`/education/${id}`, { auth: true });
      toast.success('Education deleted successfully');
      fetchEducation();
    } catch (error: any) {
      toast.error(error.message ?? 'Failed to delete education');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({});
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="glass-card p-6 rounded-lg space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          {editingId ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          {editingId ? 'Edit Education' : 'Add New Education'}
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="institution">Institution *</Label>
            <Input
              id="institution"
              value={formData.institution || ''}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              required
              className="neon-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="degree">Degree *</Label>
            <Input
              id="degree"
              value={formData.degree || ''}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              required
              className="neon-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="field_of_study">Field of Study</Label>
            <Input
              id="field_of_study"
              value={formData.field_of_study || ''}
              onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
              className="neon-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="start_year">Start Year *</Label>
            <Input
              id="start_year"
              type="number"
              value={formData.start_year || ''}
              onChange={(e) => setFormData({ ...formData, start_year: parseInt(e.target.value) })}
              required
              className="neon-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_year">End Year (Leave empty if current)</Label>
            <Input
              id="end_year"
              type="number"
              value={formData.end_year || ''}
              onChange={(e) => setFormData({ ...formData, end_year: e.target.value ? parseInt(e.target.value) : null })}
              className="neon-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="neon-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="achievements">Achievements</Label>
          <Textarea
            id="achievements"
            value={formData.achievements || ''}
            onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
            rows={3}
            className="neon-border"
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="btn-glow">
            {editingId ? 'Update' : 'Add'} Education
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm} className="neon-border">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu.id} className="glass-card p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-bold text-lg">{edu.institution}</h4>
                <p className="text-primary">{edu.degree} {edu.field_of_study && `- ${edu.field_of_study}`}</p>
                <p className="text-sm text-muted-foreground">
                  {edu.start_year} - {edu.end_year || 'Present'}
                </p>
                {edu.description && (
                  <p className="text-sm mt-2 text-muted-foreground">{edu.description}</p>
                )}
                {edu.achievements && (
                  <p className="text-sm mt-2 text-muted-foreground"><strong>Achievements:</strong> {edu.achievements}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(edu)}
                  className="neon-border"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(edu.id)}
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

export default EducationManager;
