"use client";

/**
 * @license: MIT
 * @author: nuno fernandes
 * @Copyright (c) 2026 m-motors. All rights reserved.
 */

// ---- React/Next ----
import { JSX } from "react";
// ---- Types ----
import { FilterBarProps } from "@/types";
// ---- Components ----
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

/**
 * FilterBar component that provides the filter options for the vehicle catalogue
 * @param {FilterBarProps} props - The props object containing the filter options
 * @returns {JSX.Element} The rendered filter bar
 */
export default function FilterBar({
  filters,
  onVehicleTypeChange,
  onBrandChange,
  onModelChange,
  onMinPriceChange,
  onMaxPriceChange,
  onReset,
  hideVehicleType = true,
}: FilterBarProps): JSX.Element {
  return (
    <Card className="p-4">
      <div className="flex flex-col flex-wrap gap-4 md:flex-row md:items-end md:gap-x-4 md:gap-y-0">
        {!hideVehicleType && (
          <div className="flex-1 min-w-35">
            <Label htmlFor="vehicle_type" className="mb-1 block">
              Type d&apos;offre
            </Label>
            <Select
              value={filters.vehicle_type}
              onValueChange={onVehicleTypeChange}
            >
              <SelectTrigger id="vehicle_type">
                <SelectValue placeholder="Type d'offre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="sale">Achat</SelectItem>
                <SelectItem value="rent">Location LLD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex-1 min-w-35">
          <Label htmlFor="brand" className="mb-1 block">
            Marque
          </Label>
          <Input
            id="brand"
            value={filters.brand}
            onChange={(e) => onBrandChange(e.target.value)}
            placeholder="Ex: Renault"
          />
        </div>

        <div className="flex-1 min-w-35">
          <Label htmlFor="model" className="mb-1 block">
            Modèle
          </Label>
          <Input
            id="model"
            value={filters.model}
            onChange={(e) => onModelChange(e.target.value)}
            placeholder="Clio, Mégane..."
          />
        </div>

        <div className="flex flex-1 gap-2 min-w-45">
          <div className="flex-1">
            <Label htmlFor="min_price" className="mb-1 block">
              Prix min (€)
            </Label>
            <Input
              id="min_price"
              type="number"
              value={filters.min_price}
              onChange={(e) => onMinPriceChange(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="max_price" className="mb-1 block">
              Prix max (€)
            </Label>
            <Input
              id="max_price"
              type="number"
              value={filters.max_price}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              placeholder="100000"
            />
          </div>
        </div>

        <Button variant="outline" onClick={onReset} className="self-end">
          Réinitialiser
        </Button>
      </div>
    </Card>
  );
}
