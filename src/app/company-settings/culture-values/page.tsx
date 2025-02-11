"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { type CultureValueData } from "@/lib/schema/culture-values"

interface CultureValue extends CultureValueData {
  id: string
  createdAt: string
}

export default function CultureValuesList() {
  const [values, setValues] = useState<CultureValue[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchValues = async () => {
      try {
        const response = await fetch("/api/culture-values")
        if (!response.ok) throw new Error("データの取得に失敗しました")
        const data = await response.json()
        setValues(data)
      } catch (error) {
        console.error(error)
        alert("カルチャー・バリューの取得に失敗しました。")
      } finally {
        setIsLoading(false)
      }
    }

    fetchValues()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("このカルチャー・バリューを削除してもよろしいですか？")) return

    try {
      const response = await fetch(`/api/culture-values/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("削除に失敗しました")
      
      setValues(values.filter(value => value.id !== id))
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
            <h1 className="heading text-3xl sm:text-4xl mb-4">カルチャー・バリュー一覧</h1>
            <p className="text-lg text-muted">
              登録済みのカルチャー・バリューを管理します。
            </p>
          </div>
          <Link
            href="/company-settings/culture-values/new"
            className="btn btn-primary"
          >
            <span>新規登録</span>
            <span className="transform group-hover:translate-x-0.5 transition-smooth">→</span>
          </Link>
        </div>

        <div className="grid gap-6">
          {values.length === 0 ? (
            <div className="card p-8 text-center text-muted">
              カルチャー・バリューが登録されていません。
            </div>
          ) : (
            values.map((value) => (
              <div key={value.id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="heading text-xl">{value.title}</h2>
                  <div className="flex gap-2">
                    <Link
                      href={`/company-settings/culture-values/${value.id}/edit`}
                      className="btn btn-secondary btn-sm"
                    >
                      編集
                    </Link>
                    <button
                      onClick={() => handleDelete(value.id)}
                      className="btn btn-danger btn-sm"
                    >
                      削除
                    </button>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">重要度</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${value.importance}%` }}
                        />
                      </div>
                      <span className="text-sm">{value.importance}%</span>
                    </div>
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
