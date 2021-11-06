export interface BscAddress {
  // User provided BSC Public Address
  address: string;
}

export interface BscToken {
  // Contract Address of the BSC token
  contractAddress: string;
}

export interface PriceAlert {}

export const BscAddressSchema = {
  name: 'BscAddress',
  properties: {
    address: 'string',
  },
};

export const BscTokenSchema = {
  name: 'BscToken',
  properties: {
    contractAddress: 'string',
  },
};

export const PriceAlertSchema = {
  name: 'PriceAlert',
  properties: {},
};
