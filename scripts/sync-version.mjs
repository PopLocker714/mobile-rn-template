import fs from "fs"
import path from "path"

const root = process.cwd()

const pkg = JSON.parse(
    fs.readFileSync(path.join(root, "package.json"), "utf-8")
)

const version = pkg.version
const buildNumber = version
    .split(".")
    .reduce((acc, n) => acc * 100 + Number(n), 0)

console.log("Syncing version:", version)
console.log("Build number:", buildNumber)

//
// ANDROID
//
const gradlePath = path.join(root, "android/app/build.gradle")
let gradle = fs.readFileSync(gradlePath, "utf-8")

gradle = gradle
    .replace(/versionName\s+"[^"]+"/, `versionName "${version}"`)
    .replace(/versionCode\s+\d+/, `versionCode ${buildNumber}`)

fs.writeFileSync(gradlePath, gradle)
console.log("✅ Android updated")

//
// IOS
//
const iosDir = path.join(root, "ios")
const appName = fs
    .readdirSync(iosDir)
    .find((f) => f.endsWith(".xcodeproj"))
    ?.replace(".xcodeproj", "")

if (!appName) {
    console.log("⚠️ iOS project not found, skipping")
    process.exit(0)
}

const plistPath = path.join(iosDir, appName, "Info.plist")
let plist = fs.readFileSync(plistPath, "utf-8")

plist = plist
    .replace(
        /<key>CFBundleShortVersionString<\/key>\s*<string>[^<]+<\/string>/,
        `<key>CFBundleShortVersionString</key>\n\t<string>${version}</string>`
    )
    .replace(
        /<key>CFBundleVersion<\/key>\s*<string>[^<]+<\/string>/,
        `<key>CFBundleVersion</key>\n\t<string>${buildNumber}</string>`
    )

fs.writeFileSync(plistPath, plist)
console.log("✅ iOS updated")

console.log("🎉 Version sync complete")
