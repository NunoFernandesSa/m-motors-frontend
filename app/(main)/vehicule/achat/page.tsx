"use client";

import { useEffect, useMemo } from "react";
import FilterBar from "@/components/vehicles/FilterBar";
import VehicleCard from "@/components/vehicles/VehicleCard";
import { useVehicleStore } from "@/store/vehicleStore";

function PurchaseVehicle() {
  const {
    vehicles,
    loading,
    hasMore,
    filters,
    setFilters,
    fetchVehicles,
    loadMore,
    resetToType,
  } = useVehicleStore();

  // Filter vehicles to sale only
  const saleVehicles = useMemo(
    () => vehicles.filter((v) => v.vehicle_type === "sale"),
    [vehicles],
  );

  useEffect(() => {
    resetToType("sale");
    fetchVehicles(true);
  }, [resetToType, fetchVehicles]);

  const handleBrandChange = (brand: string) => setFilters({ brand });
  const handleModelChange = (model: string) => setFilters({ model });
  const handleMinPriceChange = (min: string) => setFilters({ min_price: min });
  const handleMaxPriceChange = (max: string) => setFilters({ max_price: max });
  const handleReset = () => resetToType("sale");

  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 500 &&
        hasMore &&
        !loading
      ) {
        loadMore();
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasMore, loading, loadMore]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Nos véhicules à vendre</h1>

      <FilterBar
        filters={filters}
        onVehicleTypeChange={() => {}}
        onBrandChange={handleBrandChange}
        onModelChange={handleModelChange}
        onMinPriceChange={handleMinPriceChange}
        onMaxPriceChange={handleMaxPriceChange}
        onReset={handleReset}
        hideVehicleType
      />

      {loading && saleVehicles.length === 0 && (
        <p className="text-center">Chargement…</p>
      )}
      {!loading && saleVehicles.length === 0 && (
        <p className="text-center text-muted-foreground">
          Aucun véhicule en vente ne correspond à vos critères.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {saleVehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      {loading && saleVehicles.length > 0 && (
        <p className="text-center">Chargement de plus de véhicules…</p>
      )}
    </div>
  );
}

export default PurchaseVehicle;
