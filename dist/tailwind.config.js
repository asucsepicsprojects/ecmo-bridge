"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const svgToDataUri = require("mini-svg-data-uri");
const { default: flattenColorPalette, } = require("tailwindcss/lib/util/flattenColorPalette");
const colors_1 = __importDefault(require("tailwindcss/colors"));
const config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
        "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
    ],
    prefix: "",
    theme: {
        transparent: "transparent",
        current: "currentColor",
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                "washed-purple": {
                    "50": "#f8f7ff",
                    "100": "#e8e7ff",
                    "200": "#dddcff",
                    "300": "#cdcbff",
                    "400": "#c4c1ff",
                    "500": "#b5b2ff",
                    "600": "#a5a2e8",
                    "700": "#817eb5",
                    "800": "#64628c",
                    "900": "#4c4b6b",
                },
                "washed-blue": {
                    "50": "#f0f3ff",
                    "100": "#d0daff",
                    "200": "#bac9ff",
                    "300": "#9ab0ff",
                    "400": "#86a1ff",
                    "500": "#6889ff",
                    "600": "#5f7de8",
                    "700": "#4a61b5",
                    "800": "#394b8c",
                    "900": "#2c3a6b",
                },
                "primary-blue": {
                    "50": "#e6f0ff",
                    "100": "#b1d1ff",
                    "200": "#8cbaff",
                    "300": "#579bff",
                    "400": "#3687ff",
                    "500": "#0469ff",
                    "600": "#0460e8",
                    "700": "#034bb5",
                    "800": "#023a8c",
                    "900": "#022c6b",
                },
                "primary-purple": {
                    "50": "#f1e6ff",
                    "100": "#d3b0ff",
                    "200": "#bd8aff",
                    "300": "#9f54ff",
                    "400": "#8d33ff",
                    "500": "#7000ff",
                    "600": "#6600e8",
                    "700": "#5000b5",
                    "800": "#3e008c",
                    "900": "#2f006b",
                },
                neutrals: {
                    "1": "#e6e6e8",
                    "2": "#c3c2c7",
                    "3": "#93919a",
                    "4": "#605e6b",
                    "5": "#302e3e",
                    "6": "#030014",
                    "7": "#030011",
                    "8": "#02000e",
                    "9": "#02000b",
                    "10": "#010009",
                },
                // light mode
                tremor: {
                    brand: {
                        purple: "#2f006b",
                        faint: colors_1.default.blue[50],
                        muted: colors_1.default.blue[200],
                        subtle: colors_1.default.blue[400],
                        DEFAULT: colors_1.default.blue[500],
                        emphasis: colors_1.default.blue[700],
                        inverted: colors_1.default.white,
                    },
                    background: {
                        muted: colors_1.default.gray[50],
                        subtle: colors_1.default.gray[100],
                        DEFAULT: colors_1.default.white,
                        emphasis: colors_1.default.gray[700],
                    },
                    border: {
                        DEFAULT: colors_1.default.gray[200],
                    },
                    ring: {
                        DEFAULT: colors_1.default.gray[200],
                    },
                    content: {
                        subtle: colors_1.default.gray[400],
                        DEFAULT: colors_1.default.gray[500],
                        emphasis: colors_1.default.gray[700],
                        strong: colors_1.default.gray[900],
                        inverted: colors_1.default.white,
                    },
                },
                // dark mode
                "dark-tremor": {
                    brand: {
                        faint: "#0B1229",
                        muted: colors_1.default.blue[950],
                        subtle: colors_1.default.blue[800],
                        DEFAULT: colors_1.default.blue[500],
                        emphasis: colors_1.default.blue[400],
                        inverted: colors_1.default.blue[950],
                    },
                    background: {
                        muted: "#131A2B",
                        subtle: colors_1.default.gray[800],
                        DEFAULT: colors_1.default.gray[900],
                        emphasis: colors_1.default.gray[300],
                    },
                    border: {
                        DEFAULT: colors_1.default.gray[800],
                    },
                    ring: {
                        DEFAULT: colors_1.default.gray[800],
                    },
                    content: {
                        subtle: colors_1.default.gray[600],
                        DEFAULT: colors_1.default.gray[500],
                        emphasis: colors_1.default.gray[200],
                        strong: colors_1.default.gray[50],
                        inverted: colors_1.default.gray[950],
                    },
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            boxShadow: {
                // light
                "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                "tremor-card": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                "tremor-dropdown": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                // dark
                "dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                "dark-tremor-card": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                "dark-tremor-dropdown": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                "tremor-small": "0.375rem",
                "tremor-default": "0.5rem",
                "tremor-full": "9999px",
            },
            fontSize: {
                "tremor-label": ["0.75rem", { lineHeight: "1rem" }],
                "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
                "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
                "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    safelist: [
        {
            pattern: /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ["hover", "ui-selected"],
        },
        {
            pattern: /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ["hover", "ui-selected"],
        },
        {
            pattern: /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ["hover", "ui-selected"],
        },
        {
            pattern: /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
        },
        {
            pattern: /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
        },
        {
            pattern: /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
        },
    ],
    plugins: [
        require("tailwindcss-animate"),
        require("@headlessui/tailwindcss"),
        addVariablesForColors,
        function ({ matchUtilities, theme }) {
            matchUtilities({
                "bg-dot-thick": (value) => ({
                    backgroundImage: `url("${svgToDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="2.5"></circle></svg>`)}")`,
                }),
            }, {
                values: flattenColorPalette(theme("backgroundColor")),
                type: "color",
            });
        },
    ],
};
function addVariablesForColors({ addBase, theme }) {
    let allColors = flattenColorPalette(theme("colors"));
    let newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]));
    addBase({
        ":root": newVars,
    });
}
exports.default = config;
