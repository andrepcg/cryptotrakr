/* eslint-disable */
import { Alert } from 'react-native';
import numeral from 'numeral';
import { openPremiumScreen } from '../actions/purchases';

const uuidFormat = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

export function uuid() {
  return uuidFormat.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
}

export function formatAmount(number) {
  const n = Math.abs(number) < 1e-6 ? 0.00000 : number;
  if (Math.abs(number) < 1) return numeral(n).format('0,0.00000');
  return numeral(n).format('0,0.00');
}

export const showPremiumAlert = (dispatch) => {
  Alert.alert(
    'Limit reached!',
    'You\'ve reached the limit entries for a free user. Buy premium to unlock more slots.',
    [
      { text: 'Later' },
      { text: 'Buy Premium', onPress: () => dispatch(openPremiumScreen())},
    ],
  );
}