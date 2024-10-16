"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HomePage;
const background_beams_1 = require("~/components/ui/background-beams");
const faq_1 = __importDefault(require("./_components/faq"));
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
const lucide_react_2 = require("lucide-react");
const lucide_react_3 = require("lucide-react");
const nextjs_1 = require("@clerk/nextjs");
const lucide_react_4 = require("lucide-react");
function HomePage() {
    return (<>
      <div className="relative bg-gradient-to-b from-primary-purple-900 via-primary-purple-500 to-primary-purple-300">
        <section className="relative min-h-screen pb-10 pt-24 sm:pb-16 sm:pt-32 lg:pb-24">
          {/* <div className="absolute inset-x-0 bottom-0 z-10 hidden lg:flex">
          <img
            className="hidden w-full lg:block"
            src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/5/credit-cards.png"
            alt=""
          />
          <img
            className="block w-full lg:hidden"
            src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/5/credit-cards-mobile.png"
            alt=""
          />
        </div> */}

          <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-xl text-center">
              <h1 className="text-4xl font-bold sm:text-6xl">
                <span className="text-white">
                  Simplified patient-machine matching for healthcare
                </span>
              </h1>
              <p className="mt-5 text-base text-white sm:text-xl">
                Streamline your healthcare practice with our data driven
                patient-machine matching platform.
              </p>
              <nextjs_1.SignedOut>
                <button className="mt-8 inline-flex items-center rounded-lg bg-washed-purple-800 p-12 px-6 py-4 font-semibold text-white transition-all duration-200 hover:bg-washed-purple-400 focus:bg-washed-purple-800 sm:mt-16">
                  <nextjs_1.SignInButton>Get Started</nextjs_1.SignInButton>

                  <lucide_react_1.ArrowRightCircle className="ml-4" size={24}/>
                </button>
              </nextjs_1.SignedOut>
              <nextjs_1.SignedIn>
                <button className="mt-8 inline-flex items-center rounded-lg bg-washed-purple-800 p-12 px-6 py-4 font-semibold text-white transition-all duration-200 hover:bg-washed-purple-400 focus:bg-washed-purple-800 sm:mt-16">
                  <link_1.default href="/about">Learn More</link_1.default>

                  <lucide_react_1.ArrowRightCircle className="ml-4" size={24}/>
                </button>
              </nextjs_1.SignedIn>

              <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-8 px-20 text-left sm:grid-cols-3 sm:px-0">
                <div className="flex items-center">
                  <lucide_react_2.UsersIcon className="text-white"/>
                  <p className="ml-3 text-sm text-white">
                    Developed by students @ ASU
                  </p>
                </div>

                <div className="flex items-center">
                  <lucide_react_3.CheckSquare className="text-white"/>
                  <p className="ml-3 text-sm text-white">No charges</p>
                </div>

                <div className="flex items-center">
                  <lucide_react_4.LockIcon className="text-white"/>
                  <p className="ml-3 text-sm text-white">
                    Secured & safe database
                  </p>
                </div>
              </div>
            </div>
          </div>
          <faq_1.default />
        </section>
        <background_beams_1.BackgroundBeams />
      </div>
    </>);
}
