import { Link } from "react-router-dom";
import ProductCard from "../components/product-card";

const Home = () => {
  const addToCardHandler = () =>{
    console.log("addToCardHandler")
  }
  return (
    <div className="home">
      <section></section>
      <h1>
        Latest Products
        <Link to={"/search"}>More</Link>
      </h1>
      <main>
        <ProductCard
          productId="12"
          photo="https://m.media-amazon.com/images/I/815uX7wkOZS._AC_SX466_.jpg"
          price={123}
          stock={12}
          name="Laptop Market"
          handler={addToCardHandler}
        />
      </main>
    </div>
  );
};

export default Home;
