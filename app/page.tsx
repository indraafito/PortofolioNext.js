"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  GraduationCap,
  Code,
  ExternalLink,
} from "lucide-react";
import { apiGet } from "@/lib/api";
import AOS from "aos";
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
  const [profile, setProfile] = useState<any>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
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
      setSkills(data.slice(0, 6));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProjects = async () => {
    try {
      const data = await apiGet<Project[]>("/projects");
      setProjects(data.slice(0, 3));
    } catch (error) {
      console.error(error);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section - padding atas agar tidak tertutup header, padding bawah lebih lega di desktop */}
      <div className="pt-20 pb-4 sm:pt-24 sm:pb-6 md:pt-32 md:pb-20 lg:pt-40 lg:pb-24 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Side Image - ukuran lebih kecil di mobile */}
            <div className="flex justify-center md:justify-end order-1 md:order-1">
              <div className="relative w-[min(60%,220px)] sm:w-[min(70%,320px)] md:w-[min(85%,380px)] lg:w-[min(80%,420px)] aspect-square">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, hsl(var(--primary-glow) / 0.8), transparent 70%)`,
                    filter: "blur(min(60px, 6vw))",
                    animation: "fireGlow 8s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite",
                    transformOrigin: "center center",
                  }}
                />
                <img
                  src={profile.photo_url || "/afito-profile.png"}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover z-10 relative"
                />
                <div
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/40 blur-xl rounded-full pointer-events-none"
                  style={{ opacity: 0.5 }}
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
              className="space-y-4 md:space-y-5 text-center md:text-left order-2 md:order-2 animate-fade-in cursor-area"
            >
              <BlurText
                text={profile.full_name}
                className="text-4xl sm:text-5xl md:text-6xl font-bold glow-text mb-2 leading-tight"
                delay={0.1}
                duration={0.8}
              />
              <BlurText
                text={profile.title}
                className="text-2xl sm:text-3xl md:text-4xl text-primary font-semibold mb-3"
                delay={0.3}
                duration={0.8}
              />
              <BlurText
                text={profile.tagline}
                className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0 mb-5"
                delay={0.5}
                duration={0.8}
              />

              <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-1">
                <Link href="/projects" passHref>
                  <Button
                    className="rounded-full px-6 py-3 h-11 md:h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/50 transition-all duration-300 hover:scale-105 focus-visible:ring-0 text-base md:text-lg"
                    size="lg"
                  >
                    View Projects
                    <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="rounded-full px-6 py-3 h-11 md:h-12 text-white/80 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 focus-visible:ring-0 text-base md:text-lg"
                  >
                    Contact Me
                  </Button>
                </Link>
              </div>

              <div className="flex gap-4 justify-center md:justify-start pt-2">
                <a
                  href="https://github.com/indraafito"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full text-white/70 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com/in/indraafito"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full text-white/70 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="mailto:indraafito56@gmail.com"
                  className="p-2.5 rounded-full text-white/70 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110"
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
        <div className="container mx-auto px-4 py-6 md:py-10">
          <div className="max-w-6xl mx-auto">
            <div data-aos="fade-up">
              <div className="flex items-center justify-between mb-5 md:mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold glow-text mb-1">
                    Education Journey
                  </h2>
                  <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
                    My educational background
                  </p>
                </div>
                <Link href="/about">
                  <Button
                    variant="ghost"
                    className="rounded-full px-3 py-1 h-7 md:h-8 text-white/80 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 focus-visible:ring-0 text-xs md:text-sm"
                  >
                    View Details
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Desktop: Horizontal Timeline */}
            <div className="hidden md:block relative">
              <div
                className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                style={{ transform: "translateY(-50%)" }}
              />
              <div className="relative flex justify-between items-center py-10">
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
                      <div
                        className={`flex flex-col items-center ${
                          isTop ? "mb-5 order-1" : "mt-5 order-3"
                        }`}
                      >
                        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-3 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group w-36 lg:w-44">
                          <div className="flex flex-col items-center text-center gap-1">
                            <div className="p-1.5 rounded-xl bg-primary/10 border border-primary/30 group-hover:scale-110 transition-transform duration-300">
                              <GraduationCap className="h-4 w-4 text-primary" />
                            </div>
                            <h3 className="text-xs lg:text-sm font-bold text-white/90 line-clamp-2">
                              {edu.institution}
                            </h3>
                            <p className="text-xs text-primary font-medium">
                              {edu.start_year} - {edu.end_year || "Present"}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`w-0.5 h-5 ${
                            isTop
                              ? "bg-gradient-to-b order-2"
                              : "bg-gradient-to-t order-1"
                          } from-primary/50 to-transparent`}
                        />
                      </div>
                      <div className="relative z-10 order-2">
                        <div className="w-3 h-3 rounded-full bg-primary border-2 border-background shadow-lg shadow-primary/50" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile: Vertical Timeline */}
            <div className="flex md:hidden flex-col gap-2 py-3">
              {education.map((edu, index) => (
                <div
                  key={edu.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 150}
                  className="flex items-start gap-3"
                >
                  <div className="flex flex-col items-center pt-1">
                    <div className="w-3 h-3 rounded-full bg-primary border-2 border-background shadow-lg shadow-primary/50 shrink-0" />
                    {index < education.length - 1 && (
                      <div
                        className="w-0.5 bg-gradient-to-b from-primary/50 to-transparent mt-1"
                        style={{ minHeight: "36px" }}
                      />
                    )}
                  </div>
                  <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-3 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group flex-1 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xl bg-primary/10 border border-primary/30 group-hover:scale-110 transition-transform duration-300 shrink-0">
                        <GraduationCap className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white/90 leading-snug">
                          {edu.institution}
                        </h3>
                        {edu.degree && (
                          <p className="text-[10px] text-white/50 mt-0.5">
                            {edu.degree}
                            {edu.field_of_study ? ` — ${edu.field_of_study}` : ""}
                          </p>
                        )}
                        <p className="text-[10px] text-primary font-medium mt-0.5">
                          {edu.start_year} - {edu.end_year || "Present"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Skills Preview Section */}
      {skills.length > 0 && (
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-6xl mx-auto">
            <div data-aos="fade-up">
              <div className="flex items-center justify-between mb-8 md:mb-12">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold glow-text mb-2">
                    Skills
                  </h2>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Technologies I work with
                  </p>
                </div>
                <Link href="/skills">
                  <Button
                    variant="ghost"
                    className="rounded-full px-4 md:px-5 py-2 h-9 text-white/80 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 focus-visible:ring-0 text-sm"
                  >
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="p-4 md:p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10">
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
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-6xl mx-auto">
            <div data-aos="fade-up">
              <div className="flex items-center justify-between mb-8 md:mb-12">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold glow-text mb-2">
                    Featured Projects
                  </h2>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Some of my recent work
                  </p>
                </div>
                <Link href="/projects">
                  <Button
                    variant="ghost"
                    className="rounded-full px-4 md:px-5 py-2 h-9 text-white/80 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 focus-visible:ring-0 text-sm"
                  >
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group"
                >
                  {project.thumbnail_url ? (
                    <div className="h-44 md:h-48 overflow-hidden">
                      <img
                        src={project.thumbnail_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-44 md:h-48 bg-gradient-primary flex items-center justify-center">
                      <Code className="h-14 w-14 md:h-16 md:w-16 text-white opacity-50" />
                    </div>
                  )}

                  <div className="p-5 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold mb-2">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {project.technologies && project.technologies.length > 0 && (
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
                          <Button
                            size="sm"
                            className="w-full rounded-full h-9 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/50 transition-all duration-300 focus-visible:ring-0"
                          >
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