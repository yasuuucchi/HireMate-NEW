"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import CancelButton from "@/components/ui/CancelButton";
import { FormError } from "@/components/ui/FormError";
import Link from "next/link";

export default function NewJobRequirementPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    positionName: "",
    requiredSkills: [""],
    niceToHaveSkills: [""],
    experienceYears: 0,
    numberOfOpenings: 1,
    employmentType: "",
  });

  const handleSkillChange = (
    index: number,
    value: string,
    field: "requiredSkills" | "niceToHaveSkills"
  ) => {
    const newSkills = [...formData[field]];
    newSkills[index] = value;

    // 最後の入力欄に値が入力された場合、新しい入力欄を追加
    if (index === newSkills.length - 1 && value !== "") {
      newSkills.push("");
    }

    // 空の入力欄が連続する場合、余分な入力欄を削除
    const lastNonEmptyIndex = newSkills
      .map((skill, i) => (skill !== "" ? i : -1))
      .filter((i) => i !== -1)
      .pop();

    const trimmedSkills =
      lastNonEmptyIndex !== undefined
        ? newSkills.slice(0, lastNonEmptyIndex + 2)
        : [""];

    setFormData({ ...formData, [field]: trimmedSkills });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/job-requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          experienceYears: Number(formData.experienceYears),
          numberOfOpenings: Number(formData.numberOfOpenings),
          requiredSkills: formData.requiredSkills.filter((skill) => skill !== ""),
          niceToHaveSkills: formData.niceToHaveSkills.filter(
            (skill) => skill !== ""
          ),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "エラーが発生しました");
      }

      router.push("/company-settings/job-requirements");
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          採用要件の新規登録
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <FormError message={error} />}

          <div>
            <label
              htmlFor="positionName"
              className="block text-sm font-medium text-gray-700"
            >
              職種名
            </label>
            <input
              type="text"
              id="positionName"
              value={formData.positionName}
              onChange={(e) =>
                setFormData({ ...formData, positionName: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              必須スキル
            </label>
            <div className="space-y-2">
              {formData.requiredSkills.map((skill, index) => (
                <input
                  key={index}
                  type="text"
                  value={skill}
                  onChange={(e) =>
                    handleSkillChange(index, e.target.value, "requiredSkills")
                  }
                  placeholder={`必須スキル ${index + 1}`}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              歓迎スキル
            </label>
            <div className="space-y-2">
              {formData.niceToHaveSkills.map((skill, index) => (
                <input
                  key={index}
                  type="text"
                  value={skill}
                  onChange={(e) =>
                    handleSkillChange(index, e.target.value, "niceToHaveSkills")
                  }
                  placeholder={`歓迎スキル ${index + 1}`}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="experienceYears"
              className="block text-sm font-medium text-gray-700"
            >
              経験年数
            </label>
            <input
              type="number"
              id="experienceYears"
              value={formData.experienceYears}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  experienceYears: e.target.valueAsNumber,
                })
              }
              min="0"
              max="50"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="numberOfOpenings"
              className="block text-sm font-medium text-gray-700"
            >
              募集人数
            </label>
            <input
              type="number"
              id="numberOfOpenings"
              value={formData.numberOfOpenings}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  numberOfOpenings: e.target.valueAsNumber,
                })
              }
              min="1"
              max="999"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="employmentType"
              className="block text-sm font-medium text-gray-700"
            >
              雇用形態
            </label>
            <input
              type="text"
              id="employmentType"
              value={formData.employmentType}
              onChange={(e) =>
                setFormData({ ...formData, employmentType: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Link href="/company-settings/job-requirements">
              <CancelButton>キャンセル</CancelButton>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? "保存中..." : "保存"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
