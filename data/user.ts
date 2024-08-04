import { db } from "@/lib/db";


export const getUserByEmail = async (email: string)=>{
try {
    const user = await db.user.findUnique({ where: { email } })

    return user;
} catch  {
    return null;
}
}


export async function getUserById(userId: string) {
    try {
        return await db.user.findUnique({
            where: { id: userId },
          });
    } catch {
      return null;  
    }
  }