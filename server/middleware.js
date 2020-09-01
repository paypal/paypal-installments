/* @flow */

import { COUNTRY, LANG } from '@paypal/sdk-constants';

import type { ContentType } from '../src/types';

import type { LoggerType, CacheType } from './types';
import { clientErrorResponse, htmlResponse, allowFrame, defaultLogger, safeJSON, sdkMiddleware, type ExpressMiddleware } from './lib';
import { EVENT } from './constants';
import { getParams } from './params';
import { getInstallmentsClientScript } from './script';

type InstallmentsMiddlewareOptions = {|
    logger? : LoggerType,
    cache? : CacheType,
    content : {
        [$Values<typeof COUNTRY>] : {
            [$Values<typeof LANG>] : ContentType
        }
    }
|};

export function getInstallmentsMiddleware({ logger = defaultLogger, content: smartContent, cache } : InstallmentsMiddlewareOptions = {}) : ExpressMiddleware {
    return sdkMiddleware({ logger, cache }, {
        app: async ({ req, res, params, meta, logBuffer }) => {
            logger.info(req, EVENT.RENDER);

            const { clientID, cspNonce, debug, locale } = getParams(params, req, res);
            
            const client = await getInstallmentsClientScript({ debug, logBuffer, cache });

            const content = smartContent[locale.country][locale.lang] || {};

            logger.info(req, `installments_client_version_${ client.version }`);
            logger.info(req, `installments_params`, { params: JSON.stringify(params) });

            if (!clientID) {
                return clientErrorResponse(res, 'Please provide a clientID query parameter');
            }

            const pageHTML = `
                <!DOCTYPE html>
                <head></head>
                <body data-nonce="${ cspNonce }" data-client-version="${ client.version }">
                    ${ meta.getSDKLoader({ nonce: cspNonce }) }
                    <script nonce="${ cspNonce }">${ client.script }</script>
                    <script nonce="${ cspNonce }">installmentsModal.setupInstallments(${ safeJSON({ cspNonce, content }) })</script>
                </body>
            `;

            allowFrame(res);
            return htmlResponse(res, pageHTML);
        }
    });
}
