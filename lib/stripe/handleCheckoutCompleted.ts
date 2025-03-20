import { getCreditsPack, PackId } from "@/types/billing";
import "server-only"
import Stripe from "stripe";
import prisma from "../prisma";

export async function HandleCheckOutSessionCompleted(event: Stripe.Checkout.Session) {
    if(!event.metadata){
        throw new Error("metadata not define")
    }

    const {userId, packId} = event.metadata

    if(!userId){
        throw new Error("missing user id")
    }

    if(!packId){
        throw new Error("missing pack id")
    }

    const purchasedPack = getCreditsPack(packId as PackId)
    if(!purchasedPack){
        throw new Error("purchased pack is not found")
    }

    await prisma.userBalance.upsert({
        where: {userId},
        create: {
            userId,
            credits: purchasedPack.credits
        },
        update: {
            credits: {
                increment: purchasedPack.credits
            }
        }
    })

    await prisma.userPurchase.create({
        data:{
            userId,
            stripeId: event.id,
            description: `${purchasedPack.name} - ${purchasedPack.credits} credits`,
            amount: event.amount_total!,
            currency: event.currency!
        }
    })
}