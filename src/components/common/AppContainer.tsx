import { ReactNode } from "react";

interface AppContainerProps {
  children: ReactNode;
}

export function AppContainer({
  children,
}: AppContainerProps) {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {children}
    </div>
  );
}