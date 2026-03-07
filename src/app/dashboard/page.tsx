import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardContent from "@/components/dashboard-content";

export default async function DashboardPage() {
	const session = await auth();

	if (!session) {
		redirect("/login");
	}

	return <DashboardContent />;
}
