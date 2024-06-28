"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { error } from "console";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
export interface TRANSACTION {
  id: Number;
  email: string;
  userName: string;
  active: boolean;
  paymentId: string;
  joinDate: string;
}

function Transactions() {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<TRANSACTION[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTransaction = async () => {
    await axios
      .get("/api/get-transactions", {})
      .then((resp) => setTransactions(resp.data?.transactionList))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    fetchTransaction();
  }, []);

  return (
    <div className="m-5 p-5 border rounded-lg bg-white">
      <h2 className="font-bold text-3xl">Transactions</h2>
      <p className="text-gray-500">All Transactions Details</p>

      <div className="grid grid-cols-7 font-bold bg-secondary mt-5 py-3 px-3">
        <h2 className="col-span-1 break-all">Payment Id</h2>
        <h2 className="col-span-1 break-all">Name</h2>
        <h2 className="col-start-3 col-span-2">Email</h2>
        <h2>DATE</h2>
        <h2>Active</h2>
      </div>
      {loading && (
        <div>
          <Loader2Icon className="animate-spin w-full absolute h-24 left-[0%] bottom-[50%] text-gray-300" />
        </div>
      )}
      {transactions.map((item: TRANSACTION, index: number) => (
        <div key={index}>
          <div className="grid grid-cols-7 my-5 py-3 px-3">
            <h2 className="col-span-1 flex gap-2 items-center break-all">
              {item?.paymentId}
            </h2>
            <h2 className="col-span-1  break-all mr-3">{item.userName}</h2>
            <h2 className="col-span-2  break-all mr-3">{item.email}</h2>
            <h2 className=" break-all">{item.joinDate}</h2>
            <h2 className="text-black">{item.active + ""}</h2>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Transactions;
