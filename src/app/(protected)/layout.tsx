"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import ThemeContainer from "@/containers/theme-container";
import { Loading } from "../components/loading";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession() as any;

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    return redirect("/login");
  }

  return (
    <div>
      <ThemeContainer>{children}</ThemeContainer>
    </div>
  );
};

export default Layout;
