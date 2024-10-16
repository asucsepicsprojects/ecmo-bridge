"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Footer = () => {
    return (<section className=" bg-primary-purple-300 text-white">
      <div className="mx-auto max-w-screen-xl space-y-4 overflow-hidden px-4 py-4 sm:px-6 lg:px-8">
        {/* <nav className="-mx-5 -my-2 flex flex-wrap justify-center">
          <div className="px-5 py-2">
            <Button variant={"link"}>
              <Link href="/about">About</Link>
            </Button>
          </div>
          <div className="px-5 py-2">
            <Button variant={"link"}>
              <Link href="https://mail.google.com/mail/?view=cm&fs=1&to=amras@asu.edu">
                Contact
              </Link>
            </Button>
          </div>
          <SignedIn>
            <div className="px-5 py-2">
              <Button variant={"link"}>
                <Link href="/bridge/dashboard">Dashboard</Link>
              </Button>
            </div>
          </SignedIn>
        </nav> */}
        <p className="mt-8 text-center text-xs leading-6 ">
          © 2024 ECMO Bridge. All rights reserved.
        </p>
      </div>
    </section>);
};
exports.default = Footer;
