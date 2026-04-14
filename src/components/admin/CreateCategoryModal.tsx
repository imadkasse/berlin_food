"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { createCategory } from "@/api/categories";
import { uploadFile } from "@/api/storage";
import { Database } from "@/types/database.types";
import { toast } from "sonner";

type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateCategoryModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [formData, setFormData] = useState<CategoryInsert>({
    name: "",
    image_url: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const supabase = createClient();
    try {
      let finalImageUrl = formData.image_url;
      if (imageFile) {
        finalImageUrl = await uploadFile(imageFile, supabase);
      }

      await createCategory(supabase, { ...formData, image_url: finalImageUrl });
      toast.success("Category created successfully");
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        toast.error("Failed to create category", {
          description: error.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1B1B]/40 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-[#1C1B1B]/5">
          <h2 className="text-2xl font-black tracking-tight text-[#1C1B1B]">
            Create Categor
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F27121]/10 text-[#afacac] hover:text-[#F27121] rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
          <div>
            <div>
              <label className="block text-[10px] font-bold text-[#5c5b5b] uppercase tracking-widest mb-2">
                Name
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#F6F3F2] rounded-xl border-none focus:ring-2 focus:ring-[#F27121]/30 outline-none text-sm font-bold text-[#1C1B1B] transition-all"
                placeholder="e.g. Truffle Pizza"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#5c5b5b] uppercase tracking-widest mb-2">
              Image Upload
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  setFormData({ ...formData, image_url: "" });
                }
              }}
              className="w-full px-4 py-3 bg-[#F6F3F2] rounded-xl border-none focus:ring-2 focus:ring-[#F27121]/30 outline-none text-sm font-medium text-[#1C1B1B] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#F27121]/10 file:text-[#F27121] hover:file:bg-[#F27121]/20 cursor-pointer"
            />
            {imageFile && (
              <div className="mt-4 flex items-center gap-4 p-3 bg-white rounded-xl border border-[#e5e2e1] shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="w-14 h-14 object-cover rounded-lg border border-[#e5e2e1]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1C1B1B] truncate">
                    {imageFile.name}
                  </p>
                  <p className="text-[10px] text-[#5c5b5b] font-medium mt-0.5 uppercase tracking-wide">
                    {(imageFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            )}
            <div className="mt-3">
              <span className="text-[10px] font-bold text-[#5c5b5b] uppercase tracking-widest mb-2 block">
                Or Use Image URL
              </span>
              <input
                type="url"
                value={formData.image_url || ""}
                onChange={(e) => {
                  setFormData({ ...formData, image_url: e.target.value });
                  setImageFile(null);
                }}
                className="w-full px-4 py-3 bg-[#F6F3F2] rounded-xl border-none focus:ring-2 focus:ring-[#F27121]/30 outline-none text-sm font-medium text-[#1C1B1B] transition-all"
                placeholder="https://..."
              />
            </div>
            {formData.image_url && !imageFile && (
              <div className="mt-4 flex items-center gap-4 p-3 bg-white rounded-xl border border-[#e5e2e1] shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-14 h-14 object-cover rounded-lg border border-[#e5e2e1]"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1C1B1B] truncate">
                    URL Preview
                  </p>
                  <p className="text-[10px] text-[#5c5b5b] font-medium mt-0.5 uppercase tracking-wide">
                    External Image
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-full font-bold text-sm text-[#5c5b5b] hover:bg-[#F6F3F2] transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#F27121] text-white px-8 py-3 rounded-full font-bold text-sm shadow-md shadow-[#F27121]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center min-w-[120px]">
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "Create Category"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
