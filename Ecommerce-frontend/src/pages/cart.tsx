import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/cart-item"
import { Link } from "react-router-dom";
import cartItem from "../components/cart-item";

const cartItems = [
  {
    cartId: "12312",
    photo: "https://m.media-amazon.com/images/I/815uX7wkOZS._AC_SX466_.jpg",
    price: 123,
    stock: 123,
    name: "Laptop Market",
  },
];
const subTotal = 4000;
const tax = Math.round(subTotal * 0.18);
const shippingCharges = 200;
const discount = 400;
const total = tax + shippingCharges + subTotal;

const Cart = () => {
  const [coupenValue, setCoupenValue] = useState("");
  const [isValidCoupen, setIsValidCoupen] = useState(false);

  useEffect(() => {
    const coupenId = setTimeout(() => {
      if (Math.random() > 0.5) setIsValidCoupen(true);
      else setIsValidCoupen(false);
    }, 1000);
    return () => {
      clearTimeout(coupenId);
    };
  }, [coupenValue]);

  return (
    <div className="cart">
      <main>
        {cartItem.length > 0 ? (
          cartItems.map((cart,index)=>(
            <CartItem cartItem={cart} key={index+1} />
          ))
        ) : (
          <h1>No Items Added.</h1>
        )}
      </main>
      <aside>
        <p>SubTotal: {subTotal}</p>
        <p>Shipping Charges: {shippingCharges}</p>
        <p>Tax: {tax}</p>
        <p>
          Discount - <em className="red">{discount}</em>
        </p>
        <p>
          <b>Totol: {total}</b>
        </p>
        <input
          type="text"
          value={coupenValue}
          name="text"
          onChange={(e) => setCoupenValue(e.target.value)}
        />
        {coupenValue &&
          (isValidCoupen ? (
            <span className="green">
              {discount} off using the code <code>{coupenValue}</code>{" "}
            </span>
          ) : (
            <span className="red">
              Invalid Coupon <VscError />{" "}
            </span>
          ))}
          {cartItems.length > 0 && (
            <Link to="/shipping" >Checkout</Link>
          )}
      </aside>
    </div>
  );
};

export default Cart;
