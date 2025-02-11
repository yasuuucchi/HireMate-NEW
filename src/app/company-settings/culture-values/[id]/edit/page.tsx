"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { formSchema, type CultureValueFormData } from "@/lib/schema/culture-values"

interface CultureValue {
  id: string
  title: string
  importance: number
  createdAt: string
}

export default function EditCultureValue({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CultureValueFormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
  })

  useEffect(() => {
    const fetchCultureValue = async () => {
      try {
        const response = await fetch(`/api/culture-values/${params.id}`)
        if (!response.ok) throw new Error("データの取得に失敗しました")
        const data: CultureValue = await response.json()
        
        // フォームの初期値を設定
        reset({
          title: data.title,
          importance: data.importance,
        })
      } catch (error) {
        console.error(error)
        alert("カルチャー・バリューの取得に失敗しました。")
        router.push("/company-settings/culture-values")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCultureValue()
  }, [params.id, reset, router])

  const onSubmit = async (formData: CultureValueFormData) => {
    try {
      console.log('Form data:', formData);
      const response = await fetch(`/api/culture-values/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()

      if (!response.ok) {
        if (result.errors) {
          console.error("Validation errors:", result.errors)
          throw new Error(result.errors.map((e: any) => e.message).join("\n"))
        }
        throw new Error(result.message || "更新に失敗しました")
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

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">読み込み中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="heading text-3xl sm:text-4xl mb-4">カルチャー・バリューの編集</h1>
          <p className="text-lg text-muted">
            カルチャー・バリューの内容を編集します。
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
              {isSubmitting ? "更新中..." : "更新する"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
