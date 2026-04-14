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
      
      toast.success("Menu item deleted successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error("Failed to delete menu item", { description: error.message });
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
          <h2 className="text-xl font-black tracking-tight text-[#1C1B1B] mb-2">Delete Menu Item</h2>
          <p className="text-sm font-medium text-[#5c5b5b] leading-relaxed mb-6">
            Are you sure you want to delete <span className="font-bold text-[#1C1B1B]">"{item.name}"</span>? This action cannot be undone.
          </p>
          
          <div className="flex w-full gap-3">
            <button 
              onClick={onClose} 
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-[#5c5b5b] hover:bg-[#F6F3F2] transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete}
              disabled={isLoading} 
              className="flex-1 bg-red-500 text-white px-4 py-3 rounded-xl font-bold text-sm shadow-md shadow-red-500/20 hover:bg-red-600 transition-all flex items-center justify-center"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
