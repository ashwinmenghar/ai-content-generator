import { TRANSACTION } from "@/app/dashboard/transactions/page";
import { db } from "@/utils/db";
import { client } from "@/utils/redis";
import { UserSubscription } from "@/utils/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    // Attempt to retrieve cached history
    const cacheKey = `transactions:${email}`;
    const cachedTransactions = await client.get(cacheKey);

    if (cachedTransactions) {
      return NextResponse.json({
        transactionList: JSON.parse(cachedTransactions),
      });
    }

    // @ts-ignore
    const transactionList: TRANSACTION[] = await db
      .select()
      .from(UserSubscription)
      .where(eq(UserSubscription.email, email as string))
      .orderBy(desc(UserSubscription.id));

    // Cache the result to reduce database load for frequent requests
    await client.set(cacheKey, JSON.stringify(transactionList)); // Expires in 1 hour

    return NextResponse.json({ transactionList });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error });
  }
}
