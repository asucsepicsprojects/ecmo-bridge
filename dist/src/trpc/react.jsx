"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
exports.TRPCReactProvider = TRPCReactProvider;
const react_query_1 = require("@tanstack/react-query");
const client_1 = require("@trpc/client");
const react_query_2 = require("@trpc/react-query");
const react_1 = require("react");
const superjson_1 = __importDefault(require("superjson"));
const createQueryClient = () => new react_query_1.QueryClient();
let clientQueryClientSingleton = undefined;
const getQueryClient = () => {
    if (typeof window === "undefined") {
        // Server: always make a new query client
        return createQueryClient();
    }
    // Browser: use singleton pattern to keep the same query client
    return (clientQueryClientSingleton ??= createQueryClient());
};
exports.api = (0, react_query_2.createTRPCReact)();
function TRPCReactProvider(props) {
    const queryClient = getQueryClient();
    const [trpcClient] = (0, react_1.useState)(() => exports.api.createClient({
        links: [
            (0, client_1.loggerLink)({
                enabled: (op) => process.env.NODE_ENV === "development" ||
                    (op.direction === "down" && op.result instanceof Error),
            }),
            (0, client_1.unstable_httpBatchStreamLink)({
                transformer: superjson_1.default,
                url: getBaseUrl() + "/api/trpc",
                headers: () => {
                    const headers = new Headers();
                    headers.set("x-trpc-source", "nextjs-react");
                    return headers;
                },
            }),
        ],
    }));
    return (<react_query_1.QueryClientProvider client={queryClient}>
      <exports.api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </exports.api.Provider>
    </react_query_1.QueryClientProvider>);
}
function getBaseUrl() {
    if (typeof window !== "undefined")
        return window.location.origin;
    if (process.env.VERCEL_URL)
        return `https://${process.env.VERCEL_URL}`;
    return `http://localhost:${process.env.PORT ?? 3000}`;
}
