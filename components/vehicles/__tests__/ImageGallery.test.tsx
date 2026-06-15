import { render, screen } from "@testing-library/react";
import ImageGallery from "@/components/vehicles/ImageGallery";

// Mock de embla-carousel-react
jest.mock("embla-carousel-react", () => ({
  __esModule: true,
  default: () => [
    jest.fn(),
    {
      canScrollPrev: jest.fn(() => true),
      canScrollNext: jest.fn(() => true),
      on: jest.fn(),
      scrollPrev: jest.fn(),
      scrollNext: jest.fn(),
    },
  ],
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

// Mock de @/constants/api
jest.mock("@/constants/api", () => ({
  API_URL: "http://localhost:8000/api",
}));

describe("ImageGallery", () => {
  const vehicleName = "Renault Clio";

  it('affiche "Aucune image" si aucune image fournie', () => {
    render(<ImageGallery images={[]} vehicleName={vehicleName} />);
    expect(screen.getByText("Aucune image")).toBeInTheDocument();
  });

  it("affiche les images sous forme d’URLs absolues", () => {
    const images = ["/media/car1.jpg", "/media/car2.jpg"];
    render(<ImageGallery images={images} vehicleName={vehicleName} />);
    const imgElements = screen.getAllByRole("img");
    expect(imgElements).toHaveLength(2);
    expect(imgElements[0]).toHaveAttribute(
      "src",
      "http://localhost:8000/api/media/car1.jpg",
    );
    expect(imgElements[1]).toHaveAttribute(
      "src",
      "http://localhost:8000/api/media/car2.jpg",
    );
  });

  it("gère les objets image avec propriété 'image'", () => {
    const images = [
      { id: 1, image: "/media/car1.jpg", order: 0 },
      { id: 2, image: "/media/car2.jpg", order: 1 },
    ];
    render(<ImageGallery images={images} vehicleName={vehicleName} />);
    const imgElements = screen.getAllByRole("img");
    expect(imgElements).toHaveLength(2);
    expect(imgElements[0]).toHaveAttribute(
      "src",
      "http://localhost:8000/api/media/car1.jpg",
    );
    expect(imgElements[1]).toHaveAttribute(
      "src",
      "http://localhost:8000/api/media/car2.jpg",
    );
  });

  it("ignore les URLs vides", () => {
    const images = ["/media/car1.jpg", "", "/media/car2.jpg", null];
    render(<ImageGallery images={images as any} vehicleName={vehicleName} />);
    const imgElements = screen.getAllByRole("img");
    expect(imgElements).toHaveLength(2);
    expect(imgElements[0]).toHaveAttribute(
      "src",
      "http://localhost:8000/api/media/car1.jpg",
    );
    expect(imgElements[1]).toHaveAttribute(
      "src",
      "http://localhost:8000/api/media/car2.jpg",
    );
  });

  it("n’affiche pas les boutons de navigation si une seule image", () => {
    const images = ["/media/car1.jpg"];
    render(<ImageGallery images={images} vehicleName={vehicleName} />);
    const buttons = document.querySelectorAll("button");
    expect(buttons.length).toBe(0);
  });

  it("affiche les boutons de navigation si plusieurs images", () => {
    const images = ["/media/car1.jpg", "/media/car2.jpg"];
    render(<ImageGallery images={images} vehicleName={vehicleName} />);
    const buttons = document.querySelectorAll("button");
    expect(buttons.length).toBe(2);
  });
});
