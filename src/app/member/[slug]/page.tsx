"use client";
import Member from "~/components/Member";
import { api } from "~/trpc/react";
import { useTeam } from "~/providers/TeamProvider";
import MemberProvider from "~/providers/MemberProvider";

const MemberPage = ({ params: { slug } }: { params: { slug: string } }) => {
  const { teamId } = useTeam();
  console.log("teamId", teamId, "slug", slug);
  const { data: funnelTemplate } = api.funnelTemplate.get.useQuery({
    teamId,
    slug,
  });

  if (!funnelTemplate) return null;
  return (
    <MemberProvider isLive={true}>
      <Member funnelTemplate={funnelTemplate} />
    </MemberProvider>
  );
};

export default MemberPage;
