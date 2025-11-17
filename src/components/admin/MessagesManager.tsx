import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Trash2, Mail, MailOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { apiDelete, apiGet, apiPatch } from '@/lib/api';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

const MessagesManager = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await apiGet<Message[]>('/contact-messages', { auth: true });
      setMessages(data);
    } catch (error: any) {
      toast.error(error.message ?? 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const toggleRead = async (id: string, currentReadStatus: boolean) => {
    try {
      await apiPatch(`/contact-messages/${id}/read`, { read: !currentReadStatus }, { auth: true });
      fetchMessages();
    } catch (error: any) {
      toast.error(error.message ?? 'Failed to update message status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await apiDelete(`/contact-messages/${id}`, { auth: true });
      toast.success('Message deleted successfully');
      fetchMessages();
    } catch (error: any) {
      toast.error(error.message ?? 'Failed to delete message');
    }
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="glass-card p-12 rounded-lg text-center">
          <Mail className="h-16 w-16 mx-auto mb-4 text-primary opacity-50" />
          <p className="text-muted-foreground">No messages yet</p>
        </div>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            className={`glass-card p-6 rounded-lg ${!msg.read ? 'border-l-4 border-primary' : ''}`}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {msg.read ? (
                    <MailOpen className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Mail className="h-4 w-4 text-primary" />
                  )}
                  <h4 className="font-bold">{msg.name}</h4>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{msg.email}</p>
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleRead(msg.id, msg.read)}
                  className="neon-border"
                >
                  {msg.read ? 'Mark Unread' : 'Mark Read'}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(msg.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MessagesManager;
