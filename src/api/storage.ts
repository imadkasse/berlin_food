import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function uploadFile(
  file: File,
  supabase: SupabaseClient<Database>,
): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("menu_items")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("menu_items").getPublicUrl(fileName);

  return publicUrl;
}

export async function deleteImage(
  supabase: SupabaseClient<Database>,
  url: string,
): Promise<void> {
  try {
    const fileName = url.split("/").pop();
    if (!fileName) return;

    if (url.includes("storage/v1/object/public/menu_items")) {
      const { error } = await supabase.storage
        .from("menu_items")
        .remove([fileName]);

      if (error) {
        console.error("Error deleting image:", error);
      }
    }
  } catch (error) {
    console.error("Error deleting image:", error);
  }
}
