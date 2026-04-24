import { Header } from "@/components/Header";
import { DashboardClient } from "./DashboardClient";

export default function DashboardPage() {
  return (
    <div className="flex-1 flex flex-col bg-gc-bg-dark min-h-screen">
      <Header />
      <main className="flex-1">
        <DashboardClient />
      </main>
    </div>
  );
}
