"use client"; 
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // ← Ubah dari 'next/router' ke 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import EducationManager from '@/components/admin/EducationManager';
import SkillsManager from '@/components/admin/SkillsManager';
import ProjectsManager from '@/components/admin/ProjectsManager';
import MessagesManager from '@/components/admin/MessagesManager';
import ProfileManager from '@/components/admin/ProfileManager';
import { apiGet } from '@/lib/api';
import { clearAuthToken, getAuthToken } from '@/lib/auth';

const Admin = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Sekarang menggunakan router dari next/navigation

  useEffect(() => {
    checkAuth();
  }, [router]);

  const checkAuth = async () => {
    const token = getAuthToken();
    if (!token) {
      router.push('/auth');
      return;
    }

    try {
      await apiGet('/auth/me', { auth: true });
      setIsAuthorized(true);
    } catch {
      clearAuthToken();
      toast.error('Session expired. Please login again.');
      router.push('/auth');
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    clearAuthToken();
    toast.success('Logged out successfully');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Verifying admin access...</p>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-background/95">
      <div className="container mx-auto px-4 py-8">
        {/* Admin Tabs */}
        <Tabs defaultValue="profile" className="w-full pt-10">
          <TabsList className="bg-card border border-border w-full justify-start h-auto p-1 rounded-lg mb-6">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Profile
            </TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Education
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Skills
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Projects
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileManager />
          </TabsContent>

          <TabsContent value="education">
            <EducationManager />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsManager />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsManager />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;