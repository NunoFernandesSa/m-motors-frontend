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
import { FilterSidebarProps } from "@/types";

function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="offer_type">Type d&apos;offre</Label>
        <Select
          value={filters.offer_type}
          onValueChange={(val) =>
            onFilterChange("offer_type", val === "all" ? "" : val)
          }
        >
          <SelectTrigger id="offer_type">
            <SelectValue placeholder="Tous" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="achat">Achat</SelectItem>
            <SelectItem value="location">Location LLD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <Label htmlFor="brand">Marque</Label>
        <Input
          id="brand"
          value={filters.brand}
          onChange={(e) => onFilterChange("brand", e.target.value)}
          placeholder="Ex: Renault"
        />
      </div>

      <div>
        <Label htmlFor="search">Recherche (modèle)</Label>
        <Input
          id="search"
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
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
            onChange={(e) => onFilterChange("min_price", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="max_price">Prix max (€)</Label>
          <Input
            id="max_price"
            type="number"
            value={filters.max_price}
            onChange={(e) => onFilterChange("max_price", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default FilterSidebar;
