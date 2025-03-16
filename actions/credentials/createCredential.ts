"use server"

import { SymmetricEncrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { createCredentialsSchema, createCredentialsSchemaType } from "@/schema/credentials";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function CreateCredentials(form: createCredentialsSchemaType) {
    const {success, data} = createCredentialsSchema.safeParse(form)

    if(!success){
        throw new Error("invalid form data")
    }

    const {userId} = await auth()

    if(!userId) {
        throw new Error("unauthenticated")
    }

    const encryptedValue = SymmetricEncrypt(data.value)

    console.log("@TEST", {
        plain: data.value,
        encrypted: encryptedValue
    });

    const result = await prisma.credential.create({
        data: {
            userId,
            name: data.name,
            value: encryptedValue
        }
    })

    if(!result){
        throw new Error("failed to create creadentail")
    }

    revalidatePath("/credentials")
}