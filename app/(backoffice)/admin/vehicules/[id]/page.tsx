"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { VehicleForm } from "@/components/backoffice/VehicleForm";
import { useVehicleStore } from "@/store/vehicleStore";

import { Loading } from "@/components/shared/Loading";

export default function EditVehiclePage() {
  const { id } = useParams();
  const { vehicleDetail, loading, fetchVehicleDetail } = useVehicleStore();

  useEffect(() => {
    if (id) {
      fetchVehicleDetail(id as string);
    }
  }, [id, fetchVehicleDetail]);

  if (loading) return <Loading />;
  if (!vehicleDetail) return <div>Véhicule non trouvé</div>;

  return <VehicleForm vehicle={vehicleDetail} />;
}
