import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {SafeAreaView} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {DashboardScreen} from './src/components/DashboardScreen';
import {InitialConfigurationScreen} from './src/components/InitialConfigurationScreen';
import {createAppContainer} from 'react-navigation';
import * as Constants from './src/constants';
import {LogBox} from 'react-native';
import {UserStorageService} from './src/services/UserStorageService';
import {TokenInfoScreen} from './src/components/TokenInfoScreen';

class App extends Component<{}, {navigationReady: boolean}> {
  private AppNavigator: any = null;
  private AppContainer: any = null;

  constructor(props: any) {
    super(props);
    this.state = {navigationReady: false};

    this.initializeNavigator = this.initializeNavigator.bind(this);

    LogBox.ignoreLogs(['Setting a timer']);
  }

  async componentDidMount() {
    await UserStorageService.loadRealmDatabase();
    this.initializeNavigator();
  }

  render() {
    return (
      <>
        <SafeAreaView style={{flex: 1}}>
          {this.state.navigationReady && this.AppContainer ? (
            <this.AppContainer />
          ) : (
            <></>
          )}
        </SafeAreaView>
      </>
    );
  }

  private initializeNavigator() {
    let defaultScreen = Constants.SCREEN_INITIAL_CONFIGURATION;
    if (UserStorageService.getBscAddress() !== '') {
      defaultScreen = Constants.SCREEN_DASHBOARD;
    }

    this.AppNavigator = createStackNavigator(
      {
        Dashboard: DashboardScreen,
        InitialConfiguration: InitialConfigurationScreen,
        TokenInfo: TokenInfoScreen,
      },
      {
        initialRouteName: defaultScreen,
        headerMode: Constants.REACT_NAVIGATION_HEADER_MODE,
      },
    );
    this.AppContainer = createAppContainer(this.AppNavigator);

    this.setState({navigationReady: true});
  }
}

export default App;
