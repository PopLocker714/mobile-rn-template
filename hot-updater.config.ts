import { bare } from "@hot-updater/bare";
import { standaloneRepository } from "@hot-updater/standalone";
import { defineConfig } from "hot-updater";
import { cliS3Local } from "./customStoreagePlugin";
import { config } from "dotenv";

config({ path: ".env.hotupdater" });

export default defineConfig({
    build: bare({ enableHermes: true }),
    storage: cliS3Local({ bucketName: process.env.HOT_UPDATER_BUCKET_NAME!, baseUrl: process.env.HOT_UPDATER_BASE_URL! }),
    updateStrategy: "appVersion", // or "fingerprint"
    database: standaloneRepository({
        baseUrl: process.env.HOT_UPDATER_BASE_URL! + "/hot-updater",
    }),
});
