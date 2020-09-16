/* @flow */
const { setupInstallments } = require('../../src/ui')
import { wrapPromise } from 'belter/src';

import { setupMocks, getContent, getCspNonce, setData } from './mocks';

describe('installments cases', () => {
    beforeEach(() => {
        setupMocks();
    });

    it('installments setup', async () => {
        setData({});
        setupInstallments({
            cspNonce: getCspNonce(),
            content: getContent()
        });
    })

    it('load installments and click pay', async () => {
        return await wrapPromise(async ({ expect, avoid, wait }) => {
            setData({
                onPay: (installmentPlan)=>{
                    if(installmentPlan!==null){
                        throw new Error(`Expected iframe to have src`);
                    }
                }
            });

            setupInstallments({
                cspNonce: getCspNonce(),
                content: getContent()
            });

            const payButton = document.querySelector('.pay-btn');
            payButton && payButton.click();
        });
    })

    it('load installments and select installment and click pay and close', async () => {
        return await wrapPromise(async ({ expect, avoid, wait }) => {
            setData({
                onPay: (installmentPlan)=>{
                    if(installmentPlan.term!==3){
                        throw new Error(`Expected iframe to have src`);
                    }
                }
            });

            setupInstallments({
                cspNonce: getCspNonce(),
                content: getContent()
            });

            const selectedList = document.querySelectorAll('.installments ul li')[1].querySelector('a');
            selectedList && selectedList.click();

            await wait();

            const payButton = document.querySelector('.pay-btn');
            payButton && payButton.click();

            await wait();

            const closeButton = document.querySelector('.close-btn');
            closeButton && closeButton.click();
        });
    })
});
