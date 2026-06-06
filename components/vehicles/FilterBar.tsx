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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FilterBarProps } from "@/types";
import { Card } from "../ui/card";

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
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:flex-wrap">
        {!hideVehicleType && (
          <div className="min-w-45 flex-1">
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
        )}

        <div className="min-w-45 flex-1">
          <Label htmlFor="brand">Marque</Label>
          <Input
            id="brand"
            value={filters.brand}
            onChange={(e) => onBrandChange(e.target.value)}
            placeholder="Ex: Renault"
          />
        </div>

        <div className="min-w-45 flex-1">
          <Label htmlFor="model">Modèle</Label>
          <Input
            id="model"
            value={filters.model}
            onChange={(e) => onModelChange(e.target.value)}
            placeholder="Clio, Mégane..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4 min-w-65">
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

        <Button variant="outline" onClick={onReset} className="xl:ml-auto">
          Réinitialiser
        </Button>
      </div>
    </Card>
  );
}
