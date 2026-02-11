import { useState } from "react";

const ShoppingCart = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");

  const handleAddProduct = () => {
    if (productName.trim() !== "" && productPrice.trim() !== "") {
      const newProduct = {
        id: Date.now(),
        name: productName.trim(),
        price: parseFloat(productPrice),
        quantity: 1,
      };
      setProducts([...products, newProduct]);
      setProductName("");
      setProductPrice("");
    }
  };

  const increaseQuantity = (id) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, quantity: p.quantity + 1 } : p
      )
    );
  };

  const decreaseQuantity = (id) => {
    setProducts(
      products.map((p) =>
        p.id === id && p.quantity > 1
          ? { ...p, quantity: p.quantity - 1 }
          : p
      )
    );
  };

  const removeProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const totalPrice = products.reduce(
    (total, p) => total + p.price * p.quantity,
    0
  );

  return (
    <div>
      <h2>Simple Shopping Cart</h2>

      <input
        type="text"
        placeholder="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price"
        value={productPrice}
        onChange={(e) => setProductPrice(e.target.value)}
      />

      <button onClick={handleAddProduct}>Add to Cart</button>

      {products.length === 0 ? (
        <p>The cart is empty.</p>
      ) : (
        <>
          <ul>
            {products.map((p) => (
              <li key={p.id}>
                {p.name} - ${p.price}
                <br />
                <button onClick={() => decreaseQuantity(p.id)}>-</button>
                {p.quantity}
                <button onClick={() => increaseQuantity(p.id)}>+</button>
                <br />
                <button onClick={() => removeProduct(p.id)}>Remove</button>
              </li>
            ))}
          </ul>

          <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
        </>
      )}
    </div>
  );
};

export default ShoppingCart;
