import { HotUpdater } from "@hot-updater/react-native";
import { useEffect, useState } from "react";
import { Button, StatusBar, Text, useColorScheme, View } from "react-native";
import { useMigrations } from 'drizzle-orm/op-sqlite/migrator';
import schema from './src/database/index'
import migrations from './drizzle/migrations';
import { drizzle } from "drizzle-orm/op-sqlite";
import { open } from '@op-engineering/op-sqlite';
import { useStore } from '@nanostores/react'
import { $SEvents, SEventsValue } from "./src/stores/events";

import './src/stores/$persist'
import { $Theme, SThemeValue } from "./src/stores/test";

const opsqliteDb = open({
    name: 'template'
});

const db = drizzle(opsqliteDb, { schema });

function App() {
    const { success, error } = useMigrations(db, migrations);
    const [updateInfo, setUpdateinfo] = useState(null)
    const [bundleId, setBundleId] = useState<null | string>(null)
    const channel = HotUpdater.getChannel();
    const events: SEventsValue = useStore($SEvents)
    const theme: SThemeValue = useStore($Theme)

    useEffect(() => {
        const bundleIdData = HotUpdater.getBundleId()
        setBundleId(bundleIdData)
        db.query.events.findMany().then(e => { $SEvents.set(e) }).catch(err => { console.error(err) })
    }, [])

    const onPressChekForAppUpdate = async () => {
        const res = await checkForAppUpdate()
        setUpdateinfo(res)
    }

    const isDarkMode = useColorScheme() === 'dark';
    console.log("isDarkMode", isDarkMode)
    console.log("$theme", theme)

    if (error) {
        return (
            <View>
                <Text>Migration error: {error.message}</Text>
            </View>
        );
    }

    if (!success) {
        return (
            <View>
                <Text>Migration is in progress...</Text>
            </View>
        );
    }

    return (
        <>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

            <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                <Text>{JSON.stringify(events)}</Text>
                <Text>{success.toString()}</Text>
                <Text>Hello World! 123456</Text>
                <Text>isDark: {isDarkMode.toString()}</Text>
                <Text>isDarkTheme: {theme}</Text>
                <Text>{JSON.stringify(updateInfo)}</Text>
                <Text>bundleid: {bundleId}</Text>
                <Text>{process.env.HOT_UPDATER_SUPABASE_URL}</Text>
                <Button onPress={() => { $Theme.set($Theme.get() === 'auto' || $Theme.get() === 'dark' ? 'light' : 'dark') }} title="update theme" />
                <Button onPress={() => { $SEvents.set([...$SEvents.get(), { type: "grow_fuild_item", id: 0, data: { fuild_id: 0, game_item_id: 123 } }]) }} title="add new Event" />
                <Button onPress={onPressChekForAppUpdate} title="checkForAppUpdate" />
                <Button onPress={async () => {
                    if (!updateInfo) return
                    await HotUpdater.updateBundle({
                        bundleId: updateInfo.id,
                        fileUrl: updateInfo.fileUrl,
                        status: updateInfo.status,
                    });
                }} title="Apply build" />

                <Button onPress={async () => {
                    if (!updateInfo) return
                    await HotUpdater.reload();
                }} title="Reload" />

                <Button onPress={async () => {

                    fetch('http://localhost:3000/info').then(data => { alert(`${data.ok} : ${data.status} ${data.statusText}`) }).catch(e => alert(e.message))
                }} title="fetch" />

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
        const updateInfo = await HotUpdater.checkForUpdate({ updateStrategy: 'appVersion' });
        console.log(updateInfo)

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
