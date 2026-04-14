import { ProfileSettings } from "@/components/shared/ProfileSettings";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const page = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data;
  }
  return (
    <>
      <ProfileSettings user={profile} />
    </>
  );
};

export default page;
