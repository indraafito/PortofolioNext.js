"use client"; 
import { useEffect, useState } from "react";
import { GraduationCap, Calendar, Award } from "lucide-react";
import { apiGet } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-18">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-4 glow-text animate-fade-in">
            About Me
          </h1>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            My educational journey and achievements
          </p>

        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <LoadingSpinner size="md" text="Loading education data..." />
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
    </div>
  );
};

export default About;
