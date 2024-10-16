"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
require("~/styles/globals.css");
const nextjs_1 = require("@clerk/nextjs");
const react_1 = require("~/trpc/react");
const theme_provider_1 = require("~/components/ui/theme-provider");
const main_navbar_1 = __importDefault(require("~/components/main-navbar"));
const main_footer_1 = __importDefault(require("~/components/main-footer"));
const sans_1 = require("geist/font/sans");
const utils_1 = require("~/lib/utils");
exports.metadata = {
    title: "ECMO Bridge",
    description: "Bridge the gap between ECMO patients and machines.",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};
function RootLayout({ children, }) {
    return (<nextjs_1.ClerkProvider>
      <html lang="en">
        <body className={(0, utils_1.cn)("min-h-screen bg-background font-sans antialiased", sans_1.GeistSans.className)}>
          <react_1.TRPCReactProvider>
            <theme_provider_1.ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <main_navbar_1.default />
              {children}
              <main_footer_1.default />
            </theme_provider_1.ThemeProvider>
          </react_1.TRPCReactProvider>
        </body>
      </html>
    </nextjs_1.ClerkProvider>);
}
