import MenuEditor from "@/components/admin/MenuEditor";
import { getMenuItems } from "@/api/menu_items";
import { getCategories } from "@/api/categories";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const page = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const items = await getMenuItems(supabase);
  const categories = await getCategories(supabase);

  return (
    <>
      <MenuEditor menuItemsData={items} categoriesData={categories} />
    </>
  );
};

export default page;
