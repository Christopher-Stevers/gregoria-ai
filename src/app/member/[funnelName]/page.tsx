"use client";
import Member from "~/components/Member";
import { api } from "~/trpc/react";
import { useTeam } from "~/providers/TeamProvider";
import { type ReactNode, createContext, useContext, useMemo } from "react";

const memberContext = createContext<null | { isLive: boolean }>(null);

export const useIsLive = () => {
  const context = useContext(memberContext);
  if (context === null) {
    throw new Error("useIsLive must be used within a MemberProvider");
  }
  return context.isLive;
};

const MemberProvider = ({
  children,
  isLive,
}: {
  children: ReactNode | ReactNode[];
  isLive: boolean;
}) => {
  const memoizedValue = useMemo(() => ({ isLive }), [isLive]);
  return (
    <memberContext.Provider value={memoizedValue}>
      {children}
    </memberContext.Provider>
  );
};

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
