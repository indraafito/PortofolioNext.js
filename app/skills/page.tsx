"use client"; 
import { useEffect, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { apiGet } from '@/lib/api';

interface Skill {
  id: string;
  name: string;
  category: 'hard' | 'soft';
  icon_name: string | null;
  proficiency: number | null;
  order_index: number;
}

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await apiGet<Skill[]>('/skills');
      setSkills(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const hardSkills = skills.filter((s) => s.category === 'hard');
  const softSkills = skills.filter((s) => s.category === 'soft');

  const getIcon = (iconName: string | null) => {
    if (!iconName) return LucideIcons.Code;
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Code;
  };

  const SkillCard = ({ skill, index }: { skill: Skill; index: number }) => {
    const Icon = getIcon(skill.icon_name);
    
    return (
      <div
        className="glass-card p-6 rounded-lg hover:shadow-glow-md transition-all duration-300 animate-fade-in group"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 group-hover:bg-primary/20 transition-colors">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">{skill.name}</h3>
        </div>
        
        {skill.proficiency && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Proficiency</span>
              <span className="font-semibold">{skill.proficiency}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-primary transition-all duration-1000 rounded-full"
                style={{ width: `${skill.proficiency}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4 glow-text animate-fade-in">
          Skills & Expertise
        </h1>
        <p className="text-center text-muted-foreground mb-12 text-lg">
          My technical and soft skills
        </p>

        {loading ? (
  <div className="min-h-[300px] flex items-center justify-center relative">

    {/* Main loading content */}
    <div className="relative z-10 flex flex-col items-center gap-6">

      {/* Animated logo/spinner */}
      <div className="relative">

        {/* Outer rotating ring */}
        <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />

        {/* Inner pulsing circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/30 animate-pulse" />
        </div>

        {/* Center sparkle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-primary animate-pulse" />
        </div>

        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.4), transparent)',
            filter: 'blur(20px)',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        />
      </div>

      {/* Loading text */}
      <div className="text-center space-y-2">
        <p className="text-xl font-semibold text-primary animate-pulse">
          Loading
          <span className="inline-block animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Just a moment
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-1 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-primary rounded-full"
          style={{
            animation: 'loading-progress 2s ease-in-out infinite'
          }}
        />
      </div>
    </div>
  </div>
) : (

          <div className="space-y-12">
            {/* Hard Skills */}
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <LucideIcons.Code className="h-8 w-8 text-primary" />
                Technical Skills
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hardSkills.map((skill, index) => (
                  <SkillCard key={skill.id} skill={skill} index={index} />
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <LucideIcons.Users className="h-8 w-8 text-primary" />
                Soft Skills
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {softSkills.map((skill, index) => (
                  <SkillCard key={skill.id} skill={skill} index={index} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Skills;