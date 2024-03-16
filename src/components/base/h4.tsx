import type { ReactNode } from "react";

const H3 = ({
  children,
  className,
}: {
  children: ReactNode | ReactNode[];
  className?: string;
}) => {
  return <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>;
};

export default H3;
