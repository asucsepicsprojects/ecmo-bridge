"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Highlight = exports.HeroHighlight = void 0;
const utils_1 = require("~/lib/utils");
const framer_motion_1 = require("framer-motion");
const react_1 = __importDefault(require("react"));
const HeroHighlight = ({ children, className, containerClassName, }) => {
    let mouseX = (0, framer_motion_1.useMotionValue)(0);
    let mouseY = (0, framer_motion_1.useMotionValue)(0);
    function handleMouseMove({ currentTarget, clientX, clientY, }) {
        if (!currentTarget)
            return;
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }
    return (<div className={(0, utils_1.cn)("group relative flex h-[40rem] w-full items-center justify-center bg-white dark:bg-black", containerClassName)} onMouseMove={handleMouseMove}>
      <div className="bg-dot-thick-neutral-300 dark:bg-dot-thick-neutral-800 pointer-events-none absolute  inset-0"/>
      <framer_motion_1.motion.div className="bg-dot-thick-indigo-500 dark:bg-dot-thick-indigo-500 pointer-events-none   absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100" style={{
            WebkitMaskImage: (0, framer_motion_1.useMotionTemplate) `
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
            maskImage: (0, framer_motion_1.useMotionTemplate) `
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
        }}/>

      <div className={(0, utils_1.cn)("relative z-20", className)}>{children}</div>
    </div>);
};
exports.HeroHighlight = HeroHighlight;
const Highlight = ({ children, className, }) => {
    return (<framer_motion_1.motion.span initial={{
            backgroundSize: "0% 100%",
        }} animate={{
            backgroundSize: "100% 100%",
        }} transition={{
            duration: 2,
            ease: "linear",
            delay: 0.5,
        }} style={{
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left center",
            display: "inline",
        }} className={(0, utils_1.cn)(`relative inline-block rounded-lg   bg-gradient-to-r from-indigo-300 to-purple-300 px-1 pb-1 dark:from-indigo-500 dark:to-purple-500`, className)}>
      {children}
    </framer_motion_1.motion.span>);
};
exports.Highlight = Highlight;
