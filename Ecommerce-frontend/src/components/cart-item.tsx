import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

type cartItemProps = {
    cartItem: any
}
const cartItem = ({cartItem}:cartItemProps) => {
    const {id,name,price,stock,photo,quantity} = cartItem;
  return (
    <div className="cart-item">
        <img src={photo} alt="photo" />
        <article>
            <Link to={`/product/${id}`} >{name}</Link>
            <span>{price}</span>
        </article>
        <div>
            <button>-</button>
            <span>{quantity}</span>
            <button>+</button>
        </div>
        <button>
            <FaTrash/>
        </button>
    </div>
  )
}

export default cartItem