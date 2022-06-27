/* @flow */

import { ZalgoPromise } from "@krakenjs/zalgo-promise/src";
import { memoize } from "@krakenjs/belter/src";

import type { InstallmentsData, InstallmentsFlowType } from "../types";

type RenderProps = {|
  clientID: string,
  Installments: InstallmentsFlowType,
  data: InstallmentsData,
|};

export function renderInstallments({
  clientID,
  Installments,
  data,
}: RenderProps): ZalgoPromise<void> {
  if (!clientID) {
    throw new Error(`Can not render installments without client id`);
  }

  const { renderTo, updateProps, show, close } = Installments({ clientID });

  const render = memoize(() => {
    return renderTo(window.xprops.getParent(), "#installments-modal");
  });

  const display = () => {
    return render()
      .then(() => {
        return updateProps({
          clientID,
          data,
          close,
        });
      })
      .then(() => {
        return show();
      });
  };

  render();

  return display();
}
