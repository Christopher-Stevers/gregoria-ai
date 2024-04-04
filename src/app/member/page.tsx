"use client";
import { funnelTemplate } from "~/server/db/funnel";
import Member from "~/components/Member";

const MemberPage = () => {
  return <Member funnelTemplate={funnelTemplate} />;
};

export default MemberPage;
