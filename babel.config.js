const nextjsBabelPreset = [
    "next/babel",
    {
        "@babel/preset-env": {
            "shippedProposals": true,
        },
        "transform-runtime": {},
        "styled-jsx": {},
        "class-properties": {},
    },
];

const sourceMapPlugin = "babel-plugin-source-map-support";
const sourceMapValue = "inline";

module.exports = {
    "plugins": [
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-export-default-from",
        "@babel/plugin-proposal-numeric-separator",
        "@babel/plugin-proposal-throw-expressions",
        "@babel/plugin-proposal-nullish-coalescing-operator",
        "@babel/plugin-proposal-optional-chaining",
    ],
    "presets": [
        ["@babel/preset-flow"],
        ["@babel/preset-react"],
    ],
    "env": {
        "production": {
            "presets": [nextjsBabelPreset],
        },
        "development": {
            "presets": [nextjsBabelPreset],
            "sourceMaps": sourceMapValue,
            "plugins": [sourceMapPlugin],
        },
        "debug": {
            "sourceMaps": sourceMapValue,
            "plugins": [sourceMapPlugin],
            "presets": [
                nextjsBabelPreset,
                ["@babel/preset-react", { "development": true }],
            ]
        },
        "generate-next-config": {},
    }
};
