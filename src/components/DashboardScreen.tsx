/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {Text, View, Linking} from 'react-native';
import {NavigationRoute, NavigationScreenProp} from 'react-navigation';
import {WebView} from 'react-native-webview';
import * as Constants from '../constants';
import * as Styles from '../styles';
import * as Colors from '../colors';
import {Header, ListItem} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import {
  ChainId,
  Fetcher,
  Route,
  Token,
  WETH,
} from '@pancakeswap-libs/sdk-v2';
import {ethers, providers} from 'ethers';
import Icon from 'react-native-vector-icons/Ionicons';
import BnbLogo from '../../resources/bnb-logo.svg';
import { UserStorageService } from '../services/UserStorageService';
//import ReactNativeAN from 'react-native-alarm-notification';
import BackgroundService from 'react-native-background-actions';


export class DashboardScreen extends Component<
  {navigation: NavigationScreenProp<NavigationRoute>},
  {heldCurrencies: any[], updatedHeldCurrencies: boolean, updatingIndex: number}
> {
  private webView: any;
  private provider: providers.JsonRpcProvider;

  constructor(props: any) {
    super(props);
    this.state = {heldCurrencies: [], updatedHeldCurrencies: false, updatingIndex: -1};

    this.onWebViewMessage = this.onWebViewMessage.bind(this);
    this.refreshTokenData = this.refreshTokenData.bind(this);
    this.addTokenToBlacklistAndRefresh = this.addTokenToBlacklistAndRefresh.bind(this);
    this.stopBackgroundTask = this.stopBackgroundTask.bind(this);

    // Ethers initialization
    this.provider = new ethers.providers.JsonRpcProvider(
      Constants.BSC_RPC_ENDPOINT,
      {chainId: ChainId.MAINNET, name: ''}
    );

    Linking.addEventListener('url', () => this.stopBackgroundTask());
    Linking.getInitialURL().then((url) => {
      if (url === Constants.DISABLE_PRICE_ALERT_TASK_URL) {
        this.stopBackgroundTask();
      }
    });
  }

  refreshTokenData() {
    this.webView.injectJavaScript('getBoggedTokens()');
    this.setState({updatingIndex: -2});
  }

  stopBackgroundTask() {
    BackgroundService.stop();
  }

  onWebViewMessage(event: any) {
    const blacklistedTokens = UserStorageService.getBscTokenBlacklist();
    const filteredBalances = JSON.parse(event.nativeEvent.data).data.ethereum.address[0].balances.filter((element: any) => element.value > 0 && !blacklistedTokens.includes(element.currency.address));
    this.setState({
      heldCurrencies: filteredBalances,
      updatedHeldCurrencies: true,
      updatingIndex: -1,
    });
  }

  async componentDidUpdate() {
    if (this.state.updatedHeldCurrencies) {
      const bUsd = new Token(ChainId.MAINNET, Constants.BUSD_ADDRESS, Constants.BUSD_DECIMALS);
      const pair = await Fetcher.fetchPairData(
        bUsd,
        WETH[ChainId.MAINNET],
        this.provider
      );
      const route = new Route([pair], WETH[ChainId.MAINNET]);
      const bnbPrice = route.midPrice;

      let currencies = this.state.heldCurrencies;
      const bnbIndex = currencies.findIndex(element => element.currency.address === Constants.BNB_ADDRESS);
      currencies[bnbIndex].unitPrice = Number(bnbPrice.toSignificant(6)).toFixed(0);
      currencies[bnbIndex].price = (Number(bnbPrice.toSignificant(6)) * Number(this.state.heldCurrencies.find(element => element.currency.address === Constants.BNB_ADDRESS).value)).toFixed(2);
      let sortedCurrencies = [];
      for (let i = 0; i < this.state.heldCurrencies.length; i++) {
        try {
          const targetToken = new Token(ChainId.MAINNET, ethers.utils.getAddress(this.state.heldCurrencies[i].currency.address), this.state.heldCurrencies[i].currency.decimals);
          const pair = await Fetcher.fetchPairData(
            targetToken,
            WETH[ChainId.MAINNET],
            this.provider
          );
          const route = new Route([pair], WETH[ChainId.MAINNET]);
          currencies[i].price = ((Number(bnbPrice.toSignificant(6)) * Number(this.state.heldCurrencies[i].value)) / Number(route.midPrice.toSignificant(6))).toFixed(2);
          if (!isFinite(currencies[i].price)) {
            currencies[i].price = undefined;
          }
          sortedCurrencies = currencies;
          sortedCurrencies.sort((a, b) => Number(!isNaN(b.price) ? b.price : '0') - Number(!isNaN(a.price) ? a.price : '0'));
          this.setState({heldCurrencies: sortedCurrencies, updatingIndex: i, updatedHeldCurrencies: false});
        } catch (error) {}
      }
      this.setState({updatingIndex: -1});
    }
  }

  addTokenToBlacklistAndRefresh(address: string) {
    UserStorageService.addBscTokenToBlacklist(address);
    const blacklistedTokens = UserStorageService.getBscTokenBlacklist();
    let heldCurrencies = this.state.heldCurrencies;
    const filteredBalances = heldCurrencies.filter((element: any) => element.value > 0 && !blacklistedTokens.includes(element.currency.address));
    this.setState({heldCurrencies: filteredBalances});
  }

  render() {
    const bnbCurrency = this.state.heldCurrencies.find(element => element.currency.address === Constants.BNB_ADDRESS);
    let tokenList = [];
    for (let i = 0; i < this.state.heldCurrencies.length; i++) {
      tokenList.push(
        <ListItem key={i} bottomDivider onPress={() => this.props.navigation.navigate(Constants.SCREEN_TOKEN_INFO, {token: this.state.heldCurrencies[i]})}>
          <ListItem.Content>
            <ListItem.Title>
              {this.state.heldCurrencies[i].currency.name}
            </ListItem.Title>
            <ListItem.Subtitle>
              {`$${this.state.heldCurrencies[i].price !== undefined ? this.state.heldCurrencies[i].price : Constants.PRICE_LOADING_PLACEHOLDER}`}
            </ListItem.Subtitle>
            <Icon style={{position: 'absolute', right: 10}} onPress={() => this.addTokenToBlacklistAndRefresh(this.state.heldCurrencies[i].currency.address)} size={30} color={Colors.RED} name="close-outline" />
          </ListItem.Content>
        </ListItem>,
      );
    }

    let totalBalance = 0;

    for (let i = 0; i < this.state.heldCurrencies.length; i++) {
      if (this.state.heldCurrencies[i].price !== undefined) {
        totalBalance += Number(this.state.heldCurrencies[i].price);
      }
    }

    return (
      <>
      <Header
        placement="center"
        leftComponent={<Text style={Styles.STYLE_SHEET.DASHBOARD_HEADER_LEFT}>{`$${bnbCurrency !== undefined && bnbCurrency.unitPrice !== undefined ? bnbCurrency.unitPrice : Constants.PRICE_LOADING_PLACEHOLDER}`}</Text>}
        centerComponent={<Text style={Styles.STYLE_SHEET.DASHBOARD_HEADER_CENTER}>${totalBalance.toFixed(2)}</Text>}
        rightComponent={<Icon onPress={this.refreshTokenData} size={Styles.DASHBOARD_REFRESH_ICON_SIZE} color={Colors.WHITE} name="refresh-outline" />}
      />
        <BnbLogo height={'5%'} width={'5%'} style={Styles.STYLE_SHEET.DASHBOARD_BNB_LOGO}/>
        <View style={Styles.STYLE_SHEET.DASHBOARD_ROOT_VIEW}>
          {
            (this.state.updatingIndex !== -1 && this.state.updatingIndex !== -2) &&
            <View style={Styles.STYLE_SHEET.DASHBOARD_POPUP_PANEL}>
              <Text style={Styles.STYLE_SHEET.DASHBOARD_POPUP_PANEL_TEXT}>Updating balances {this.state.updatingIndex}/{this.state.heldCurrencies.length}</Text>
            </View>
          }
          {
            this.state.updatingIndex === -2 &&
            <View style={Styles.STYLE_SHEET.DASHBOARD_POPUP_PANEL}>
              <Text style={Styles.STYLE_SHEET.DASHBOARD_POPUP_PANEL_TEXT}>Fetching tokens</Text>
            </View>
          }
          <ScrollView>{tokenList}</ScrollView>
          <WebView
            androidHardwareAccelerationDisabled={true}
            onLoadEnd={this.refreshTokenData}
            containerStyle={Styles.STYLE_SHEET.DASHBOARD_HIDDEN_WEBVIEW}
            ref={ref => (this.webView = ref)}
            onMessage={(event: any) => this.onWebViewMessage(event)}
            injectedJavaScript={Constants.BOGGED_TOKENS_REQUEST_JAVASCRIPT(
              UserStorageService.getBscAddress(),
            )}
            source={{
              uri: 'https://charts.bogged.finance/',
            }}
            />
        </View>
      </>
    );
  }
}
