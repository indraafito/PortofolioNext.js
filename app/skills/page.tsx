"use client"; 
import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';

import { apiGet } from '@/lib/api';
import { skillsCatalog, groupLabels, categoryIcons, type CatalogSkill, type SkillGroup } from '@/data/skillsCatalog';

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
  const [query] = useState<string>("");

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

  const catalogByName = useMemo(() => {
    const map = new Map<string, CatalogSkill>();
    skillsCatalog.forEach((s) => map.set(s.name.toLowerCase(), s));
    return map;
  }, []);

  const grouped: Record<SkillGroup, CatalogSkill[]> = useMemo(() => {
    const result: Record<SkillGroup, CatalogSkill[]> = {
      'programming-language': [],
      'framework-library': [],
      database: [],
      'cloud-tool': [],
      design: [],
      other: [],
    };
    skills.forEach((sk) => {
      const cat = catalogByName.get(sk.name.toLowerCase());
      if (cat) {
        result[cat.group].push(cat);
      } else {
        result.other.push({ name: sk.name, icon: 'lucide:code', group: 'other' });
      }
    });
    return result;
  }, [skills, catalogByName]);

  const filteredGrouped: Record<SkillGroup, CatalogSkill[]> = useMemo(() => {
    if (!query) return grouped;
    const q = query.toLowerCase();
    return {
      'programming-language': grouped['programming-language'].filter((s) => s.name.toLowerCase().includes(q)),
      'framework-library': grouped['framework-library'].filter((s) => s.name.toLowerCase().includes(q)),
      database: grouped['database'].filter((s) => s.name.toLowerCase().includes(q)),
      'cloud-tool': grouped['cloud-tool'].filter((s) => s.name.toLowerCase().includes(q)),
      design: grouped['design'].filter((s) => s.name.toLowerCase().includes(q)),
      other: grouped['other'].filter((s) => s.name.toLowerCase().includes(q)),
    };
  }, [grouped, query]);

  const SkillCard = ({ catalogSkill, index }: { catalogSkill: CatalogSkill; index: number }) => {
    return (
      <div
        className="group relative p-2 rounded-lg transition-all duration-300 hover:scale-110"
        data-tooltip={catalogSkill.name}
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <Icon 
          icon={catalogSkill.icon} 
          className="h-10 w-10 text-white/80 group-hover:text-primary transition-colors" 
        />
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 text-xs font-medium bg-black/90 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {catalogSkill.name}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 glow-text animate-fade-in">
            Skills & Tech Stack
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Technologies and tools I'm proficient in
          </p>
        </div>

        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center px-4">
            <div className="text-center">
              <p className="text-white/80 text-lg font-medium">Loading...</p>
              <div className="mt-4 h-1 rounded-full overflow-hidden">
                <div className="h-full bg-white/20 rounded-full" style={{ animation: 'loading-progress 1.8s ease-in-out infinite', width: '30%' }} />
              </div>
            </div>
          </div>
        ) : (

          <div className="space-y-12">
            {Object.entries(groupLabels).map(([groupKey, label]) => {
              const list = filteredGrouped[groupKey as SkillGroup];
              if (!list || list.length === 0) return null;
              return (
                <div key={groupKey}>
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                    <Icon icon={categoryIcons[groupKey as SkillGroup]} className="h-8 w-8 text-primary" />
                    {label}
                  </h2>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                    {list.map((cs, index) => (
                      <SkillCard key={`${cs.name}-${index}`} catalogSkill={cs} index={index} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Skills;
