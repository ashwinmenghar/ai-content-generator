import { currentUser } from "@clerk/nextjs/server";
import { AIOutput, UserSubscription } from "@/utils/schema";
import { desc, eq, gte, lte } from "drizzle-orm";
import { db } from "@/utils/db";
import { NextResponse } from "next/server";
import { client } from "@/utils/redis";
import moment from "moment";

export interface HISTORY {
  id: number; // Use lowercase for primitives
  formData: string;
  aiResponse: string;
  templateSlug: string;
  createdBy: string;
  createdAt: string;
}

export async function GET(req: any, res: any) {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const userSubscription = searchParams.get("userSubscription");

    const user = await currentUser();
    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const email = user.primaryEmailAddress.emailAddress;

    // Attempt to retrieve cached history
    const cacheKey = `history:${email}`;
    const cachedHistory = await client.get(cacheKey);

    if (cachedHistory) {
      return NextResponse.json(JSON.parse(cachedHistory));
    }

    let historyList: HISTORY[];

    if (userSubscription) {
      // @ts-ignore
      historyList = await db.query.AIOutput.findMany({
        where: (AIOutput, { eq, gte }) => {
          eq(AIOutput.createdBy, email);
          gte(
            AIOutput.createdAt,
            moment().subtract(30, "days").format("DD/MM/YYYY")
          );
        },
      });
    } else {
      // @ts-ignore
      historyList = await db
        .select()
        .from(AIOutput)
        .where(eq(AIOutput.createdBy, email))
        .orderBy(desc(AIOutput.id));
    }

    // Cache the result to reduce database load for frequent requests
    await client.set(cacheKey, JSON.stringify(historyList), "EX", 24 * 60 * 60); // Expires in 1 hour

    return NextResponse.json(historyList);
  } catch (error) {
    console.error("Failed to fetch history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: any, res: any) {
  try {
    const user = await currentUser();

    // Attempt to retrieve cached history
    const cacheKey = `history:${user?.primaryEmailAddress?.emailAddress}`;
    const cachedHistory = await client.del(cacheKey);

    if (cachedHistory) {
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.log(error);
  }
}
