"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { candidateSchema, type CandidateFormData, standardStatuses } from "@/lib/schema/candidates";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function NewCandidatePage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [resumeError, setResumeError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      status: "応募",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setResumeError("ファイルサイズは5MB以下にしてください");
        setSelectedFileName("");
        event.target.value = "";
        return;
      }

      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setResumeError("PDF、Word文書のみアップロード可能です");
        setSelectedFileName("");
        event.target.value = "";
        return;
      }

      setSelectedFileName(file.name);
      setResumeError("");
    }
  };

  const onSubmit = async (data: CandidateFormData) => {
    try {
      if (!fileInputRef.current?.files?.[0]) {
        setResumeError("職務経歴書が必要です");
        return;
      }

      setUploading(true);
      setSubmitError("");
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("status", data.status);
      formData.append("resume", fileInputRef.current.files[0]);

      const response = await fetch("/api/candidates", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "登録に失敗しました");
      }

      router.push("/candidates");
    } catch (error) {
      console.error("Error creating candidate:", error);
      setSubmitError(error instanceof Error ? error.message : "候補者の登録に失敗しました");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">候補者登録</h1>

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            名前
          </label>
          <input
            type="text"
            id="name"
            {...register("name")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="山田 太郎"
          />
          {errors.name?.message && (
            <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="yamada.taro@example.com"
          />
          {errors.email?.message && (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            電話番号
          </label>
          <input
            type="tel"
            id="phone"
            {...register("phone")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="090-1234-5678"
          />
          {errors.phone?.message && (
            <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            ステータス
          </label>
          <select
            id="status"
            {...register("status")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            {standardStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            職務経歴書
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              ファイルを選択
            </button>
            <span className="ml-3 text-sm text-gray-500">
              {selectedFileName || "選択されていません"}
            </span>
          </div>
          {resumeError && (
            <p className="mt-2 text-sm text-red-600">{resumeError}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            PDF、Word文書 (.doc, .docx) が使用できます（最大5MB）
          </p>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => router.push("/candidates")}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {isSubmitting || uploading ? "登録中..." : "登録"}
          </button>
        </div>
      </form>
    </div>
  );
}
