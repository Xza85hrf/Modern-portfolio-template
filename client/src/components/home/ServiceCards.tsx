import { memo } from "react";
import { motion } from "framer-motion";
import { Code2, Database, Palette, Server, Smartphone, Zap } from "lucide-react";
import { TiltCard } from "@/components/3d/TiltCard";
import { GlassCard } from "@/components/layout/GlassCard";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface Service {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
  iconColor: string;
}

const services: Service[] = [
  {
    icon: Code2,
    title: "Frontend Development",
    description: "Creating responsive, intuitive interfaces with React, TypeScript, and modern CSS.",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    icon: Server,
    title: "Backend Solutions",
    description: "Building robust APIs and server-side applications with Node.js and Express.",
    gradient: "from-secondary/20 to-secondary/5",
    iconColor: "text-secondary",
  },
  {
    icon: Database,
    title: "Database Design",
    description: "Designing efficient schemas and optimizing queries for PostgreSQL and more.",
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Crafting beautiful, user-centered designs with attention to detail.",
    gradient: "from-chart-4/20 to-chart-4/5",
    iconColor: "text-chart-4",
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description: "Ensuring seamless experiences across all devices and screen sizes.",
    gradient: "from-chart-5/20 to-chart-5/5",
    iconColor: "text-chart-5",
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Optimizing applications for speed, accessibility, and user experience.",
    gradient: "from-primary/20 to-accent/5",
    iconColor: "text-primary",
  },
];

interface ServiceCardsProps {
  className?: string;
}

export const ServiceCards = memo(function ServiceCards({ className }: ServiceCardsProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {services.map((service, index) => (
        <motion.div key={service.title} variants={staggerItemVariants}>
          <TiltCard
            className="h-full"
            tiltAmount={10}
            glareEnabled={!prefersReducedMotion}
          >
            <GlassCard
              variant="bordered"
              hover={false}
              className="h-full p-6 group"
            >
              {/* Icon with gradient background */}
              <div
                className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110",
                  `bg-gradient-to-br ${service.gradient}`
                )}
              >
                <service.icon className={cn("h-7 w-7", service.iconColor)} />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {service.description}
              </p>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div
                  className={cn(
                    "absolute top-2 right-2 w-full h-full rounded-bl-3xl",
                    `bg-gradient-to-bl ${service.gradient}`
                  )}
                  style={{
                    maskImage: "linear-gradient(135deg, black 0%, transparent 50%)",
                    WebkitMaskImage: "linear-gradient(135deg, black 0%, transparent 50%)",
                  }}
                />
              </div>
            </GlassCard>
          </TiltCard>
        </motion.div>
      ))}
    </motion.div>
  );
});

/**
 * Compact service cards for smaller sections
 */
export const ServiceCardsCompact = memo(function ServiceCardsCompact({ className }: ServiceCardsProps) {
  return (
    <motion.div
      className={cn("flex flex-wrap justify-center gap-4", className)}
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {services.slice(0, 4).map((service) => (
        <motion.div
          key={service.title}
          variants={staggerItemVariants}
          className="flex items-center gap-3 px-4 py-2 rounded-full glass"
        >
          <service.icon className={cn("h-5 w-5", service.iconColor)} />
          <span className="text-sm font-medium">{service.title}</span>
        </motion.div>
      ))}
    </motion.div>
  );
});

export default ServiceCards;
