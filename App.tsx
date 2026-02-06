import { HotUpdater } from "@hot-updater/react-native";
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";
import { Button, StatusBar, Text, useColorScheme, View } from "react-native";
import { $SEvents, type SEventsValue } from "./src/stores/events";
import "./src/stores/$persist";
import { $TEvents } from "./src/database/schema";
import { getRemoteDb } from "./src/database/syncStorage";
import type { CheckForUpdateResult } from "./src/libs/updater/types";
import { $Theme, type SThemeValue } from "./src/stores/test";

const db = getRemoteDb();

function App() {
	const [updateInfo, setUpdateinfo] = useState<CheckForUpdateResult | null>(null);
	const [bundleId, setBundleId] = useState<null | string>(null);
	const channel = HotUpdater.getChannel();
	const events: SEventsValue = useStore($SEvents);
	const theme: SThemeValue = useStore($Theme);

	useEffect(() => {
		const bundleIdData = HotUpdater.getBundleId();
		setBundleId(bundleIdData);

		db.query.$TEvents
			.findMany()
			.then((e) => {
				setTimeout(() => {
					$SEvents.set(e);
				}, 1000);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	const onPressChekForAppUpdate = async () => {
		const res = await checkForAppUpdate();
		if (res !== null && "id" in res) {
			setUpdateinfo(res);
		}
	};

	const isDarkMode = useColorScheme() === "dark";

	return (
		<>
			<StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

			<View style={{ flex: 1, alignContent: "center", justifyContent: "center", backgroundColor: "white" }}>
				<Text>{JSON.stringify(events)}</Text>
				{/*<Text>{success.toString()}</Text>*/}
				<Text>Hello World! 123456</Text>
				<Text>isDark: {isDarkMode.toString()}</Text>
				<Text>isDarkTheme: {theme}</Text>
				<Text>{JSON.stringify(updateInfo)}</Text>
				<Text>bundleid: {bundleId}</Text>
				<Text>{process.env.HOT_UPDATER_SUPABASE_URL}</Text>
				<Button
					onPress={() => {
						$Theme.set($Theme.get() === "auto" || $Theme.get() === "dark" ? "light" : "dark");
					}}
					title="update theme"
				/>
				<Button
					onPress={() => {
						db.insert($TEvents)
							.values({ type: "grow_fuild_item", data: { fuild_id: 1, game_item_id: 1 } })
							.returning()
							.then((data) => {
								const newEvent = data.at(0);
								if (!newEvent) return;
								$SEvents.set([...$SEvents.get(), newEvent]);
							})
							.catch((e) => console.log(e));
					}}
					title="add new Event"
				/>
				<Button onPress={onPressChekForAppUpdate} title="checkForAppUpdate" />
				<Button
					onPress={async () => {
						if (!updateInfo) return;
						if (!bundleId) return;
						await HotUpdater.updateBundle({ ...updateInfo, bundleId });
					}}
					title="Apply build"
				/>

				<Button
					onPress={async () => {
						if (!updateInfo) return;
						await HotUpdater.reload();
					}}
					title="Reload"
				/>

				<View>
					<Text>Current Channel: {channel}</Text>
				</View>
			</View>
		</>
	);
}

export default HotUpdater.wrap({
	// baseURL: `https://jjwhjwqhoglmcbxamqpw.supabase.co/functions/v1/update-server`,
	baseURL: `http://localhost:3000/hot-updater`,
	updateMode: "manual",
})(App);

async function checkForAppUpdate() {
	try {
		// Option 1: Use wrap's updateStrategy
		const updateInfo = await HotUpdater.checkForUpdate({ updateStrategy: "appVersion" });
		console.log(updateInfo);

		if (!updateInfo) {
			return {
				status: "UP_TO_DATE",
			};
		}

		/**
		 * You can apply updates using one of two methods:
		 *
		 * Method 1: Use the updateBundle() method from the updateInfo object
		 * - A convenience method built into the return value from checkForUpdate
		 * - Performs the same function as HotUpdater.updateBundle with all required arguments pre-filled
		 */
		await updateInfo.updateBundle();

		/**
		 * Method 2: Call HotUpdater.updateBundle() directly
		 * - Explicitly pass the necessary values extracted from updateInfo
		 */
		// await HotUpdater.updateBundle({
		//   bundleId: updateInfo.id,
		//   fileUrl: updateInfo.fileUrl,
		//   status: updateInfo.status,
		// });

		if (updateInfo.shouldForceUpdate) {
			await HotUpdater.reload();
		}
		return updateInfo;
	} catch (error) {
		console.error("Failed to check for update:", error);
		return null;
	}
}
