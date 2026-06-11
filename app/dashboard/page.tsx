import { DashboardClient } from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  return (
    <div className="w-full">
      <DashboardClient />
    </div>
  );
}
