import React from "react"
import Link from "next/link"

export default function Home() {
  const features = [
    {
      title: "企業情報管理",
      description: "採用要件、カルチャー、評価基準の登録および設定",
      href: "/company-settings",
    },
    {
      title: "候補者管理",
      description: "書類アップロード、基本情報管理、ステータス管理",
      href: "/candidates",
    },
    {
      title: "面接アシスト",
      description: "面接質問の自動生成、キャリア可視化、面接シート作成",
      href: "/interview-sheets",
    },
  ]

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-primary/10 to-white">
      <div className="section">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-primary mb-6">
            HireMate
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AIを活用した次世代の採用支援サービス
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="card group hover:bg-primary/5 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              <h2 className="text-2xl font-semibold text-primary mb-4 group-hover:text-accent group-hover:translate-x-1 transition-all duration-300">
                {feature.title}
              </h2>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
