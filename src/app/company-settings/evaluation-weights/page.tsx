"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { formSchema, type EvaluationWeightFormData } from "@/lib/schema/evaluation-weights"

export default function EvaluationWeights() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<EvaluationWeightFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      skillWeight: 25,
      cultureWeight: 25,
      achievementWeight: 25,
      potentialWeight: 25,
    },
  })

  // 各重みの値を監視
  const skillWeight = watch("skillWeight")
  const cultureWeight = watch("cultureWeight")
  const achievementWeight = watch("achievementWeight")
  const potentialWeight = watch("potentialWeight")

  // 合計値を計算
  const total = skillWeight + cultureWeight + achievementWeight + potentialWeight

  useEffect(() => {
    const fetchWeights = async () => {
      try {
        const response = await fetch("/api/evaluation-weights")
        if (!response.ok) throw new Error("データの取得に失敗しました")
        const data = await response.json()
        
        // フォームの初期値を設定
        reset(data)
      } catch (error) {
        console.error(error)
        alert("評価基準の重みの取得に失敗しました。")
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeights()
  }, [reset])

  const onSubmit = async (formData: EvaluationWeightFormData) => {
    try {
      console.log('Form data:', formData);
      const response = await fetch("/api/evaluation-weights", {
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
      router.push("/company-settings")
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert("エラーが発生しました。もう一度お試しください。")
      }
    }
  }

  // 他の重みを自動調整する関数
  const adjustOtherWeights = (
    changedField: keyof EvaluationWeightFormData,
    newValue: number
  ) => {
    const fields: (keyof EvaluationWeightFormData)[] = [
      "skillWeight",
      "cultureWeight",
      "achievementWeight",
      "potentialWeight",
    ]
    
    // 変更されたフィールド以外の現在の値を取得
    const otherFields = fields.filter(field => field !== changedField)
    const otherValues = otherFields.map(field => watch(field))
    const otherTotal = otherValues.reduce((sum, value) => sum + value, 0)
    
    // 残りの100%から新しい値を引いた分を、他のフィールドに比例配分
    const remaining = 100 - newValue
    if (otherTotal > 0) {
      otherFields.forEach(field => {
        const currentValue = watch(field)
        const proportion = currentValue / otherTotal
        setValue(field, Math.round(remaining * proportion))
      })
    } else {
      // 他のフィールドがすべて0の場合は均等に配分
      const equalShare = Math.round(remaining / otherFields.length)
      otherFields.forEach(field => setValue(field, equalShare))
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
          <h1 className="heading text-3xl sm:text-4xl mb-4">評価基準の重みづけ</h1>
          <p className="text-lg text-muted">
            4つの評価軸の重要度を設定します。合計が100%になるように調整してください。
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* 合計値の表示 */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="heading text-xl">合計</h2>
              <div className={`text-2xl font-bold ${total === 100 ? 'text-green-600' : 'text-red-600'}`}>
                {total}%
              </div>
            </div>
            {total !== 100 && (
              <p className="text-sm text-red-500">
                合計が100%になるように調整してください
              </p>
            )}
          </div>

          {/* スキル適合度 */}
          <div className="card">
            <label htmlFor="skillWeight" className="block heading text-lg mb-4">
              スキル適合度
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                id="skillWeight"
                min={0}
                max={100}
                step={1}
                className="flex-1"
                {...register("skillWeight", {
                  valueAsNumber: true,
                  onChange: (e) => adjustOtherWeights("skillWeight", Number(e.target.value)),
                })}
              />
              <input
                type="number"
                min={0}
                max={100}
                className="w-20 px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
                {...register("skillWeight", {
                  valueAsNumber: true,
                  onChange: (e) => adjustOtherWeights("skillWeight", Number(e.target.value)),
                })}
              />
            </div>
            {errors.skillWeight && (
              <p className="mt-2 text-sm text-red-500">{errors.skillWeight.message}</p>
            )}
          </div>

          {/* カルチャーフィット度 */}
          <div className="card">
            <label htmlFor="cultureWeight" className="block heading text-lg mb-4">
              カルチャーフィット度
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                id="cultureWeight"
                min={0}
                max={100}
                step={1}
                className="flex-1"
                {...register("cultureWeight", {
                  valueAsNumber: true,
                  onChange: (e) => adjustOtherWeights("cultureWeight", Number(e.target.value)),
                })}
              />
              <input
                type="number"
                min={0}
                max={100}
                className="w-20 px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
                {...register("cultureWeight", {
                  valueAsNumber: true,
                  onChange: (e) => adjustOtherWeights("cultureWeight", Number(e.target.value)),
                })}
              />
            </div>
            {errors.cultureWeight && (
              <p className="mt-2 text-sm text-red-500">{errors.cultureWeight.message}</p>
            )}
          </div>

          {/* 実績度 */}
          <div className="card">
            <label htmlFor="achievementWeight" className="block heading text-lg mb-4">
              実績度
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                id="achievementWeight"
                min={0}
                max={100}
                step={1}
                className="flex-1"
                {...register("achievementWeight", {
                  valueAsNumber: true,
                  onChange: (e) => adjustOtherWeights("achievementWeight", Number(e.target.value)),
                })}
              />
              <input
                type="number"
                min={0}
                max={100}
                className="w-20 px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
                {...register("achievementWeight", {
                  valueAsNumber: true,
                  onChange: (e) => adjustOtherWeights("achievementWeight", Number(e.target.value)),
                })}
              />
            </div>
            {errors.achievementWeight && (
              <p className="mt-2 text-sm text-red-500">{errors.achievementWeight.message}</p>
            )}
          </div>

          {/* ポテンシャル */}
          <div className="card">
            <label htmlFor="potentialWeight" className="block heading text-lg mb-4">
              ポテンシャル
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                id="potentialWeight"
                min={0}
                max={100}
                step={1}
                className="flex-1"
                {...register("potentialWeight", {
                  valueAsNumber: true,
                  onChange: (e) => adjustOtherWeights("potentialWeight", Number(e.target.value)),
                })}
              />
              <input
                type="number"
                min={0}
                max={100}
                className="w-20 px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
                {...register("potentialWeight", {
                  valueAsNumber: true,
                  onChange: (e) => adjustOtherWeights("potentialWeight", Number(e.target.value)),
                })}
              />
            </div>
            {errors.potentialWeight && (
              <p className="mt-2 text-sm text-red-500">{errors.potentialWeight.message}</p>
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
              disabled={isSubmitting || total !== 100}
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
