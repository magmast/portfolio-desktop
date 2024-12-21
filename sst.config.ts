/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "portfolio-desktop",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Nextjs("DesktopAugustyniak", {
      domain: {
        name: "desktop.augustyniak.app",
        dns: sst.cloudflare.dns(),
      },
    });
  },
});
