import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { apiGet, apiPut } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Profile {
  id: string;
  full_name: string;
  tagline: string | null;
  title: string | null;
  photo_url: string | null;
}

const ProfileManager = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await apiGet<Profile[]>('/profiles', { auth: true });
      const profileData = data[0];
      if (profileData) {
        setProfile(profileData);
        setFormData(profileData);
      } else {
        toast.error('Profile not found');
      }
    } catch (error: any) {
      toast.error(error.message ?? 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;

    try {
      await apiPut(`/profiles/${profile.id}`, formData, { auth: true });
      toast.success('Profile updated successfully');
      fetchProfile();
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message ?? 'Failed to update profile');
    }
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;
  if (!profile) return <div className="text-muted-foreground">Profile not found</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Profile</h3>
        <Button onClick={() => setOpen(true)} className="btn-glow">
          <Save className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="glass-card p-6 rounded-lg">
        <div className="grid md:grid-cols-2 gap-4 items-center">
          <div>
            <h4 className="font-bold text-lg">{profile.full_name}</h4>
            <p className="text-primary">{profile.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{profile.tagline}</p>
          </div>
          <div className="flex justify-end">
            <img
              src={profile.photo_url || '/afito-profile.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-primary/30"
            />
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="space-y-4">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name || ''}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                  className="neon-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Informatics Engineer"
                  className="neon-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Textarea
                id="tagline"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                rows={3}
                placeholder="A short description about yourself"
                className="neon-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo_url">Photo URL</Label>
              <Input
                id="photo_url"
                value={formData.photo_url || ''}
                onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                placeholder="https://..."
                className="neon-border"
              />
              {formData.photo_url && (
                <div className="mt-2">
                  <img
                    src={formData.photo_url}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-full object-cover border-2 border-primary/30"
                  />
                </div>
              )}
            </div>

            <Button type="submit" className="btn-glow">
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileManager;
