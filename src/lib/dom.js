/* @flow */

import { DATA_ATTRIBUTES, CLASS } from '../constants';

export function getNonce() : string {
    let nonce = '';
    if (document.body) {
        nonce = document.body.getAttribute(`${ DATA_ATTRIBUTES.NONCE }`) || '';
    }
    return nonce;
}

export function enableLoadingSpinner(button : HTMLElement) {
    button.classList.add(CLASS.LOADING);
}

export function disableLoadingSpinner(button : HTMLElement) {
    button.classList.remove(CLASS.LOADING);
}
