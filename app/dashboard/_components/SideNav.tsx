"use client";
import { FileClock, Home, Settings, WalletCards } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import UsageTrack from "./UsageTrack";
import Link from "next/link";
import { TransparencyGridIcon } from "@radix-ui/react-icons";
import { useUser } from "@clerk/nextjs";

function SideNav() {
  const path = usePathname();
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const MenuList = [
    {
      name: "Home",
      icon: Home,
      path: "/dashboard",
    },
    {
      name: "History",
      icon: FileClock,
      path: "/dashboard/history",
    },
    {
      name: "Billing",
      icon: WalletCards,
      path: "/dashboard/billing",
    },

    {
      name: "Setting",
      icon: Settings,
      path: "/dashboard/settings",
    },
  ];

  if (email?.split("@")[0] == "system") {
    MenuList.push({
      name: "Transactions",
      icon: WalletCards,
      path: "/dashboard/transactions",
    });
  }

  return (
    <div className="h-screen relative p-5 shadow-sm border bg-white">
      <div className="flex justify-center">
        <Image src={"/logo.svg"} alt="logo" width={50} height={80} />
      </div>
      <hr className="my-6 border" />
      <div className="mt-3">
        {MenuList.map((menu, index) => (
          <Link href={menu.path} key={index}>
            <div
              className={`flex gap-2 mb-2 p-3 hover:bg-primary hover:text-white rounded-lg cursor-pointer items-center ${
                path == menu.path && "bg-primary text-white"
              }`}
            >
              <menu.icon className="h-6 w-6" />
              <h6 className="text-lg">{menu.name}</h6>
            </div>
          </Link>
        ))}
      </div>
      <div className="absolute bottom-10 left-0 w-full">
        <UsageTrack />
      </div>
    </div>
  );
}

export default SideNav;
