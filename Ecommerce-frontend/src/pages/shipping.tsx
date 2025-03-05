import React, { ChangeEvent, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const shipping = () => {
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    state: "",
    country: "",
    pinCode: "",
    city: "",
  });
  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const navigate = useNavigate()
  return (
    <div className="shipping">
      <button className="back-btn" onClick={()=> navigate("/cart")}>
        <BiArrowBack />
      </button>
      <form action="">
        <h1>Shipping Address</h1>
        <input
          type="text"
          placeholder="Address"
          name="address"
          value={shippingInfo.address}
          onChange={changeHandler}
        />
        <input
          type="text"
          placeholder="City"
          name="city"
          value={shippingInfo.city}
          onChange={changeHandler}
        />
        <input
          type="text"
          placeholder="state"
          name="state"
          value={shippingInfo.state}
          onChange={changeHandler}
        />
        <input
          type="number"
          placeholder="pinCode"
          name="pinCode"
          value={shippingInfo.pinCode}
          onChange={changeHandler}
        />
        <select
          onChange={changeHandler}
          value={shippingInfo.country}
          name="country"
        >
          <option value="">Choose Country</option>
          <option value="pakistan">Pak</option>
          <option value="usa">USA</option>
        </select>
        <button type="submit">
            Pay Now
        </button>
      </form>
    </div>
  );
};

export default shipping;
