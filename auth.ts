import { getUserById } from "@/data/user";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { DefaultSession } from "next-auth";
import authConfig from "./auth.config";
import { db } from "./lib/db";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";


type UserRole = "ADMIN" | "USER";

declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
      isTwoFactorEnabled: boolean;
      name: string;
      email: string;
      isOAuth: boolean
    } & DefaultSession["user"];
  }

  interface JWT {
    role: UserRole;
    isTwoFactorEnabled: boolean;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date () }
      })
    }
  },
  callbacks: {
    async signIn({ user, account }) {
  
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;
  
      const existingUser = await getUserById(user.id as string);
  
      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) {
        return false;
      }
  
      // TODO: Add 2FA check
      if (existingUser.isTwoFactorEnabled) {
        const twoFatorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)
        
        if(!twoFatorConfirmation) return false

        // Delete two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFatorConfirmation.id }
        })
      }
  
      return true;
    },

    async session({ token, session }) {
      // console.log({ sessionToken: token });

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.isOAuth = token.isOAuth as boolean
      }

      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id)

      token.isOAuth = !!existingAccount;

      token.name = existingUser.name;
      token.email = existingUser.email

      token.role = existingUser.role as UserRole;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
