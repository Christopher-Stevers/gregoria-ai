"use client";
import Member from "~/components/Member";
import { api } from "~/trpc/react";
import { useTeam } from "~/providers/TeamProvider";

const MemberPage = () => {
  const team = useTeam();
  const { data: funnelTemplate } = api.funnelTemplate.get.useQuery({
    id: 1,
    teamId: team.id,
  });
  if (!funnelTemplate) return null;
  return <Member funnelTemplate={funnelTemplate} />;
};

export default MemberPage;
