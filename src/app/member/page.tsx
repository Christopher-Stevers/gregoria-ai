import Link from "next/link";
import H2 from "~/components/base/h2";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

const Page = async () => {
  const session = await getServerAuthSession();
  console.log(session);
  const teamResponse = await api.team.getUserTeams.query(undefined);
  const teamId = teamResponse?.[0]?.team?.id as unknown as number;
  const teamFunnels = await api.funnelTemplate.getTeamFunnels.query({ teamId });

  return (
    <div>
      <H2>Funnels</H2>
      <ul>
        {teamFunnels.map((funnel) => (
          <li key={funnel.id}>
            <Link href={`/member/${funnel.name}`}>{funnel.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Page;
