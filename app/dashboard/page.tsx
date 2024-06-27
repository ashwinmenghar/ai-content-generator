"use client";
import React, { useEffect, useState } from "react";
import SearchSection from "./_components/SearchSection";
import TemplateListSection from "./_components/TemplateListSection";
import axios from "axios";

function Dashboard() {
  const [userSearchInput, setUserSearchInput] = useState<string>();

  const checkSubscription = async () => {
    await axios.get("api/create-subscription", {});
  };

  useEffect(() => {
    checkSubscription();
  }, []);
  return (
    <div>
      {/* Search Section  */}
      <SearchSection
        onSearchInput={(value: string) => setUserSearchInput(value)}
      />

      {/* Template List Section  */}
      <TemplateListSection userSearchInput={userSearchInput} />
    </div>
  );
}

export default Dashboard;
