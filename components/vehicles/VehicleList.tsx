"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import VehicleCard from "./VehicleCard";
import FilterSidebar from "./FilterSidebar";
import { Skeleton } from "../ui/skeleton";
import { useVehicleStore } from "@/store/vehicleStore";
import { Button } from "../ui/button";

const VehicleList = () => {
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
      offer_type: searchParams.get("offer_type") || "",
      brand: searchParams.get("brand") || "",
      search: searchParams.get("search") || "",
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
      <div className="text-center text-red-500 py-10">Erreur : {error}</div>
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
