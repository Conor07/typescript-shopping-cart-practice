import React from "react";
import storeItems from "../data/items.json";
import { Row, Col } from "react-bootstrap";
import StoreItem from "../components/StoreItem";

const Store = () => {
  return (
    <div>
      <h1>Store</h1>

      <Row xs={1} md={2} lg={3} className="g-3">
        {storeItems.map((item) => (
          <Col>
            <StoreItem key={item.id} {...item} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Store;
