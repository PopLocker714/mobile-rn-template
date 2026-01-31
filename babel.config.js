module.exports = {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
        'hot-updater/babel-plugin',
        ["inline-import", { extensions: [".sql"] }],
    ],
};
