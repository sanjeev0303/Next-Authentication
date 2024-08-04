"use server"

import { signOut } from "@/auth"

export const logout = async () => {
// somer server stuffs
  return signOut()
}