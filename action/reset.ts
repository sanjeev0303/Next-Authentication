'use server';

import * as z from "zod";

import { getUserByEmail } from "@/data/user";
import { ResetSchema } from "@/schema";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/token";


export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedField = ResetSchema.safeParse(values);

    if (!validatedField.success) {
        return { error: "Invalid email!" }
    }

    const { email } = validatedField.data;

    const existingUser = await getUserByEmail(email);

    if(!existingUser){
        return { error: "Email does not exist!" }
    }

    const passwordResetToken = await generatePasswordResetToken(email);

    await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token
    )


    return { success: "Reset email sent!" }
}