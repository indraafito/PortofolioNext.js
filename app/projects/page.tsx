"use client"; 

import { useEffect, useState } from "react";
import { Github, ExternalLink, Code, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiGet } from "@/lib/api";

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

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await apiGet<Project[]>("/projects");
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4 glow-text animate-fade-in">
          Projects
        </h1>
        <p className="text-center text-muted-foreground mb-12 text-lg">
          Showcasing my work and achievements
        </p>

        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center relative">
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/30 animate-pulse" />
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                </div>

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
        ) : projects.length === 0 ? (
          <div className="text-center text-muted-foreground glass-card p-12 rounded-lg">
            <Code className="h-16 w-16 mx-auto mb-4 text-primary opacity-50" />
            <p className="text-lg">No projects yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="glass-card rounded-lg overflow-hidden hover:shadow-glow-md transition-all duration-300 animate-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
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
                  <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    {project.description}
                  </p>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="border border-primary/30"
                        >
                          {tech}
                        </Badge>
                      ))}
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
                        <Button className="w-full btn-glow">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Live Demo
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
