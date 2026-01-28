import { motion, AnimatePresence } from "framer-motion";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface FilterBarProps {
  technologies: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  projectCount?: number;
}

export function FilterBar({
  technologies,
  activeFilter,
  onFilterChange,
  projectCount,
}: FilterBarProps) {
  const prefersReducedMotion = useReducedMotion();

  const allFilters = ["all", ...technologies];

  return (
    <div className="space-y-4">
      {/* Filter header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Filter by technology</span>
        </div>
        {activeFilter !== "all" && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => onFilterChange("all")}
          >
            <X className="h-3 w-3" />
            Clear filter
          </motion.button>
        )}
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          {allFilters.map((filter, index) => {
            const isActive = activeFilter === filter;
            const label = filter === "all" ? "All Projects" : filter;

            return (
              <motion.div
                key={filter}
                initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.03,
                }}
                layout={!prefersReducedMotion}
              >
                <Button
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFilterChange(filter)}
                  className={cn(
                    "relative transition-all duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "glass border-border/50 hover:border-primary/50 hover:bg-primary/10"
                  )}
                >
                  {label}
                  {/* Active indicator dot */}
                  {isActive && (
                    <motion.span
                      layoutId="filterIndicator"
                      className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </Button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Results count */}
      {projectCount !== undefined && (
        <motion.p
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={`${activeFilter}-${projectCount}`}
        >
          Showing{" "}
          <span className="font-medium text-foreground">{projectCount}</span>{" "}
          {projectCount === 1 ? "project" : "projects"}
          {activeFilter !== "all" && (
            <>
              {" "}
              with <span className="text-primary">{activeFilter}</span>
            </>
          )}
        </motion.p>
      )}
    </div>
  );
}

export default FilterBar;
