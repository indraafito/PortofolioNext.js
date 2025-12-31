"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  GraduationCap,
  Code,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { apiGet } from "@/lib/api";
import AOS from "aos";
import "aos/dist/aos.css";
import { Icon as Iconify } from "@iconify/react";
import { LogoLoop } from "@/components/LogoLoop";
import BlurText from "@/components/ui/BlurText";

interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_year: number;
  end_year: number | null;
}

interface Skill {
  id: string;
  name: string;
  category: "hard" | "soft";
  icon_name: string | null;
  proficiency: number | null;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  github_url: string | null;
  live_url: string | null;
  thumbnail_url: string | null;
}

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const { currentColor } = useTheme();
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      easing: "ease-out-cubic",
    });

    fetchProfile();
    fetchEducation();
    fetchSkills();
    fetchProjects();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await apiGet<any[]>("/profiles");
      setProfile(data[0]);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const fetchEducation = async () => {
    try {
      const data = await apiGet<Education[]>("/education");
      setEducation(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSkills = async () => {
    try {
      const data = await apiGet<Skill[]>("/skills");
      setSkills(data.slice(0, 6)); // Ambil 6 teratas
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProjects = async () => {
    try {
      const data = await apiGet<Project[]>("/projects");
      setProjects(data.slice(0, 3)); // Ambil 3 teratas
    } catch (error) {
      console.error(error);
    }
  };

  const getIconElement = (iconName: string | null) => {
    if (!iconName) return <Iconify icon="lucide:code" className="h-6 w-6 text-primary" />;
    return <Iconify icon={iconName} className="h-6 w-6 text-primary" />;
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-white/80 text-lg font-medium">Loading...</p>
          <div className="mt-4 h-1 rounded-full overflow-hidden">
            <div className="h-full bg-white/20 rounded-full" style={{ animation: "loading-progress 1.8s ease-in-out infinite" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side Image */}
            <div className="flex justify-center md:justify-end order-1 md:order-1">
              <div className="relative w-80 h-96 md:w-96 md:h-[28rem] flex items-center justify-center overflow-visible">
                {/* Glow Effect */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, hsl(var(--primary-glow) / 1), transparent)`,
                    filter: "blur(120px)",
                    zIndex: -1,
                    animation:
                      "fireGlow 8s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite",
                    transformOrigin: "center center",
                  }}
                />

                {/* Profile Image */}
                <img
                  src={profile.photo_url || "/afito-profile.png"}
                  alt="Profile"
                  className="w-80 h-80 md:w-full md:h-full rounded-full object-cover z-10"
                />

                {/* Gradient Shadow */}
                <div
                  className="absolute bottom-0 left-0 w-full h-36 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0))",
                    transform: "translateY(100%) scaleY(0.9)",
                    filter: "blur(18px)",
                    opacity: 0.65,
                  }}
                />
              </div>
            </div>

            {/* Right Side Text */}
            <div
              ref={textRef}
              onMouseMove={(e) => {
                const el = textRef.current;
                if (!el) return;
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                el.style.setProperty("--mx", `${x}px`);
                el.style.setProperty("--my", `${y}px`);
              }}
              onMouseEnter={() => {
                const el = textRef.current;
                if (!el) return;
                el.style.setProperty("--cursor-opacity", "1");
              }}
              onMouseLeave={() => {
                const el = textRef.current;
                if (!el) return;
                el.style.setProperty("--cursor-opacity", "0");
              }}
              className="space-y-6 text-center md:text-left order-2 md:order-2 animate-fade-in cursor-area"
            >
              <BlurText 
                text={profile.full_name}
                className="text-5xl md:text-5xl font-bold glow-text mb-2"
                delay={0.1}
                duration={0.8}
              />

              <BlurText 
                text={profile.title}
                className="text-2xl text-primary font-semibold mb-4"
                delay={0.3}
                duration={0.8}
              />

              <BlurText 
                text={profile.tagline}
                className="text-lg text-muted-foreground max-w-xl mb-6"
                delay={0.5}
                duration={0.8}
              />

              <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                <Link href="/projects" passHref>
                  <Button className="rounded-full px-6 py-2.5 h-11 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/50 transition-all duration-300 hover:scale-105 focus-visible:ring-0" size="lg">
                    View Projects
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Link href="/contact">
                  <Button variant="ghost" size="lg" className="rounded-full px-6 py-2.5 h-11 text-white/80 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 focus-visible:ring-0">
                    Contact Me
                  </Button>
                </Link>
              </div>

              <div className="flex gap-4 justify-center md:justify-start pt-4">
                <a
                  href="https://github.com/indraafito"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full text-white/70 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110"
                >
                  <Github className="h-5 w-5" />
                </a>

                <a
                  href="https://linkedin.com/in/indraafito"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full text-white/70 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110"
                >
                  <Linkedin className="h-5 w-5" />
                </a>

                <a
                  href="mailto:indraafito56@gmail.com"
                  className="p-3 rounded-full text-white/70 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Education Preview Section */}
      {education.length > 0 && (
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div data-aos="fade-up">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-bold glow-text mb-2">Education Journey</h2>
                  <p className="text-muted-foreground">My educational background</p>
                </div>
                <Link href="/about">
                  <Button variant="ghost" className="rounded-full px-5 py-2 h-9 text-white/80 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 focus-visible:ring-0">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Timeline Container */}
            <div className="relative">
              {/* Horizontal Line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent" style={{ transform: 'translateY(-50%)' }} />
              
              {/* Timeline Items */}
              <div className="relative flex justify-between items-center py-20">
                {education.map((edu, index) => {
                  const isTop = index % 2 === 0;
                  return (
                    <div
                      key={edu.id}
                      data-aos={isTop ? "fade-down" : "fade-up"}
                      data-aos-delay={index * 150}
                      className="flex flex-col items-center"
                      style={{ flex: 1 }}
                    >
                      {/* Card positioned above or below */}
                      <div className={`flex flex-col items-center ${isTop ? 'mb-8' : 'mt-8'} ${isTop ? 'order-1' : 'order-3'}`}>
                        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group w-48">
                          <div className="flex flex-col items-center text-center gap-2">
                            <div className="p-2 rounded-xl bg-primary/10 border border-primary/30 group-hover:scale-110 transition-transform duration-300">
                              <GraduationCap className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="text-sm font-bold text-white/90 line-clamp-2">
                              {edu.institution}
                            </h3>
                            <p className="text-xs text-primary font-medium">
                              {edu.start_year} - {edu.end_year || "Present"}
                            </p>
                          </div>
                        </div>
                        {/* Connecting Line */}
                        <div className={`w-0.5 ${isTop ? 'h-8 bg-gradient-to-b' : 'h-8 bg-gradient-to-t'} from-primary/50 to-transparent ${isTop ? 'order-2' : 'order-1'}`} />
                      </div>
                      
                      {/* Center Dot */}
                      <div className="relative z-10 order-2">
                        <div className="w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg shadow-primary/50 group-hover:scale-125 transition-transform duration-300" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            
          </div>
        </div>
      )}

      {/* Skills Preview Section */}
      {skills.length > 0 && (
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div data-aos="fade-up">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-bold glow-text mb-2">Skills</h2>
                  <p className="text-muted-foreground">
                    Technologies I work with
                  </p>
                </div>
                <Link href="/skills">
                  <Button variant="ghost" className="rounded-full px-5 py-2 h-9 text-white/80 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 focus-visible:ring-0">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10">
              <LogoLoop
                icons={skills.map((s) => s.icon_name || "lucide:code")}
                size={32}
                speed={24}
                gap={32}
              />
            </div>
          </div>
        </div>
      )}

      {/* Projects Preview Section */}
      {projects.length > 0 && (
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div data-aos="fade-up">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-bold glow-text mb-2">
                    Featured Projects
                  </h2>
                  <p className="text-muted-foreground">
                    Some of my recent work
                  </p>
                </div>
                <Link href="/projects">
                  <Button variant="ghost" className="rounded-full px-5 py-2 h-9 text-white/80 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 focus-visible:ring-0">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group"
                >
                  {project.thumbnail_url ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={project.thumbnail_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-primary flex items-center justify-center">
                      <Code className="h-16 w-16 text-white opacity-50" />
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {project.technologies &&
                      project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.slice(0, 3).map((tech, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="bg-white/5 border border-white/10 text-white/80 text-xs px-2.5 py-0.5 rounded-full"
                            >
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 3 && (
                            <Badge
                              variant="secondary"
                              className="bg-white/5 border border-white/10 text-white/80 text-xs px-2.5 py-0.5 rounded-full"
                            >
                              +{project.technologies.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                    <div className="flex gap-3">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full rounded-full h-9 text-white/80 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 focus-visible:ring-0"
                          >
                            <Github className="mr-2 h-4 w-4" />
                            Code
                          </Button>
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button size="sm" className="w-full rounded-full h-9 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/50 transition-all duration-300 focus-visible:ring-0">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Demo
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
