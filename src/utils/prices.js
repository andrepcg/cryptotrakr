import { filter, mean } from 'lodash';

export function filterOhlcData(apiData) {
  const newObj = {};
  Object.keys(apiData).forEach((key) => {
    const value = apiData[key];
    newObj[key] = filter(value, d => d[1] !== 0);
  });
  return newObj;
}

export function candleMean(candle) { // [timestamp, open, high, low, close, volume]
  if (!candle || candle.length === 0) return -1;
  return mean(candle.slice(1, candle.length - 1));
}
