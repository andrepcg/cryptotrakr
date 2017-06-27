import firebase from '../firebase';

const analyticsMiddleware = store => next => (action) => {
  switch (action.type) {
    case 'Navigation/NAVIGATE': {
      firebase.analytics().setCurrentScreen(action.routeName);
      break;
    }

    default:
      break;
  }

  return next(action);
};

export default analyticsMiddleware;
