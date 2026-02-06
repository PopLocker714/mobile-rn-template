import fs from "node:fs/promises";
import { createStoragePlugin } from "@hot-updater/plugin-core";

const uploadFile = async (filePath: string, key: string, uploadUrl: string) => {
	const fileData = await fs.readFile(filePath);

	const res = await fetch(uploadUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/octet-stream",
			"X-Key": key,
		},
		body: fileData,
	});

	const json = (await res.json()) as { storageUri: string };
	console.log("Upload response:", json);
	return json;
};

export interface CliS3Config {
	bucketName: string;
	baseUrl: string;
}

export const cliS3Local = createStoragePlugin<CliS3Config>({
	name: "cliS3Local",
	supportedProtocol: "http",
	factory: (config) => {
		const { bucketName, baseUrl } = config;

		return {
			async upload(key, filePath) {
				let res: { storageUri: string };
				try {
					res = await uploadFile(filePath, key, `${baseUrl}/s3/${bucketName}`);
				} catch (e) {
					console.error("Upload failed:", e);
					return { storageUri: "" };
				}

				return {
					storageUri: res.storageUri,
				};
			},

			async delete(storageUri) {
				await fetch(`${baseUrl}/s3`, {
					method: "DELETE",
					body: JSON.stringify({ storageUri }),
				});
			},

			async getDownloadUrl(storageUri) {
				return {
					fileUrl: storageUri,
				};
			},
		};
	},
});
