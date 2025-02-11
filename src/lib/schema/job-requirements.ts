import { z } from "zod"

// 入力データのスキーマ（フォームデータ）
export const formSchema = z.object({
  positionName: z
    .string()
    .min(1, "職種名を入力してください")
    .max(100, "職種名は100文字以内で入力してください"),
  requiredSkills: z
    .string()
    .min(1, "必須スキルを入力してください"),
  niceToHaveSkills: z
    .string(),
  experienceYears: z
    .number()
    .min(0, "0以上の数値を入力してください")
    .max(50, "50以下の数値を入力してください"),
  numberOfOpenings: z
    .number()
    .min(1, "1以上の数値を入力してください")
    .max(100, "100以下の数値を入力してください"),
  employmentType: z
    .string()
    .min(1, "雇用形態を選択してください")
})

// 変換後のデータスキーマ（Prismaに保存するデータ）
export const jobRequirementSchema = formSchema.transform((data) => ({
  ...data,
  requiredSkills: data.requiredSkills.split("・").map((s) => s.trim()).filter(Boolean),
  niceToHaveSkills: data.niceToHaveSkills ? data.niceToHaveSkills.split("・").map((s) => s.trim()).filter(Boolean) : [],
}))

// フォームデータの型
export type JobRequirementFormData = z.infer<typeof formSchema>

// 変換後のデータ型
export type JobRequirementData = z.infer<typeof jobRequirementSchema>
