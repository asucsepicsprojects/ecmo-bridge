"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const button_1 = require("~/components/ui/button");
const nextjs_1 = require("@clerk/nextjs");
const Header = () => {
    return (<header className="absolute inset-x-0 top-0 z-10 w-full">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <div className="flex-shrink-0">
            <a href="/" title="home" className="flex">
              <img className="h-8 w-auto" src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/5/logo.svg" alt=""/>
            </a>
          </div>

          <div className="ml-auto flex items-center justify-end space-x-6">
            <nextjs_1.SignedOut>
              <button_1.Button variant={"outline"} className="border-washed-purple-400 text-primary-purple-500 border-2 bg-white transition-all duration-200 hover:bg-slate-200 hover:text-primary-purple-primary-purple-800 hover:text-opacity-80 lg:inline-flex">
                <nextjs_1.SignInButton></nextjs_1.SignInButton>
              </button_1.Button>
            </nextjs_1.SignedOut>
            <nextjs_1.SignedIn>
              <button_1.Button variant={"outline"} className="border-washed-purple-400 text-primary-purple-500 hidden  border-2 bg-white transition-all duration-200  hover:bg-slate-200 hover:text-primary-purple-primary-purple-800 hover:text-opacity-80 lg:inline-flex">
                Dashboard
              </button_1.Button>
              <nextjs_1.UserButton></nextjs_1.UserButton>
            </nextjs_1.SignedIn>
          </div>

          {/* <Button
          variant={"ghost"}
          className="hover:bg-primary-purple-800 text-white hover:text-white"
        >
          <HamburgerMenuIcon />
        </Button> */}
        </div>
      </div>
    </header>);
};
exports.default = Header;
