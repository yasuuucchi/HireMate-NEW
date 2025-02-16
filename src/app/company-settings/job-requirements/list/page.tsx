"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { JobRequirementInput } from "@/lib/schema/job-requirements"

interface JobRequirement extends JobRequirementInput {
  id: string
  createdAt: string
}

export default function JobRequirementsList() {
  const [requirements, setRequirements] = useState<JobRequirement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const response = await fetch("/api/job-requirements")
        if (!response.ok) throw new Error("データの取得に失敗しました")
        const data = await response.json()
        setRequirements(data)
      } catch (error) {
        console.error(error)
        alert("採用要件の取得に失敗しました。")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequirements()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("この採用要件を削除してもよろしいですか？")) return

    try {
      const response = await fetch(`/api/job-requirements/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("削除に失敗しました")
      
      setRequirements(requirements.filter(req => req.id !== id))
    } catch (error) {
      console.error(error)
      alert("削除に失敗しました。もう一度お試しください。")
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="heading text-3xl sm:text-4xl mb-4">採用要件一覧</h1>
            <p className="text-lg text-muted">
              登録済みの採用要件を管理します。
            </p>
          </div>
          <Link
            href="/company-settings/job-requirements/new"
            className="btn btn-primary"
          >
            <span>新規登録</span>
            <span className="transform group-hover:translate-x-0.5 transition-smooth">→</span>
          </Link>
        </div>

        <div className="grid gap-6">
          {requirements.length === 0 ? (
            <div className="card p-8 text-center text-muted">
              採用要件が登録されていません。
            </div>
          ) : (
            requirements.map((req) => (
              <div key={req.id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="heading text-xl">{req.positionName}</h2>
                  <div className="flex gap-2">
                    <Link
                      href={`/company-settings/job-requirements/${req.id}/edit`}
                      className="btn btn-secondary btn-sm"
                    >
                      編集
                    </Link>
                    <button
                      onClick={() => handleDelete(req.id)}
                      className="btn btn-danger btn-sm"
                    >
                      削除
                    </button>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">必須スキル</h3>
                    <div className="flex flex-wrap gap-2">
                      {req.requiredSkills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">歓迎スキル</h3>
                    <div className="flex flex-wrap gap-2">
                      {req.niceToHaveSkills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-primary/5 text-primary/80 rounded-md text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">必要経験年数</h3>
                    <p>{req.experienceYears}年以上</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">募集人数</h3>
                    <p>{req.numberOfOpenings}名</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">雇用形態</h3>
                    <p>{req.employmentType}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
