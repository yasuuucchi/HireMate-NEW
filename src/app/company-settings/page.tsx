import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"

export default function CompanySettings() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-primary/10 to-white">
      <div className="section">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">企業設定</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            採用要件、カルチャー、評価基準の設定を行います。
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* 採用要件登録セクション */}
          <Link 
            href="/company-settings/job-requirements" 
            className="card group hover:bg-primary/5 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            <h2 className="text-2xl font-semibold text-primary mb-4 group-hover:text-accent group-hover:translate-x-1 transition-all duration-300">
              採用要件登録
            </h2>
            <p className="text-gray-600 mb-6">
              職種名、必須スキル、歓迎スキル、経験年数などを設定します。
            </p>
            <Button variant="primary" className="w-full sm:w-auto">
              新規登録
            </Button>
          </Link>

          {/* カルチャー・バリュー設定セクション */}
          <Link 
            href="/company-settings/culture-values" 
            className="card group hover:bg-primary/5 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            <h2 className="text-2xl font-semibold text-primary mb-4 group-hover:text-accent group-hover:translate-x-1 transition-all duration-300">
              カルチャー・バリュー設定
            </h2>
            <p className="text-gray-600 mb-6">
              企業のコアバリューと重要度を設定します。
            </p>
            <Button variant="primary" className="w-full sm:w-auto">
              設定する
            </Button>
          </Link>

          {/* 評価基準重みづけセクション */}
          <Link 
            href="/company-settings/evaluation-weights" 
            className="card group hover:bg-primary/5 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            <h2 className="text-2xl font-semibold text-primary mb-4 group-hover:text-accent group-hover:translate-x-1 transition-all duration-300">
              評価基準重みづけ
            </h2>
            <p className="text-gray-600 mb-6">
              スキル適合度、カルチャーフィット度、実績度、ポテンシャルの重みを設定します。
            </p>
            <Button variant="primary" className="w-full sm:w-auto">
              重みを設定
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
