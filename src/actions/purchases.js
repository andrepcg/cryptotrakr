export const REMOVE_PURCHASE = 'REMOVE_PURCHASE';
export const REMOVE_PURCHASES = 'REMOVE_PURCHASES';
export const PURCHASE_PRODUCT = 'PURCHASE_PRODUCT';
export const PURCHASE_PRODUCTS = 'PURCHASE_PRODUCTS';
export const OPEN_PREMIUM_SCREEN = 'OPEN_PREMIUM_SCREEN';

export const purchaseProduct = id => ({ type: PURCHASE_PRODUCT, payload: id });
export const purchaseProducts = idsArray => ({ type: PURCHASE_PRODUCTS, payload: idsArray });
export const removePurchase = id => ({ type: REMOVE_PURCHASE, payload: id });
export const removePurchases = idsArray => ({ type: REMOVE_PURCHASE, payload: idsArray });

export const openPremiumScreen = () => ({ type: OPEN_PREMIUM_SCREEN });
