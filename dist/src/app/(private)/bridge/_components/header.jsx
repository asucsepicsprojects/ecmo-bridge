"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = void 0;
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
const nextjs_1 = require("@clerk/nextjs");
const input_1 = require("~/components/ui/input");
const Header = () => {
    return (<header className="sticky top-0 flex h-16 items-center gap-4 px-4 md:px-6">
      <nav className="hidden flex-col text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <link_1.default href="/bridge/dashboard" className="text-foreground transition-colors hover:text-foreground">
          Dashboard
        </link_1.default>
        <link_1.default href="/bridge/patients" className="text-muted-foreground transition-colors hover:text-foreground">
          Patients
        </link_1.default>
        <link_1.default href="/bridge/machines" className="text-muted-foreground transition-colors hover:text-foreground">
          ECMO
        </link_1.default>

        <link_1.default href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">
          Contact
        </link_1.default>
      </nav>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <lucide_react_1.Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
            <input_1.Input type="search" placeholder="Search products..." className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"/>
          </div>
        </form>
        <nextjs_1.UserButton />
      </div>
    </header>);
};
exports.Header = Header;
