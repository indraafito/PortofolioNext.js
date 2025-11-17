import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  github_url: string | null;
  live_url: string | null;
  thumbnail_url: string | null;
  order_index: number;
}

const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({
    technologies: [],
  });
  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await apiGet<Project[]>('/projects');
      setProjects(data);
    } catch (error: any) {
      toast.error(error.message ?? 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      if (editingId) {
        await apiPut(`/projects/${editingId}`, formData, { auth: true });
        toast.success('Project updated successfully');
      } else {
        await apiPost('/projects', {
          title: formData.title!,
          description: formData.description!,
          technologies: formData.technologies || [],
          github_url: formData.github_url || null,
          live_url: formData.live_url || null,
          thumbnail_url: formData.thumbnail_url || null,
          order_index: projects.length,
        }, { auth: true });
        toast.success('Project added successfully');
      }
      resetForm();
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message ?? (editingId ? 'Failed to update project' : 'Failed to add project'));
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData(project);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await apiDelete(`/projects/${id}`, { auth: true });
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message ?? 'Failed to delete project');
    }
  };

  const addTechnology = () => {
    if (techInput.trim()) {
      setFormData({
        ...formData,
        technologies: [...(formData.technologies || []), techInput.trim()],
      });
      setTechInput('');
    }
  };

  const removeTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies?.filter((_, i) => i !== index) || [],
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ technologies: [] });
    setTechInput('');
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="glass-card p-6 rounded-lg space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          {editingId ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          {editingId ? 'Edit Project' : 'Add New Project'}
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="neon-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
            <Input
              id="thumbnail_url"
              value={formData.thumbnail_url || ''}
              onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
              placeholder="https://..."
              className="neon-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={3}
            className="neon-border"
          />
        </div>

        <div className="space-y-2">
          <Label>Technologies</Label>
          <div className="flex gap-2">
            <Input
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
              placeholder="Add a technology"
              className="neon-border"
            />
            <Button type="button" onClick={addTechnology} variant="outline" className="neon-border">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.technologies?.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-sm flex items-center gap-2"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTechnology(index)}
                  className="hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub URL</Label>
            <Input
              id="github_url"
              value={formData.github_url || ''}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              placeholder="https://github.com/..."
              className="neon-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="live_url">Live URL</Label>
            <Input
              id="live_url"
              value={formData.live_url || ''}
              onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
              placeholder="https://..."
              className="neon-border"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="btn-glow">
            {editingId ? 'Update' : 'Add'} Project
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
        {projects.map((project) => (
          <div key={project.id} className="glass-card p-4 rounded-lg">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h4 className="font-bold text-lg">{project.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-primary/20 border border-primary/30 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                  {project.github_url && <span>GitHub ✓</span>}
                  {project.live_url && <span>Live Demo ✓</span>}
                  {project.thumbnail_url && <span>Thumbnail ✓</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(project)}
                  className="neon-border"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(project.id)}
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

export default ProjectsManager;
