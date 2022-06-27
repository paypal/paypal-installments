/* @flow */

import { ZalgoPromise } from "@krakenjs/zalgo-promise/src";
import { request } from "@krakenjs/belter/src";

import { GRAPHQL_URI } from "../config";
import { SMART_PAYMENT_BUTTONS } from "../constants";

export function callGraphQL<T>({
  name,
  query,
  variables = {},
  headers = {},
}: {|
  name: string,
  query: string,
  variables?: { [string]: mixed },
  headers?: { [string]: string },
|}): ZalgoPromise<T> {
  return request({
    url: `${GRAPHQL_URI}?${name}`,
    method: "POST",
    json: {
      query,
      variables,
    },
    headers: {
      "x-app-name": SMART_PAYMENT_BUTTONS,
      ...headers,
    },
  }).then(({ status, body }) => {
    const errors = body.errors || [];

    if (errors.length) {
      const message = errors[0].message || JSON.stringify(errors[0]);
      throw new Error(message);
    }

    if (status !== 200) {
      throw new Error(`${GRAPHQL_URI} returned status ${status}`);
    }

    return body.data;
  });
}
