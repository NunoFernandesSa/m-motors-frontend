"use client";

import { useEffect, useCallback, useRef } from "react";
import FilterBar from "@/components/vehicles/FilterBar";
import VehicleCard from "@/components/vehicles/VehicleCard";
import { useVehicleStore } from "@/store/vehicleStore";
import WhyUsSection from "@/components/shared/WhyUsSection";

const CataloguePage = () => {
  const {
    vehicles,
    loading,
    hasMore,
    filters,
    setFilters,
    fetchVehicles,
    loadMore,
  } = useVehicleStore();

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleFiltersChange = useCallback(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetchVehicles(true);
    }, 300);
  }, [fetchVehicles]);

  useEffect(() => {
    handleFiltersChange();
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [filters, handleFiltersChange]);

  const handleVehicleTypeChange = (type: string) =>
    setFilters({ vehicle_type: type });
  const handleBrandChange = (brand: string) => setFilters({ brand });
  const handleModelChange = (model: string) => setFilters({ model });
  const handleMinPriceChange = (min: string) => setFilters({ min_price: min });
  const handleMaxPriceChange = (max: string) => setFilters({ max_price: max });
  const handleReset = () => {
    setFilters({
      vehicle_type: "all",
      brand: "",
      model: "",
      min_price: "",
      max_price: "",
    });
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
      <WhyUsSection />

      <h1 className="text-2xl font-bold">Notre sélection</h1>
      <p className="text-muted-foreground">
        Des véhicules d&apos;exception, à acheter ou à louer
      </p>

      <FilterBar
        filters={filters}
        onVehicleTypeChange={handleVehicleTypeChange}
        onBrandChange={handleBrandChange}
        onModelChange={handleModelChange}
        onMinPriceChange={handleMinPriceChange}
        onMaxPriceChange={handleMaxPriceChange}
        onReset={handleReset}
        hideVehicleType={false}
      />

      {loading && vehicles.length === 0 && (
        <p className="text-center">Chargement…</p>
      )}
      {!loading && vehicles.length === 0 && (
        <p className="text-center text-muted-foreground">
          Aucun véhicule ne correspond à vos critères.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      {loading && vehicles.length > 0 && (
        <p className="text-center">Chargement de plus de véhicules…</p>
      )}
    </div>
  );
};

export default CataloguePage;
