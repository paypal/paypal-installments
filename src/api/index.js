/* @flow */

import type { ZalgoPromise } from 'zalgo-promise/src';

import { HEADERS } from '../constants';

import { callGraphQL } from './api';

type getInstallmentsOptions = {|
  paymentToken? : string,
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
  getInstallmentsForOnboardingFlows : $ReadOnlyArray<{|
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

export const getInstallments = ({ paymentToken, token, country, buyerAccessToken } : getInstallmentsOptions) : ZalgoPromise<getInstallmentsInfo> => {
    return callGraphQL({
        name:  'getInstallmentsForOnboardingFlows',
        query: `
            query getInstallmentsForOnboardingFlows(
                $paymentToken: String
                $token: String!
                $country: CountryCodes!
            ) {
                getInstallmentsForOnboardingFlows(
                paymentToken: $paymentToken
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
            paymentToken,
            token,
            country
        },
        headers:   {
            [HEADERS.ACCESS_TOKEN]: buyerAccessToken
        }
    });
};
