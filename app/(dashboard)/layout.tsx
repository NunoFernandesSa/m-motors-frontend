import React, { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return <div className="container mx-auto py-6">{children}</div>;
}
