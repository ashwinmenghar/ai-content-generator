"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { error } from "console";
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

  const fetchTransaction = async () => {
    await axios
      .get("/api/transactions", {
        params: {
          email: user?.primaryEmailAddress?.emailAddress as string,
        },
      })
      .then((resp) => {
        console.log(resp.data.transactionList);

        setTransactions(resp.data?.transactionList);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchTransaction();
  }, []);

  return (
    <div className="m-5 p-5 border rounded-lg bg-white">
      <h2 className="font-bold text-3xl">Transactions</h2>
      <p className="text-gray-500">All Transactions Details</p>

      <div className="grid grid-cols-7 font-bold bg-secondary mt-5 py-3 px-3">
        <h2 className="col-span-1">Payment Id</h2>
        <h2 className="col-span-1">Name</h2>
        <h2 className="col-start-3 col-span-2">Email</h2>
        <h2>DATE</h2>
        <h2>Active</h2>
      </div>
      {transactions.map((item: TRANSACTION, index: number) => (
        <div key={index}>
          <div className="grid grid-cols-7 my-5 py-3 px-3">
            <h2 className="col-span-1 flex gap-2 items-center">
              {item?.paymentId}
            </h2>
            <h2 className="col-span-1 line-clamp-3 mr-3">{item.userName}</h2>
            <h2 className="col-span-2 line-clamp-3 mr-3">{item.email}</h2>
            <h2>{item.joinDate}</h2>
            <h2 className="text-black">{item.active + ""}</h2>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Transactions;
