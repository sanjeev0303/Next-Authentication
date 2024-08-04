"use server";

import bcrypt from 'bcryptjs'
import * as z from "zod"
import { RegisterSchema } from "@/schema/index";
import { db } from '@/lib/db';
import { getUserByEmail } from '@/data/user';

import { generateVerificationToken } from '@/lib/token';

import { sendVerificationEmail } from '@/lib/mail';

export const register = async (values: z.infer<typeof RegisterSchema>)=>{

    const validataFields = RegisterSchema.safeParse(values);

    if (! validataFields.success) {
        return{ error: "Invalid fields!" }
    }

    const { email, password, name } = validataFields.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
        return {error: "Email already in use!"}
    }

    await db.user.create({
        data:{
            name,
            email,
            password: hashedPassword,
        }
    })
    
    // Generates the verification email token
    const verificaitonToken = await generateVerificationToken(email)
    
    // Send verification token email
    await sendVerificationEmail(verificaitonToken.email, verificaitonToken.token)

    
    return { success: "Confirmation email sent!" }
}