"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const button_1 = require("~/components/ui/button");
const card_1 = require("~/components/ui/card");
const react_2 = require("@remixicon/react");
const OnboardingPage = () => {
    return (<div className="flex min-h-screen flex-col items-center justify-center space-y-2 p-10">
      <h1 className="text-3xl font-bold">Getting started</h1>
      <p className="text-md font-light text-gray-500">2 of 4 completed</p>
      <div className="card-div space-y-4 p-4">
        <card_1.Card className="flex flex-row items-center space-x-4">
          <card_1.CardHeader className="w-[80%]">
            <card_1.CardTitle>Set up your profile</card_1.CardTitle>
            <card_1.CardDescription>Add your hospital's location.</card_1.CardDescription>
          </card_1.CardHeader>
          <card_1.CardContent>
            <button_1.Button variant={"ghost"}>
              Start
              <react_2.RiArrowRightSLine />
            </button_1.Button>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card className="flex flex-row items-center">
          <card_1.CardHeader className="w-[80%]">
            <card_1.CardTitle>Add patients</card_1.CardTitle>
            <card_1.CardDescription>
              Start adding patients in need now.
            </card_1.CardDescription>
          </card_1.CardHeader>
          <card_1.CardContent>
            <button_1.Button variant={"ghost"}>
              Start
              <react_2.RiArrowRightSLine />
            </button_1.Button>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card className="flex flex-row items-center">
          <card_1.CardHeader className="w-[80%]">
            <card_1.CardTitle>Have ECMOS?</card_1.CardTitle>
            <card_1.CardDescription>
              Register your ECMO machine with us.
            </card_1.CardDescription>
          </card_1.CardHeader>
          <card_1.CardContent>
            <button_1.Button variant={"ghost"}>
              Start
              <react_2.RiArrowRightSLine />
            </button_1.Button>
          </card_1.CardContent>
        </card_1.Card>
      </div>
    </div>);
};
exports.default = OnboardingPage;
