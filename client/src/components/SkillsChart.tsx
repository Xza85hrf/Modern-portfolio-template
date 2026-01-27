import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { type Skill } from "@db/schema";

interface SkillsChartProps {
  skills: Skill[];
}

export default function SkillsChart({ skills }: SkillsChartProps) {
  // Group skills by category
  const groupedSkills = skills?.reduce((acc, skill) => {
    const category = skill.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedSkills || {}).map(([category, categorySkills]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold">{category}</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categorySkills}>
                <XAxis 
                  dataKey="name"
                  tick={{ fill: 'hsl(var(--foreground))' }}
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fill: 'hsl(var(--foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
                <Bar
                  dataKey="proficiency"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                >
                  {categorySkills.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(var(--primary) / ${0.5 + (index * 0.1)})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
}
