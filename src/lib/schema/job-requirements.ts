import { z } from "zod";

export const jobRequirementSchema = z.object({
  positionName: z
    .string()
    .min(1, "職種名は必須です")
    .max(100, "職種名は100文字以内で入力してください"),
  requiredSkills: z
    .array(z.string())
    .min(1, "必須スキルは1つ以上入力してください")
    .transform((skills) => skills.filter((skill) => skill.trim() !== "")),
  niceToHaveSkills: z
    .array(z.string())
    .transform((skills) => skills.filter((skill) => skill.trim() !== "")),
  experienceYears: z
    .number()
    .min(0, "経験年数は0以上で入力してください")
    .max(50, "経験年数は50以下で入力してください"),
  numberOfOpenings: z
    .number()
    .min(1, "募集人数は1以上で入力してください")
    .max(999, "募集人数は999以下で入力してください"),
  employmentType: z
    .string()
    .min(1, "雇用形態は必須です")
    .max(50, "雇用形態は50文字以内で入力してください"),
});

export type JobRequirementInput = z.infer<typeof jobRequirementSchema>;
