/* @flow */

import { ZalgoPromise } from '@krakenjs/zalgo-promise/src';
import { noop } from '@krakenjs/belter/src';

export function unresolvedPromise<T>() : ZalgoPromise<T> {
    return new ZalgoPromise(noop);
}

export function promiseNoop<T>(...args : $ReadOnlyArray<T>) : ZalgoPromise<void> { // eslint-disable-line no-unused-vars
    return ZalgoPromise.resolve();
}

export function getBody() : HTMLBodyElement {
    // eslint-disable-next-line compat/compat
    const body = document.body;

    if (!body) {
        throw new Error(`Document body not found`);
    }

    return body;
}
