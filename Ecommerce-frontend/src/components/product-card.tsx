import { FaPlus } from "react-icons/fa";

type ProductProps = {
  productId: string;
  photo: string;
  price: number;
  stock: number;
  name: string;
  handler: () => void;
};
const server = "aslfdjasdklfj";
const ProductCard = ({
  productId,
  name,
  price,
  stock,
  photo,
  handler,
}: ProductProps) => {
  return (
    <div className="product-card">
      <img src={photo} alt="photo" />
      <p>{name}</p>
      <span>{price}</span>
      <div>
        <button onClick={() => handler()}>
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
