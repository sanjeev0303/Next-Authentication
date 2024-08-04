"use client";

import { useRouter } from "next/navigation";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import LoginForm from "@/components/auth/LoginForm";

interface loginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
}: loginButtonProps) => {
  const router = useRouter();

  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>
          {children}
        </DialogTrigger>
        <DialogContent className="p-0 w-aut0 bg-transparent border-none">
          <LoginForm />
        </DialogContent>
      </Dialog>
    )
  }

  const onClick = () => {
    router.push("/auth/login");
  };

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default LoginButton;
