type UpdateStatus = "ROLLBACK" | "UPDATE";

interface UpdateInfo {
	id: string;
	shouldForceUpdate: boolean;
	message: string | null;
	status: UpdateStatus;
	storageUri: string | null;
	fileHash: string | null;
}

interface AppUpdateInfo extends Omit<UpdateInfo, "storageUri"> {
	fileUrl: string | null;
	/**
	 * SHA256 hash of the bundle file, optionally with embedded signature.
	 * Format when signed: "sig:<base64_signature>"
	 * Format when unsigned: "<hex_hash>" (64-character lowercase hex)
	 * The client parses this to extract signature for native verification.
	 */
	fileHash: string | null;
}

export type CheckForUpdateResult = AppUpdateInfo & {
	/**
	 * Updates the bundle.
	 * This method is equivalent to `HotUpdater.updateBundle()` but with all required arguments pre-filled.
	 */
	updateBundle: () => Promise<boolean>;
};
