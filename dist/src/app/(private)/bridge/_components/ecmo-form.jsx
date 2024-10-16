"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ECMOForm = ECMOForm;
const zod_1 = require("@hookform/resolvers/zod");
const react_hook_form_1 = require("react-hook-form");
const zod_2 = require("zod");
const button_1 = require("~/components/ui/button");
const form_1 = require("~/components/ui/form");
const select_1 = require("~/components/ui/select");
const dialog_1 = require("~/components/ui/dialog");
const input_1 = require("~/components/ui/input");
const react_1 = require("~/trpc/react");
const switch_1 = require("~/components/ui/switch");
const navigation_1 = require("next/navigation");
const sonner_1 = require("sonner");
const react_2 = require("react");
const functions_1 = require("~/server/api/functions");
function ECMOForm() {
    const router = (0, navigation_1.useRouter)();
    const ECMOType = zod_2.z.enum(["PULMONARY", "CARDIAC", "ECPR"], {
        errorMap: (issue, ctx) => ({ message: "Inavlid ECMO type" }),
    });
    const ecmoTypes = [
        { value: "PULMONARY", label: "Pulmonary" },
        { value: "CARDIAC", label: "Cardiac" },
        { value: "ECPR", label: "ECPR" },
    ];
    const [message, setMessage] = (0, react_2.useState)("");
    const newEcmoSchema = zod_2.z.object({
        model: zod_2.z
            .string()
            .min(1, { message: "Minimum 1 character required" })
            .max(30),
        serial: zod_2.z
            .string()
            .min(1, { message: "Minimum 1 character required" })
            .max(30),
        type: ECMOType,
        inUse: zod_2.z.boolean().default(false),
    });
    const form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(newEcmoSchema),
        defaultValues: {
            model: "",
            serial: "",
            inUse: false,
            type: undefined,
        },
    });
    const createEcmo = react_1.api.ecmo.create.useMutation({
        onSuccess: () => {
            // console.log("ECMO created successfully");
            sonner_1.toast.success("ECMO created successfully", {
                description: `ECMO was added on ${(0, functions_1.getCurrentDateTime)()}`,
            });
            router.refresh();
        },
        onError: (error) => {
            // console.log("error", error);
            sonner_1.toast.error(error.message);
        },
    });
    function onSubmit(values) {
        createEcmo.mutate(values);
    }
    return (<dialog_1.Dialog>
      <dialog_1.DialogTrigger>Add ECMO</dialog_1.DialogTrigger>
      <dialog_1.DialogContent className="w-[50%] p-10">
        <form_1.Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-8">
            <form_1.FormField control={form.control} name="model" render={({ field }) => (<form_1.FormItem>
                  <form_1.FormLabel>Model</form_1.FormLabel>
                  <form_1.FormControl>
                    <input_1.Input placeholder="For eg: ABC-123" {...field}/>
                  </form_1.FormControl>
                  <form_1.FormDescription>This is your ECMO's model.</form_1.FormDescription>
                  <form_1.FormMessage />
                </form_1.FormItem>)}/>
            <form_1.FormField control={form.control} name="serial" render={({ field }) => (<form_1.FormItem>
                  <form_1.FormLabel>Serial</form_1.FormLabel>
                  <form_1.FormControl>
                    <input_1.Input placeholder="For eg: ABC-123" {...field}/>
                  </form_1.FormControl>
                  <form_1.FormDescription>This is your ECMO's serial.</form_1.FormDescription>
                  <form_1.FormMessage />
                </form_1.FormItem>)}/>
            <form_1.FormField control={form.control} name="type" render={({ field }) => (<form_1.FormItem>
                  <form_1.FormLabel>Type</form_1.FormLabel>
                  <select_1.Select onValueChange={field.onChange} defaultValue={field.value}>
                    <form_1.FormControl>
                      <select_1.SelectTrigger>
                        <select_1.SelectValue placeholder="Select a special care type"/>
                      </select_1.SelectTrigger>
                    </form_1.FormControl>
                    <select_1.SelectContent>
                      {ecmoTypes.map((item) => (<select_1.SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </select_1.SelectItem>))}
                    </select_1.SelectContent>
                  </select_1.Select>
                  <form_1.FormMessage />
                </form_1.FormItem>)}/>
            <form_1.FormField control={form.control} name="inUse" render={({ field }) => (<form_1.FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <form_1.FormLabel className="text-base">Status</form_1.FormLabel>
                    <form_1.FormDescription>
                      Is this ECMO currently in use?
                    </form_1.FormDescription>
                  </div>
                  <form_1.FormControl>
                    <switch_1.Switch checked={field.value} onCheckedChange={field.onChange}/>
                  </form_1.FormControl>
                </form_1.FormItem>)}/>
            <button_1.Button type="submit">Submit</button_1.Button>
          </form>
        </form_1.Form>
      </dialog_1.DialogContent>
    </dialog_1.Dialog>);
}
