import React, {Component} from 'react';
import {
  Keyboard,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Button, Input} from 'react-native-elements';
import * as Styles from '../styles';
import * as Colors from '../colors';
import * as Constants from '../constants';
import {NavigationRoute, NavigationScreenProp} from 'react-navigation';
import BnbLogo from '../../resources/bnb-logo-blue.svg';
import {ethers} from 'ethers';
import {UserStorageService} from '../services/UserStorageService';

export class InitialConfigurationScreen extends Component<
  {navigation: NavigationScreenProp<NavigationRoute>},
  {validAddressEntered: boolean}
> {
  private enteredAddress: string = '';

  constructor(props: any) {
    super(props);
    this.state = {validAddressEntered: false};

    this.validateBscAddress = this.validateBscAddress.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  private validateBscAddress(address: string) {
    try {
      let parsedAddress = ethers.utils.getAddress(address);
      this.enteredAddress = parsedAddress;
      UserStorageService.setBscAddress(parsedAddress);
      this.setState({validAddressEntered: true});
    } catch (error) {
      console.log(error);
    }
  }

  private confirm() {
    UserStorageService.setBscAddress(this.enteredAddress);
    this.props.navigation.navigate(Constants.SCREEN_DASHBOARD);
  }

  render() {
    return (
      <>
        <StatusBar backgroundColor={Colors.BLUE} />
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          {
            <View style={Styles.STYLE_SHEET.INITIAL_CONFIGURATION_ROOT_VIEW}>
              <View
                style={Styles.STYLE_SHEET.INITIAL_CONFIGURATION_CONTAINER_VIEW}>
                <Text style={Styles.STYLE_SHEET.INITIAL_CONFIGURATION_TEXT}>
                  I always considered myself to be the very definition of
                  mediocre.
                  {'\n'}
                  However, you were the person I always strove to be, and you...
                  {'\n'}
                  You are the true Amadeus.
                </Text>
                <Input
                  containerStyle={
                    Styles.STYLE_SHEET.INITIAL_CONFIGURATION_INPUT
                  }
                  inputStyle={{color: Colors.GRAY}}
                  inputContainerStyle={
                    Styles.STYLE_SHEET.INITIAL_CONFIGURATION_INPUT_CONTAINER
                  }
                  placeholder="Enter BSC Public Address"
                  autoCapitalize="none"
                  placeholderTextColor={Colors.GRAY}
                  onSubmitEditing={event =>
                    this.validateBscAddress(event.nativeEvent.text)
                  }
                  onEndEditing={event =>
                    this.validateBscAddress(event.nativeEvent.text)
                  }
                />
                <Button
                  onPress={this.confirm}
                  title="Confirm"
                  buttonStyle={
                    Styles.STYLE_SHEET.INITIAL_CONFIGURATION_BUTTON_ACTIVE
                  }
                  disabledStyle={
                    Styles.STYLE_SHEET.INITIAL_CONFIGURATION_BUTTON_DISABLED
                  }
                  containerStyle={
                    Styles.STYLE_SHEET.INITIAL_CONFIGURATION_BUTTON_CONTAINER
                  }
                  disabled={!this.state.validAddressEntered}
                />
              </View>
              <BnbLogo
                height={Styles.INITIAL_CONFIGURATION_LOGO_SIZE}
                width={Styles.INITIAL_CONFIGURATION_LOGO_SIZE}
                style={Styles.STYLE_SHEET.INITIAL_CONFIGURATION_LOGO}
              />
            </View>
          }
        </TouchableWithoutFeedback>
      </>
    );
  }
}
