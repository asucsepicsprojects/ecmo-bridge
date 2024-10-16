"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
const react_1 = __importDefault(require("react"));
const navigation_1 = require("next/navigation");
const nextjs_1 = require("@clerk/nextjs");
const tooltip_1 = require("~/components/ui/tooltip");
const Sidebar = () => {
    const currentRoute = (0, navigation_1.usePathname)();
    const linkClasses = (path) => `mt-2 flex h-8 w-12 items-center justify-center ${currentRoute === path ? "bg-primary-purple-700 rounded-md" : ""}`;
    return (<div className="flex min-h-screen flex-auto flex-shrink-0 flex-col bg-primary-purple-900 text-gray-800 antialiased">
      <div className="flex h-full w-16 flex-col items-center overflow-hidden rounded bg-primary-purple-900 text-washed-purple-300 transition-all duration-500 ease-in-out">
        <link_1.default className="mt-3 flex w-full items-center justify-center px-3" href="/">
          <h1 className="text-2xl font-bold text-white">EB</h1>
        </link_1.default>
        <div className="mt-3 flex flex-col items-center border-t border-gray-700 text-white">
          <tooltip_1.TooltipProvider>
            <tooltip_1.Tooltip>
              <tooltip_1.TooltipTrigger asChild>
                <link_1.default className={linkClasses("/")} href="/">
                  <lucide_react_1.HomeIcon size={18}/>
                </link_1.default>
              </tooltip_1.TooltipTrigger>
              <tooltip_1.TooltipContent side="right">
                <p>Home</p>
              </tooltip_1.TooltipContent>
            </tooltip_1.Tooltip>
          </tooltip_1.TooltipProvider>
          <tooltip_1.TooltipProvider>
            <tooltip_1.Tooltip>
              <tooltip_1.TooltipTrigger asChild>
                <link_1.default className={linkClasses("/bridge/dashboard")} href="/bridge/dashboard">
                  <lucide_react_1.LayoutDashboardIcon size={18}/>
                </link_1.default>
              </tooltip_1.TooltipTrigger>
              <tooltip_1.TooltipContent side="right">
                <p>Dashboard</p>
              </tooltip_1.TooltipContent>
            </tooltip_1.Tooltip>
          </tooltip_1.TooltipProvider>

          <tooltip_1.TooltipProvider>
            <tooltip_1.Tooltip>
              <tooltip_1.TooltipTrigger asChild>
                <link_1.default className={linkClasses("/bridge/patients-and-ecmos")} href="/bridge/patients-and-ecmos">
                  <lucide_react_1.DatabaseIcon size={18}/>
                </link_1.default>
              </tooltip_1.TooltipTrigger>
              <tooltip_1.TooltipContent side="right">
                <p>Patients & ECMOs</p>
              </tooltip_1.TooltipContent>
            </tooltip_1.Tooltip>
          </tooltip_1.TooltipProvider>
          <tooltip_1.TooltipProvider>
            <tooltip_1.Tooltip>
              <tooltip_1.TooltipTrigger asChild>
                <link_1.default className={linkClasses("/bridge/match-list")} href="/bridge/match-list">
                  <lucide_react_1.ActivityIcon size={18}/>
                </link_1.default>
              </tooltip_1.TooltipTrigger>
              <tooltip_1.TooltipContent side="right">
                <p>Match List</p>
              </tooltip_1.TooltipContent>
            </tooltip_1.Tooltip>
          </tooltip_1.TooltipProvider>
        </div>
        <div className="mt-2 flex flex-col items-center border-t border-gray-700 text-white">
          <tooltip_1.TooltipProvider>
            <tooltip_1.Tooltip>
              <tooltip_1.TooltipTrigger asChild>
                <link_1.default className={linkClasses("/bridge/settings")} href="/bridge/settings">
                  <lucide_react_1.SettingsIcon size={18}/>
                </link_1.default>
              </tooltip_1.TooltipTrigger>
              <tooltip_1.TooltipContent side="right">
                <p>Settings</p>
              </tooltip_1.TooltipContent>
            </tooltip_1.Tooltip>
          </tooltip_1.TooltipProvider>
        </div>
        <div className="mt-auto flex h-16 w-full items-center justify-center space-x-2">
          <nextjs_1.UserButton />
        </div>
      </div>
    </div>);
};
exports.default = Sidebar;
