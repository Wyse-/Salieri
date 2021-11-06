/* eslint-disable no-useless-escape */
export const SCREEN_DASHBOARD = 'Dashboard';
export const SCREEN_INITIAL_CONFIGURATION = 'InitialConfiguration';
export const SCREEN_TOKEN_INFO = 'TokenInfo';
export const REACT_NAVIGATION_HEADER_MODE = 'none';
export const BSC_RPC_ENDPOINT = 'https://bsc-dataseed.binance.org/';
export const PCS_ROUTER = '0x10ED43C718714eb63d5aA57B78B54704E256024E';
export const BUSD_ADDRESS = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56';
export const BUSD_DECIMALS = 18;
export const BNB_ADDRESS = '-';
export const PRICE_LOADING_PLACEHOLDER = ' ...';
export const REALM_DB_PATH = 'realm_db';
export const DISABLE_PRICE_ALERT_TASK_URL = 'salieri://DisablePriceAlertTask';

export function BOGGED_TOKENS_REQUEST_JAVASCRIPT(value: string) {
  return `
  window.getBoggedTokens = async function() {
    const boggedApiRequest = await fetch("https://cache.bogged.finance/api/bitquery/wallet/query", {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/json",
      "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="90"',
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site"
    },
    "referrer": "https://charts.bogged.finance/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": \"{\\\"query\\\":\\\"{ethereum(network: bsc) {address(address: {is: \\\\\\\"${value}\\\\\\\"}) {                 address                                 balances {                     currency {                         address                         decimals                         name                         symbol                     }                     value                                     }             }         }     }\\\"}\",
    "method": "POST",
    "mode": "cors",
    "credentials": "omit"
    })
    const boggedApiResult = await boggedApiRequest.text() 
    window.ReactNativeWebView.postMessage(boggedApiResult);
  }
  `;
}
