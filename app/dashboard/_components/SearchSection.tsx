import { TotalUsageContext } from "@/app/(context)/TotalUserContext";
import { UserSubscriptionContext } from "@/app/(context)/UserSubscriptionContext";
import { freePlanCreditLimit } from "@/constants/data";
import { Search } from "lucide-react";
import React, { useContext, useState } from "react";

function SearchSection({ onSearchInput }: any) {
  const { totalUsage } = useContext(TotalUsageContext);
  const { userSubscription } = useContext(UserSubscriptionContext);

  return (
    <div
      className="p-10 
      bg-gradient-to-br from-purple-500 via-purple-700 to-blue-600 flex flex-col
     justify-center items-center text-white"
    >
      <h2 className="text-3xl font-bold">Browse All Templates</h2>
      <p>What would you like to create today?</p>
      <div className="w-full flex justify-center">
        <div className="flex gap-2 items-center p-2 border rounded-md bg-white my-5 w-[50%]">
          <Search className="text-primary" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent w-full outline-none text-black"
            onChange={(e) => onSearchInput(e.target.value)}
          />
        </div>
      </div>

      {totalUsage >= freePlanCreditLimit && !userSubscription && (
        <h2 className="text-xl font-bold bg-orange-500 px-14 py-3 rounded-lg">
          Please Upgrade Your plan
        </h2>
      )}
    </div>
  );
}

export default SearchSection;
