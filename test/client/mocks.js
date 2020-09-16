/* @flow */
import { ZalgoPromise } from 'zalgo-promise';

import type { ZoidComponentInstance, InstallmentsFlowProps } from '../../src/types';

export function setupMocks() {
    if(!window.xprops){
        window.xprops = {};
    }
    window.xprops.onProps = () => {};
    window.xprops.close = () => {};
}

export function setData({ key='DISCOUNT', onPay=()=>{}, onClose=()=>{}, onCancel=()=>{} } : { key?: String, onPay?:Function, onClose?:Function, onCancel?:Function }) {
    const variation  = {
        'DISCOUNT' : {
            "cartAmount":"$5,000.00 MXN",
            "options":[
                {"term":1,"intervalDuration":"P1M","percent":"70.00","amount":"$1,500.00 MXN","totalAmount":"$1,500.00 MXN", onSelect:()=>{}},
                {"term":3,"intervalDuration":"P1M","amount":"$1,666.66 MXN","totalAmount":"$5,000.00 MXN", onSelect:()=>{}},
                {"term":6,"intervalDuration":"P1M","amount":"$833.33 MXN","totalAmount":"$5,000.00 MXN", onSelect:()=>{}},
                {"term":9,"intervalDuration":"P1M","amount":"$555.55 MXN","totalAmount":"$5,000.00 MXN", onSelect:()=>{}}
            ],
            "orderID":"6MC96371RC871403L"
        },
        'NO_DISCOUNT' : {
            "cartAmount":"$5,000.00 MXN",
            "options":[
                {"term":1,"intervalDuration":"P1M","amount":"$5,000.00 MXN","totalAmount":"$5,000.00 MXN", onSelect:()=>{}},
                {"term":3,"intervalDuration":"P1M","amount":"$1,666.66 MXN","totalAmount":"$5,000.00 MXN", onSelect:()=>{}},
                {"term":6,"intervalDuration":"P1M","amount":"$833.33 MXN","totalAmount":"$5,000.00 MXN", onSelect:()=>{}},
                {"term":9,"intervalDuration":"P1M","amount":"$555.55 MXN","totalAmount":"$5,000.00 MXN", onSelect:()=>{}}
            ],
            "orderID":"6MC96371RC871403L"
        }
    }

    window.xprops.data = {
        ...variation[key],
        onPay,
        onClose,
        onCancel
    };
}

export function mockInstallments() : ZoidComponentInstance<InstallmentsFlowProps> {
    return {
        renderTo:    () => ZalgoPromise.resolve(),
        render:      () => ZalgoPromise.resolve(),
        onError:     () => ZalgoPromise.resolve(),
        updateProps: () => ZalgoPromise.resolve(),
        close:       () => ZalgoPromise.resolve(),
        show:        () => ZalgoPromise.resolve(),
        hide:        () => ZalgoPromise.resolve()
    };
}

export function getContent(){
    return {
        header:"Choose your monthly installment plan",
        monthly:"{amount}/month",
        monthly1x:"One-time payment",
        monthly1xWithDiscount:"Get {percent}% off on one-time payment",
        term:"{term}x",
        totalAmount:"{totalAmount} Total amount",
        totalWithDiscount:"{totalAmount} Total after discount",
        disclaimer:"By clicking the above button, your order will be placed",
        payLabel:"Pay {payAmount}"
    }
}

export function getCspNonce() {
    return 'owjahsdn23nj112l3k2ff1mnp4'
}