"use client";

/**
 * @license: MIT
 * @author: nuno fernandes
 * @Copyright (c) 2026 m-motors. All rights reserved.
 */

import { JSX, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

/**
 * Auth provider component for managing authentication state.
 * @param param0
 * @param param0.children - React children to wrap
 * @returns JSX.Element - Auth provider component
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return <>{children}</>;
}
