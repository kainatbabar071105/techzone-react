import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";
import { initialProducts } from "../data/products";

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const { user } = useAuth();

 // ==========================================
// PRODUCTS
// ==========================================

const [products, setProducts] = useState(() => {
  const savedProducts = localStorage.getItem("products");

  if (!savedProducts) {
    return initialProducts;
  }

  try {
    const parsedProducts = JSON.parse(savedProducts);

    // Make sure saved data is actually an array
    if (!Array.isArray(parsedProducts)) {
      return initialProducts;
    }

    // If old products don't have images,
    // use the latest initial product data.
    const updatedProducts = parsedProducts.map((savedProduct) => {
      const originalProduct = initialProducts.find(
        (product) => product.id === savedProduct.id
      );

      return {
        ...originalProduct,
        ...savedProduct,
        image:
          savedProduct.image ||
          originalProduct?.image ||
          "",
        description:
          savedProduct.description ||
          originalProduct?.description ||
          "",
      };
    });

    return updatedProducts;
  } catch (error) {
    console.error("Error loading products:", error);
    return initialProducts;
  }
});

useEffect(() => {
  localStorage.setItem(
    "products",
    JSON.stringify(products)
  );
}, [products]);
  // ==========================================
  // CART
  // ==========================================

  const [cartItems, setCartItems] = useState([]);

  // Load user's cart
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      return;
    }

    const savedCart = localStorage.getItem(
      `cartItems_${user.id}`
    );

    try {
      setCartItems(
        savedCart
          ? JSON.parse(savedCart)
          : []
      );
    } catch (error) {
      console.error(
        "Error loading cart:",
        error
      );

      setCartItems([]);
    }
  }, [user]);

  // Save cart
  function saveCart(updatedCart) {
    setCartItems(updatedCart);

    if (user) {
      localStorage.setItem(
        `cartItems_${user.id}`,
        JSON.stringify(updatedCart)
      );
    }
  }

  // ==========================================
  // ADD TO CART
  // ==========================================

  function addToCart(product) {
    if (product.stock <= 0) {
      alert(
        "This product is out of stock!"
      );
      return;
    }

    const existingProduct =
      cartItems.find(
        (item) =>
          item.id === product.id
      );

    // Product already exists
    if (existingProduct) {
      if (
        existingProduct.quantity >=
        existingProduct.stock
      ) {
        alert(
          "Maximum available stock reached!"
        );
        return;
      }

      const updatedCart =
        cartItems.map((item) => {
          if (
            item.id === product.id
          ) {
            return {
              ...item,
              quantity:
                item.quantity + 1,
            };
          }

          return item;
        });

      saveCart(updatedCart);
      return;
    }

    // Add new product
    const updatedCart = [
      ...cartItems,
      {
        ...product,
        quantity: 1,
      },
    ];

    saveCart(updatedCart);
  }

  // ==========================================
  // INCREASE QUANTITY
  // ==========================================

  function increaseQuantity(productId) {
    const updatedCart =
      cartItems.map((item) => {
        if (
          item.id === productId
        ) {
          if (
            item.quantity >=
            item.stock
          ) {
            alert(
              "Maximum available stock reached!"
            );

            return item;
          }

          return {
            ...item,
            quantity:
              item.quantity + 1,
          };
        }

        return item;
      });

    saveCart(updatedCart);
  }

  // ==========================================
  // DECREASE QUANTITY
  // ==========================================

  function decreaseQuantity(productId) {
    const product =
      cartItems.find(
        (item) =>
          item.id === productId
      );

    if (!product) {
      return;
    }

    // Reduce quantity
    if (product.quantity > 1) {
      const updatedCart =
        cartItems.map((item) => {
          if (
            item.id === productId
          ) {
            return {
              ...item,
              quantity:
                item.quantity - 1,
            };
          }

          return item;
        });

      saveCart(updatedCart);
      return;
    }

    // Remove product
    const updatedCart =
      cartItems.filter(
        (item) =>
          item.id !== productId
      );

    saveCart(updatedCart);
  }

  // ==========================================
  // REMOVE FROM CART
  // ==========================================

  function removeFromCart(productId) {
    const updatedCart =
      cartItems.filter(
        (item) =>
          item.id !== productId
      );

    saveCart(updatedCart);
  }

  // ==========================================
  // CLEAR CART
  // ==========================================

  function clearCart() {
    setCartItems([]);

    if (user) {
      localStorage.removeItem(
        `cartItems_${user.id}`
      );
    }
  }

  // ==========================================
  // TOTAL CART ITEMS
  // ==========================================

  const totalItems =
    cartItems.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );

  // ==========================================
  // WISHLIST
  // ==========================================

  const [wishlist, setWishlist] =
    useState([]);

  // Load user's wishlist
  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }

    const savedWishlist =
      localStorage.getItem(
        `wishlist_${user.id}`
      );

    try {
      setWishlist(
        savedWishlist
          ? JSON.parse(savedWishlist)
          : []
      );
    } catch (error) {
      console.error(
        "Error loading wishlist:",
        error
      );

      setWishlist([]);
    }
  }, [user]);

  // ==========================================
  // TOGGLE WISHLIST
  // ==========================================

  function toggleWishlist(product) {
    if (!user) {
      alert(
        "Please login to use wishlist."
      );
      return;
    }

    const alreadyLiked =
      wishlist.some(
        (item) =>
          item.id === product.id
      );

    let updatedWishlist;

    if (alreadyLiked) {
      updatedWishlist =
        wishlist.filter(
          (item) =>
            item.id !== product.id
        );
    } else {
      updatedWishlist = [
        ...wishlist,
        product,
      ];
    }

    setWishlist(updatedWishlist);

    localStorage.setItem(
      `wishlist_${user.id}`,
      JSON.stringify(updatedWishlist)
    );
  }

  // ==========================================
  // PROVIDER
  // ==========================================

  return (
    <StoreContext.Provider
      value={{
        // Products
        products,
        setProducts,

        // Cart
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        totalItems,

        // Wishlist
        wishlist,
        toggleWishlist,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

// ==========================================
// CUSTOM HOOK
// ==========================================

export function useStore() {
  return useContext(StoreContext);
}