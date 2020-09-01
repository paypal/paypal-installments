/* @flow */

import type { CrossDomainWindowType } from 'cross-domain-utils/src';
import type { ZalgoPromise } from 'zalgo-promise/src';
import { COUNTRY, LANG } from '@paypal/sdk-constants/src';

import { CONTEXT } from './constants';

export type LocaleType = {|
    country : $Values<typeof COUNTRY>,
    lang : $Values<typeof LANG>
|};

export type ZoidComponentInstance<P> = {|
    render : (string, ?$Values<typeof CONTEXT>) => ZalgoPromise<void>,
    renderTo : (CrossDomainWindowType, string, ?$Values<typeof CONTEXT>) => ZalgoPromise<void>,
    updateProps : (P) => ZalgoPromise<void>,
    close : () => ZalgoPromise<void>,
    show : () => ZalgoPromise<void>,
    hide : () => ZalgoPromise<void>,
    onError : (mixed) => ZalgoPromise<void>
|};

export type ZoidComponent<P> = {|
    canRenderTo : (CrossDomainWindowType) => ZalgoPromise<boolean>,
    (P): ZoidComponentInstance<P>
|};

export type InstallmentsOption = {|
    term : string,
    intervalDuration : string,
    percent? : string,
    amount : string,
    totalAmount : string,
    onSelect : (InstallmentsOption) => void | ZalgoPromise<void>
|};

export type InstallmentsOptions = $ReadOnlyArray<InstallmentsOption>;

export type InstallmentsData = {|
    cartAmount : string,
    onPay : (InstallmentsOption | null) => void | ZalgoPromise<void>,
    onClose : () => void | ZalgoPromise<void>,
    options : InstallmentsOptions,
    orderID : string
|};

export type InstallmentsFlowProps = {|
    clientID : string,
    data? : InstallmentsData,
    close? : () => ZalgoPromise<void>
|};

export type InstallmentsFlowType = ZoidComponent<InstallmentsFlowProps>;

export type ContentType = {|
    header : string,
    monthly : string,
    monthly1x : string,
    monthly1xWithDiscount : string,
    term : string,
    totalAmount : string,
    totalWithDiscount : string,
    disclaimer : string,
    payLabel : string
|};
