import Realm from 'realm';
import {
  BscAddress,
  BscAddressSchema,
  BscToken,
  BscTokenSchema,
  PriceAlertSchema,
} from '../common';
import * as Constants from '../constants';

export class UserStorageService {
  private static realm: Realm;

  static async loadRealmDatabase() {
    this.realm = await Realm.open({
      path: Constants.REALM_DB_PATH,
      schema: [BscAddressSchema, BscTokenSchema, PriceAlertSchema],
    });
  }

  static setBscAddress(bscAddress: string) {
    this.realm.write(() => {
      this.realm.delete(this.realm.objects('BscAddress'));
      this.realm.create('BscAddress', {address: bscAddress});
    });
  }

  static getBscAddress(): string {
    let addresses = this.realm.objects<BscAddress>('BscAddress');
    if (addresses.length > 0) {
      return this.realm.objects<BscAddress>('BscAddress')[0].address;
    } else {
      return '';
    }
  }

  static addBscTokenToBlacklist(bscTokenContract: string) {
    this.realm.write(() => {
      this.realm.create('BscToken', {contractAddress: bscTokenContract});
    });
  }

  static getBscTokenBlacklist(): string[] {
    let blacklistedTokens = this.realm.objects<BscToken>('BscToken');
    if (blacklistedTokens.length > 0) {
      return blacklistedTokens.map(element => element.contractAddress);
    } else {
      return [];
    }
  }
}
