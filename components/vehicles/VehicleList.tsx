"use client";

/**
 * @license: MIT
 * @author: nuno fernandes
 * @Copyright (c) 2026 m-motors. All rights reserved.
 */

import { useRouter, useSearchParams } from "next/navigation";
import { JSX, useCallback, useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import VehicleCard from "./VehicleCard";
import FilterSidebar from "./FilterBar";
import { ErrorMessage } from "@components/shared/ErrorMessage";
import { useVehicleStore } from "@/store/vehicleStore";
import { useDebounce } from "@/hooks/useDebounce";
import { Filters } from "@/types";

/**
 * VehicleList component that displays a list of vehicles
 * @returns {JSX.Element} The rendered VehicleList component
 */
const VehicleList = (): JSX.Element => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    vehicles,
    totalCount,
    loading,
    error,
    filters,
    hasMore,
    setFilters,
    fetchVehicles,
    loadMore,
  } = useVehicleStore();

  const [localFilters, setLocalFilters] = useState({
    brand: filters.brand,
    model: filters.model,
    min_price: filters.min_price,
    max_price: filters.max_price,
  });

  const debouncedBrand = useDebounce(localFilters.brand, 500);
  const debouncedModel = useDebounce(localFilters.model, 500);
  const debouncedMinPrice = useDebounce(localFilters.min_price, 500);
  const debouncedMaxPrice = useDebounce(localFilters.max_price, 500);

  useEffect(() => {
    const urlFilters: Filters = {
      vehicle_type: searchParams.get("vehicle_type") || "sale",
      brand: searchParams.get("brand") || "",
      model: searchParams.get("model") || "",
      min_price: searchParams.get("min_price") || "",
      max_price: searchParams.get("max_price") || "",
    };

    setFilters(urlFilters);
    setLocalFilters({
      brand: urlFilters.brand,
      model: urlFilters.model,
      min_price: urlFilters.min_price,
      max_price: urlFilters.max_price,
    });
  }, []);

  useEffect(() => {
    const newFilters: Partial<Filters> = {};
    if (debouncedBrand !== filters.brand) newFilters.brand = debouncedBrand;
    if (debouncedModel !== filters.model) newFilters.model = debouncedModel;
    if (debouncedMinPrice !== filters.min_price)
      newFilters.min_price = debouncedMinPrice;
    if (debouncedMaxPrice !== filters.max_price)
      newFilters.max_price = debouncedMaxPrice;

    if (Object.keys(newFilters).length > 0) {
      setFilters(newFilters);
    }
  }, [
    debouncedBrand,
    debouncedModel,
    debouncedMinPrice,
    debouncedMaxPrice,
    filters,
    setFilters,
  ]);

  const handleVehicleTypeChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
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

  const handleLoadMore = () => loadMore();

  if (loading && vehicles.length === 0) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message="Une erreur est survenue"
        onRetry={() => fetchVehicles(true)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <FilterSidebar
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

      <main className="flex-1">
        <p className="text-sm text-muted-foreground mb-4">
          {totalCount} véhicule(s) trouvé(s)
        </p>

        {vehicles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              Aucun véhicule ne correspond à vos critères.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button onClick={handleLoadMore} disabled={loading}>
                  {loading ? "Chargement..." : "Charger plus de véhicules"}
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default VehicleList;
