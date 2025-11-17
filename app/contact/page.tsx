"use client"; 
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { apiPost } from '@/lib/api';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email is too long'),
  message: z.string().trim().min(1, 'Message is required').max(1000, 'Message is too long'),
});

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input
      const validated = contactSchema.parse(formData);

      await apiPost('/contact-messages', {
        name: validated.name,
        email: validated.email,
        message: validated.message,
      });

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      toast.success('Message sent successfully!');
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4 glow-text animate-fade-in">
          Get In Touch
        </h1>
        <p className="text-center text-muted-foreground mb-12 text-lg">
          Have a project in mind? Let's talk!
        </p>

        {submitted ? (
          <div className="glass-card p-12 rounded-lg text-center animate-fade-in">
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for reaching out. I'll get back to you soon!
            </p>
            <Button onClick={() => setSubmitted(false)} className="btn-glow">
              Send Another Message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card p-8 rounded-lg space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                maxLength={100}
                className="neon-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                maxLength={255}
                className="neon-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-lg">Message</Label>
              <Textarea
                id="message"
                placeholder="Tell me about your project..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                maxLength={1000}
                rows={6}
                className="neon-border resize-none"
              />
              <p className="text-sm text-muted-foreground text-right">
                {formData.message.length}/1000
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full btn-glow text-lg py-6"
            >
              {loading ? (
                <>Sending...</>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        )}

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Or reach me directly at:</p>
          <a
            href="mailto:afito@example.com"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-glow transition-colors text-lg"
          >
            <Mail className="h-5 w-5" />
            afito@example.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;