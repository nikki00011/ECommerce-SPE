import React, { useEffect, useState } from "react";
import axios from "axios";
import getHeaders from "../Utils/jwt_header";
import { toast } from "react-toastify";
import QuantityButton from "./QuantityButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Utils/auth_context";
import ClipLoader from "react-spinners/ClipLoader";

const Cart = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  let [loading, setLoading] = useState(false);

  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || {}
  );
  const [total, setTotal] = useState(0);

  const placeOrder = async () => {
    const products = Object.values(cartItems);
    const result = products.map(
      ({ productId, name, imageUrl, price, quantity }) => ({
        productId,
        name,
        imageUrl,
        price,
        quantity,
      })
    );
    try {
      setLoading(true);
      await axios.post(
        "http://ekart.com/orders/create",
        {
          products: result,
          total,
        },
        {
          headers: await getHeaders(navigate, auth),
        }
      );
      toast.info("Order Created");
    } catch (err) {
      toast.error("Error while Ordering");
      console.log(err);
    } finally {
      setLoading(false);
    }
    setCartItems({});
    localStorage.removeItem("cartItems");
  };

  const removeFromCart = (item) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};
    delete cartItems[item.productId];
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    setCartItems(cartItems);
  };

  const computeTotalPrice = () => {
    let t = 0;
    Object.values(cartItems).forEach((product) => {
      t += parseInt(product.price) * parseInt(product.quantity);
    });
    setTotal(t);
  };

  useEffect(() => {
    computeTotalPrice();
  });

  const renderedProducts = Object.values(cartItems).map((product) => {
    return (
      <div
        className="myCard card justify-content-center align-items-around"
        style={{ width: "48%", margin: "10px" }}
        key={product.productId}
      >
        <div className="card-body">
          <div className="d-flex flex-row">
            <img
              src={
                product.imageUrl ||
                "https://www.rallis.com/Upload/Images/thumbnail/Product-inside.png"
              }
              width="50%"
              style={{ marginRight: "50px" }}
              alt="product"
            />
            <div className="d-flex flex-column justify-content-start align-items-start ">
              <h3>{product.name}</h3>
              <h6>Price : ₹ {product.price}</h6>
              <h6>Stock : {product.stock} Units</h6>
              <h6>Seller : {product.sellerName}</h6>
              <QuantityButton
                maxStock={product.stock}
                selcted_quantity={product.quantity}
                updateStock={(currentStock) => {
                  product.quantity = currentStock;
                  computeTotalPrice();
                }}
              />
              <button
                className="btn rounded-0 btn-danger"
                onClick={() => {
                  removeFromCart(product);
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return total > 0 ? (
    <div>
      {loading ? (
        <center>
          <ClipLoader
            loading={loading}
            color="white"
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </center>
      ) : null}
      <div className="row">
        <div className="col-9">
          <div className="d-flex flex-row flex-wrap justify-content-start">
            {renderedProducts}
          </div>
        </div>
        <div className="col  ">
          <h4 className="m-3"> Cart Summary</h4>
          <h6 className="m-3"> Total Amount : ₹ {total}</h6>
          <button
            className="btn rounded-0 btn-success ml-3"
            onClick={placeOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  ) : (
    <center className="mt-5">No Items in Cart</center>
  );
};

export default Cart;
