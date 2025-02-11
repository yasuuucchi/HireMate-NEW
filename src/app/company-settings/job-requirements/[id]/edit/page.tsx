"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { jobRequirementSchema, type JobRequirementFormData, type JobRequirementData } from "@/lib/schema/job-requirements"

interface JobRequirement {
  id: string
  positionName: string
  requiredSkills: string[]
  niceToHaveSkills: string[]
  experienceYears: number
  numberOfOpenings: number
  employmentType: string
  createdAt: string
}

export default function EditJobRequirement({
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
  } = useForm<JobRequirementFormData>({
    resolver: zodResolver(jobRequirementSchema),
  })

  useEffect(() => {
    const fetchJobRequirement = async () => {
      try {
        const response = await fetch(`/api/job-requirements/${params.id}`)
        if (!response.ok) throw new Error("データの取得に失敗しました")
        const data: JobRequirement = await response.json()
        
        // フォームの初期値を設定
        reset({
          positionName: data.positionName,
          requiredSkills: data.requiredSkills.join(", "),
          niceToHaveSkills: data.niceToHaveSkills.join(", "),
          experienceYears: data.experienceYears,
          numberOfOpenings: data.numberOfOpenings,
          employmentType: data.employmentType,
        })
      } catch (error) {
        console.error(error)
        alert("採用要件の取得に失敗しました。")
        router.push("/company-settings/job-requirements")
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobRequirement()
  }, [params.id, reset, router])

  const onSubmit = async (data: JobRequirementFormData) => {
    try {
      const response = await fetch(`/api/job-requirements/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error("更新に失敗しました")
      }

      const result = await response.json()
      alert(result.message)
      router.push("/company-settings/job-requirements")
    } catch (error) {
      console.error(error)
      alert("エラーが発生しました。もう一度お試しください。")
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
          <h1 className="heading text-3xl sm:text-4xl mb-4">採用要件の編集</h1>
          <p className="text-lg text-muted">
            採用要件の内容を編集します。
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* 職種名 */}
          <div className="card">
            <label htmlFor="positionName" className="block heading text-lg mb-4">
              職種名
            </label>
            <input
              type="text"
              id="positionName"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
              placeholder="例: フロントエンドエンジニア"
              {...register("positionName")}
            />
            {errors.positionName && (
              <p className="mt-2 text-sm text-red-500">{errors.positionName.message}</p>
            )}
          </div>

          {/* 必須スキル */}
          <div className="card">
            <label htmlFor="requiredSkills" className="block heading text-lg mb-4">
              必須スキル
            </label>
            <textarea
              id="requiredSkills"
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
              placeholder="例: React, TypeScript, Next.js"
              {...register("requiredSkills")}
            />
            <p className="mt-2 text-sm text-muted">
              カンマ区切りで複数入力できます
            </p>
            {errors.requiredSkills && (
              <p className="mt-2 text-sm text-red-500">{errors.requiredSkills.message}</p>
            )}
          </div>

          {/* 歓迎スキル */}
          <div className="card">
            <label htmlFor="niceToHaveSkills" className="block heading text-lg mb-4">
              歓迎スキル
            </label>
            <textarea
              id="niceToHaveSkills"
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
              placeholder="例: GraphQL, AWS, Docker"
              {...register("niceToHaveSkills")}
            />
            <p className="mt-2 text-sm text-muted">
              カンマ区切りで複数入力できます
            </p>
            {errors.niceToHaveSkills && (
              <p className="mt-2 text-sm text-red-500">{errors.niceToHaveSkills.message}</p>
            )}
          </div>

          {/* 経験年数 */}
          <div className="card">
            <label htmlFor="experienceYears" className="block heading text-lg mb-4">
              必要経験年数
            </label>
            <input
              type="number"
              id="experienceYears"
              min={0}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
              placeholder="3"
              {...register("experienceYears", { valueAsNumber: true })}
            />
            <p className="mt-2 text-sm text-muted">
              年単位で入力してください
            </p>
            {errors.experienceYears && (
              <p className="mt-2 text-sm text-red-500">{errors.experienceYears.message}</p>
            )}
          </div>

          {/* 募集人数 */}
          <div className="card">
            <label htmlFor="numberOfOpenings" className="block heading text-lg mb-4">
              募集人数
            </label>
            <input
              type="number"
              id="numberOfOpenings"
              min={1}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
              placeholder="1"
              {...register("numberOfOpenings", { valueAsNumber: true })}
            />
            {errors.numberOfOpenings && (
              <p className="mt-2 text-sm text-red-500">{errors.numberOfOpenings.message}</p>
            )}
          </div>

          {/* 雇用形態 */}
          <div className="card">
            <label htmlFor="employmentType" className="block heading text-lg mb-4">
              雇用形態
            </label>
            <select
              id="employmentType"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
              {...register("employmentType")}
            >
              <option value="">選択してください</option>
              <option value="正社員">正社員</option>
              <option value="契約社員">契約社員</option>
              <option value="業務委託">業務委託</option>
              <option value="パートタイム">パートタイム</option>
            </select>
            {errors.employmentType && (
              <p className="mt-2 text-sm text-red-500">{errors.employmentType.message}</p>
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
