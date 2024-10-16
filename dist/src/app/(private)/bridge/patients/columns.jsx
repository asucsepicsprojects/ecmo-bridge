"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientColumns = void 0;
const zod_1 = require("zod");
const button_1 = require("~/components/ui/button");
const lucide_react_1 = require("lucide-react");
const dropdown_menu_1 = require("~/components/ui/dropdown-menu");
const react_1 = require("~/trpc/react");
const navigation_1 = require("next/navigation");
const dialog_1 = require("~/components/ui/dialog");
const select_1 = require("~/components/ui/select");
const input_1 = require("~/components/ui/input");
const react_2 = require("react");
const react_label_1 = require("@radix-ui/react-label");
const react_3 = require("react");
const sonner_1 = require("sonner");
const functions_1 = require("~/server/api/functions");
const editPatientSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Minimum 1 character required" }).max(30),
    age: zod_1.z.number().min(1).max(100),
});
exports.PatientColumns = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (<button_1.Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <lucide_react_1.ArrowUpDown className="ml-2 h-4 w-4"/>
        </button_1.Button>);
        },
        cell: ({ getValue }) => {
            const value = getValue();
            return <div className="text-center font-medium">{value}</div>;
        },
    },
    {
        accessorKey: "age",
        header: ({ column }) => {
            return (<button_1.Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Age
          <lucide_react_1.ArrowUpDown className="ml-2 h-4 w-4"/>
        </button_1.Button>);
        },
        cell: ({ getValue }) => {
            const value = getValue();
            return <div className="text-center font-medium">{value}</div>;
        },
    },
    {
        accessorKey: "specialCare",
        header: ({ column }) => {
            return (<button_1.Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Special Care
          <lucide_react_1.ArrowUpDown className="ml-2 h-4 w-4"/>
        </button_1.Button>);
        },
        cell: ({ getValue }) => {
            const value = getValue();
            const formattedValue = value
                .toString()
                .toLowerCase()
                .replace(/_/g, " ")
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
            return <div className="text-center font-medium">{formattedValue}</div>;
        },
    },
    {
        accessorKey: "ecmoType",
        header: ({ column }) => {
            return (<button_1.Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Type
          <lucide_react_1.ArrowUpDown className="ml-2 h-4 w-4"/>
        </button_1.Button>);
        },
        cell: ({ getValue }) => {
            const value = getValue();
            const formattedValue = value.startsWith("E")
                ? value.toUpperCase()
                : value
                    .toLowerCase()
                    .replace(/_/g, " ")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");
            return <div className="text-center font-medium">{formattedValue}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const router = (0, navigation_1.useRouter)();
            const edit = react_1.api.patient.edit.useMutation({
                onSuccess: () => {
                    // console.log("edited successfully.");
                    sonner_1.toast.success("Patient edited successfully", {
                        description: `Patient was edited on ${(0, functions_1.getCurrentDateTime)()}`,
                    });
                    router.refresh();
                },
                onError: (error) => {
                    // console.error("error", error);
                    sonner_1.toast.error(error.message);
                },
            });
            const SpecialCareCategory = zod_1.z.enum([
                "PEDIATRIC",
                "FIRST_RESPONDERS",
                "SINGLE_CARETAKERS",
                "PREGNANT_PATIENTS",
                "SHORT_TERM_SURVIVAL",
            ], {
                errorMap: (issue, ctx) => ({ message: "Invalid category" }),
            });
            const ECMOType = zod_1.z.enum(["PULMONARY", "CARDIAC", "ECPR"], {
                errorMap: (issue, ctx) => ({ message: "Inavlid ECMO type" }),
            });
            const [name, setName] = (0, react_3.useState)(row.original.name || "John Doe");
            const [age, setAge] = (0, react_3.useState)(row.original.age || 45);
            const [specialCare, setSpecialCare] = (0, react_3.useState)(SpecialCareCategory.parse(row.original.specialCare));
            const [ecmoType, setEcmoType] = (0, react_3.useState)(ECMOType.parse(row.original.ecmoType));
            const query = react_1.api.patient.delete.useMutation({
                onSuccess: () => {
                    // console.log("deleted successfully.");
                    sonner_1.toast.success("Patient deleted successfully", {
                        description: `Patient was deleted on ${(0, functions_1.getCurrentDateTime)()}`,
                    });
                    router.refresh();
                },
                onError: (error) => {
                    // console.log("error", error);
                    sonner_1.toast.error(error.message);
                },
            });
            const handleDelete = (0, react_2.useCallback)(async (id) => {
                router.refresh();
                await query.mutateAsync({ id });
            }, [query]);
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
            const handleEdit = () => {
                edit.mutate({ name, specialCare, ecmoType, age, id: row.original.id });
            };
            const patient = row.original;
            return (<dialog_1.Dialog>
          <dropdown_menu_1.DropdownMenu>
            <dropdown_menu_1.DropdownMenuTrigger asChild>
              <button_1.Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <lucide_react_1.MoreHorizontal className="h-4 w-4"/>
              </button_1.Button>
            </dropdown_menu_1.DropdownMenuTrigger>
            <dropdown_menu_1.DropdownMenuContent align="end">
              <dropdown_menu_1.DropdownMenuLabel>Actions</dropdown_menu_1.DropdownMenuLabel>
              <dropdown_menu_1.DropdownMenuItem onClick={() => navigator.clipboard.writeText(patient.id.toString())}>
                Copy patient ID
              </dropdown_menu_1.DropdownMenuItem>
              <dropdown_menu_1.DropdownMenuSeparator />
              <dropdown_menu_1.DropdownMenuItem onClick={() => handleDelete(patient.id)}>
                Delete Patient
              </dropdown_menu_1.DropdownMenuItem>

              <dropdown_menu_1.DropdownMenuItem>
                <dialog_1.DefaultDialogTrigger>Edit Patient</dialog_1.DefaultDialogTrigger>
              </dropdown_menu_1.DropdownMenuItem>
            </dropdown_menu_1.DropdownMenuContent>
          </dropdown_menu_1.DropdownMenu>
          <dialog_1.DialogContent className="p-10">
            <react_label_1.Label>Name</react_label_1.Label>
            <input_1.Input id="name" defaultValue={row.original.name} placeholder="John Doe" onChange={(e) => setName(e.target.value)}></input_1.Input>
            <react_label_1.Label>Age</react_label_1.Label>
            <input_1.Input id="age" type="number" defaultValue={row.original.age} onChange={(e) => setAge(Number(e.target.value))}></input_1.Input>
            <react_label_1.Label>Special Care</react_label_1.Label>
            <select_1.Select onValueChange={(value) => setSpecialCare(SpecialCareCategory.parse(value))} defaultValue={row.original.specialCare}>
              <select_1.SelectTrigger>
                <select_1.SelectValue placeholder="Select a Special Care type"/>
              </select_1.SelectTrigger>

              <select_1.SelectContent>
                {specialCareTypes.map((item) => (<select_1.SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </select_1.SelectItem>))}
              </select_1.SelectContent>
            </select_1.Select>
            <react_label_1.Label>ECMO Type</react_label_1.Label>
            <select_1.Select onValueChange={(value) => setEcmoType(ECMOType.parse(value))} defaultValue={row.original.ecmoType}>
              <select_1.SelectTrigger>
                <select_1.SelectValue placeholder="Select a ECMO type"/>
              </select_1.SelectTrigger>

              <select_1.SelectContent>
                {ecmoTypes.map((item) => (<select_1.SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </select_1.SelectItem>))}
              </select_1.SelectContent>
            </select_1.Select>
            <dialog_1.DialogFooter>
              <button_1.Button type="submit" onClick={() => handleEdit()}>
                Confirm
              </button_1.Button>
            </dialog_1.DialogFooter>
          </dialog_1.DialogContent>
        </dialog_1.Dialog>);
        },
    },
];
