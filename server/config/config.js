/* @flow */

import pkg from "../../package.json";

export const MODULE_POLL_INTERVAL = 5 * 60;

export const WEBPACK_CONFIG = "webpack.config";

export const BUTTON_RENDER_MODULE = "@paypal/sdk-release";
export const BUTTON_RENDER_CHILD_MODULE = "@paypal/checkout-components";
export const BUTTON_CLIENT_MODULE = pkg.name;

export const INSTALLMENTS_CLIENT_JS = "dist/installments.js";
export const INSTALLMENTS_CLIENT_MIN_JS = "dist/installments.min.js";

export const BROWSER_CACHE_TIME = 6 * 60 * 60;

export const SDK_CDN_NAMESPACE = "https://www.paypalobjects.com/js-sdk-release";
export const SMART_BUTTONS_CDN_NAMESPACE =
  "https://www.paypalobjects.com/smart-payment-buttons";
