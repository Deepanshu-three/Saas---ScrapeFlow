import crypto from "crypto"
import "server-only"

const AGL = "aes-256-cbc";//key length is 32 byte


export const SymmetricEncrypt = (data: string) => {
    const key = process.env.ENCRYPTION_KEY

    if(!key){
        throw new Error("encryption key not found")
    }

    const iv = crypto.randomBytes(16)

    const cipher = crypto.createCipheriv(AGL, Buffer.from(key, "hex"), iv)

    let encrypted = cipher.update(data)

    encrypted = Buffer.concat([encrypted, cipher.final()])

    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export const SymmetricDecrypt = (encrypted: string) => {
    const key = process.env.ENCRYPTION_KEY

    if(!key) throw new Error("encryption key not found")

    const textPart = encrypted.split(":");

    const iv = Buffer.from(textPart.shift() as string, "hex")

    const encryptedText = Buffer.from(textPart.join(":"), "hex")

    const decipher = crypto.createDecipheriv(AGL, Buffer.from(key, "hex"), iv);

    let decrypted = decipher.update(encryptedText)

    decrypted = Buffer.concat([decrypted, decipher.final()])

    return decrypted.toString();

}
