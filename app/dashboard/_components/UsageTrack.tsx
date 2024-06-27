"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { AIOutput, UserSubscription } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";

import { eq } from "drizzle-orm";
import React, { useContext, useEffect, useState } from "react";
import { HISTORY } from "../history/page";
import { TotalUsageContext } from "@/app/(context)/TotalUserContext";
import { UserSubscriptionContext } from "@/app/(context)/UserSubscriptionContext";
import { UpdateCreditUsageContext } from "@/app/(context)/UpdateCreditUsageContext";
import { freePlanCreditLimit, paidPlanCreditLimit } from "@/constants/data";
import Link from "next/link";

function UsageTrack() {
  const { user } = useUser();
  const { totalUsage, setTotalUsage } = useContext(TotalUsageContext);
  const { _, setUserSubscription } = useContext(UserSubscriptionContext);
  const [maxWords, setMaxWords] = useState(freePlanCreditLimit);
  const { updateCreditUsage, setUpdateCreditUsage } = useContext(
    UpdateCreditUsageContext
  );
  useEffect(() => {
    user && GetData();
    user && IsUserSubscribe();
  }, [user]);

  useEffect(() => {
    user && GetData();
  }, [updateCreditUsage && user]);

  const GetData = async () => {
    // @ts-ignore
    const result: HISTORY[] = await db
      .select()
      .from(AIOutput)
      .where(
        eq(
          AIOutput.createdBy,
          user?.primaryEmailAddress?.emailAddress as string
        )
      );

    GetTotalUsage(result);
  };

  const IsUserSubscribe = async () => {
    // @ts-ignore
    // const result = await db
    //   .select()
    //   .from(UserSubscription)
    //   .where(
    //     eq(
    //       UserSubscription.email,
    //       user?.primaryEmailAddress?.emailAddress as string
    //     )
    //   );
    // if (result.length > 0) {
    //   console.log(result);

    //   setUserSubscription(true);
    //   setMaxWords(paidPlanCreditLimit);
    // }
    const email = user?.primaryEmailAddress?.emailAddress;
    const subscription = await db.query.UserSubscription.findFirst({
      where: (UserSubscription, { eq }) => {
        return (
          eq(UserSubscription.email, email as string) &&
          eq(UserSubscription.active, true)
        );
      },
    });
    if (subscription != undefined) {
      setUserSubscription(true);
      setMaxWords(paidPlanCreditLimit);
    }
  };

  const GetTotalUsage = (result: HISTORY[]) => {
    let total: number = 0;
    result.forEach((element) => {
      total = total + Number(element.aiResponse?.length);
    });

    setTotalUsage(total);
    console.log(total);
  };

  return (
    <div className="m-5">
      <div className="bg-primary text-white p-3 rounded-lg">
        <h2 className="font-medium">Credits</h2>
        <div className="h-2 bg-[#9981f9] w-full rounded-full mt-3">
          <div
            className="h-2 bg-white rounded-full"
            style={{
              width:
                totalUsage / maxWords > 1
                  ? 100 + "%"
                  : (totalUsage / maxWords) * 100 + "%",
            }}
          ></div>
        </div>
        <h2 className="text-sm my-2">
          {totalUsage}/{maxWords} credit used
        </h2>
      </div>
      <Button variant={"secondary"} className="w-full my-3 text-primary">
        <Link href={"/dashboard/billing"}>Upgrade</Link>
      </Button>
    </div>
  );
}

export default UsageTrack;
