"use client"; 

import { useEffect, useState } from "react";
import { Github, ExternalLink, Code, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiGet } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-18">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-4 glow-text animate-fade-in">
            Projects
          </h1>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Showcasing my work and achievements
          </p>

        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <LoadingSpinner size="md" text="Loading projects..." />
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
    </div>
  );
};

export default Projects;
