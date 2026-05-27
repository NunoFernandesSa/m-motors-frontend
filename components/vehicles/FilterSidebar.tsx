"use client";

/**
 * @license: MIT
 * @author: nuno fernandes
 * @Copyright (c) 2026 m-motors. All rights reserved.
 */

import { JSX } from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FilterSidebarProps } from "@/types";

export default function FilterSidebar({
  filters,
  onVehicleTypeChange,
  onBrandChange,
  onModelChange,
  onMinPriceChange,
  onMaxPriceChange,
  onReset,
}: FilterSidebarProps): JSX.Element {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="vehicle_type">Type d&apos;offre</Label>
        <Select
          value={filters.vehicle_type}
          onValueChange={onVehicleTypeChange}
        >
          <SelectTrigger id="vehicle_type">
            <SelectValue placeholder="Type d'offre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sale">Achat</SelectItem>
            <SelectItem value="rent">Location LLD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <Label htmlFor="brand">Marque</Label>
        <Input
          id="brand"
          value={filters.brand}
          onChange={(e) => onBrandChange(e.target.value)}
          placeholder="Ex: Renault"
        />
      </div>

      <div>
        <Label htmlFor="model">Recherche (modèle)</Label>
        <Input
          id="model"
          value={filters.model}
          onChange={(e) => onModelChange(e.target.value)}
          placeholder="Clio, Mégane..."
        />
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="min_price">Prix min (€)</Label>
          <Input
            id="min_price"
            type="number"
            value={filters.min_price}
            onChange={(e) => onMinPriceChange(e.target.value)}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="max_price">Prix max (€)</Label>
          <Input
            id="max_price"
            type="number"
            value={filters.max_price}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            placeholder="100000"
          />
        </div>
      </div>

      <Button variant="outline" onClick={onReset} className="w-full">
        Réinitialiser
      </Button>
    </div>
  );
}
