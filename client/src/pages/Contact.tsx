import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Mail, MapPin, Github, Linkedin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/layout/GlassCard";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/layout/AnimatedPage";
import { FloatingInput, FloatingTextarea } from "@/components/contact/FloatingInput";
import { SuccessAnimation } from "@/components/contact/SuccessAnimation";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { insertMessageSchema, type InsertMessage } from "@db/schema";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "srudeshan@yahoo.com",
    href: "mailto:srudeshan@yahoo.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Katowice, Poland",
    href: null,
  },
];

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com/Xza85hrf" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/ravindu-s-ab7914329/" },
];

export default function Contact() {
  const prefersReducedMotion = useReducedMotion();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InsertMessage>({
    resolver: zodResolver(insertMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: InsertMessage) =>
      fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      setShowSuccess(true);
      reset();
    },
  });

  const handleReset = () => {
    setShowSuccess(false);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-20 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={
            prefersReducedMotion
              ? {}
              : { scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }
          }
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl"
          animate={
            prefersReducedMotion
              ? {}
              : { scale: [1.1, 1, 1.1], opacity: [0.5, 0.8, 0.5] }
          }
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="space-y-16">
        {/* Header */}
        <AnimatedSection className="space-y-4">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full glass text-sm font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Contact
          </motion.span>
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Let's <span className="gradient-text">Connect</span>
          </motion.h1>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Have a project in mind or just want to say hello? I'd love to hear from you.
            Fill out the form below and I'll get back to you as soon as possible.
          </motion.p>
        </AnimatedSection>

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard variant="elevated" className="p-8">
              <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>

              <form
                onSubmit={handleSubmit((data) => mutation.mutate(data))}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <FloatingInput
                    id="name"
                    label="Your Name"
                    error={errors.name?.message}
                    {...register("name")}
                  />
                  <FloatingInput
                    id="email"
                    type="email"
                    label="Email Address"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                </div>

                <FloatingTextarea
                  id="message"
                  label="Your Message"
                  error={errors.message?.message}
                  {...register("message")}
                />

                <motion.div
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    size="lg"
                    disabled={mutation.isPending}
                    className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                  >
                    {mutation.isPending ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </GlassCard>
          </motion.div>

          {/* Contact Info Sidebar */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Contact Details */}
            <GlassCard variant="default" className="p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <StaggerContainer className="space-y-4">
                {contactInfo.map((item) => (
                  <StaggerItem key={item.label}>
                    <motion.div
                      className="flex items-center gap-4 group"
                      whileHover={prefersReducedMotion ? {} : { x: 4 }}
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="font-medium">{item.value}</p>
                        )}
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </GlassCard>

            {/* Social Links */}
            <GlassCard variant="default" className="p-6">
              <h3 className="text-lg font-semibold mb-4">Follow Me</h3>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.1, y: -2 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </GlassCard>

            {/* Quick Response */}
            <GlassCard variant="gradient" hover={false} className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse mt-1.5" />
                <div>
                  <h3 className="font-semibold mb-1">Quick Response</h3>
                  <p className="text-sm text-muted-foreground">
                    I typically respond within 24-48 hours. For urgent matters,
                    feel free to reach out on social media.
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Success Animation Overlay */}
      <SuccessAnimation isVisible={showSuccess} onReset={handleReset} />
    </div>
  );
}
