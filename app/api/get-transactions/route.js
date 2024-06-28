"use server";
import { TRANSACTION } from "@/app/dashboard/transactions/page";
import { db } from "@/utils/db";
import { client } from "@/utils/redis";
import { UserSubscription } from "@/utils/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const user = await currentUser();
    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const email = user?.primaryEmailAddress?.emailAddress;
    // Attempt to retrieve cached history
    const cacheKey = `transactions:${email}`;
    const cachedTransactions = await client.get(cacheKey);

    if (cachedTransactions) {
      return NextResponse.json({
        success: true,
        transactionList: JSON.parse(cachedTransactions),
      });
    }

    // @ts-ignore
    const transactionList = await db
      .select()
      .from(UserSubscription)
      .orderBy(desc(UserSubscription.id));

    // Cache the result to reduce database load for frequent requests
    await client.set(cacheKey, JSON.stringify(transactionList));

    return NextResponse.json({ success: true, transactionList });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "something went wrong",
    });
  }
}
