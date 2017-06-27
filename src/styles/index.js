import { StyleSheet, Platform } from 'react-native';
// import { setCustomText } from 'react-native-global-props';

const ios = () => Platform.OS === 'ios';

if (ios()) {
  // const customTextProps = { style: { fontFamily: 'montserrat' } };
  // setCustomText(customTextProps);
}

/* eslint-disable no-unused-vars */

/*
--------------------------------------------------------------------------------
Colors
--------------------------------------------------------------------------------
*/

export const SUPER_DARKER_BLUE = '#0b171c';
export const DARKER_BLUE = '#102026';
export const ALMOST_WHITE = '#F5F5F5';
export const GREEN = '#21C293';
export const RED = '#c91c1c';
export const LIGHT_GREY = '#D9DFDF';
export const GREY = '#bbbbbb';
export const YELLOW = '#F8CB43';
export const ORANGE = '#F97C2C';
export const LIGHT_BLUE = '#87B6D8';
export const BLUE = '#4A90E2';
export const DARK_BLUE = '#2F6DB5';
export const TRANSPARENT = 'rgba(0,0,0,0)';
// const WHITE = '#FFFFFF';


export const darkBlue = { color: DARK_BLUE };
export const blue = { color: BLUE };
export const lightGrey = { color: LIGHT_GREY };
export const white = { color: ALMOST_WHITE };
export const yellow = { color: YELLOW };
export const orange = { color: ORANGE };
export const lightBlue = { color: LIGHT_BLUE };
export const green = { color: GREEN };

export const bgGrey = { backgroundColor: LIGHT_GREY };
export const bgWhite = { backgroundColor: ALMOST_WHITE };
export const bgGreen = { backgroundColor: GREEN };
export const bgYellow = { backgroundColor: YELLOW };
export const bgOrange = { backgroundColor: ORANGE };
export const bgLightGrey = { backgroundColor: LIGHT_GREY };
export const bgLightBlue = { backgroundColor: LIGHT_BLUE };
export const bgBlue = { backgroundColor: BLUE };
export const bgDarkBlue = { backgroundColor: DARK_BLUE };
export const bgDarkerBlue = { backgroundColor: DARKER_BLUE };
export const bgTransparent = { backgroundColor: 'transparent' };

export const darken = percentage => `rgba(0, 0, 0, ${percentage})`;
export const lighten = percentage => `rgba(255, 255, 255, ${percentage})`;

/*
--------------------------------------------------------------------------------
Margins
--------------------------------------------------------------------------------
*/

const margin = margin => ({ margin });
const marginV = margin => ({ marginVertical: margin });
const marginH = margin => ({ marginHorizontal: margin });
const marginB = margin => ({ marginBottom: margin });
const marginT = margin => ({ marginTop: margin });
const marginL = margin => ({ marginLeft: margin });
const marginR = margin => ({ marginRight: margin });


/*
--------------------------------------------------------------------------------
Paddings
--------------------------------------------------------------------------------
*/

const padding = padding => ({ padding });
const padV = pad => ({ paddingVertical: pad });
const padH = pad => ({ paddingHorizontal: pad });
const padB = pad => ({ paddingBottom: pad });
const padT = pad => ({ paddingTop: pad });
const padL = pad => ({ paddingLeft: pad });
const padR = pad => ({ paddingRight: pad });

export const darkHeader = {
  headerStyle: { backgroundColor: DARKER_BLUE, paddingLeft: 15, paddingRight: 20 },
  headerTitleStyle: { color: ALMOST_WHITE },
  headerBackTitleStyle: { color: ALMOST_WHITE },
  headerTintColor: ALMOST_WHITE,
};
