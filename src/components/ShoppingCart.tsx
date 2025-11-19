import React from "react";
import { Offcanvas, Stack } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext";
import CartItem from "./CartItem";
import storeItems from "../data/items.json";

type ShoppingCartProps = {
  isOpen: boolean;
};

const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen }) => {
  const { closeCart, cartItems } = useShoppingCart();
  return (
    <Offcanvas show={isOpen} placement="end" onHide={closeCart}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title> Cart</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        <Stack gap={3}>
          {cartItems.length === 0 ? (
            <div>Your cart is empty</div>
          ) : (
            cartItems.map((item) => <CartItem key={item.id} {...item} />)
          )}

          <div className="ms-auto fw-bold fs-5">
            Total{" "}
            {cartItems
              .reduce((total, cartItem) => {
                const item = storeItems.find((i) => i.id === cartItem.id);

                return total + (item?.price || 0) * cartItem.quantity;
              }, 0)
              .toLocaleString("en-GB", {
                style: "currency",
                currency: "GBP",
              })}
          </div>
        </Stack>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ShoppingCart;
