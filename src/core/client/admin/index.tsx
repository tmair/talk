import React, { FunctionComponent } from "react";
import ReactDOM from "react-dom";

import { createManaged } from "coral-framework/lib/bootstrap";

import App from "./App";
import Head from "./Head";
import { initLocalState } from "./local";
import localesData from "./locales";

// Import css variables.
import "coral-ui/theme/admin.css";

async function main() {
  const managed = await createManaged({
    initLocalState,
    localesData,
    reporterFeedbackPrompt: true,
    bundle: "admin",
  });

  const Index: FunctionComponent = () => (
    <managed.provider>
      <Head />
      <App />
    </managed.provider>
  );

  // eslint-disable-next-line no-restricted-globals
  ReactDOM.render(<Index />, document.getElementById("app"));
}

void main();
