"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { TEMPLATE } from "../_components/TemplateListSection";
import Template from "@/app/(data)/Template";
import CopyButton from "./_components/CopyButton";
import axios from "axios";

export interface HISTORY {
  id: Number;
  formData: string;
  aiResponse: string;
  templateSlug: string;
  createdBy: string;
  createdAt: string;
}
function History() {
  // const user = await currentUser();
  const [history, setHistory] = useState<HISTORY[]>([]);

  const fetchData = async () => {
    await axios
      .get("/api/get-history", {})
      .then((resp) => setHistory(resp.data))
      .catch((err) => console.log(err.message));
  };
  useEffect(() => {
    fetchData();
  }, [!history]);

  // // @ts-ignore
  // const HistoryList: HISTORY[] = await db
  //   .select()
  //   .from(AIOutput)
  //   .where(
  //     eq(AIOutput?.createdBy, user?.primaryEmailAddress?.emailAddress as string)
  //   )
  //   .orderBy(desc(AIOutput.id));

  const GetTemplateName = (slug: string) => {
    const template: TEMPLATE | any = Template?.find(
      (item) => item.slug == slug
    );
    return template;
  };
  return (
    <div className="m-5 p-5 border rounded-lg bg-white">
      <h2 className="font-bold text-3xl">History</h2>
      <p className="text-gray-500">
        Search your previously generate AI content
      </p>
      <div className="grid grid-cols-7 font-bold bg-secondary mt-5 py-3 px-3">
        <h2 className="col-span-2">TEMPLATE</h2>
        <h2 className="col-span-2">AI RESP</h2>
        <h2>DATE</h2>
        <h2>WORDS</h2>
        <h2>COPY</h2>
      </div>
      {history.map((item: HISTORY, index: number) => (
        <div key={index}>
          <div className="grid grid-cols-7 my-5 py-3 px-3">
            <h2 className="col-span-2 flex gap-2 items-center">
              <Image
                src={GetTemplateName(item?.templateSlug)?.icon}
                width={25}
                height={25}
                alt="icon"
              />
              {GetTemplateName(item.templateSlug)?.name}
            </h2>
            <h2 className="col-span-2 line-clamp-3 mr-3">{item?.aiResponse}</h2>
            <h2>{item.createdAt}</h2>
            <h2>{item?.aiResponse.length}</h2>
            <h2>
              <CopyButton aiResponse={item.aiResponse} />
            </h2>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default History;
