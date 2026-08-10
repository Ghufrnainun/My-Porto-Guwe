import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Loader2, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { profile } from '@/data/profile';
import { useToast } from '@/hooks/use-toast';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xbdlwwlr';

interface ContactModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactModal({ isOpen, onOpenChange }: ContactModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      setIsSuccess(false);
      setSubmitError(false);
    }
    onOpenChange(open);
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(false);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to send message');

      setIsSuccess(true);
      reset();
      toast({ title: 'Message sent!', description: 'Thank you for reaching out.' });
    } catch {
      setSubmitError(true);
      toast({
        title: 'Message not sent',
        description: 'Please try again or email me directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent aria-describedby={isSuccess ? "contact-modal-success-desc" : "contact-modal-desc"} className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border-border bg-card p-0 shadow-2xl">
        {isSuccess ? (
          <div className="flex flex-col items-center p-6 text-center sm:p-10">
            <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle className="size-8" aria-hidden="true" />
            </div>
            <DialogHeader className="items-center text-center">
              <DialogTitle className="text-xl">Message sent!</DialogTitle>
              <DialogDescription id="contact-modal-success-desc" className="max-w-xs leading-relaxed">
                Thank you for reaching out. Your message has been sent.
              </DialogDescription>
            </DialogHeader>
            <Button className="mt-8" onClick={() => handleOpenChange(false)} autoFocus>
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="px-5 pb-2 pt-8 text-left sm:px-8">
              <DialogTitle className="text-2xl">Send Message</DialogTitle>
              <DialogDescription id="contact-modal-desc">
                Share the role, project, or problem you want to discuss.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-5 pb-6 sm:px-8 sm:pb-8" noValidate>
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
                  Name
                </label>
                <Input
                  id="name"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className="h-12 bg-secondary"
                  {...register('name')}
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className="h-12 bg-secondary"
                  {...register('email')}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-foreground">
                  Subject <span className="text-muted-foreground">(optional)</span>
                </label>
                <Input id="subject" className="h-12 bg-secondary" {...register('subject')} />
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
                  Message
                </label>
                <Textarea
                  id="message"
                  rows={4}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  className="resize-none bg-secondary"
                  {...register('message')}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1 text-xs text-destructive">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {submitError && (
                <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-foreground">
                  Message could not be sent. Try again or{' '}
                  <a className="font-semibold text-primary underline underline-offset-4" href={`mailto:${profile.email}`}>
                    email me directly
                  </a>
                  .
                </p>
              )}

              <Button type="submit" variant="glass" className="h-12 w-full text-base font-bold tracking-wide" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 size-4" aria-hidden="true" />
                  </>
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
