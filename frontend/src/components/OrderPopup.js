import { useState } from "react"
import "./OrderPopup.css"
import emailjs from "emailjs-com"
import { useCart } from "../contexts/CartContext"

const calculateItemBasePrice = (item) => {
  const quantity = Number.parseFloat(item.quantity) || 0

  if (quantity >= 0.5 && quantity < 0.9) {
    return item.price * quantity + 0.5
  }

  if (quantity >= 0.9) {
    return item.price * quantity
  }

  return 0
}

const OrderPopup = ({ product, cartItems = null, onClose }) => {
  const { clearCart } = useCart()
  const isCartOrder = Array.isArray(cartItems)
  const checkoutItems = isCartOrder
    ? cartItems
    : product
      ? [{ id: product._id, name: product.name, price: product.price || 0, quantity: "" }]
      : []

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    city: "",
    street: "",
    phone: "",
    email: "",
    quantity: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "phone") {
      const digitsOnly = value.replace("+383", "").replace(/\D/g, "")
      setFormData((prev) => ({ ...prev, phone: digitsOnly }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const { name, surname, street, phone, quantity } = formData
    const quantityNum = Number.parseFloat(quantity)

    if (!/^[A-Za-z\s]{3,}$/.test(name)) {
      setErrorMsg("Emri duhet te permbaje vetem shkronja dhe te kete te pakten 3 karaktere.")
      return false
    }

    if (!/^[A-Za-z\s]{4,}$/.test(surname)) {
      setErrorMsg("Mbiemri duhet te permbaje vetem shkronja dhe te kete te pakten 4 karaktere.")
      return false
    }

    if (!/^[A-Za-z\s\d]{4,}$/.test(street)) {
      setErrorMsg("Rruga duhet te kete te pakten 4 karaktere dhe mund te permbaje numra.")
      return false
    }

    if (isCartOrder && checkoutItems.length === 0) {
      setErrorMsg("Karta eshte bosh.")
      return false
    }

    if (!isCartOrder && (Number.isNaN(quantityNum) || quantityNum < 0.5)) {
      setErrorMsg("Sasia minimale eshte 0.5 kg.")
      return false
    }

    if (!phone || !/^[04]/.test(phone)) {
      setErrorMsg("Numri i telefonit duhet te filloje me 0 ose 4.")
      return false
    }

    if (phone.startsWith("0") && phone.length !== 9) {
      setErrorMsg("Numri i telefonit qe fillon me 0 duhet te permbaje 9 shifra pas prefix-it +383.")
      return false
    }

    if (phone.startsWith("4") && phone.length !== 8) {
      setErrorMsg("Numri i telefonit qe fillon me 4 duhet te permbaje 8 shifra pas prefix-it +383.")
      return false
    }

    setErrorMsg("")
    return true
  }

  const singleProductItem = checkoutItems[0]
  const singleQuantity = Number.parseFloat(formData.quantity) || 0
  const pricedItems = isCartOrder
    ? checkoutItems
    : singleProductItem
      ? [{ ...singleProductItem, quantity: formData.quantity }]
      : []
  const basePrice = pricedItems.reduce((sum, item) => sum + calculateItemBasePrice(item), 0)
  const shippingCost = basePrice >= 30 || basePrice === 0 ? 0 : 2
  const totalPrice = basePrice > 0 ? basePrice + shippingCost : 0

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    const productLines = pricedItems.map((item) => `${item.name} - ${item.quantity}kg`)

    const templateParams = {
      name: formData.name,
      surname: formData.surname,
      city: formData.city,
      street: formData.street,
      phone: `+383${formData.phone}`,
      email: formData.email,
      quantity: isCartOrder ? productLines.join(", ") : formData.quantity,
      product_name: isCartOrder ? checkoutItems.map((item) => item.name).join(", ") : product.name,
      products: productLines.join("\n"),
      total_price: totalPrice.toFixed(2),
    }

    emailjs
      .send("service_e59cmkw", "template_983i76o", templateParams, "Ce9DUJpvpK1vhqbJY")
      .then(() => {
        setIsSubmitting(false)
        if (isCartOrder) {
          clearCart()
        }
        setIsSuccess(true)
      })
      .catch(() => {
        setIsSubmitting(false)
        setErrorMsg("Gabim gjate dergimit te porosise. Ju lutem provoni perseri.")
      })
  }

  return (
    <div className="popup-backdrop">
      <div className={isSuccess ? "popup-form1" : "popup-form"}>
        {!isSuccess ? (
          <>
            <h2>{isCartOrder ? "Karta juaj" : `Porosit ${product.name}`}</h2>

            {errorMsg && (
              <div style={{ color: "red", marginBottom: "1rem", fontWeight: "600", textAlign: "center" }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {isCartOrder && (
                <div className="cart-order-list">
                  {checkoutItems.length > 0 ? (
                    checkoutItems.map((item) => (
                      <div className="cart-order-item" key={item.id}>
                        <span>{item.name}</span>
                        <strong>{item.quantity} kg</strong>
                      </div>
                    ))
                  ) : (
                    <p>Karta eshte bosh.</p>
                  )}
                </div>
              )}

              <input name="name" placeholder="Emri" onChange={handleChange} required disabled={isSubmitting} />
              <input name="surname" placeholder="Mbiemri" onChange={handleChange} required disabled={isSubmitting} />
              <input name="city" placeholder="Qyteti" onChange={handleChange} required disabled={isSubmitting} />
              <input name="street" placeholder="Rruga(Nr-opsional)" onChange={handleChange} required disabled={isSubmitting} />
              <input
                type="text"
                name="phone"
                value={formData.phone ? `+383 ${formData.phone}` : ""}
                placeholder="Numri i telefonit"
                onChange={handleChange}
                onKeyDown={(e) => {
                  const caretPos = e.target.selectionStart
                  if (caretPos <= 4 && (e.key === "Backspace" || e.key === "Delete")) {
                    e.preventDefault()
                  }
                }}
                onClick={(e) => {
                  if (e.target.selectionStart < 4) {
                    e.target.setSelectionRange(4, 4)
                  }
                }}
                onFocus={(e) => {
                  if (e.target.selectionStart < 4) {
                    e.target.setSelectionRange(4, 4)
                  }
                }}
                required
                disabled={isSubmitting}
              />
              <input
                type="email"
                name="email"
                placeholder="Email (opsionale)"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
              />

              {!isCartOrder && (
                <>
                  <label>
                    Sasia (kg): <span className="quantity-note">* Minimumi i lejuar eshte 0.5 kg</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="0.5"
                    step="any"
                    placeholder="kg"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </>
              )}

              <div className="total-price">
                <p>
                  Cmimi Total: <strong>EUR {totalPrice.toFixed(2)}</strong>
                </p>
                {!isCartOrder && singleQuantity >= 0.5 && singleQuantity < 0.9 && (
                  <p className="price-note">* +0.50 EUR per sasi me pak se 0.9kg *</p>
                )}
                {totalPrice > 0 && (
                  <p className="price-note">
                    <strong>SHPENZIMET E POSTES EUR {shippingCost.toFixed(2)}</strong>
                  </p>
                )}
              </div>

              <div className="popup-buttons">
                <button type="submit" disabled={isSubmitting || (isCartOrder && checkoutItems.length === 0)}>
                  {isSubmitting ? "Dergim..." : "Dergo"}
                </button>
                <button type="button" onClick={onClose} disabled={isSubmitting}>
                  Anulo
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="success-message">
            <h3 style={{ marginBottom: 0 }}>Porosia juaj u dergua me sukses! {formData.name}</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              style={{ margin: "10px auto 8px", display: "block" }}
            >
              <circle cx="12" cy="12" r="12" fill="green" />
              <path
                d="M6 12.5l4 4 8-8"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <p>Pagesa behet Cash, Faleminderit per blerjen Tuaj.</p>
            <button onClick={onClose}>Mbyll</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderPopup
