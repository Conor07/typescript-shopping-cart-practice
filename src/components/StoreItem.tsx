import React from "react";
import { Button, Card } from "react-bootstrap";
import { formatCurrency } from "../utilities/formatCurrency";
import { useShoppingCart } from "../context/ShoppingCartContext";

type StoreItemProps = {
  id: number;
  name: string;
  price: number;
  imgUrl: string;
};

const StoreItem: React.FC<StoreItemProps> = ({ id, name, price, imgUrl }) => {
  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
  } = useShoppingCart();

  const quantity = getItemQuantity(id);

  return (
    <Card className="h-100" data-testid={`store-item-${id}`}>
      <Card.Img
        variant="top"
        src={imgUrl}
        height="200px"
        style={{ objectFit: "cover" }}
      />

      <Card.Body className="d-flex flex-column">
        <Card.Title className="d-flex justify-content-between align-items-baseline mb-4">
          <span className="fs-2">{name}</span>

          <span className="ms-2 text-muted">{formatCurrency(price)}</span>
        </Card.Title>

        <div className="mt-auto">
          {quantity === 0 ? (
            <Button
              className="w-100"
              onClick={() => increaseCartQuantity(id)}
              data-testid={`add-to-cart-${id}`}
            >
              Add To Cart
            </Button>
          ) : (
            <div
              className="d-flex align-items-center flex-column"
              style={{ gap: "0.5rem" }}
            >
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ gap: "0.5rem" }}
              >
                <Button
                  onClick={() => decreaseCartQuantity(id)}
                  data-testid={`decrease-cart-quantity-${id}`}
                >
                  -
                </Button>
                <div>
                  <span className="fs-3" data-testid={`quantity-in-cart-${id}`}>
                    {quantity}
                  </span>{" "}
                  in cart
                </div>

                <Button
                  onClick={() => increaseCartQuantity(id)}
                  data-testid={`increase-cart-quantity-${id}`}
                >
                  +
                </Button>
              </div>

              <div
                className="d-flex align-items-center justify-content-center"
                style={{ gap: "0.5rem" }}
              >
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeFromCart(id)}
                  data-testid={`remove-from-cart-${id}`}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default StoreItem;
