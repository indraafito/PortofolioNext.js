"use client"; 
import { useEffect, useState } from "react";
import { GraduationCap, Calendar, Award, Sparkles } from "lucide-react";
import { apiGet } from "@/lib/api";

interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_year: number;
  end_year: number | null;
  description: string | null;
  achievements: string | null;
  order_index: number;
}

const About = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const data = await apiGet<Education[]>("/education");
      setEducation(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4 glow-text animate-fade-in">
          About Me
        </h1>
        <p className="text-center text-muted-foreground mb-12 text-lg">
          My educational journey and achievements
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
        ) : (
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div
                key={edu.id}
                className="glass-card p-6 rounded-lg hover:shadow-glow-md transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-1">
                      {edu.institution}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-3">
                      <span className="font-semibold text-primary">
                        {edu.degree}
                        {edu.field_of_study && ` - ${edu.field_of_study}`}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {edu.start_year} - {edu.end_year || "Present"}
                        </span>
                      </div>
                    </div>

                    {edu.description && (
                      <p className="text-muted-foreground mb-3">
                        {edu.description}
                      </p>
                    )}

                    {edu.achievements && (
                      <div className="flex flex-col gap-1 p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-start gap-2">
                          <Award className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <ul className="text-sm text-muted-foreground list-disc pl-4">
                            {edu.achievements.split("\n").map((item, index) => (
                              <li key={index}>{item.trim()}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
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

export default About;
