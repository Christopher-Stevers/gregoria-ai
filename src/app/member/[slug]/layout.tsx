import { type ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode | ReactNode[] }) => {
  return <div className="p-12">{children}</div>;
};

export default Layout;
