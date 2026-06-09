"use client";

import { useEffect, useMemo, useState } from "react";
import FilterBar from "@/components/vehicles/FilterBar";
import VehicleCard from "@/components/vehicles/VehicleCard";
import { useVehicleStore } from "@/store/vehicleStore";

const CataloguePage = () => {
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

  const [activeType, setActiveType] = useState<"sale" | "rent">("sale");

  // Filter vehicles to sale only
  const filteredVehicles = useMemo(
    () => vehicles.filter((v) => v.vehicle_type === activeType),
    [vehicles, activeType],
  );

  useEffect(() => {
    resetToType(activeType);
    fetchVehicles(true);
  }, [activeType, resetToType, fetchVehicles]);

  const handleBrandChange = (brand: string) => setFilters({ brand });
  const handleModelChange = (model: string) => setFilters({ model });
  const handleMinPriceChange = (min: string) => setFilters({ min_price: min });
  const handleMaxPriceChange = (max: string) => setFilters({ max_price: max });
  const handleReset = () => {
    setFilters({ brand: "", model: "", min_price: "", max_price: "" });
    resetToType(activeType);
  };

  const handleVehicleTypeChange = (type: string) => {
    setActiveType(type as "sale" | "rent");
  };

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
      <h1 className="text-2xl font-bold">Nos véhicules</h1>

      {/* Sélecteur Achat / Location */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => handleVehicleTypeChange("sale")}
          className={`px-4 py-2 rounded-md font-medium ${
            activeType === "sale"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Achat
        </button>
        <button
          onClick={() => handleVehicleTypeChange("rent")}
          className={`px-4 py-2 rounded-md font-medium ${
            activeType === "rent"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Location
        </button>
      </div>

      <FilterBar
        filters={filters}
        onVehicleTypeChange={handleVehicleTypeChange}
        onBrandChange={handleBrandChange}
        onModelChange={handleModelChange}
        onMinPriceChange={handleMinPriceChange}
        onMaxPriceChange={handleMaxPriceChange}
        onReset={handleReset}
        hideVehicleType={true}
      />

      {loading && filteredVehicles.length === 0 && (
        <p className="text-center">Chargement…</p>
      )}
      {!loading && filteredVehicles.length === 0 && (
        <p className="text-center text-muted-foreground">
          Aucun véhicule {activeType === "sale" ? "en vente" : "en location"} ne
          correspond à vos critères.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      {loading && filteredVehicles.length > 0 && (
        <p className="text-center">Chargement de plus de véhicules…</p>
      )}
    </div>
  );
};

export default CataloguePage;
