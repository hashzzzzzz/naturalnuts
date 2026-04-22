import { createContext, useContext, useEffect, useMemo, useReducer } from "react"

const CartContext = createContext()
const CART_STORAGE_KEY = "naturalNutsCart"

const normalizeCartItem = (product, quantityKg) => ({
  id: product._id || product.id,
  _id: product._id || product.id,
  name: product.name || product.title,
  title: product.title || product.name,
  imageUrl: product.imageUrl || product.image,
  image: product.image || product.imageUrl,
  price: Number(product.price) || 0,
  quantity: Number(quantityKg),
})

function calculateTotals(items) {
  const total = items.reduce((sum, item) => sum + item.price * Number(item.quantity), 0)
  return {
    items,
    total,
    itemCount: items.length,
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const nextItem = normalizeCartItem(action.payload.product, action.payload.quantityKg)
      const existingItem = state.items.find((item) => item.id === nextItem.id)

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === nextItem.id
            ? { ...item, quantity: Number(item.quantity) + Number(nextItem.quantity) }
            : item,
        )
        return calculateTotals(updatedItems)
      }

      return calculateTotals([...state.items, nextItem])
    }

    case "REMOVE_ITEM":
      return calculateTotals(state.items.filter((item) => item.id !== action.payload.productId))

    case "UPDATE_QUANTITY": {
      const quantity = Number(action.payload.quantityKg)

      if (!Number.isFinite(quantity) || quantity < 0.5) {
        return state
      }

      const updatedItems = state.items.map((item) =>
        item.id === action.payload.productId ? { ...item, quantity } : item,
      )
      return calculateTotals(updatedItems)
    }

    case "CLEAR_CART":
      return calculateTotals([])

    case "LOAD_CART":
      return calculateTotals(Array.isArray(action.payload) ? action.payload : [])

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, calculateTotals([]))

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (!savedCart) return

    try {
      dispatch({ type: "LOAD_CART", payload: JSON.parse(savedCart) })
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items))
  }, [state.items])

  const value = useMemo(() => ({
    state,
    addToCart: (product, quantityKg) => dispatch({ type: "ADD_ITEM", payload: { product, quantityKg } }),
    removeFromCart: (productId) => dispatch({ type: "REMOVE_ITEM", payload: { productId } }),
    updateCartQuantity: (productId, quantityKg) =>
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantityKg } }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
  }), [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
