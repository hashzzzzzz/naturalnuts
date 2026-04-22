export const formatPrice = (value) => `EUR ${Number(value || 0).toFixed(2)}`;

export const calculateItemBasePrice = (item) => {
  const quantity = Number.parseFloat(item.quantity) || 0;
  const price = Number(item.price) || 0;

  if (quantity >= 0.5 && quantity < 0.9) {
    return price * quantity + 0.5;
  }

  if (quantity >= 0.9) {
    return price * quantity;
  }

  return 0;
};

export const calculateCartPricing = (items) => {
  const subtotal = items.reduce((sum, item) => sum + calculateItemBasePrice(item), 0);
  const shipping = subtotal >= 30 || subtotal === 0 ? 0 : 2;
  const total = subtotal > 0 ? subtotal + shipping : 0;

  return {
    subtotal,
    shipping,
    total,
    hasFreeShipping: subtotal >= 30,
  };
};
