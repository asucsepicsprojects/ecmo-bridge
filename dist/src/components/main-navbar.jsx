"use client";
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const button_1 = require("./ui/button");
const utils_1 = require("~/lib/utils");
const avatar_1 = require("./ui/avatar");
const navigation_menu_1 = require("~/components/ui/navigation-menu");
const react_icons_1 = require("@radix-ui/react-icons");
const drawer_1 = require("~/components/ui/drawer");
const link_1 = __importDefault(require("next/link"));
const nextjs_1 = require("@clerk/nextjs");
const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setDrawerOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    // Define the menu content to reuse in both mobile and desktop layouts
    const MenuContent = () => (<navigation_menu_1.NavigationMenu>
      <navigation_menu_1.NavigationMenuList className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0 md:bg-transparent">
        <navigation_menu_1.NavigationMenuItem asChild>
          <button_1.Button variant={"link"} className="text-primary-purple-700 md:text-white">
            <link_1.default href="/">Home</link_1.default>
          </button_1.Button>
        </navigation_menu_1.NavigationMenuItem>
        <navigation_menu_1.NavigationMenuItem asChild>
          <button_1.Button variant={"link"} className="text-primary-purple-700 md:text-white">
            <link_1.default href="/about">About</link_1.default>
          </button_1.Button>
        </navigation_menu_1.NavigationMenuItem>
        <navigation_menu_1.NavigationMenuItem asChild>
          <button_1.Button variant={"link"} className="text-primary-purple-700 md:text-white">
            <link_1.default href="https://mail.google.com/mail/?view=cm&fs=1&to=amras@asu.edu">
              Contact
            </link_1.default>
          </button_1.Button>
        </navigation_menu_1.NavigationMenuItem>
        <nextjs_1.SignedIn>
          <navigation_menu_1.NavigationMenuItem asChild>
            <button_1.Button variant={"link"} className="text-primary-purple-700 md:text-white">
              <link_1.default href="/bridge/dashboard">Dashboard</link_1.default>
            </button_1.Button>
          </navigation_menu_1.NavigationMenuItem>
        </nextjs_1.SignedIn>
        <navigation_menu_1.NavigationMenuItem>
          <nextjs_1.SignedOut>
            <button_1.Button variant={"link"} className="text-primary-purple-700 md:text-white">
              <nextjs_1.SignInButton />
            </button_1.Button>
          </nextjs_1.SignedOut>
          <nextjs_1.SignedIn>
            <avatar_1.Avatar>
              <nextjs_1.UserButton />
            </avatar_1.Avatar>
          </nextjs_1.SignedIn>
        </navigation_menu_1.NavigationMenuItem>
      </navigation_menu_1.NavigationMenuList>
    </navigation_menu_1.NavigationMenu>);
    return (<header className="absolute inset-x-0 top-0 z-10 w-full">
      <div className="mx-auto flex flex-row justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <div className="flex-shrink-0">
            <link_1.default href="/" className="flex">
              <span className="text-2xl font-bold text-white">ECMO Bridge</span>
            </link_1.default>
          </div>
        </div>
        <div className="ml-auto flex items-center justify-end space-x-6 md:hidden">
          <button_1.Button onClick={() => setDrawerOpen(!drawerOpen)} aria-label={drawerOpen ? "Close menu" : "Open menu"}>
            {drawerOpen ? <react_icons_1.Cross1Icon /> : <react_icons_1.HamburgerMenuIcon />}
          </button_1.Button>
        </div>
        <drawer_1.Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <drawer_1.DrawerContent>
            <drawer_1.DrawerDescription className="flex flex-row justify-end bg-white p-4">
              <drawer_1.DrawerClose onClick={() => setDrawerOpen(false)}>
                <button_1.Button variant={"secondary"}>
                  <react_icons_1.Cross1Icon />
                </button_1.Button>
              </drawer_1.DrawerClose>
            </drawer_1.DrawerDescription>
            <drawer_1.DrawerHeader className="flex h-full flex-row items-center justify-center bg-white ">
              {MenuContent()}
            </drawer_1.DrawerHeader>
          </drawer_1.DrawerContent>
        </drawer_1.Drawer>
        <div className="hidden md:flex md:flex-row md:items-center md:bg-transparent">
          {MenuContent()}
        </div>
      </div>
    </header>);
};
const ListItem = react_1.default.forwardRef(({ className, title, children, ...props }, ref) => {
    return (<li>
      <navigation_menu_1.NavigationMenuLink asChild>
        <a ref={ref} className={(0, utils_1.cn)("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground", className)} {...props}>
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </navigation_menu_1.NavigationMenuLink>
    </li>);
});
ListItem.displayName = "ListItem";
exports.default = Navbar;
