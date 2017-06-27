import moment from 'moment';

require('moment-round');

export const ONE_HOUR = 'ONE_HOUR';
export const ONE_DAY = 'ONE_DAY';
export const THREE_DAYS = 'THREE_DAYS';
export const ONE_WEEK = 'ONE_WEEK';
export const ONE_MONTH = 'ONE_MONTH';
export const THREE_MONTHS = 'THREE_MONTHS';
export const SIX_MONTHS = 'SIX_MONTHS';
export const ONE_YEAR = 'ONE_YEAR';

export const strings = {
  [ONE_HOUR]: '1H',
  [ONE_DAY]: '1D',
  [ONE_WEEK]: '1W',
  [ONE_MONTH]: '1M',
  [THREE_MONTHS]: '3M',
  // [SIX_MONTHS]: '6M',
  // [ONE_YEAR]: '1Y',
};

export const timeframePeriod = {
  [ONE_HOUR]: 60,            // 1 minute interval between candles
  [ONE_DAY]: 30 * 60,       // 30 minutes
  [ONE_WEEK]: 4 * 60 * 60,   // 4 hours
  [ONE_MONTH]: 12 * 60 * 60, // 12 hours
  [THREE_MONTHS]: 24 * 60 * 60, // 24 hours
  [SIX_MONTHS]: 2 * 24 * 60 * 60, // 2 days
  [ONE_YEAR]: 15 * 24 * 60 * 60, // 15 days
};

export const timeframeFormat = {
  [ONE_HOUR]: 'HH:mm',
  [ONE_DAY]: 'HH:mm',
  [ONE_WEEK]: 'D MMM',
  [ONE_MONTH]: 'D MMM',
  [THREE_MONTHS]: 'D MMM',
  [SIX_MONTHS]: 'D MMM',
  [ONE_YEAR]: 'D MMM',
};

export function timeframeToMoment(timeframe) {
  switch (timeframe) {
    case ONE_HOUR:
      return moment().ceil(10, 'minute').subtract(1, 'hours');
    case ONE_DAY:
      return moment().ceil(1, 'hour').subtract(1, 'days');
    case THREE_DAYS:
      return moment().endOf('day').subtract(3, 'days');
    case ONE_WEEK:
      return moment().endOf('day').subtract(1, 'weeks');
    case ONE_MONTH:
      return moment().endOf('week').subtract(1, 'months');
    case THREE_MONTHS:
      return moment().endOf('week').subtract(3, 'months');
    case SIX_MONTHS:
      return moment().subtract(6, 'months');
    case ONE_YEAR:
      return moment().subtract(1, 'years');
    default:
      return moment();
  }
}
