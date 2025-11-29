 const getQuantityInCart = (itemId: string): number => {
    const entry = cart.find((c) => c.itemId === itemId);
    return entry?.quantity ?? 0;
  };