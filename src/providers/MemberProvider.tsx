"use client";
import { type ReactNode, useMemo, createContext, useContext } from "react";
export const useFunnel = () => {
  const context = useContext(memberContext);
  if (context === null) {
    throw new Error("useIsLive must be used within a MemberProvider");
  }
  return context;
};

const memberContext = createContext<null | { isLive: boolean }>(null);
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

export default MemberProvider;
