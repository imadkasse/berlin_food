"use client";

import { useState } from "react";
import { X, Loader2, AlertTriangle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { deleteMenuItem } from "@/api/menu_items";
import { deleteImage } from "@/api/storage";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: any;
}

export default function DeleteMenuItemModal({ isOpen, onClose, onSuccess, item }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !item) return null;

  const handleDelete = async () => {
    setIsLoading(true);
    const supabase = createClient();
    try {
      // 1. Delete image if it's hosted on supabase storage
      if (item.image_url && item.image_url.includes('storage/v1/object/public/menu_items')) {
        await deleteImage(supabase, item.image_url);
      }
      // 2. Delete menu item
      await deleteMenuItem(supabase, item.id);
      
       toast.success("تم حذف عنصر القائمة بنجاح");
      onSuccess();
      onClose();
    } catch (error: any) {
       toast.error("تعذر حذف عنصر القائمة", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1B1B]/40 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 md:p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 border border-red-100">
            <AlertTriangle className="text-red-500 w-8 h-8" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-[#1C1B1B] mb-2">حذف عنصر القائمة</h2>
          <p className="text-sm font-medium text-[#5c5b5b] leading-relaxed mb-6">
            هل أنت متأكد من حذف <span className="font-bold text-[#1C1B1B]">&quot;{item.name}&quot;</span>؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
          
          <div className="flex w-full gap-3">
            <button 
              onClick={onClose} 
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-[#5c5b5b] hover:bg-[#F6F3F2] transition-colors"
            >
               إلغاء
            </button>
            <button 
              onClick={handleDelete}
              disabled={isLoading} 
              className="flex-1 bg-red-500 text-white px-4 py-3 rounded-xl font-bold text-sm shadow-md shadow-red-500/20 hover:bg-red-600 transition-all flex items-center justify-center"
            >
               {isLoading ? <Loader2 size={18} className="animate-spin" /> : "حذف"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
