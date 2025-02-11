import { z } from "zod"

// 入力データのスキーマ（フォームデータ）
export const formSchema = z.object({
  title: z
    .string()
    .min(1, "バリュー名を入力してください")
    .max(100, "バリュー名は100文字以内で入力してください"),
  importance: z
    .number()
    .min(0, "0以上の数値を入力してください")
    .max(100, "100以下の数値を入力してください"),
})

// 変換後のデータスキーマ（Prismaに保存するデータ）
export const cultureValueSchema = formSchema

// フォームデータの型
export type CultureValueFormData = z.infer<typeof formSchema>

// 変換後のデータ型
export type CultureValueData = z.infer<typeof cultureValueSchema>
