"use client"

import { useState, useEffect } from "react"
import "./OrderPopup.css"
import emailjs from "emailjs-com"
import {CheckMark} from 'react-checkmark';

const OrderPopup = ({ product, onClose }) => {
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
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const validateForm = () => {
    const { name, surname, street, phone, quantity } = formData
    const quantityNum = Number.parseFloat(quantity)

    if (!/^[A-Za-zÇçËë\s]{3,}$/.test(name)) {
      setErrorMsg("Emri duhet të përmbajë vetëm shkronja dhe të ketë të paktën 3 karaktere.")
      return false
    }
    if (!/^[A-Za-zÇçËë\s]{4,}$/.test(surname)) {
      setErrorMsg("Mbiemri duhet të përmbajë vetëm shkronja dhe të ketë të paktën 4 karaktere.")
      return false
    }
if (!/^[A-Za-zÇçËë\s\d]{4,}$/.test(street)) {
  setErrorMsg("Rruga duhet të ketë të paktën 4 karaktere dhe mund të përmbajë numra opsionalisht.")
  return false
}

    if (isNaN(quantityNum) || quantityNum < 0.5) {
      setErrorMsg("Sasia minimale është 0.5 kg.")
      return false
    }
    if (!phone || !/^[04]/.test(phone)) {
      setErrorMsg("Numri i telefonit duhet të fillojë me 0 ose 4.")
      return false
    }
    if (phone.startsWith("0") && phone.length !== 9) {
      setErrorMsg("Numri i telefonit që fillon me 0 duhet të përmbajë 9 shifra pas prefix-it +383.")
      return false
    }
    if (phone.startsWith("4") && phone.length !== 8) {
      setErrorMsg("Numri i telefonit që fillon me 4 duhet të përmbajë 8 shifra pas prefix-it +383.")
      return false
    }

    setErrorMsg("")
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    const quantityNum = Number.parseFloat(formData.quantity)
    let basePrice = 0
    let shippingCost = 2

    if (quantityNum >= 0.5 && quantityNum < 0.9) {
      const gramPrice = product.price / 1000
      basePrice = gramPrice * quantityNum * 1000 + 0.5
    } else if (quantityNum >= 0.9) {
      basePrice = product.price * quantityNum
    }

    if (basePrice >= 30.0) {
      shippingCost = 0
    }

    const totalPrice = quantityNum >= 0.5 ? basePrice + shippingCost : 0

    const templateParams = {
      name: formData.name,
      surname: formData.surname,
      city: formData.city,
      street: formData.street,
      phone: `+383${formData.phone}`,
      email: formData.email,
      quantity: formData.quantity,
      product_name: product.name,
      total_price: totalPrice.toFixed(2),
    }

    emailjs
      .send("service_e59cmkw", "template_983i76o", templateParams, "Ce9DUJpvpK1vhqbJY")
      .then(() => {
        setIsSubmitting(false)
        setIsSuccess(true)
      })
      .catch(() => {
        setIsSubmitting(false)
        setErrorMsg("Gabim gjatë dërgimit të porosisë. Ju lutem provoni përsëri.")
      })
  }

  const quantityNum = Number.parseFloat(formData.quantity) || 0
  let basePrice = 0
  let shippingCost = 2

  if (quantityNum >= 0.5 && quantityNum < 0.9) {
    const gramPrice = product.price / 1000
    basePrice = gramPrice * quantityNum * 1000 + 0.5
  } else if (quantityNum >= 0.9) {
    basePrice = product.price * quantityNum
  }

  if (basePrice >= 30.0) {
    shippingCost = 0
  }

  const totalPrice = quantityNum >= 0.5 ? basePrice + shippingCost : 0

  return (
    <div className="popup-backdrop">
      <div className={isSuccess ? "popup-form1" : "popup-form"}>
        {!isSuccess ? (
          <>
            <h2>Porosit {product.name}</h2>

            {errorMsg && (
              <div style={{ color: "red", marginBottom: "1rem", fontWeight: "600", textAlign: "center" }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Emri"
                onChange={handleChange}
                pattern="[A-Za-zÇçËë\s]{3,}"
                title="Emri duhet të përmbajë vetëm shkronja dhe të ketë të paktën 3 karaktere."
                required
                disabled={isSubmitting}
              />
              <input
                name="surname"
                placeholder="Mbiemri"
                onChange={handleChange}
                pattern="[A-Za-zÇçËë\s]{4,}"
                title="Mbiemri duhet të përmbajë vetëm shkronja dhe të ketë të paktën 4 karaktere."
                required
                disabled={isSubmitting}
              />
              <input name="city" placeholder="Qyteti" onChange={handleChange} required disabled={isSubmitting} />
              <input
                name="street"
                placeholder="Rruga(Nr-opsional)"
                onChange={handleChange}
                pattern="[A-Za-zÇçËë\s\d]{4,}"
                title="Rruga duhet të përmbajë shkronja opsionale(numra) dhe të ketë të paktën 4 karaktere"
                required
                disabled={isSubmitting}
              />
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

              <label>
                Sasia (kg): <span className="quantity-note">* Minimumi i lejuar është 0.5 kg</span>
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

              <div className="total-price">
                <p>
                  Çmimi Total: <strong>€{totalPrice.toFixed(2)}</strong>
                </p>
                {quantityNum >= 0.5 && quantityNum < 0.9 && (
                  <p className="price-note">* +0.50€ për sasi më pak se 0.9kg *</p>
                )}
                {quantityNum >= 0.5 && (
                  <p className="price-note">
                    <strong>SHPENZIMET E POSTES €{shippingCost.toFixed(2)}</strong>
                  </p>
                )}
              </div>

              <div className="popup-buttons">
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Dërgo... ⏳" : "Dërgo"}
                </button>
                <button type="button" onClick={onClose} disabled={isSubmitting}>
                  Anulo
                </button>
              </div>
            </form>
          </>
        ) : (
         <div className="popup-overlay">
  <div className="popup-form1">
    <div className="success-message">
<h3 style={{ marginBottom: 0 }}>
  Porosia juaj u dërgua me sukses! {formData.name}
</h3>
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


      <p>Pagesa behet Cash, Faleminderit për blerjen Tuaj.</p>
      <button onClick={onClose}>Mbyll</button>
    </div>
  </div>
</div>

        )}
      </div>
    </div>
  )
}

export default OrderPopup
