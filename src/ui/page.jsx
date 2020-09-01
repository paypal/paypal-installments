/* @flow */
/** @jsx h */

import { h, render, Fragment, type Node } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import type { ContentType } from '../types';
import { getBody } from '../lib';

import { Installments } from './installments';
import { useXProps } from './hooks';

type PageProps = {|
    cspNonce : string,
    content : ContentType
|};

function Page({ cspNonce, content } : PageProps) : Node {
    const { data, close } = useXProps();
    const [ visible, setVisible ] = useState(false);

    useEffect(() => {
        const hasOptions = Boolean(data && data.options && data.options.length);
        setVisible(hasOptions);
    }, [ data ]);

    return (
        <Fragment>
            <style nonce={ cspNonce }>
                {`
                    * {
                        box-sizing: border-box;
                    }

                    html, body {
                        margin: 0;
                        padding: 0;
                        font-family: Helvetica, sans-serif;
                        font-size: 14px;
                    }

                    body {
                        width: 100%;
                        overflow:auto;
                    }
                `}
            </style>

            {
                (visible)
                    ? <Installments
                        data={ data }
                        cspNonce={ cspNonce }
                        close={ close }
                        content={ content } />
                    : null
            }
        </Fragment>
    );
}

type SetupOptions = {|
    cspNonce : string,
    content : ContentType
|};

export function setupInstallments({ cspNonce, content } : SetupOptions) {
    render(<Page cspNonce={ cspNonce } content={ content } />, getBody());
}
