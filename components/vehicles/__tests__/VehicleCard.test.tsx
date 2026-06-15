import { render, screen } from "@testing-library/react";
import VehicleCard from "@/components/vehicles/VehicleCard";
import { Vehicle } from "@/types";

// Mock du module utils
jest.mock("@/lib/utils", () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
  getValidImageUrl: jest.fn((url) =>
    url ? `http://localhost:8000/api${url}` : "/images/placeholder-car.png",
  ),
}));

// Mock de next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...rest} src={props.src} alt={props.alt} />;
  },
}));

// Mock de next/link
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => {
    return <a href={href}>{children}</a>;
  },
}));

const mockVehicle: Vehicle = {
  id: 1,
  ref: "2023-RENAULT-001",
  brand: "Renault",
  model: "Clio",
  year: 2023,
  mileage: 15000,
  fuel_type: "essence",
  transmission: "manuel",
  color: "Rouge",
  description: "Voiture en bon état",
  vehicle_type: "sale",
  sale_price: "15000",
  rent_price: "",
  rent_duration_min: undefined,
  is_available: true,
  created_at: "2023-01-01",
  updated_at: "2023-01-01",
  price: "15000",
  images: [
    {
      id: 1,
      image: "/media/car.jpg",
      order: 0,
      created_at: "2023-01-01",
      updated_at: "2023-01-01",
    },
  ],
};

describe("VehicleCard", () => {
  it("show vehicle information correctly", () => {
    render(<VehicleCard vehicle={mockVehicle} />);
    expect(screen.getByText("Renault Clio")).toBeInTheDocument();
    expect(screen.getByText("Année : 2023")).toBeInTheDocument();
    expect(screen.getByText("15 000 km")).toBeInTheDocument();
    expect(screen.getByText("15 000 €")).toBeInTheDocument();
    expect(screen.getByText("Achat")).toBeInTheDocument();
  });

  it("show location badge for rent vehicle if available", () => {
    const rentVehicle = {
      ...mockVehicle,
      vehicle_type: "rent" as const,
      rent_price: "400",
      sale_price: undefined,
    } as unknown as Vehicle;
    render(<VehicleCard vehicle={rentVehicle as Vehicle} />);
    expect(screen.getByText("Location LLD")).toBeInTheDocument();
  });

  it("show default image if no image provided", () => {
    const noImageVehicle = { ...mockVehicle, images: [] } as unknown as Vehicle;
    render(<VehicleCard vehicle={noImageVehicle} />);
    const img = screen.getByRole("img");
    expect(img.getAttribute("src")).toBe("/images/placeholder-car.png");
  });

  it("show vehicle image if available", () => {
    render(<VehicleCard vehicle={mockVehicle} />);
    const img = screen.getByRole("img");
    expect(img.getAttribute("src")).toBe(
      "http://localhost:8000/api/media/car.jpg",
    );
  });
});
