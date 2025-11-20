import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { ShoppingCartProvider } from "../../context/ShoppingCartContext";
import Store from "../Store";

import storeItems from "../../data/items.json";
import { formatCurrency } from "../../utilities/formatCurrency";

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
  // JSDOM doesn't implement matchMedia; react-bootstrap Offcanvas uses it.
  // Mock it for this test file so the component can render without error.
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: watchMediaMock,
  });
});

beforeEach(() => {
  localStorage.clear();

  render(
    <ShoppingCartProvider>
      <Store />
    </ShoppingCartProvider>
  );
});

test("store page renders with 4 store items", () => {
  expect(screen.getByTestId("store-page")).toBeInTheDocument();

  expect(screen.getAllByTestId(/store-item-/i).length).toBe(4);
});

test("each store item displays correct name and price", () => {
  const itemNames = storeItems.map((item) => item.name);

  const itemPrices = storeItems.map((item) => {
    return formatCurrency(item.price);
  });

  itemNames.forEach((name) => {
    expect(screen.getByText(name)).toBeInTheDocument();
  });

  itemPrices.forEach((price) => {
    expect(screen.getByText(price)).toBeInTheDocument();
  });
});

test("each store item has an 'Add To Cart' button", () => {
  const addToCartButtons = screen.getAllByRole("button", {
    name: /add to cart/i,
  });

  expect(addToCartButtons.length).toBe(4);
});

test("adding an item to the cart updates the quantity display", () => {
  const firstItemId = storeItems[0].id;

  const addToCartButton = screen.getByTestId(`add-to-cart-${firstItemId}`);

  expect(addToCartButton).toBeInTheDocument();

  act(() => {
    addToCartButton.click();
  });

  const quantityDisplay = screen.getByTestId(`quantity-in-cart-${firstItemId}`);

  expect(quantityDisplay).toBeInTheDocument();

  expect(quantityDisplay).toHaveTextContent("1");
});

test("after adding an item to the cart the increase and decrease cart quantity buttons should render, then clicking increase cart quantity and decrease cart quantity updates the quantity display correctly", () => {
  const firstItemId = storeItems[0].id;

  const addToCartButton = screen.getByTestId(`add-to-cart-${firstItemId}`);

  expect(addToCartButton).toBeInTheDocument();

  act(() => {
    addToCartButton.click();
  });

  const increaseCartQuantityButton = screen.getByTestId(
    `increase-cart-quantity-${firstItemId}`
  );

  expect(increaseCartQuantityButton).toBeInTheDocument();

  const decreaseCartQuantityButton = screen.getByTestId(
    `decrease-cart-quantity-${firstItemId}`
  );

  expect(decreaseCartQuantityButton).toBeInTheDocument();

  act(() => {
    increaseCartQuantityButton.click();
    increaseCartQuantityButton.click();
  });

  const quantityDisplay = screen.getByTestId(`quantity-in-cart-${firstItemId}`);

  expect(quantityDisplay).toBeInTheDocument();

  expect(quantityDisplay).toHaveTextContent("3");

  act(() => {
    decreaseCartQuantityButton.click();
  });

  expect(quantityDisplay).toHaveTextContent("2");
});

test("removing an item from the cart updates the store item to show 'Add To Cart' button again", () => {
  const firstItemId = storeItems[0].id;

  const addToCartButton = screen.getByTestId(`add-to-cart-${firstItemId}`);

  expect(addToCartButton).toBeInTheDocument();

  act(() => {
    addToCartButton.click();
  });

  const removeFromCartButton = screen.getByTestId(
    `remove-from-cart-${firstItemId}`
  );

  expect(removeFromCartButton).toBeInTheDocument();

  act(() => {
    removeFromCartButton.click();
  });

  const newAddToCartButton = screen.getByTestId(`add-to-cart-${firstItemId}`);

  expect(newAddToCartButton).toBeInTheDocument();
});

test("clicking decrease cart quantity button when quantity is 1 removes the item from the cart and shows 'Add To Cart' button", () => {
  const firstItemId = storeItems[0].id;

  const addToCartButton = screen.getByTestId(`add-to-cart-${firstItemId}`);

  expect(addToCartButton).toBeInTheDocument();

  act(() => {
    addToCartButton.click();
  });

  const decreaseCartQuantityButton = screen.getByTestId(
    `decrease-cart-quantity-${firstItemId}`
  );

  expect(decreaseCartQuantityButton).toBeInTheDocument();

  act(() => {
    decreaseCartQuantityButton.click();
  });

  const newAddToCartButton = screen.getByTestId(`add-to-cart-${firstItemId}`);

  expect(newAddToCartButton).toBeInTheDocument();
});
