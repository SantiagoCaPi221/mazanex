"use client";

import CommunityHeader from "@/components/comp_community/CommunityHeader";
import CommunityTabs from "@/components/comp_community/CommunityTabs";
import LoadingScreen from "@/components/comp_community/LoadingScreen";
import UsersGrid from "@/components/comp_community/UsersGrid";

import { useCommunity } from "../hooks/community/useCommunity";

export default function CommunityPage() {
  const {
    user,
    loading,

    users,
    relationships,

    search,
    setSearch,

    filter,
    setFilter,

    handleSocialAction,
  } = useCommunity();

  if (!user || loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative min-h-screen w-full bg-[#030712] text-white overflow-x-hidden">
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(#1f2937 1px, transparent 1px),
            linear-gradient(90deg, #1f2937 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-[1600px] mx-auto p-6 md:p-12">
        <CommunityHeader search={search} setSearch={setSearch} />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          <div className="xl:col-span-8 space-y-8">
            <CommunityTabs filter={filter} setFilter={setFilter} />

            <UsersGrid
              users={users}
              relationships={relationships}
              onAction={handleSocialAction}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
