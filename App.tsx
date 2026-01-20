import { HotUpdater, } from "@hot-updater/react-native";
import { useEffect, useState } from "react";
import { Button, StatusBar, Text, useColorScheme, View } from "react-native";

function App() {
    const [updateInfo, setUpdateinfo] = useState(null)
    const [bundleId, setBundleId] = useState<null | string>(null)
    const channel = HotUpdater.getChannel();
    useEffect(() => {
        const bundleIdData = HotUpdater.getBundleId()
        setBundleId(bundleIdData)

    }, [])

    const onPressChekForAppUpdate = async () => {
        const res = await checkForAppUpdate()

        setUpdateinfo(res)
    }


    const isDarkMode = useColorScheme() === 'dark';

    return (
        <>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

            <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
                <Text>Hello World! 123456</Text>
                <Text>isDark: {isDarkMode.toString()}</Text>
                <Text>{JSON.stringify(updateInfo)}</Text>
                <Text>bundleid: {bundleId}</Text>
                <Text>{process.env.HOT_UPDATER_SUPABASE_URL}</Text>
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
