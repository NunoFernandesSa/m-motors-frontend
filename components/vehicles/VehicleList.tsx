"use client";

/**
 * @license: MIT
 * @author: nuno fernandes
 * @Copyright (c) 2026 m-motors. All rights reserved.
 */

// ----- React & Next.js -----
import { useRouter, useSearchParams } from "next/navigation";
import { JSX, useCallback, useEffect } from "react";
// ----- Shadcn UI -----
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
// ----- Components -----
import VehicleCard from "./VehicleCard";
import FilterSidebar from "./FilterSidebar";
import { ErrorMessage } from "@components/shared/ErrorMessage";
// ----- Store -----
import { useVehicleStore } from "@/store/vehicleStore";

/**
 * VehicleList component that displays a list of vehicles with filters and pagination
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

  useEffect(() => {
    const urlFilters = {
      offer_type: searchParams.get("vehicle_type") || "sale",
      brand: searchParams.get("brand") || "",
      model: searchParams.get("model") || "",
      min_price: searchParams.get("min_price") || "",
      max_price: searchParams.get("max_price") || "",
    };

    // if filters have changed, fetch vehicles
    if (JSON.stringify(urlFilters) !== JSON.stringify(filters)) {
      setFilters(urlFilters);
    } else if (vehicles.length === 0 && !loading) {
      fetchVehicles(true);
    }
  }, []);

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) params.set(key, value);
      else params.delete(key);
      router.push(`/vehicules?${params.toString()}`);
      setFilters({ [key]: value });
    },
    [router, searchParams, setFilters],
  );

  // manage load more vehicles
  const handleLoadMore = () => {
    loadMore();
  };

  if (loading && vehicles.length === 0) {
    return (
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </aside>
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message={"Une erreur est survenue"}
        onRetry={fetchVehicles}
      />
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64">
        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
      </aside>
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
