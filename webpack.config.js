/* @flow */
/* eslint import/no-nodejs-modules: off, import/no-default-export: off */

import { getWebpackConfig } from '@krakenjs/grumbler-scripts/config/webpack.config';

import { globals } from './globals';

const MODULE_NAME = 'installmentsModal';

type SmartWebpackConfig = {|
    env? : string,
    entry : string,
    filename : string,
    minify? : boolean,
    debug? : boolean,
    vars? : { [string] : mixed },
    libraryTarget? : string
|};

function getSmartWebpackConfig({ entry, env, filename, minify = true, debug = false, libraryTarget = 'window', vars } : SmartWebpackConfig) : Object {
    return getWebpackConfig({
        env,
        entry:         `${ __dirname }/${ entry }`,
        modulename:    MODULE_NAME,
        filename,
        minify,
        debug,
        libraryTarget,
        vars,
        sourcemaps:    false
    });
}

export const WEBPACK_CONFIG_INSTALLMENTS : Object = getSmartWebpackConfig({
    entry:    'src/ui',
    filename: 'installments',
    minify:   false,
    vars:     globals
});

export const WEBPACK_CONFIG_INSTALLMENTS_MIN : Object = getSmartWebpackConfig({
    entry:    'src/ui',
    filename: 'installments',
    minify:   true,
    vars:     globals
});

export const WEBPACK_CONFIG_INSTALLMENTS_DEBUG : Object = getSmartWebpackConfig({
    entry:    'src/ui',
    filename: 'installments',
    debug:    true,
    minify:   false,
    vars:     globals
});

export const WEBPACK_CONFIG_TEST : Object = getWebpackConfig({
    entry:      `${ __dirname }/src/ui`,
    modulename: MODULE_NAME,
    test:       true,
    options:    {
        devtool: 'inline-source-map'
    },
    vars: {
        ...globals,
        __TEST__: true
    }
});

export default [
    WEBPACK_CONFIG_INSTALLMENTS,
    WEBPACK_CONFIG_INSTALLMENTS_MIN
];
