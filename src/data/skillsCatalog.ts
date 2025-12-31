export type SkillGroup =
  | 'programming-language'
  | 'framework-library'
  | 'database'
  | 'cloud-tool'
  | 'design'
  | 'other'

export interface CatalogSkill {
  name: string
  icon: string // iconify icon name, e.g., 'logos:javascript'
  group: SkillGroup
}

export const skillsCatalog: CatalogSkill[] = [
  // Programming Languages
  { name: 'JavaScript', icon: 'logos:javascript', group: 'programming-language' },
  { name: 'TypeScript', icon: 'logos:typescript-icon', group: 'programming-language' },
  { name: 'Python', icon: 'logos:python', group: 'programming-language' },
  { name: 'Go', icon: 'logos:go', group: 'programming-language' },

  // Frameworks & Libraries
  { name: 'React', icon: 'logos:react', group: 'framework-library' },
  { name: 'Next.js', icon: 'logos:nextjs', group: 'framework-library' },
  { name: 'Node.js', icon: 'logos:nodejs-icon', group: 'framework-library' },
  { name: 'Express', icon: 'logos:express', group: 'framework-library' },
  { name: 'Tailwind CSS', icon: 'logos:tailwindcss-icon', group: 'framework-library' },
  { name: 'Shadcn UI', icon: 'logos:tailwindcss-icon', group: 'framework-library' },

  // Databases
  { name: 'PostgreSQL', icon: 'logos:postgresql', group: 'database' },
  { name: 'MySQL', icon: 'logos:mysql', group: 'database' },
  { name: 'MongoDB', icon: 'logos:mongodb', group: 'database' },

  // Cloud & Tools
  { name: 'Vercel', icon: 'logos:vercel-icon', group: 'cloud-tool' },
  { name: 'AWS', icon: 'logos:aws', group: 'cloud-tool' },
  { name: 'Docker', icon: 'logos:docker-icon', group: 'cloud-tool' },
  { name: 'Git', icon: 'logos:git-icon', group: 'cloud-tool' },
  { name: 'GitHub', icon: 'mdi:github', group: 'cloud-tool' },
  { name: 'Neon', icon: 'simple-icons:neon', group: 'cloud-tool' },

  // Design
  { name: 'Figma', icon: 'logos:figma', group: 'design' },
  { name: 'Adobe XD', icon: 'simple-icons:adobexd', group: 'design' },
  { name: 'Canva', icon: 'logos:canva', group: 'design' },

  // Other
  { name: 'HTML5', icon: 'logos:html-5', group: 'other' },
  { name: 'CSS3', icon: 'logos:css-3', group: 'other' },
]

export const groupLabels: Record<SkillGroup, string> = {
  'programming-language': 'Programming Languages',
  'framework-library': 'Frameworks & Libraries',
  database: 'Databases',
  'cloud-tool': 'Cloud & Tools',
  design: 'Design Tools',
  other: 'Other',
}

export const categoryIcons: Record<SkillGroup, string> = {
  'programming-language': 'mdi:code-braces',
  'framework-library': 'mdi:layers-triple-outline',
  database: 'mdi:database-outline',
  'cloud-tool': 'mdi:cloud-outline',
  design: 'mdi:palette-outline',
  other: 'mdi:shape-outline',
}

export const findSkillByName = (name: string) =>
  skillsCatalog.find((s) => s.name.toLowerCase() === name.toLowerCase())
