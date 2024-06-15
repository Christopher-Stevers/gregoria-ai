"use client";
import Member from "~/components/Member";
import { api } from "~/trpc/react";
import { useTeam } from "~/providers/TeamProvider";
import MemberProvider from "~/providers/MemberProvider";

const MemberPage = ({
  params: { funnelName },
}: {
  params: { funnelName: string };
}) => {
  const { teamId } = useTeam();
  const { data: funnelTemplate } = api.funnelTemplate.get.useQuery({
    teamId,
    name: funnelName,
  });
  if (!funnelTemplate) return null;
  return (
    <MemberProvider isLive={true}>
      <Member funnelTemplate={funnelTemplate} />
    </MemberProvider>
  );
};

export default MemberPage;
