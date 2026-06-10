import { VehicleForm } from "@/components/backoffice/VehicleForm";
import { JSX } from "react";

/**
 * Page component for adding a new vehicle in the admin dashboard.
 * @returns JSX element rendering the add vehicle form interface
 */
const AddVehiclePage = (): JSX.Element => {
  return (
    <div className="w-full h-full pt-16">
      <VehicleForm />;
    </div>
  );
};

export default AddVehiclePage;
