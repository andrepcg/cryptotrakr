export const REMOVE_PURCHASE = 'REMOVE_PURCHASE';
export const PURCHASE_PRODUCT = 'PURCHASE_PRODUCT';
export const OPEN_PREMIUM_SCREEN = 'OPEN_PREMIUM_SCREEN';

export const purchaseProduct = id => ({ type: PURCHASE_PRODUCT, payload: id });
export const removePurchase = id => ({ type: REMOVE_PURCHASE, payload: id });

export const openPremiumScreen = () => ({ type: OPEN_PREMIUM_SCREEN });
