"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { DareFeed } from "@/components/DareFeed";
import { CreateDareModal } from "@/components/CreateDareModal";
import { ConfigNotice } from "@/components/ConfigNotice";
import { Footer } from "@/components/Footer";
import { IS_CONTRACT_CONFIGURED } from "@/config/wagmi";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stats, setStats] = useState({ total: 0, open: 0, completed: 0 });

  const handleStatsUpdate = React.useCallback(
    (newStats: { total: number; open: number; completed: number }) => {
      setStats(newStats);
    },
    []
  );

  const handleCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex min-h-screen flex-col bg-charcoal-950 text-gray-100">
      <Header />

      <main className="flex-1">
        <Hero
          onCreateClick={() => setIsModalOpen(true)}
          totalDares={stats.total}
          openDares={stats.open}
          completedDares={stats.completed}
        />

        {!IS_CONTRACT_CONFIGURED ? (
          <ConfigNotice />
        ) : (
          <DareFeed
            onCreateClick={() => setIsModalOpen(true)}
            onStatsUpdate={handleStatsUpdate}
            refreshTrigger={refreshTrigger}
          />
        )}
      </main>

      <Footer />

      <CreateDareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreated}
      />
    </div>
  );
}

