import React, { useState, useEffect } from "react";
import axios from "axios";
import ReviewsList from "./ReviewsList";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

const ProductList = () => {
  const [products, setProducts] = useState({});
  let [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://ekart.com/products");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};
    item["quantity"] = 1;
    cartItems[item.productId] = item;
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    toast.success("Added To Cart");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const renderedProducts = Object.values(products).map((product) => {
    return (
      <div
        className="myCard card d-flex align-items-center"
        style={{
          width: "23%",
          height: "40%",
          margin: "10px",
          padding: 0,
        }}
        key={product.productId}
      >
        <div className=" card-body">
          <img
            src={product.imageUrl}
            style={{ marginBottom: "50px" }}
            height="200vh"
            width="200hw"
            alt="product"
          />
          <h2 style={{ color: "white" }}>{product.name}</h2>
          <p className="mb-0 pb-0">Seller : {product.sellerName}</p>
          <p className="mt-0 pt-0">{product.stock} Units Avaialable</p>
          <p>Product Reviews</p>
          <ReviewsList reviews={product.reviews} />
          {product.stock > 0 ? (
            <div className="d-flex flex-row justify-content-start align-items-baseline">
              <h5 style={{ color: "white", marginRight: 2, paddingTop: 5 }}>
                ₹
              </h5>
              <h4 className="mr-5" style={{ color: "white" }}>
                {product.price}
              </h4>
              <button
                onClick={() => addToCart(product)}
                className="btn myBtn rounded-0"
              >
                Add To Cart
              </button>
            </div>
          ) : (
            <button
              className="btn btn-danger rounded-0"
              style={{ alignSelf: "flex-end" }}
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    );
  });

  return (
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
      ) : (
        <div className="d-flex flex-row flex-wrap justify-content-start">
          {renderedProducts}{" "}
        </div>
      )}
    </div>
  );
};

export default ProductList;
