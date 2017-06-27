import React, { Component } from 'react';
import { Provider } from 'react-redux';
import CodePush from 'react-native-code-push';

import App from './containers/AppWithNavigationState';
import LoadingScreen from './components/Loading';
import configureStore from './configureStore';
// import App from './App';

// @CodePush
class setup extends Component {

  state = {
    hydrated: false,
    codepushLoaded: __DEV__ ? true : false,
    codepushStatus: null,
  }

  componentDidMount() {
    this.store = configureStore(() => this.setState({ hydrated: true }));

    if (!__DEV__) {
      CodePush.sync({ updateDialog: false, installMode: CodePush.InstallMode.IMMEDIATE },
        this.codePushStatusDidChange
      );
    }
  }

  codePushStatusDidChange = (status) => {
    switch(status) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        this.setState({ codepushStatus: 'Downloading update...' });
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        this.setState({ codepushStatus: 'Installing update...' });
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        this.setState({ codepushStatus: 'Update installed, restarting...' });
        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
      case CodePush.SyncStatus.UP_TO_DATE:
      case CodePush.SyncStatus.UPDATE_IGNORED:
        this.setState({ codepushLoaded: true, codepushStatus: null });
        break;
    }
  }

  render() {
    const { hydrated, codepushLoaded, codepushStatus } = this.state;
    return hydrated && codepushLoaded
      ? <Provider store={this.store}>
        <App />
      </Provider>
      : <LoadingScreen message={codepushStatus}/>;
  }
}

export default __DEV__ ? setup : CodePush(setup);
