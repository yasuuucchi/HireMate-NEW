"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { formSchema, type CultureValueFormData } from "@/lib/schema/culture-values"

export default function NewCultureValue() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CultureValueFormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      title: "",
      importance: 50,
    },
  })

  const onSubmit = async (formData: CultureValueFormData) => {
    try {
      console.log('Form data:', formData);
      const response = await fetch("/api/culture-values", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()

      if (!response.ok) {
        if (result.errors) {
          console.error("Validation errors:", result.errors)
          throw new Error(result.errors.map((e: any) => e.message).join("\n"))
        }
        throw new Error(result.message || "登録に失敗しました")
      }

      alert(result.message)
      router.push("/company-settings/culture-values")
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert("エラーが発生しました。もう一度お試しください。")
      }
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="heading text-3xl sm:text-4xl mb-4">カルチャー・バリュー登録</h1>
          <p className="text-lg text-muted">
            企業のコアバリューと重要度を設定します。
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* バリュー名 */}
          <div className="card">
            <label htmlFor="title" className="block heading text-lg mb-4">
              バリュー名
            </label>
            <input
              type="text"
              id="title"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
              placeholder="例: チャレンジ精神"
              {...register("title")}
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* 重要度 */}
          <div className="card">
            <label htmlFor="importance" className="block heading text-lg mb-4">
              重要度
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                id="importance"
                min={0}
                max={100}
                step={1}
                className="flex-1"
                {...register("importance", { valueAsNumber: true })}
              />
              <input
                type="number"
                min={0}
                max={100}
                className="w-20 px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
                {...register("importance", { valueAsNumber: true })}
              />
            </div>
            <p className="mt-2 text-sm text-muted">
              0～100の範囲で設定してください
            </p>
            {errors.importance && (
              <p className="mt-2 text-sm text-red-500">{errors.importance.message}</p>
            )}
          </div>

          {/* 送信ボタン */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "登録中..." : "登録する"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
