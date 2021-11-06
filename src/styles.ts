import {StyleSheet} from 'react-native';
import * as Colors from './colors';

export const INITIAL_CONFIGURATION_LOGO_SIZE = '75%';
export const DASHBOARD_REFRESH_ICON_SIZE = 25;
export const DASHBOARD_BNB_LOGO_SIZE = '5%';

export const STYLE_SHEET = StyleSheet.create({
  /**
   * Initial Configuration
   */
  INITIAL_CONFIGURATION_ROOT_VIEW: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BLUE,
    justifyContent: 'center',
  },
  INITIAL_CONFIGURATION_CONTAINER_VIEW: {
    backgroundColor: Colors.BLUE_DARK,
    alignContent: 'center',
    alignItems: 'center',
  },
  INITIAL_CONFIGURATION_TEXT: {
    fontSize: 15,
    paddingTop: 25,
    paddingHorizontal: 25,
    textAlign: 'left',
    color: Colors.WHITE,
  },
  INITIAL_CONFIGURATION_INPUT: {
    width: 250,
    height: 35,
    backgroundColor: Colors.WHITE_ICE,
    marginTop: 35,
    marginBottom: 15,
  },
  INITIAL_CONFIGURATION_INPUT_CONTAINER: {
    borderBottomWidth: 0,
  },
  INITIAL_CONFIGURATION_BUTTON_CONTAINER: {
    borderRadius: 0,
  },
  INITIAL_CONFIGURATION_BUTTON_ACTIVE: {
    width: 90,
    height: 40,
    backgroundColor: Colors.GREEN,
    borderRadius: 0,
    marginBottom: 15,
  },
  INITIAL_CONFIGURATION_BUTTON_DISABLED: {
    width: 90,
    height: 40,
    backgroundColor: Colors.GRAY,
    borderRadius: 0,
    marginBottom: 15,
  },
  INITIAL_CONFIGURATION_LOGO: {
    position: 'absolute',
    bottom: -255,
    zIndex: -1,
  },
  INITIAL_CONFIGURATION_DUMMY_VIEW: {
    height: '30%',
  },
  /**
   * Dashboard
   */
  DASHBOARD_HEADER_LEFT: {
    color: Colors.WHITE,
    fontSize: 16,
    paddingLeft: 30,
    paddingTop: 3,
  },
  DASHBOARD_HEADER_CENTER: {
    color: Colors.WHITE,
    fontSize: 16,
    paddingTop: 3,
  },
  DASHBOARD_BNB_LOGO: {
    position: 'absolute',
    top: 32,
    left: 12,
  },
  DASHBOARD_ROOT_VIEW: {
    flex: 1,
  },
  DASHBOARD_POPUP_PANEL: {
    height: 24,
    backgroundColor: Colors.GRAY,
  },
  DASHBOARD_POPUP_PANEL_TEXT: {
    fontSize: 15,
    alignSelf: 'center',
    color: Colors.WHITE,
  },
  DASHBOARD_HIDDEN_WEBVIEW: {
    height: 0,
    width: 0,
  },
  /**
   * Token Info
   */
  TOKEN_INFO_PRICE_ALERT_INPUT: {
    width: 250,
    height: 35,
    backgroundColor: Colors.WHITE_ICE,
    marginBottom: 15,
    alignSelf: 'center',
  },
});
