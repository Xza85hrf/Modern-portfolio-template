import { memo } from "react";
import { motion } from "framer-motion";
import { Code2, Server, Terminal, Wrench, Brain, Users } from "lucide-react";
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
    icon: Wrench,
    title: "IT Support",
    description: "Technical support for computers, software, printers, and network issues. Rapid response and durable solutions.",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    icon: Server,
    title: "System Administration",
    description: "Managing IT infrastructure, local networks, and workstations in Windows and Linux environments.",
    gradient: "from-secondary/20 to-secondary/5",
    iconColor: "text-secondary",
  },
  {
    icon: Terminal,
    title: "Scripting & Automation",
    description: "Python scripts for administrative tasks, office process automation, and streamlined workflows.",
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent",
  },
  {
    icon: Code2,
    title: "Software Development",
    description: "Building GUI applications, monitoring dashboards, and tools supporting IT teams and end users.",
    gradient: "from-chart-4/20 to-chart-4/5",
    iconColor: "text-chart-4",
  },
  {
    icon: Brain,
    title: "AI/ML Projects",
    description: "Image and audio processing projects, Vision AI platforms, and integration with local and cloud AI models.",
    gradient: "from-chart-5/20 to-chart-5/5",
    iconColor: "text-chart-5",
  },
  {
    icon: Users,
    title: "Technical Consulting",
    description: "IT solutions consulting for businesses, clear communication with non-technical users, and vendor coordination.",
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
