import { getRequestById } from "@/api/admin";
import CompleteRegistrationPage from "@/components/auth/CompleteRegisterDelivery";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import React from "react";

const page = async ({ params }: { params: { requestId: string } }) => {
  const { requestId } = await params;
  const cookiesStore = await cookies();
  const supabase = createClient(cookiesStore);
  const request = await getRequestById(requestId, supabase);
  return <CompleteRegistrationPage requestData={request} />;
};

export default page;
