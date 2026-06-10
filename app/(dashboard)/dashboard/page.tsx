"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

function ClientDashboard() {
  const { user } = useAuthStore();

  return (
    <div>
      <h1 className="text-2xl font-bold">Bienvenue {user?.username}</h1>
      <p className="mt-2">
        Accédez à vos dossiers ou faites une nouvelle demande.
      </p>
      <Link
        href="/catalogue"
        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
      >
        Nouvelle demande
      </Link>
    </div>
  );
}
export default ClientDashboard;
