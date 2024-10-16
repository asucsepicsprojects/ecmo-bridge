"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RootLayout;
require("~/styles/globals.css");
const sidebar_1 = __importDefault(require("./_components/sidebar"));
const react_1 = require("~/trpc/react");
const nextjs_1 = require("@clerk/nextjs");
const sans_1 = require("geist/font/sans");
const sonner_1 = require("~/components/ui/sonner");
function RootLayout({ children, }) {
    return (<>
      <nextjs_1.ClerkProvider>
        <html lang="en">
          <body className={`${sans_1.GeistSans.className} flex justify-between antialiased`}>
            <react_1.TRPCReactProvider>
              <sidebar_1.default />
              <main className="h-full w-full">{children}</main>
              <sonner_1.Toaster />
              <script src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}></script>
            </react_1.TRPCReactProvider>
          </body>
        </html>
      </nextjs_1.ClerkProvider>
    </>);
}
