import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { ParticleBackground, StarBackground } from "@/components/home/ParticleBackground";
import { HeroContent } from "@/components/home/HeroContent";
import { Hero3D } from "@/components/home/Hero3D";
import { ServiceCards } from "@/components/home/ServiceCards";
import { GlassCard } from "@/components/layout/GlassCard";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/layout/AnimatedPage";
import { ProjectCard3D } from "@/components/portfolio/ProjectCard3D";
import { ProjectModal } from "@/components/portfolio/ProjectModal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Project } from "@db/schema";

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Fetch featured projects
  const { data: projects } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => fetch("/api/projects").then((res) => res.json()),
  });

  const featuredProjects = projects?.slice(0, 3) || [];

  return (
    <div className="relative">
      {/* Particle Background - only render if not reduced motion */}
      {!prefersReducedMotion && (
        <div className="fixed inset-0 -z-10">
          <ParticleBackground className="absolute inset-0" />
        </div>
      )}

      {/* Fallback star background */}
      <StarBackground className="-z-20" />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <HeroContent />

            {/* 3D Decoration */}
            <div className="hidden lg:block relative h-[500px]">
              <Hero3D />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <AnimatedSection className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.span
              className="inline-block px-4 py-1.5 rounded-full glass text-sm font-medium mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              What I Do
            </motion.span>
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Services & <span className="gradient-text">Expertise</span>
            </motion.h2>
            <motion.p
              className="text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Comprehensive solutions for modern web development needs
            </motion.p>
          </div>

          <ServiceCards />
        </div>
      </AnimatedSection>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <AnimatedSection className="py-24 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-4">
              <div>
                <motion.span
                  className="inline-block px-4 py-1.5 rounded-full glass text-sm font-medium mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  Portfolio
                </motion.span>
                <motion.h2
                  className="text-3xl md:text-4xl lg:text-5xl font-bold"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  Featured <span className="gradient-text">Projects</span>
                </motion.h2>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  href="/portfolio"
                  className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2 glass border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                >
                  View All Projects
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <StaggerItem key={project.id}>
                  <ProjectCard3D
                    project={project}
                    onViewDetails={setSelectedProject}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </AnimatedSection>
      )}

      {/* CTA Section */}
      <AnimatedSection className="py-24">
        <div className="container mx-auto px-4">
          <GlassCard
            variant="gradient"
            hover={false}
            className="relative overflow-hidden p-8 md:p-16 text-center"
          >
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10">
              <motion.h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Let's Work <span className="gradient-text">Together</span>
              </motion.h2>
              <motion.p
                className="text-muted-foreground max-w-2xl mx-auto mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Have a project in mind? I'd love to hear about it. Let's create something amazing together.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                className="inline-block"
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-11 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40"
                >
                  Start a Conversation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </GlassCard>
        </div>
      </AnimatedSection>

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
