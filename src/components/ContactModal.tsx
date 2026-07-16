import { useState } from 'react';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';

import { Send, Loader2, CheckCircle, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

import { Textarea } from '@/components/ui/textarea';

import { useToast } from '@/hooks/use-toast';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';



// Zod validation schema

const contactSchema = z.object({

  name: z.string().min(1, 'Name is required'),

  email: z.string().email('Please enter a valid email'),

  subject: z.string().optional(),

  message: z.string().min(10, 'Message must be at least 10 characters'),

});



type ContactFormData = z.infer<typeof contactSchema>;



// Replace with your Formspree endpoint if needed

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xbdlwwlr';



interface ContactModalProps {

  isOpen: boolean;

  onOpenChange: (open: boolean) => void;

}



export function ContactModal({ isOpen, onOpenChange }: ContactModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const [isSuccess, setIsSuccess] = useState(false);

  const { toast } = useToast();



  const {

    register,

    handleSubmit,

    reset,

    formState: { errors },

  } = useForm<ContactFormData>({

    resolver: zodResolver(contactSchema),

  });



  const onSubmit = async (data: ContactFormData) => {

    setIsSubmitting(true);

    setIsSuccess(false);



    try {

      const response = await fetch(FORMSPREE_ENDPOINT, {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json',

        },

        body: JSON.stringify(data),

      });



      if (response.ok) {

        setIsSuccess(true);

        toast({

          title: 'Message sent!',

          description: "Thank you for reaching out. I'll get back to you soon.",

        });

        reset();



        setTimeout(() => {

          setIsSuccess(false);

          onOpenChange(false);

        }, 2000);

      } else {

        throw new Error('Failed to send message');

      }

    } catch (error) {

      toast({

        title: 'Error',

        description:

          'Failed to send message. Please try again or email me directly.',

        variant: 'destructive',

      });

    } finally {

      setIsSubmitting(false);

    }

  };



  const handleClose = () => {

    onOpenChange(false);

    reset();

    setIsSuccess(false);

  };



  return (

    <AnimatePresence>

      {isOpen && (

        <motion.div

          className="fixed inset-0 z-50 flex items-center justify-center p-4"

          initial={{ opacity: 0 }}

          animate={{ opacity: 1 }}

          exit={{ opacity: 0 }}

        >

          {/* Backdrop */}

          <motion.div

            className="absolute inset-0 bg-black/60 backdrop-blur-md"

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            exit={{ opacity: 0 }}

            onClick={handleClose}

          />



          {/* Modal */}

          <motion.div

            className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"

            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 15 }}
            transition={shouldReduceMotion ? { duration: 0.15 } : { type: 'spring', stiffness: 300, damping: 30 }}

          >

            {/* Close Button */}

            <button

              onClick={handleClose}

              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors z-10"

              aria-label="Close modal"

            >

              <X className="w-4 h-4" />

            </button>



            <AnimatePresence mode="wait" initial={false}>

              {isSuccess ? (

                <motion.div

                  key="success"

                  initial={{ opacity: 0, scale: 0.95 }}

                  animate={{ opacity: 1, scale: 1 }}

                  exit={{ opacity: 0, scale: 0.95 }}

                  transition={{ duration: 0.3 }}

                  className="flex flex-col items-center justify-center p-12 text-center"

                >

                  <motion.div

                    initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.5, opacity: 0 }}
                    animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
                    transition={shouldReduceMotion ? { duration: 0.2, delay: 0.1 } : { type: "spring", stiffness: 200, damping: 15, delay: 0.15 }}

                    className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6"

                  >

                    <CheckCircle className="w-8 h-8 text-primary" />

                  </motion.div>

                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>

                  <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">

                    Thank you for reaching out. I'll get back to you soon.

                  </p>

                </motion.div>

              ) : (

                <motion.div

                  key="form"

                  initial={{ opacity: 0 }}

                  animate={{ opacity: 1 }}

                  exit={{ opacity: 0 }}

                  transition={{ duration: 0.2 }}

                >

                  {/* Header */}

                  <div className="px-8 pt-8 pb-4 text-center">

                    <h2 className="text-2xl font-bold mb-1">Send Message</h2>

                    <p className="text-muted-foreground text-sm">

                      Usually respond within 24 hours

                    </p>

                  </div>



                  {/* Form */}

                  <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-8">

                    <div className="space-y-4">

                      {/* Name */}

                      <motion.div

                        animate={errors.name && !shouldReduceMotion ? { x: [-6, 6, -6, 6, 0] } : {}}

                        transition={{ duration: 0.4 }}

                      >

                        <Input

                          id="name"

                          placeholder="Your name"

                          className="bg-secondary border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-12"

                          {...register('name')}

                        />

                        {errors.name && (

                          <p className="text-red-400 text-xs mt-1">

                            {errors.name.message}

                          </p>

                        )}

                      </motion.div>



                      {/* Email */}

                      <motion.div

                        animate={errors.email && !shouldReduceMotion ? { x: [-6, 6, -6, 6, 0] } : {}}

                        transition={{ duration: 0.4 }}

                      >

                        <Input

                          id="email"

                          type="email"

                          placeholder="your@email.com"

                          className="bg-secondary border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-12"

                          {...register('email')}

                        />

                        {errors.email && (

                          <p className="text-red-400 text-xs mt-1">

                            {errors.email.message}

                          </p>

                        )}

                      </motion.div>



                      {/* Subject */}

                      <div>

                        <Input

                          id="subject"

                          placeholder="Subject (optional)"

                          className="bg-secondary border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-12"

                          {...register('subject')}

                        />

                      </div>



                      {/* Message */}

                      <motion.div

                        animate={errors.message && !shouldReduceMotion ? { x: [-6, 6, -6, 6, 0] } : {}}

                        transition={{ duration: 0.4 }}

                      >

                        <Textarea

                          id="message"

                          placeholder="Your message..."

                          rows={4}

                          className="bg-secondary border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 resize-none"

                          {...register('message')}

                        />

                        {errors.message && (

                          <p className="text-red-400 text-xs mt-1">

                            {errors.message.message}

                          </p>

                        )}

                      </motion.div>



                      {/* Submit Button */}

                      <Button

                        type="submit"

                        className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background font-semibold transition-all"

                        disabled={isSubmitting || isSuccess}

                      >

                        {isSubmitting ? (

                          <>

                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                            Sending...

                          </>

                        ) : isSuccess ? (

                          <>

                            <CheckCircle className="mr-2 h-4 w-4" />

                            Sent!

                          </>

                        ) : (

                          <>

                            Send Message

                            <Send className="ml-2 h-4 w-4" />

                          </>

                        )}

                      </Button>

                    </div>

                  </form>

                </motion.div>

              )}

            </AnimatePresence>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>

  );

}

