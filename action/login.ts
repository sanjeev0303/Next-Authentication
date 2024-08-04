"use server";

import * as z from "zod";
import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/token";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schema/index";
import { AuthError } from "next-auth";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { error } from "console";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { db } from "@/lib/db";


export const login = async (values: z.infer<typeof LoginSchema>, callbackUrl?: string | null) => {
  const validateFields = LoginSchema.safeParse(values);

  // Log the result of validation
  // console.log("Validation result:", validateFields);

  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validateFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation email sent!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      // TODO : Verify code
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)

      if (!twoFactorToken) {
        return { error: "Invalid code!" }
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid code!" }
      }

      const hasExpired = new Date (twoFactorToken.expires) < new Date()

      if (hasExpired) {
        return { error: "Code expired!" }
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id }
      })

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id }
        })
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        }
      })

    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }

  try {
    // const redirectTo = redirect(DEFAULT_LOGIN_REDIRECT)

    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
    return { success: "Login Successfully!" };
  } catch (error) {
    
    console.log("login error: ", error);

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid creadentials or not yet verified email!" };
        // case "AccessDenied":
        //   return { success: "Confirmation email sent!" };
        default:
          return { error: "Something went wrong" };
      }
    }
  }
};
