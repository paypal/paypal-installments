/* @flow */

import { ZalgoPromise } from 'zalgo-promise/src';
import { FPTI_KEY, COUNTRY } from '@paypal/sdk-constants/src';
import { stringifyError } from 'belter/src';


import type { InstallmentsFlowType } from '../types';
import { getLogger, enableLoadingSpinner, disableLoadingSpinner } from '../lib';
import { FPTI_TRANSITION, FPTI_CONTEXT_TYPE } from '../constants';
import { getInstallments } from '../api';

import { renderInstallments } from './renderer';

type installmentsProps = {|
    clientID : string,
    Installments : InstallmentsFlowType,
    paymentMethodID : string,
    button : HTMLElement,
    buyerCountry : $Values<typeof COUNTRY>,
    orderID : string,
    accessToken : string,
    cartAmount : string,
    onPay : Function
|};

export function initiateInstallments({ clientID, Installments, paymentMethodID, button, buyerCountry, orderID, accessToken, cartAmount, onPay } : installmentsProps) : Function {
    const inputs = {
        paymentToken:       paymentMethodID,
        country:            buyerCountry,
        token:              orderID,
        buyerAccessToken:   accessToken
    };
    
    getLogger()
        .info('vault_merchant_installments_eligible')
        .track({
            [FPTI_KEY.TRANSITION]:   FPTI_TRANSITION.INSTALLMENTS_ELIGIBLE,
            [FPTI_KEY.CONTEXT_TYPE]: FPTI_CONTEXT_TYPE.ORDER_ID,
            [FPTI_KEY.TOKEN]:        orderID,
            [FPTI_KEY.CONTEXT_ID]:   orderID
        }).flush();
    
    return getInstallments(inputs).then((installmentsResponse) => {
        if (installmentsResponse && installmentsResponse.getInstallmentsForOnboardingFlows) {
            const installmentsData = installmentsResponse.getInstallmentsForOnboardingFlows;

            getLogger()
                .info('installments_loaded')
                .track({
                    [FPTI_KEY.TRANSITION]:   FPTI_TRANSITION.INSTALLMENTS_LOAD,
                    [FPTI_KEY.CONTEXT_TYPE]: FPTI_CONTEXT_TYPE.ORDER_ID,
                    [FPTI_KEY.TOKEN]:        orderID,
                    [FPTI_KEY.CONTEXT_ID]:   orderID
                }).flush();

            const showInstallmentsModal = installmentsData.length > 1 || (installmentsData[0] && installmentsData[0].discount);

            if (showInstallmentsModal) {
                const options = installmentsData.map((info) => {
                    return {
                        term:               info.term,
                        intervalDuration:   info.intervalDuration,
                        ...(info.discount && { percent: info.discount.percentage }),
                        amount:             info.monthlyPayment.currencyFormatSymbolISOCurrency,
                        totalAmount:        info.totalCost.currencyFormatSymbolISOCurrency,
                        onSelect:           (option) => {
                            getLogger()
                                .info(`installment_option_selected_${ option.term }x`)
                                .track({
                                    [FPTI_KEY.TRANSITION]:   FPTI_TRANSITION.INSTALLMENT_SELECT,
                                    [FPTI_KEY.CONTEXT_TYPE]: FPTI_CONTEXT_TYPE.ORDER_ID,
                                    [FPTI_KEY.TOKEN]:        orderID,
                                    [FPTI_KEY.CONTEXT_ID]:   orderID
                                }).flush();
                        }
                    };
                });

                const data = {
                    cartAmount,
                    onPay:   (selectedInstallment) => {
                        enableLoadingSpinner(button);
                        
                        getLogger()
                            .info(`installments_pay_button_clicked_${ selectedInstallment ? selectedInstallment.term : '' }x`)
                            .track({
                                [FPTI_KEY.TRANSITION]:   FPTI_TRANSITION.INSTALLMENTS_PAY,
                                [FPTI_KEY.CONTEXT_TYPE]: FPTI_CONTEXT_TYPE.ORDER_ID,
                                [FPTI_KEY.TOKEN]:        orderID,
                                [FPTI_KEY.CONTEXT_ID]:   orderID
                            }).flush();

                        let installmentPlan = null;
                        if (selectedInstallment) {
                            installmentPlan = {
                                term:               selectedInstallment.term,
                                interval_duration:  selectedInstallment.intervalDuration
                            };
                        }

                        return ZalgoPromise.try(() => {
                            return onPay(orderID, installmentPlan);
                        }).finally(() => {
                            disableLoadingSpinner(button);
                        });
                    },
                    onClose: () => {
                        getLogger()
                            .info('installments_modal_close')
                            .track({
                                [FPTI_KEY.TRANSITION]:   FPTI_TRANSITION.INSTALLMENTS_CLOSE,
                                [FPTI_KEY.CONTEXT_TYPE]: FPTI_CONTEXT_TYPE.ORDER_ID,
                                [FPTI_KEY.TOKEN]:        orderID,
                                [FPTI_KEY.CONTEXT_ID]:   orderID
                            }).flush();
                    },
                    options,
                    orderID
                };

                getLogger()
                    .info('initiate_installments_modal')
                    .track({
                        [FPTI_KEY.TRANSITION]:   FPTI_TRANSITION.INSTALLMENTS_LOAD_MODAL,
                        [FPTI_KEY.CONTEXT_TYPE]: FPTI_CONTEXT_TYPE.ORDER_ID,
                        [FPTI_KEY.TOKEN]:        orderID,
                        [FPTI_KEY.CONTEXT_ID]:   orderID
                    }).flush();

                return renderInstallments({ clientID, Installments, data });
            } else {
                return onPay(orderID);
            }
        }
        throw new Error('Installments fetch returns null');
    }).catch(() => {
        return ZalgoPromise.try((err) => {
            getLogger()
                .error('installment_fetch_error', {
                    err: stringifyError(err)
                })
                .track({
                    [FPTI_KEY.TRANSITION]:   FPTI_TRANSITION.INSTALLMENTS_ERROR,
                    [FPTI_KEY.CONTEXT_TYPE]: FPTI_CONTEXT_TYPE.ORDER_ID,
                    [FPTI_KEY.TOKEN]:        orderID,
                    [FPTI_KEY.CONTEXT_ID]:   orderID,
                    err:                     stringifyError(err)
                }).flush();
            
            // fallback without installments
            return onPay(orderID);
        });
    });
}
