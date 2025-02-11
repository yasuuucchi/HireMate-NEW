import React from "react"
import Link from "next/link"

export default function CompanySettings() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="heading text-3xl sm:text-4xl mb-4">企業設定</h1>
          <p className="text-lg text-muted max-w-3xl">
            採用要件、カルチャー、評価基準の設定を行います。
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* 採用要件登録セクション */}
          <Link href="/company-settings/job-requirements" className="card card-hover relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
            <h2 className="heading text-xl mb-4 relative z-10">
              採用要件登録
            </h2>
            <p className="text-muted mb-6 relative z-10">
              職種名、必須スキル、歓迎スキル、経験年数などを設定します。
            </p>
            <div className="btn btn-primary relative z-10">
              <span>新規登録</span>
              <span className="transform group-hover:translate-x-0.5 transition-smooth">→</span>
            </div>
          </Link>

          {/* カルチャー・バリュー設定セクション */}
          <Link href="/company-settings/culture-values" className="card card-hover relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
            <h2 className="heading text-xl mb-4 relative z-10">
              カルチャー・バリュー設定
            </h2>
            <p className="text-muted mb-6 relative z-10">
              企業のコアバリューと重要度を設定します。
            </p>
            <div className="btn btn-primary relative z-10">
              <span>設定する</span>
              <span className="transform group-hover:translate-x-0.5 transition-smooth">→</span>
            </div>
          </Link>

          {/* 評価基準重みづけセクション */}
          <Link href="/company-settings/evaluation-weights" className="card card-hover relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
            <h2 className="heading text-xl mb-4 relative z-10">
              評価基準重みづけ
            </h2>
            <p className="text-muted mb-6 relative z-10">
              スキル適合度、カルチャーフィット度、実績度、ポテンシャルの重みを設定します。
            </p>
            <div className="btn btn-primary relative z-10">
              <span>重みを設定</span>
              <span className="transform group-hover:translate-x-0.5 transition-smooth">→</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
