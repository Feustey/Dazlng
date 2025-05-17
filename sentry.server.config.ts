// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://59d7ffd523dcab5178b002989c1032ba@o4509328438788096.ingest.de.sentry.io/4509328440754256",

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
