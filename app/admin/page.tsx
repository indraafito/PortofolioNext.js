"use client"; 
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import EducationManager from '@/components/admin/EducationManager';
import SkillsManager from '@/components/admin/SkillsManager';
import ProjectsManager from '@/components/admin/ProjectsManager';
import MessagesManager from '@/components/admin/MessagesManager';
import ProfileManager from '@/components/admin/ProfileManager';
import { apiGet } from '@/lib/api';
import { clearAuthToken, getAuthToken } from '@/lib/auth';
import { UserCircle, GraduationCap, Award, Briefcase, Mail } from 'lucide-react';

const Admin = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
          <TabsList className="w-full max-w-5xl mx-auto h-auto p-2 rounded-full mb-8 sticky top-24 z-40 bg-black/40 backdrop-blur-xl border border-white/5 overflow-x-auto flex justify-center gap-1">
            <TabsTrigger
              value="profile"
              className="inline-flex items-center gap-2 px-5 py-2 h-9 rounded-full text-[15px] font-normal transition-all duration-300 text-white/80 hover:text-white hover:bg-white/5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/50 min-w-[120px] justify-center focus-visible:ring-0"
              title="Profile"
            >
              <UserCircle className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="education"
              className="inline-flex items-center gap-2 px-5 py-2 h-9 rounded-full text-[15px] font-normal transition-all duration-300 text-white/80 hover:text-white hover:bg-white/5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/50 min-w-[120px] justify-center focus-visible:ring-0"
              title="Education"
            >
              <GraduationCap className="h-4 w-4" />
              <span>Education</span>
            </TabsTrigger>
            <TabsTrigger
              value="skills"
              className="inline-flex items-center gap-2 px-5 py-2 h-9 rounded-full text-[15px] font-normal transition-all duration-300 text-white/80 hover:text-white hover:bg-white/5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/50 min-w-[120px] justify-center focus-visible:ring-0"
              title="Skills"
            >
              <Award className="h-4 w-4" />
              <span>Skills</span>
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="inline-flex items-center gap-2 px-5 py-2 h-9 rounded-full text-[15px] font-normal transition-all duration-300 text-white/80 hover:text-white hover:bg-white/5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/50 min-w-[120px] justify-center focus-visible:ring-0"
              title="Projects"
            >
              <Briefcase className="h-4 w-4" />
              <span>Projects</span>
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="inline-flex items-center gap-2 px-5 py-2 h-9 rounded-full text-[15px] font-normal transition-all duration-300 text-white/80 hover:text-white hover:bg-white/5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/50 min-w-[120px] justify-center focus-visible:ring-0"
              title="Messages"
            >
              <Mail className="h-4 w-4" />
              <span>Messages</span>
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