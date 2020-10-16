/* @flow */

import type { ZalgoPromise } from 'zalgo-promise/src';

import { HEADERS } from '../constants';

import { callGraphQL } from './api';

type getInstallmentsOptions = {|
  vaultedToken? : string,
  country : string,
  token : string,
  buyerAccessToken : string
|};

type InstallmentValue = {|
  currencyCode : string,
  currencyFormatSymbolISOCurrency : string,
  currencyValue : string
|};

type getInstallmentsInfo = {|
  getInstallments : $ReadOnlyArray<{|
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

export const getInstallments = ({ vaultedToken, token, country, buyerAccessToken } : getInstallmentsOptions) : ZalgoPromise<getInstallmentsInfo> => {
    return callGraphQL({
        name:  'getInstallments',
        query: `
            query getInstallments(
                $vaultedToken: String
                $token: String!
                $country: CountryCodes!
            ) {
                getInstallments(
                    vaultedToken: $vaultedToken
                    token: $token
                    buyerCountry: $country
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
            token,
            country
        },
        headers:   {
            [HEADERS.ACCESS_TOKEN]: buyerAccessToken
        }
    });
};
