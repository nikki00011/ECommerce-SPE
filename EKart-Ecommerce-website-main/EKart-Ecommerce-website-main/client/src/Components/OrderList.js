import React, { useEffect, useState } from "react";
import ReviewCreate from "./ReviewCreate";
import axios from "axios";
import getHeaders from "../Utils/jwt_header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Utils/auth_context";
import ClipLoader from "react-spinners/ClipLoader";

const OrderList = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [orders, setOrders] = useState([]);
  let [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`http://ekart.com/orders`, {
        headers: await getHeaders(navigate, auth),
      });
      console.table(res.data.ordersList[0]?.orders);
      if (res.data?.ordersList[0]?.orders) {
        setOrders(res.data?.ordersList[0]?.orders);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const renderedOrders = Object.values(orders).map((order) => (
    <div key={order.orderId}>
      <hr style={{ backgroundColor: "white", opacity: 0.2, height: 0.1 }}></hr>
      <div>
        <div style={{ marginLeft: 20 }}>
          <h6>
            Order Id : {order.orderId} &emsp; |&emsp; Order Total : ₹{" "}
            {order.total}
            &emsp; | &emsp;Order Status : {order.status}
          </h6>
        </div>
        <div className="d-flex flex-row flex-wrap justify-content-start ">
          {order.products.map((product) => (
            <div
              className="myCard card justify-content-center align-items-around"
              style={{
                width: "31%",
                height: "40%",
                margin: "10px",
              }}
              key={product.productId + order.orderId}
            >
              <div className="myCard card-body">
                <div className="d-flex flex-row">
                  <img
                    src={product.imageUrl}
                    style={{ marginRight: "20px" }}
                    width="50%"
                    alt="product"
                  />
                  <div className="d-flex flex-column justify-content-start align-items-start ">
                    <h3>{product.name}</h3>
                    <h6>Price : ₹ {product.price}</h6>
                    <h6>Quantity : {product.quantity} Units</h6>
                    {order.status === "Accepted" ? (
                      <ReviewCreate
                        productId={product.productId}
                        productName={product.name}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ));

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="d-flex flex-column flex-wrap justify-content-start">
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
        <div>
          {Object.keys(orders).length > 0 ? null : (
            <center className="mt-5">No Orders</center>
          )}
          {renderedOrders}
        </div>
      )}
    </div>
  );
};

export default OrderList;
