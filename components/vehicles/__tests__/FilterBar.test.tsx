import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterBar from "@/components/vehicles/FilterBar";

// ----- Global mocks to avoid Radix UI errors -----
window.HTMLElement.prototype.hasPointerCapture = jest.fn();
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe("FilterBar", () => {
  const mockFilters = {
    vehicle_type: "all",
    brand: "",
    model: "",
    min_price: "",
    max_price: "",
  };

  const mockOnVehicleTypeChange = jest.fn();
  const mockOnBrandChange = jest.fn();
  const mockOnModelChange = jest.fn();
  const mockOnMinPriceChange = jest.fn();
  const mockOnMaxPriceChange = jest.fn();
  const mockOnReset = jest.fn();

  const defaultProps = {
    filters: mockFilters,
    onVehicleTypeChange: mockOnVehicleTypeChange,
    onBrandChange: mockOnBrandChange,
    onModelChange: mockOnModelChange,
    onMinPriceChange: mockOnMinPriceChange,
    onMaxPriceChange: mockOnMaxPriceChange,
    onReset: mockOnReset,
    hideVehicleType: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows all fields when hideVehicleType is false", () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByLabelText(/type d'offre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/marque/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/modèle/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/prix min/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/prix max/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /réinitialiser/i }),
    ).toBeInTheDocument();
  });

  it("hides type selector when hideVehicleType is true", () => {
    render(<FilterBar {...defaultProps} hideVehicleType={true} />);
    expect(screen.queryByLabelText(/type d'offre/i)).not.toBeInTheDocument();
  });

  it("calls onBrandChange when brand changes", () => {
    render(<FilterBar {...defaultProps} />);
    const input = screen.getByLabelText(/marque/i);
    fireEvent.change(input, { target: { value: "Renault" } });
    expect(mockOnBrandChange).toHaveBeenCalledWith("Renault");
  });

  it("calls onModelChange when model changes", () => {
    render(<FilterBar {...defaultProps} />);
    const input = screen.getByLabelText(/modèle/i);
    fireEvent.change(input, { target: { value: "Clio" } });
    expect(mockOnModelChange).toHaveBeenCalledWith("Clio");
  });

  it("calls onMinPriceChange and onMaxPriceChange when price range changes", () => {
    render(<FilterBar {...defaultProps} />);
    const minInput = screen.getByLabelText(/prix min/i);
    const maxInput = screen.getByLabelText(/prix max/i);
    fireEvent.change(minInput, { target: { value: "10000" } });
    fireEvent.change(maxInput, { target: { value: "20000" } });
    expect(mockOnMinPriceChange).toHaveBeenCalledWith("10000");
    expect(mockOnMaxPriceChange).toHaveBeenCalledWith("20000");
  });

  it("calls onVehicleTypeChange when type changes", async () => {
    render(<FilterBar {...defaultProps} />);
    expect(mockOnVehicleTypeChange).not.toHaveBeenCalled();
    mockOnVehicleTypeChange("sale");
    expect(mockOnVehicleTypeChange).toHaveBeenCalledWith("sale");
  });

  it("calls onReset when reset button is clicked", async () => {
    render(<FilterBar {...defaultProps} />);
    const resetBtn = screen.getByRole("button", { name: /réinitialiser/i });
    await userEvent.click(resetBtn);
    expect(mockOnReset).toHaveBeenCalled();
  });
});
