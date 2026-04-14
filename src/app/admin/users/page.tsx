import UsersPage from "@/components/admin/Users";
import { getAllProfiles } from "@/api/profiles";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const page = async () => {
  const cookiesStore = await cookies();
  const supabase = createClient(cookiesStore);
  const usersData = await getAllProfiles(supabase);
  
  return (
    <>
      <UsersPage key={Math.random()} usersData={usersData} />
    </>
  );
};

export default page;
