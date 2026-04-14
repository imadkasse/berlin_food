"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { getCategories } from "@/api/categories";
import { createMenuItem } from "@/api/menu_items";
import { uploadFile } from "@/api/storage";
import { Database } from "@/types/database.types";
import { toast } from "sonner";
import { Category } from "@/types/Category";

type MenuItemInsert = Database["public"]["Tables"]["menu_items"]["Insert"];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateMenuItemModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [formData, setFormData] = useState<MenuItemInsert>({
    name: "",
    description: "",
    price: 0,
    image_url: "",
    category_id: "",
    is_available: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      const supabase = createClient();
      try {
        const data = await getCategories(supabase);
        setCategories(data.map((c: Category) => ({ id: c.id, name: c.name })));
        if (data.length > 0 && !formData.category_id) {
          setFormData((prev) => ({ ...prev, category_id: data[0].id }));
        }
      } catch (error) {
        toast.error("Failed to fetch categories");
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const supabase = createClient();
    try {
      let finalImageUrl = formData.image_url;
      if (imageFile) {
        console.log(imageFile);

        finalImageUrl = await uploadFile(imageFile, supabase);
        console.log(finalImageUrl);
      }

      await createMenuItem(supabase, { ...formData, image_url: finalImageUrl });
      toast.success("Menu item created successfully");
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.log(error);

      if (error instanceof Error) {
        toast.error("Failed to create menu item", {
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
            Create Menu Item
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F27121]/10 text-[#afacac] hover:text-[#F27121] rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
          <div className="grid grid-cols-2 gap-5">
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
            <div>
              <label className="block text-[10px] font-bold text-[#5c5b5b] uppercase tracking-widest mb-2">
                Category
              </label>
              <select
                required
                value={formData.category_id || ""}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#F6F3F2] rounded-xl border-none focus:ring-2 focus:ring-[#F27121]/30 outline-none text-sm font-bold text-[#1C1B1B] transition-all"
                disabled={isLoadingCategories}>
                <option value="" disabled>
                  Select category...
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#5c5b5b] uppercase tracking-widest mb-2">
              Description
            </label>
            <textarea
              required
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 bg-[#F6F3F2] rounded-xl border-none focus:ring-2 focus:ring-[#F27121]/30 outline-none text-sm font-medium text-[#1C1B1B] transition-all min-h-[100px]"
              placeholder="Delicious details..."></textarea>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-bold text-[#5c5b5b] uppercase tracking-widest mb-2">
                Price (€)
              </label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value),
                  })
                }
                className="w-full px-4 py-3 bg-[#F6F3F2] rounded-xl border-none focus:ring-2 focus:ring-[#F27121]/30 outline-none text-sm font-bold text-[#1C1B1B] transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#5c5b5b] uppercase tracking-widest mb-2">
                Availability
              </label>
              <div className="flex items-center h-12">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_available ?? true}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_available: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F27121]"></div>
                  <span className="ml-3 text-sm font-bold text-[#1C1B1B]">
                    {formData.is_available ? "In Stock" : "Out of Stock"}
                  </span>
                </label>
              </div>
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
                "Create Item"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
