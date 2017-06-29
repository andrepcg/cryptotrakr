export const REMOVE_PURCHASE = 'REMOVE_PURCHASE';
export const PURCHASE_PRODUCT = 'PURCHASE_PRODUCT';

export const purchaseProduct = id => ({ type: PURCHASE_PRODUCT, payload: id });
export const removePurchase = id => ({ type: REMOVE_PURCHASE, payload: id });
