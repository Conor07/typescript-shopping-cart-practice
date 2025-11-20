import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ShoppingCartProvider } from "../../context/ShoppingCartContext";
import ShoppingCart from "../ShoppingCart";

const watchMediaMock = jest.fn().mockImplementation((query) => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
});

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: watchMediaMock,
  });
});

test("shows empty cart message when there are no items", () => {
  // JSDOM doesn't implement matchMedia; react-bootstrap Offcanvas uses it.
  // Mock it for this test file so the component can render without error.

  render(
    <ShoppingCartProvider>
      <ShoppingCart isOpen={true} />
    </ShoppingCartProvider>
  );

  expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
});
