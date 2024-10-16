"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactForm = ContactForm;
const react_1 = __importDefault(require("react"));
const zod_1 = require("zod");
const lucide_react_1 = require("lucide-react");
const zod_2 = require("@hookform/resolvers/zod");
const react_hook_form_1 = require("react-hook-form");
const badge_1 = require("~/components/ui/badge");
const link_1 = __importDefault(require("next/link"));
const contactFormSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(50),
    email: zod_1.z.string().email(),
    subject: zod_1.z.string().min(2).max(50),
    message: zod_1.z.string().min(2).max(500),
});
function ContactForm() {
    // 1. Define your form.
    const form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_2.zodResolver)(contactFormSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
    });
    // 2. Define a submit handler.
    function onSubmit(values) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
    }
    return (<div className="my-6">
      <div className=" mx-auto grid max-w-fit  items-center gap-16  rounded-md bg-white p-8 text-black sm:grid-cols-2">
        <div className="flex h-full w-full flex-col items-center justify-center  space-y-6 text-center">
          <div>
            <h1 className="text-5xl font-extrabold">Let's Talk</h1>
            <p className="mt-3 text-lg ">
              Want to update your information? Have a question? Feedback? Feel
              free to reach out to us!
            </p>
          </div>
          <div>
            <link_1.default href={"https://mail.google.com/mail/?view=cm&fs=1&to=amras@asu.edu"}>
              <badge_1.Badge className="h-fit bg-washed-purple-800 p-4 hover:bg-washed-purple-400 focus:bg-washed-purple-800 md:mb-16">
                <lucide_react_1.Mail className="h-6 w-6 "/>
                <p className="ml-3 text-sm ">amras@asu.edu</p>
              </badge_1.Badge>
            </link_1.default>
          </div>
        </div>
      </div>
    </div>);
}
