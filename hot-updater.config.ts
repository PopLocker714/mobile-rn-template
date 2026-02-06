import { bare } from "@hot-updater/bare";
import { standaloneRepository } from "@hot-updater/standalone";
import { config } from "dotenv";
import { defineConfig } from "hot-updater";
import { cliS3Local } from "./customStoreagePlugin";

config({ path: ".env.hotupdater" });

if (process.env.HOT_UPDATER_BUCKET_NAME === null) {
	throw new Error("HOT_UPDATER_BUCKET_NAME is not set");
}

export default defineConfig({
	build: bare({ enableHermes: true }),
	storage: cliS3Local({
		bucketName: process.env.HOT_UPDATER_BUCKET_NAME!,
		baseUrl: process.env.HOT_UPDATER_BASE_URL!,
	}),
	updateStrategy: "appVersion", // or "fingerprint"
	database: standaloneRepository({
		baseUrl: `${process.env.HOT_UPDATER_BASE_URL}/hot-updater`,
	}),
});
