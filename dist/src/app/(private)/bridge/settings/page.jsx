"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const profile_form_1 = require("../_components/profile-form");
const server_1 = require("~/trpc/server");
const link_1 = __importDefault(require("next/link"));
const react_2 = require("@tremor/react");
const lucide_react_1 = require("lucide-react");
const react_icons_1 = require("@radix-ui/react-icons");
const react_3 = require("@tremor/react");
const SettingsPage = async () => {
    const hospital = await server_1.api.hospital.get();
    if (!hospital) {
        return (<div className="flex w-[80%] flex-col items-start space-y-10 p-10">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600">Manage your hospital settings</p>
        </div>
        <div className="w-[60%] space-y-6">
          <react_2.Callout icon={lucide_react_1.AlertCircleIcon} title="Heads up!" color="red">
            For security and ethical reasons, you will only be able to set your
            hospital's name and location once.{" "}
            <link_1.default href="/about" className=" hover:underline">
              Learn more &gt;
            </link_1.default>
          </react_2.Callout>
          <profile_form_1.ProfileForm />
        </div>
      </div>);
    }
    else {
        return (<div className="flex w-[80%] flex-col items-start space-y-10 p-10">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600">Manage your hospital settings</p>
        </div>
        <div className="w-[60%] space-y-6">
          <div className="flex flex-row space-x-4">
            <h1 className="text-xl font-bold">{hospital.name}</h1>
            <react_3.Badge className="h-fit text-sm font-normal" color={"green"}>
              Verified
            </react_3.Badge>
          </div>
          <h2 className="text-lg">{hospital.location}</h2>
          <react_2.Callout icon={react_icons_1.QuestionMarkCircledIcon} title="Need to update your information?" color="purple">
            If you need to update your hospital's information or have any
            questions, please reach out to us.{" "}
            <link_1.default href="/about" className="hover:underline">
              Learn more &gt;
            </link_1.default>
          </react_2.Callout>
        </div>
      </div>);
    }
};
exports.default = SettingsPage;
