"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientForm = PatientForm;
const zod_1 = require("@hookform/resolvers/zod");
const react_hook_form_1 = require("react-hook-form");
const zod_2 = require("zod");
const button_1 = require("~/components/ui/button");
const form_1 = require("~/components/ui/form");
const dialog_1 = require("~/components/ui/dialog");
const select_1 = require("~/components/ui/select");
const input_1 = require("~/components/ui/input");
const react_1 = require("~/trpc/react");
const navigation_1 = require("next/navigation");
const sonner_1 = require("sonner");
const functions_1 = require("~/server/api/functions");
function PatientForm() {
    const router = (0, navigation_1.useRouter)();
    const SpecialCareCategory = zod_2.z.enum([
        "PEDIATRIC",
        "FIRST_RESPONDERS",
        "SINGLE_CARETAKERS",
        "PREGNANT_PATIENTS",
        "SHORT_TERM_SURVIVAL",
    ], {
        errorMap: (issue, ctx) => ({ message: "Invalid category" }),
    });
    const ECMOType = zod_2.z.enum(["PULMONARY", "CARDIAC", "ECPR"], {
        errorMap: (issue, ctx) => ({ message: "Inavlid ECMO type" }),
    });
    const ecmoTypes = [
        { value: "PULMONARY", label: "Pulmonary" },
        { value: "CARDIAC", label: "Cardiac" },
        { value: "ECPR", label: "ECPR" },
    ];
    const specialCareTypes = [
        { value: "PEDIATRIC", label: "Pediatric" },
        { value: "FIRST_RESPONDERS", label: "First Responders" },
        { value: "SINGLE_CARETAKERS", label: "Single-caretaker" },
        { value: "PREGNANT_PATIENTS", label: "Pregnant Patients" },
        { value: "SHORT_TERM_SURVIVAL", label: "Short-term Survival" },
    ];
    const newPatientSchema = zod_2.z.object({
        name: zod_2.z
            .string()
            .min(1, { message: "Minimum 1 character required" })
            .max(30),
        age: zod_2.z.number().min(1).max(100),
        specialCare: SpecialCareCategory,
        ecmoType: ECMOType,
    });
    const form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(newPatientSchema),
        defaultValues: {
            name: "",
            age: 1,
            specialCare: "",
            ecmoType: "",
        },
    });
    const createPatient = react_1.api.patient.create.useMutation({
        onSuccess: () => {
            // console.log("added successfully.");
            sonner_1.toast.success("Patient created successfully", {
                description: `Patient was added on ${(0, functions_1.getCurrentDateTime)()}`,
            });
            router.refresh(); // Refresh the page after adding a new patient
        },
        onError: (error) => {
            // console.error("error", error);
            sonner_1.toast.error(error.message);
        },
    });
    function onSubmit(values) {
        createPatient.mutate(values);
        form.reset();
    }
    return (<dialog_1.Dialog>
      <dialog_1.DialogTrigger>Add Patient</dialog_1.DialogTrigger>

      <dialog_1.DialogContent className="w-[50%] p-10">
        <form_1.Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-8">
            <form_1.FormField control={form.control} name="name" render={({ field }) => (<form_1.FormItem>
                  <form_1.FormLabel>Name</form_1.FormLabel>
                  <form_1.FormControl>
                    <input_1.Input placeholder="For eg: John Doe" {...field}/>
                  </form_1.FormControl>
                  <form_1.FormDescription>
                    This is your patient's name.
                  </form_1.FormDescription>
                  <form_1.FormMessage />
                </form_1.FormItem>)}/>
            <form_1.FormField control={form.control} name="age" render={({ field }) => (<form_1.FormItem>
                  <form_1.FormLabel>Age</form_1.FormLabel>
                  <form_1.FormControl>
                    <input_1.Input {...field} onChange={(e) => field.onChange(Number(e.target.value))} // Convert string to number
         value={field.value}></input_1.Input>
                  </form_1.FormControl>
                  <form_1.FormDescription>
                    Choose the age for your patient.
                  </form_1.FormDescription>
                  <form_1.FormMessage />
                </form_1.FormItem>)}/>
            <form_1.FormField control={form.control} name="specialCare" render={({ field }) => (<form_1.FormItem>
                  <form_1.FormLabel>Special Care</form_1.FormLabel>
                  <select_1.Select onValueChange={field.onChange} defaultValue={field.value}>
                    <form_1.FormControl>
                      <select_1.SelectTrigger>
                        <select_1.SelectValue placeholder="Select a special care type"/>
                      </select_1.SelectTrigger>
                    </form_1.FormControl>
                    <select_1.SelectContent>
                      {specialCareTypes.map((item) => (<select_1.SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </select_1.SelectItem>))}
                    </select_1.SelectContent>
                  </select_1.Select>
                  <form_1.FormMessage />
                </form_1.FormItem>)}/>
            <form_1.FormField control={form.control} name="ecmoType" render={({ field }) => (<form_1.FormItem>
                  <form_1.FormLabel>ECMO</form_1.FormLabel>
                  <select_1.Select onValueChange={field.onChange} defaultValue={field.value}>
                    <form_1.FormControl>
                      <select_1.SelectTrigger>
                        <select_1.SelectValue placeholder="Select a ECMO type"/>
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
            <button_1.Button type="submit">Submit</button_1.Button>
          </form>
        </form_1.Form>
      </dialog_1.DialogContent>
    </dialog_1.Dialog>);
}
