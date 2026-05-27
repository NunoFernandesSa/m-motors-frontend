"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import VehicleCard from "./VehicleCard";
import FilterSidebar from "./FilterSidebar";
import { Skeleton } from "../ui/skeleton";

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  price: number;
  offer_type: "achat" | "location";
  image?: string;
  year?: number;
  mileage?: number;
}

function VehicleList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // retrieve filters from search params
  const filters = {
    offer_type: searchParams.get("offer_type") || "",
    brand: searchParams.get("brand") || "",
    search: searchParams.get("search") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        // Construire l'URL avec les paramètres de filtre
        const params = new URLSearchParams();
        if (filters.offer_type) params.append("offer_type", filters.offer_type);
        if (filters.brand) params.append("brand", filters.brand);
        if (filters.search) params.append("search", filters.search);
        if (filters.min_price) params.append("min_price", filters.min_price);
        if (filters.max_price) params.append("max_price", filters.max_price);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/vehicles/?${params}`,
        );
        const data = await res.json();
        setVehicles(data.results || data); // selon la structure de ton API
        setTotal(data.count || data.length);
      } catch (error) {
        console.error("Erreur lors du chargement des véhicules", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [
    filters.offer_type,
    filters.brand,
    filters.search,
    filters.min_price,
    filters.max_price,
  ]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/vehicles?${params.toString()}`);
  };

  if (loading) {
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

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64">
        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
      </aside>
      <main className="flex-1">
        <p className="text-sm text-muted-foreground mb-4">
          {total} véhicule(s) trouvé(s)
        </p>
        {vehicles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              Aucun véhicule ne correspond à vos critères.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default VehicleList;
