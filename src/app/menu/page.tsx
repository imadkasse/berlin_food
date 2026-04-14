import { getCategories } from "@/api/categories";
import { getMenuItems } from "@/api/menu_items";
import Menu from "@/components/menu/Menu";
import { Category } from "@/types/Category";
import { Menu as MenuType } from "@/types/Menu";
import { createClient } from "@/utils/supabase/client";

const page = async () => {
  const supabase = createClient();
  const menuItems: MenuType[] = await getMenuItems(supabase);
  const categories: Category[] = await getCategories(supabase);

  return (
    <>
      <Menu categories={categories} menuItems={menuItems} />
    </>
  );
};

export default page;
