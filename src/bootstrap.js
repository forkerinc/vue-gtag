import { load } from "@/utils";
import registerGlobals from "@/register-globals";
import addRoutesTracker from "@/add-routes-tracker";
import { getOptions } from "@/options";
import { getRouter } from "@/router";
import addConfiguration from "@/add-configuration";

export default () => {
  const {
    onReady,
    onError,
    globalObjectName,
    globalDataLayerName,
    config,
    customResourceURL,
    customPreconnectOrigin,
    deferScriptLoad,
    pageTrackerEnabled,
    disableScriptLoad,
  } = getOptions();

  const isPageTrackerEnabled = Boolean(pageTrackerEnabled && getRouter());

  registerGlobals();

  if (isPageTrackerEnabled) {
    addRoutesTracker();
  } else {
    addConfiguration();
  }

  if (disableScriptLoad) {
    return;
  }

  return load(
    `${customResourceURL}?id=${config.id}&l=${globalDataLayerName}&gtm_auth=${config.params.gtm_auth}&gtm_preview=${config.params.gtm_preview}&gtm_cookies_win=x`,
    {
      preconnectOrigin: customPreconnectOrigin,
      defer: deferScriptLoad,
    }
  )
    .then(() => {
      if (onReady) {
        onReady(window[globalObjectName]);
      }
    })
    .catch((error) => {
      if (onError) {
        onError(error);
      }

      return error;
    });
};
