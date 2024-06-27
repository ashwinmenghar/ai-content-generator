import { db } from "@/utils/db";
import { client } from "@/utils/redis";
import { UserSubscription } from "@/utils/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, like } from "drizzle-orm";
import moment from "moment";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req, res) {
  let instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  });

  const result = await instance.subscriptions.create({
    plan_id: process.env.SUBSCRIPTION_PLAN_ID,
    customer_notify: 1,
    quantity: 1,
    total_count: 1,
    addons: [],
    notes: {
      key1: "Notes",
    },
  });

  return NextResponse.json(result);
}

export async function GET(req, res) {
  try {
    const user = await currentUser();
    const email = user.primaryEmailAddress.emailAddress;

    // Delete cached transactions
    await client.del(`transactions:${email}`);

    const subscription = await db.query.UserSubscription.findFirst({
      where: (UserSubscription, { eq }) => {
        eq(UserSubscription.email, email);
        eq(UserSubscription.active, true);
      },
    });
    if (subscription) {
      if (subscription.joinDate > moment().format("DD/MM/YYYY")) {
        await db
          .update(UserSubscription)
          .set({ active: false })
          .where(eq(UserSubscription.email, email))
          .returning({ updatedId: UserSubscription.id });
      }
      return NextResponse.json({ success: true, subscription });
    }
    return NextResponse.json({ success: true, message: "not data found" });
  } catch (error) {
    console.log(error);
  }
}
