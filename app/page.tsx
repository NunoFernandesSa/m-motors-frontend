import VehicleList from "@/components/vehicles/VehicleList";
import { Suspense } from "react";

export const metadata = {
  title: "Catalogue - M-Motors",
  description:
    "Découvrez notre sélection de véhicules à l'achat ou en location longue durée",
};

const CataloguePage = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Catalogue de véhicules</h1>
      <Suspense fallback={<div>Chargement du catalogue...</div>}>
        <VehicleList />
      </Suspense>
    </div>
  );
};

export default CataloguePage;
