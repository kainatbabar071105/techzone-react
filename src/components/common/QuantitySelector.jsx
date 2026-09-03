
function QuantitySelector({
  quantity,
  increaseQuantity,
  decreaseQuantity,
}) {
  return (
    <div>
      <h3>Quantity Selector</h3>

      <button onClick={decreaseQuantity}>
        -
      </button>

      <span style={{ margin: "0 15px" }}>
        Quantity: {quantity}
      </span>

      <button onClick={increaseQuantity}>
        +
      </button>
    </div>
  );
}

export default QuantitySelector;

