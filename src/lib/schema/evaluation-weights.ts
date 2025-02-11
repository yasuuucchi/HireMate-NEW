import { z } from "zod"

// 入力データのスキーマ（フォームデータ）
export const formSchema = z.object({
  skillWeight: z
    .number()
    .min(0, "0以上の数値を入力してください")
    .max(100, "100以下の数値を入力してください"),
  cultureWeight: z
    .number()
    .min(0, "0以上の数値を入力してください")
    .max(100, "100以下の数値を入力してください"),
  achievementWeight: z
    .number()
    .min(0, "0以上の数値を入力してください")
    .max(100, "100以下の数値を入力してください"),
  potentialWeight: z
    .number()
    .min(0, "0以上の数値を入力してください")
    .max(100, "100以下の数値を入力してください"),
}).refine(
  (data) => {
    const total = data.skillWeight + data.cultureWeight + data.achievementWeight + data.potentialWeight;
    return total === 100;
  },
  {
    message: "重みの合計は100%になるように設定してください",
    path: ["skillWeight"], // エラーメッセージを表示する項目
  }
);

// 変換後のデータスキーマ（Prismaに保存するデータ）
export const evaluationWeightSchema = formSchema;

// フォームデータの型
export type EvaluationWeightFormData = z.infer<typeof formSchema>;

// 変換後のデータ型
export type EvaluationWeightData = z.infer<typeof evaluationWeightSchema>;
