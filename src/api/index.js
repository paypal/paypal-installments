/* @flow */

import type { ZalgoPromise } from '@krakenjs/zalgo-promise/src';

import { HEADERS } from '../constants';

import { callGraphQL } from './api';

type getInstallmentsOptions = {|
  vaultedToken : string,
  token : string,
  buyerAccessToken : string
|};

type InstallmentValue = {|
  currencyCode : string,
  currencyFormatSymbolISOCurrency : string,
  currencyValue : string
|};

type getInstallmentsInfo = {|
  getInstallmentsForVaultedToken : $ReadOnlyArray<{|
      discount? : {|
          amount : InstallmentValue,
          percentage : string
      |},
      monthlyPayment : InstallmentValue,
      totalCost : InstallmentValue,
      term : string,
      intervalDuration : string
  |}>
|};

export const getInstallments = ({ vaultedToken, token, buyerAccessToken } : getInstallmentsOptions) : ZalgoPromise<getInstallmentsInfo> => {
    return callGraphQL({
        name:  'getInstallmentsForVaultedToken',
        query: `
            query getInstallmentsForVaultedToken(
                $vaultedToken: String!
                $token: String!
            ) {
                getInstallmentsForVaultedToken(
                    vaultedToken: $vaultedToken
                    token: $token
                ) {
                    discount {
                        amount {
                            currencyCode
                            currencyFormatSymbolISOCurrency
                            currencyValue
                        }
                        percentage
                    }
                    monthlyPayment {
                        currencyCode
                        currencyFormatSymbolISOCurrency
                        currencyValue
                    }
                    totalCost {
                        currencyCode
                        currencyFormatSymbolISOCurrency
                        currencyValue
                    }
                    term
                    intervalDuration
                }
            }
        `,
        variables: {
            vaultedToken,
            token
        },
        headers:   {
            [HEADERS.ACCESS_TOKEN]: buyerAccessToken
        }
    });
};
