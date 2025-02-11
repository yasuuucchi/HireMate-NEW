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
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="heading text-4xl sm:text-5xl mb-4 text-gradient">
            HireMate
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            AIを活用した次世代の採用支援サービス
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="card card-hover relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
              <h2 className="heading text-xl mb-3 relative z-10 group-hover:text-primary-light transition-smooth">
                {feature.title}
              </h2>
              <p className="text-muted relative z-10">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
