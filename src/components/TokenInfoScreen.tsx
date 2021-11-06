/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {Keyboard, Text, TouchableWithoutFeedback, View} from 'react-native';
import {NavigationRoute, NavigationScreenProp} from 'react-navigation';
import * as Constants from '../constants';
import * as Styles from '../styles';
import * as Colors from '../colors';
import {
    ChainId,
    Fetcher,
    Route,
    Token,
    WETH,
  } from '@pancakeswap-libs/sdk-v2';
import Icon from 'react-native-vector-icons/Ionicons';
import {Header, Divider, Input, Button} from 'react-native-elements';
import BackgroundService from 'react-native-background-actions';
import { ethers } from 'ethers';
import ReactNativeAN from 'react-native-alarm-notification';


export class TokenInfoScreen extends Component<
  {navigation: NavigationScreenProp<NavigationRoute>},
  {validPriceAlertValueEntered: boolean}
> {
  private token: any;
  private alertTargetValue: number = Number.POSITIVE_INFINITY;

  constructor(props: any) {
    super(props);
    this.token = this.props.navigation.getParam('token');
    this.state = {validPriceAlertValueEntered: false};

    this.createAlert = this.createAlert.bind(this);
    this.startBackgroundService = this.startBackgroundService.bind(this);
  }

  private validatePriceAlertValue(value: string) {
    const parsedValue = Number(value);
    if (!isNaN(parsedValue) && parsedValue > 0) {
        this.alertTargetValue = parsedValue;
        this.setState({validPriceAlertValueEntered: true});
    } else {
        this.alertTargetValue = Number.POSITIVE_INFINITY;
        this.setState({validPriceAlertValueEntered: false});
    }
  }

  private async createAlert() {
    await this.startBackgroundService(this.token, this.alertTargetValue);
    this.alertTargetValue = Number.POSITIVE_INFINITY;
    this.setState({validPriceAlertValueEntered: false});
  }

  async startBackgroundService(element: any, targetPrice: number) {
    const provider = new ethers.providers.JsonRpcProvider(
        Constants.BSC_RPC_ENDPOINT,
        {chainId: ChainId.MAINNET, name: ''}
    );

    const testTask = async (taskDataArguments: any) => {
      const {token} = taskDataArguments;
      const {bUsd} = taskDataArguments;
      const {alertPrice} = taskDataArguments;
      while (BackgroundService.isRunning()) {
        const bnbPair = await Fetcher.fetchPairData(
            bUsd,
            WETH[ChainId.MAINNET],
            provider
          );
        const bnbRoute = new Route([bnbPair], WETH[ChainId.MAINNET]);
        const bnbPrice = bnbRoute.midPrice;

        const pair = await Fetcher.fetchPairData(
          token,
          WETH[ChainId.MAINNET],
          provider
        );
        const route = new Route([pair], WETH[ChainId.MAINNET]);
        const price = ((Number(bnbPrice.toSignificant(6)) * Number(element.value)) / Number(route.midPrice.toSignificant(6)));
        console.log(`Price: ${price.toFixed(2)}`);
        if (price >= alertPrice) {
            const alarmNotifData = {
                title: 'Price Alert',
                message: `Your "${element.currency.name}" holdings are now worth ${price.toFixed(2)}.`,
                channel: 'salieri-price-alerts',
                small_icon: 'ic_launcher',
                has_button: true,
                auto_cancel: true,
                bypass_dnd: true,
                volume: 1.0,
            };
            ReactNativeAN.sendNotification(alarmNotifData);
            BackgroundService.stop();
        }

        await new Promise(r => setTimeout(r, 1000));
      }
    };

    const targetToken = new Token(ChainId.MAINNET, ethers.utils.getAddress(element.currency.address), element.currency.decimals);
    const bUsd = new Token(ChainId.MAINNET, Constants.BUSD_ADDRESS, Constants.BUSD_DECIMALS);

    const options = {
      taskName: 'priceAlertTask',
      taskTitle: 'Price Alert Task',
      taskDesc: 'One or more price alert tasks are currently active. Tap to kill.',
      taskIcon: {
          name: 'ic_launcher',
          type: 'mipmap',
      },
      color: '#ff00ff',
      linkingURI: Constants.DISABLE_PRICE_ALERT_TASK_URL,
      parameters: {
          token: targetToken,
          bUsd: bUsd,
          currency: element,
          alertPrice: targetPrice,
      },
    };

    await BackgroundService.start(testTask, options);
  }

  render() {
    return (
    <>
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {
    <View style={Styles.STYLE_SHEET.DASHBOARD_ROOT_VIEW}>
        <Header
            placement="center"
            leftComponent={<Icon onPress={() => this.props.navigation.goBack()} size={Styles.DASHBOARD_REFRESH_ICON_SIZE} color={Colors.WHITE} name="arrow-back-outline" />}
            centerComponent={<Text style={Styles.STYLE_SHEET.DASHBOARD_HEADER_CENTER}>{this.token.currency.name}</Text>}
        />
        <Text style={{padding: 15, fontSize: 16, lineHeight: 25}}>
            Name:{'\t\t\t'}{this.token.currency.name}{'\n'}
            Ticker:{'\t\t\t'}{this.token.currency.symbol}{'\n'}
            Balance:{'\t\t'}{this.token.value}{'\n'}
            Value:{'\t\t\t\t'}${this.token.price}{'\n'}
        </Text>
        <Divider/>
        <Text style={{alignSelf: 'center', fontSize: 16, padding: 30}}><Icon size={Styles.DASHBOARD_REFRESH_ICON_SIZE} color={Colors.BLACK} name="alarm-outline" />Price Alert</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <Input
            containerStyle={
              Styles.STYLE_SHEET.TOKEN_INFO_PRICE_ALERT_INPUT
            }
            inputStyle={{color: Colors.GRAY}}
            inputContainerStyle={
              Styles.STYLE_SHEET.INITIAL_CONFIGURATION_INPUT_CONTAINER
            }
            placeholder="Enter Target Value"
            autoCapitalize="none"
            placeholderTextColor={Colors.GRAY}
            keyboardType="decimal-pad"
            onSubmitEditing={event =>
                this.validatePriceAlertValue(event.nativeEvent.text)
              }
            onEndEditing={event =>
                this.validatePriceAlertValue(event.nativeEvent.text)
              }
        />
        <Button
            title="Create"
            buttonStyle={
              Styles.STYLE_SHEET.INITIAL_CONFIGURATION_BUTTON_ACTIVE
            }
            disabledStyle={
              Styles.STYLE_SHEET.INITIAL_CONFIGURATION_BUTTON_DISABLED
            }
            containerStyle={
              Styles.STYLE_SHEET.INITIAL_CONFIGURATION_BUTTON_CONTAINER
            }
            disabled={!this.state.validPriceAlertValueEntered}
            onPress={this.createAlert}
        />
        </View>
    </View>
    }
    </TouchableWithoutFeedback>
    </>
    );
  }
}
