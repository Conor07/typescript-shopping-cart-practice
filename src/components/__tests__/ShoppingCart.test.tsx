import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { ShoppingCartProvider } from "../../context/ShoppingCartContext";
import ShoppingCart from "../ShoppingCart";

import storeItems from "../../data/items.json";
import Store from "../../pages/Store";
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
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: watchMediaMock,
  });
});

describe("ShoppingCart component initally empty test", () => {
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
});

describe("ShoppingCart component with items test", () => {
  // Add items to the cart before each test
  // Add items to the cart before each test
  beforeEach(() => {
    localStorage.clear();

    render(
      <ShoppingCartProvider>
        <Store />
      </ShoppingCartProvider>
    );

    const firstItemId = storeItems[0].id;

    const addToCartButton = screen.getByTestId(`add-to-cart-${firstItemId}`);

    expect(addToCartButton).toBeInTheDocument();

    act(() => {
      addToCartButton.click();
    });

    const increaseCartQuantityButtonFirstItem = screen.getByTestId(
      `increase-cart-quantity-${firstItemId}`
    );

    expect(increaseCartQuantityButtonFirstItem).toBeInTheDocument();

    act(() => {
      increaseCartQuantityButtonFirstItem.click();
      increaseCartQuantityButtonFirstItem.click();
    });

    const secondItemId = storeItems[1].id;

    const addToCartButtonSecondItem = screen.getByTestId(
      `add-to-cart-${secondItemId}`
    );

    expect(addToCartButtonSecondItem).toBeInTheDocument();

    act(() => {
      addToCartButtonSecondItem.click();
    });

    const increaseCartQuantityButtonSecondItem = screen.getByTestId(
      `increase-cart-quantity-${secondItemId}`
    );

    expect(increaseCartQuantityButtonSecondItem).toBeInTheDocument();

    act(() => {
      increaseCartQuantityButtonSecondItem.click();
    });

    render(
      <ShoppingCartProvider>
        <ShoppingCart isOpen={true} />
      </ShoppingCartProvider>
    );
  });

  test("shows correct items, names and quantities in the cart", () => {
    // Check for first item
    const firstItemId = storeItems[0].id;

    const firstItemName = screen.getByTestId(`cart-item-name-${firstItemId}`);

    expect(firstItemName).toHaveTextContent(storeItems[0].name);

    const firstItemQuantity = screen.getByTestId(
      `cart-item-quantity-${firstItemId}`
    );

    expect(firstItemQuantity).toHaveTextContent("x3");

    // Check for second item
    const secondItemId = storeItems[1].id;

    const secondItemName = screen.getByTestId(`cart-item-name-${secondItemId}`);

    expect(secondItemName).toHaveTextContent(storeItems[1].name);

    const secondItemQuantity = screen.getByTestId(
      `cart-item-quantity-${secondItemId}`
    );
    expect(secondItemQuantity).toHaveTextContent("x2");
  });

  test("shows correct total price in the cart", () => {
    const firstItem = storeItems[0];
    const secondItem = storeItems[1];

    const expectedTotal = formatCurrency(
      firstItem.price * 3 + secondItem.price * 2
    );

    const totalPriceElement = screen.getByTestId("cart-total-price");

    expect(totalPriceElement).toHaveTextContent(`${expectedTotal}`);
  });

  test("removing all items from the cart shows empty cart message", () => {
    const firstItemId = storeItems[0].id;

    const removeFromCartButtonFirstItem = screen.getByTestId(
      `cart-item-remove-from-cart-${firstItemId}`
    );

    expect(removeFromCartButtonFirstItem).toBeInTheDocument();

    act(() => {
      removeFromCartButtonFirstItem.click();
      removeFromCartButtonFirstItem.click();
      removeFromCartButtonFirstItem.click();
    });

    const secondItemId = storeItems[1].id;

    const removeFromCartButtonSecondItem = screen.getByTestId(
      `cart-item-remove-from-cart-${secondItemId}`
    );

    expect(removeFromCartButtonSecondItem).toBeInTheDocument();

    act(() => {
      removeFromCartButtonSecondItem.click();
      removeFromCartButtonSecondItem.click();
    });

    const emptyCartMessage = screen.queryByTestId("cart-is-empty-message");

    expect(emptyCartMessage).toBeInTheDocument();
  });

  test("removing an item from the cart updates the items  correctly", async () => {
    const firstItemId = storeItems[0].id;

    const removeFromCartButton = await screen.findByTestId(
      `cart-item-remove-from-cart-${firstItemId}`
    );

    expect(removeFromCartButton).toBeInTheDocument();

    act(() => {
      removeFromCartButton.click();
    });

    const firstItem = screen.queryByTestId(`cart-item-name-${firstItemId}`);

    expect(firstItem).not.toBeInTheDocument();
  });

  test("removing an item from the cart updates the total price correctly", () => {
    const firstItem = storeItems[0];
    const secondItem = storeItems[1];

    const firstItemId = firstItem.id;
    const firstRemoveFromCartButton = screen.getByTestId(
      `cart-item-remove-from-cart-${firstItemId}`
    );

    expect(firstRemoveFromCartButton).toBeInTheDocument();

    act(() => {
      firstRemoveFromCartButton.click();
    });

    const expectedTotal = formatCurrency(secondItem.price * 2);

    const totalPriceElement = screen.getByTestId("cart-total-price");

    expect(totalPriceElement).toHaveTextContent(`${expectedTotal}`);
  });
});
