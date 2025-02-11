import React, { Suspense } from "react"
import dynamic from "next/dynamic"

const JobRequirementsList = dynamic(() => import("./list/page"), {
  ssr: false,
})

export default function JobRequirementsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">読み込み中...</div>
        </div>
      </div>
    }>
      <JobRequirementsList />
    </Suspense>
  )
} 