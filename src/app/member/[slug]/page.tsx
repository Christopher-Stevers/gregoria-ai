import Member from "~/components/Member";
import { api } from "~/trpc/server";
import MemberProvider from "~/providers/MemberProvider";
import { getServersideTeam } from "~/providers/GetServersideTeam";

const MemberPage = async ({
  params: { slug },
}: {
  params: { slug: string };
}) => {
  const team = await getServersideTeam();
  const funnelTemplate = await api.funnelTemplate.get.query({
    teamId: team.id,
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
