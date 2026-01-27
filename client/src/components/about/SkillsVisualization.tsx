import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { type Skill } from "@db/schema";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface SkillsVisualizationProps {
  skills: Skill[];
}

// Color mapping for categories
const categoryColors: Record<string, { ring: string; bg: string; text: string }> = {
  Infrastructure: {
    ring: "stroke-primary",
    bg: "bg-primary/10",
    text: "text-primary",
  },
  Development: {
    ring: "stroke-secondary",
    bg: "bg-secondary/10",
    text: "text-secondary",
  },
  Tools: {
    ring: "stroke-accent",
    bg: "bg-accent/10",
    text: "text-accent",
  },
  "AI/ML": {
    ring: "stroke-chart-4",
    bg: "bg-chart-4/10",
    text: "text-chart-4",
  },
  Languages: {
    ring: "stroke-chart-5",
    bg: "bg-chart-5/10",
    text: "text-chart-5",
  },
  Other: {
    ring: "stroke-muted-foreground",
    bg: "bg-muted/10",
    text: "text-muted-foreground",
  },
};

function getColorForCategory(category: string) {
  return categoryColors[category] || categoryColors.Other;
}

interface SkillRingProps {
  skill: Skill;
  index: number;
}

const SkillRing = memo(function SkillRing({ skill, index }: SkillRingProps) {
  const prefersReducedMotion = useReducedMotion();
  const colors = getColorForCategory(skill.category);

  // SVG circle properties
  const size = 100;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = skill.proficiency / 100;
  const offset = circumference * (1 - progress);

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.5,
        delay: index * 0.05,
      }}
    >
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/30"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={colors.ring}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{
              strokeDashoffset: prefersReducedMotion ? offset : offset,
            }}
            viewport={{ once: true }}
            transition={{
              duration: prefersReducedMotion ? 0 : 1.5,
              delay: index * 0.05 + 0.2,
              ease: "easeOut",
            }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>
        {/* Percentage in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-lg font-bold"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.3,
              delay: index * 0.05 + 0.5,
            }}
          >
            {skill.proficiency}%
          </motion.span>
        </div>
      </div>
      <span className="text-sm font-medium text-center">{skill.name}</span>
    </motion.div>
  );
});

export function SkillsVisualization({ skills }: SkillsVisualizationProps) {
  const prefersReducedMotion = useReducedMotion();

  // Group skills by category
  const groupedSkills = useMemo(() => {
    return skills?.reduce((acc, skill) => {
      const category = skill.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>) || {};
  }, [skills]);

  return (
    <div className="space-y-12">
      {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => {
        const colors = getColorForCategory(category);

        return (
          <motion.div
            key={category}
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.5,
              delay: categoryIndex * 0.1,
            }}
          >
            {/* Category header */}
            <div className="flex items-center gap-3">
              <div className={cn("w-3 h-3 rounded-full", colors.bg, colors.text)}>
                <div className="w-full h-full rounded-full bg-current" />
              </div>
              <h3 className="text-xl font-semibold">{category}</h3>
              <div className="flex-1 h-px bg-border/50" />
            </div>

            {/* Skills grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {categorySkills.map((skill, index) => (
                <SkillRing
                  key={skill.id}
                  skill={skill}
                  index={categoryIndex * 5 + index}
                />
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * Compact skill bars for smaller displays
 */
export function SkillBars({ skills }: SkillsVisualizationProps) {
  const prefersReducedMotion = useReducedMotion();

  const groupedSkills = useMemo(() => {
    return skills?.reduce((acc, skill) => {
      const category = skill.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>) || {};
  }, [skills]);

  return (
    <div className="space-y-8">
      {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => {
        const colors = getColorForCategory(category);

        return (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-full", colors.bg.replace("/10", "/50"))} />
              {category}
            </h3>
            <div className="space-y-3">
              {categorySkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  className="space-y-1"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.3,
                    delay: (categoryIndex * categorySkills.length + index) * 0.03,
                  }}
                >
                  <div className="flex justify-between text-sm">
                    <span>{skill.name}</span>
                    <span className="text-muted-foreground">{skill.proficiency}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                    <motion.div
                      className={cn("h-full rounded-full", colors.ring.replace("stroke-", "bg-"))}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: prefersReducedMotion ? 0 : 1,
                        delay: (categoryIndex * categorySkills.length + index) * 0.03 + 0.2,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SkillsVisualization;
