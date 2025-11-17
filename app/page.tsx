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
import * as LucideIcons from "lucide-react";

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
      const res = await fetch("http://localhost:3001/api/profiles");
      const data = await res.json();
      setProfile(data[0]);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const fetchEducation = async () => {
    try {
      const data = await apiGet<Education[]>("/education");
      setEducation(data.slice(0, 2)); // Ambil 2 teratas
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

  const getIcon = (iconName: string | null) => {
    if (!iconName) return LucideIcons.Code;
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Code;
  };

  // Ganti bagian loading di komponen Home dengan ini:

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-primary/20"
              style={{
                width: Math.random() * 100 + 50 + "px",
                height: Math.random() * 100 + 50 + "px",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                animation: `float ${
                  Math.random() * 10 + 5
                }s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
                filter: "blur(40px)",
                opacity: 0.3,
              }}
            />
          ))}
        </div>

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
                background:
                  "radial-gradient(circle, hsl(var(--primary) / 0.4), transparent)",
                filter: "blur(20px)",
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            />
          </div>

          {/* Loading text */}
          <div className="text-center space-y-2">
            <p className="text-xl font-semibold text-primary animate-pulse">
              Loading
              <span
                className="inline-block animate-bounce"
                style={{ animationDelay: "0ms" }}
              >
                .
              </span>
              <span
                className="inline-block animate-bounce"
                style={{ animationDelay: "150ms" }}
              >
                .
              </span>
              <span
                className="inline-block animate-bounce"
                style={{ animationDelay: "300ms" }}
              >
                .
              </span>
            </p>
            <p className="text-sm text-muted-foreground">Just a moment</p>
          </div>

          {/* Progress bar */}
          <div className="w-64 h-1 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-primary rounded-full"
              style={{
                animation: "loading-progress 2s ease-in-out infinite",
              }}
            />
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
              <h1 className="text-5xl md:text-6xl font-bold glow-text">
                {profile.full_name}
              </h1>

              <p className="text-2xl text-primary font-semibold">
                {profile.title}
              </p>

              <p className="text-lg text-muted-foreground max-w-xl">
                {profile.tagline}
              </p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                <Link href="/projects" passHref>
                  <Button className="btn-glow" size="lg">
                    View Projects
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Link href="/contact">
                  <Button variant="outline" size="lg" className="neon-border">
                    Contact Me
                  </Button>
                </Link>
              </div>

              <div className="flex gap-4 justify-center md:justify-start pt-4">
                <a
                  href="https://github.com/indraafito"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border border-primary/50 hover:border-primary hover:shadow-glow-md transition-all"
                >
                  <Github className="h-5 w-5" />
                </a>

                <a
                  href="https://linkedin.com/in/indraafito"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border border-primary/50 hover:border-primary hover:shadow-glow-md transition-all"
                >
                  <Linkedin className="h-5 w-5" />
                </a>

                <a
                  href="mailto:indraafito56@gmail.com"
                  className="p-3 rounded-full border border-primary/50 hover:border-primary hover:shadow-glow-md transition-all"
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
                  <h2 className="text-4xl font-bold glow-text mb-2">
                    Education
                  </h2>
                  <p className="text-muted-foreground">
                    My educational background
                  </p>
                </div>
                <Link href="/about">
                  <Button variant="outline" className="neon-border">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              {education.map((edu, index) => (
                <div
                  key={edu.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className="glass-card p-6 rounded-lg hover:shadow-glow-md transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-1">
                        {edu.institution}
                      </h3>
                      <p className="text-primary font-semibold">
                        {edu.degree}
                        {edu.field_of_study && ` - ${edu.field_of_study}`}
                      </p>
                      <p className="text-muted-foreground text-sm mt-1">
                        {edu.start_year} - {edu.end_year || "Present"}
                      </p>
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
                  <Button variant="outline" className="neon-border">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill, index) => {
                const Icon = getIcon(skill.icon_name);
                return (
                  <div
                    key={skill.id}
                    data-aos="zoom-in"
                    data-aos-delay={index * 50}
                    className="glass-card p-6 rounded-lg hover:shadow-glow-md transition-all duration-300 group"
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
                          <span className="font-semibold">
                            {skill.proficiency}%
                          </span>
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
              })}
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
                  <Button variant="outline" className="neon-border">
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
                  className="glass-card rounded-lg overflow-hidden hover:shadow-glow-md transition-all duration-300 group"
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
                              className="border border-primary/30 text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 3 && (
                            <Badge
                              variant="secondary"
                              className="border border-primary/30 text-xs"
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
                            variant="outline"
                            size="sm"
                            className="w-full neon-border"
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
                          <Button size="sm" className="w-full btn-glow">
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
