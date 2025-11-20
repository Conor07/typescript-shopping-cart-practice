import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ShoppingCartProvider } from "../../context/ShoppingCartContext";
import Store from "../../pages/Store";
import Navbar from "../Navbar";

import storeItems from "../../data/items.json";
import Home from "../../pages/Home";
// import App from "../../App";

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

describe("ShoppingCart component initally empty test", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: watchMediaMock,
    });

    localStorage.clear();

    render(
      <ShoppingCartProvider>
        <MemoryRouter initialEntries={["/store"]}>
          {/* // Set initial route to /store so Store page renders first so we can add items to cart */}
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/store" element={<Store />} />
          </Routes>
        </MemoryRouter>
      </ShoppingCartProvider>
    );
  });

  test("cart button does not render when cart is empty", () => {
    const navbar = screen.getByTestId("navbar");

    expect(navbar).toBeInTheDocument();

    const navbarCartButton = screen.queryByTestId("navbar-cart-button");

    expect(navbarCartButton).not.toBeInTheDocument();
  });
});

describe("ShoppingCart component with items test", () => {
  // Add items to the cart before each test
  beforeEach(() => {
    localStorage.clear();

    render(
      <ShoppingCartProvider>
        <MemoryRouter initialEntries={["/store"]}>
          {/* // Set initial route to /store so Store page renders first so we can add items to cart */}
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/store" element={<Store />} />
          </Routes>
        </MemoryRouter>
      </ShoppingCartProvider>
    );

    const firstItemId = storeItems[0].id;

    const addToCartButton = screen.getByTestId(`add-to-cart-${firstItemId}`);

    act(() => {
      addToCartButton.click();
      addToCartButton.click();
      addToCartButton.click();
    });

    const secondItemId = storeItems[1].id;

    const addToCartButton2 = screen.getByTestId(`add-to-cart-${secondItemId}`);

    act(() => {
      addToCartButton2.click();
      addToCartButton2.click();
    });
  });

  test("cart button renders when cart has items", () => {
    const navbar = screen.getByTestId("navbar");

    expect(navbar).toBeInTheDocument();

    const navbarCartButton = screen.queryByTestId("navbar-cart-button");

    expect(navbarCartButton).toBeInTheDocument();
  });

  test("navbar cart badge renders and shows correct number of items in cart", () => {
    const navbarCartQuantityBadge = screen.queryByTestId(
      "navbar-cart-quantity-badge"
    );

    expect(navbarCartQuantityBadge).toBeInTheDocument();

    expect(navbarCartQuantityBadge).toHaveTextContent("5");
  });

  test("clicking cart button opens shopping cart", async () => {
    const navbarCartButton = await screen.findByTestId("navbar-cart-button");

    expect(navbarCartButton).toBeInTheDocument();

    act(() => {
      navbarCartButton.click();
    });

    const shoppingCart = await screen.findByTestId("shopping-cart");

    expect(shoppingCart).toBeInTheDocument();
  });
});
