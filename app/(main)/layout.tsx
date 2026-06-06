"use client";

import FilterBar from "@/components/vehicles/FilterBar";
import { useVehicleStore } from "@/store/vehicleStore";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { ReactNode, useCallback, useState } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters, setFilters } = useVehicleStore();

  const [localFilters, setLocalFilters] = useState({
    brand: "",
    model: "",
    min_price: "",
    max_price: "",
  });

  const handleVehicleTypeChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("vehicle_type", value);
      router.push(`/vehicules?${params.toString()}`);
      setFilters({ vehicle_type: value });
    },
    [router, searchParams, setFilters],
  );

  const handleBrandChange = (value: string) =>
    setLocalFilters((prev) => ({ ...prev, brand: value }));

  const handleModelChange = (value: string) =>
    setLocalFilters((prev) => ({ ...prev, model: value }));

  const handleMinPriceChange = (value: string) =>
    setLocalFilters((prev) => ({ ...prev, min_price: value }));

  const handleMaxPriceChange = (value: string) =>
    setLocalFilters((prev) => ({ ...prev, max_price: value }));

  const handleResetFilters = () => {
    setLocalFilters({ brand: "", model: "", min_price: "", max_price: "" });
    setFilters({
      vehicle_type: "sale",
      brand: "",
      model: "",
      min_price: "",
      max_price: "",
    });
    router.push("/vehicules?vehicle_type=sale");
  };

  return (
    <div className="container mx-auto py-6">
      <FilterBar
        filters={{
          vehicle_type: filters.vehicle_type,
          brand: localFilters.brand,
          model: localFilters.model,
          min_price: localFilters.min_price,
          max_price: localFilters.max_price,
        }}
        onVehicleTypeChange={handleVehicleTypeChange}
        onBrandChange={handleBrandChange}
        onModelChange={handleModelChange}
        onMinPriceChange={handleMinPriceChange}
        onMaxPriceChange={handleMaxPriceChange}
        onReset={handleResetFilters}
      />
      {children}
    </div>
  );
}
