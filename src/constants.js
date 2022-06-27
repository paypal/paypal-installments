/* @flow */

export const SMART_PAYMENT_BUTTONS = "smart-payment-buttons";

export const HEADERS = {
  AUTHORIZATION: "authorization",
  CONTENT_TYPE: "content-type",

  ACCESS_TOKEN: "x-paypal-internal-euat",
  CSRF_TOKEN: "x-csrf-jwt",
  SOURCE: "x-source",
  REQUESTED_BY: "x-requested-by",
  APP_NAME: "x-app-name",
  APP_VERSION: "x-app-version",
  CLIENT_CONTEXT: "paypal-client-context",

  PARTNER_ATTRIBUTION_ID: "paypal-partner-attribution-id",
  CLIENT_METADATA_ID: "paypal-client-metadata-id",
  PAYPAL_DEBUG_ID: "paypal-debug-id",
};

export const CONTEXT = {
  IFRAME: "iframe",
  POPUP: "popup",
};

export const DATA_ATTRIBUTES = {
  NONCE: "data-nonce",
};

export const FPTI_CONTEXT_TYPE = {
  BUTTON_SESSION_ID: ("button_session_id": "button_session_id"),
  WALLET_SESSION_ID: ("wallet_session_id": "wallet_session_id"),
  ORDER_ID: ("EC-Token": "EC-Token"),
  PAYMENT_ID: ("Pay-ID": "Pay-ID"),
};

export const FPTI_STATE = {
  BUTTON: ("smart_button": "smart_button"),
  WALLET: ("smart_wallet": "smart_wallet"),
  PXP: ("PXP_CHECK": "PXP_CHECK"),
};

export const FPTI_TRANSITION = {
  INSTALLMENTS_LOAD: ("installments_load": "installments_load"),
  INSTALLMENT_SELECT: ("installment_select": "installment_select"),
  INSTALLMENTS_PAY: ("installments_pay": "installments_pay"),
  INSTALLMENTS_CLOSE: ("installments_close": "installments_close"),
  INSTALLMENTS_ERROR: ("installments_error": "installments_error"),
  INSTALLMENTS_LOAD_MODAL:
    ("installments_load_modal": "installments_load_modal"),
  PXP: ("process_pxp_check": "process_pxp_check"),
};

export const CLASS = {
  LOADING: "paypal-button-loading",
};
