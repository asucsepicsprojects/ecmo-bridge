"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ECMOColumns = void 0;
const button_1 = require("~/components/ui/button");
const zod_1 = require("zod");
const lucide_react_1 = require("lucide-react");
const dropdown_menu_1 = require("~/components/ui/dropdown-menu");
const navigation_1 = require("next/navigation");
const react_1 = require("~/trpc/react");
const react_2 = require("react");
const switch_1 = require("~/components/ui/switch");
const dialog_1 = require("~/components/ui/dialog");
const select_1 = require("~/components/ui/select");
const input_1 = require("~/components/ui/input");
const react_3 = require("react");
const label_1 = require("~/components/ui/label");
const sonner_1 = require("sonner");
const functions_1 = require("~/server/api/functions");
exports.ECMOColumns = [
    {
        accessorKey: "model",
        header: ({ column }) => {
            return (<button_1.Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Model
          <lucide_react_1.ArrowUpDown className="ml-2 h-4 w-4"/>
        </button_1.Button>);
        },
        cell: ({ getValue }) => {
            const value = getValue();
            return <div className="text-center font-medium">{value}</div>;
        },
    },
    {
        accessorKey: "serial",
        header: ({ column }) => {
            return (<button_1.Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Serial
          <lucide_react_1.ArrowUpDown className="ml-2 h-4 w-4"/>
        </button_1.Button>);
        },
        cell: ({ getValue }) => {
            const value = getValue();
            return <div className="text-center font-medium">{value}</div>;
        },
    },
    {
        accessorKey: "type",
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
        accessorKey: "inUse",
        header: ({ column }) => {
            return (<button_1.Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Status
          <lucide_react_1.ArrowUpDown className="ml-2 h-4 w-4"/>
        </button_1.Button>);
        },
        cell: ({ getValue }) => {
            const value = getValue();
            if (value) {
                return (<div className="text-center font-medium text-red-500">In use</div>);
            }
            return (<div className="text-center font-medium text-green-500">Vacant</div>);
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const router = (0, navigation_1.useRouter)();
            const edit = react_1.api.ecmo.edit.useMutation({
                onSuccess: () => {
                    // console.log("edited successfully.");
                    sonner_1.toast.success("ECMO edited successfully", {
                        description: `ECMO was updated on ${(0, functions_1.getCurrentDateTime)()}`,
                    });
                    router.refresh();
                },
                onError: (error) => {
                    // console.log("error", error);
                    sonner_1.toast.error(error.message);
                },
            });
            const ECMOType = zod_1.z.enum(["PULMONARY", "CARDIAC", "ECPR"], {
                errorMap: (issue, ctx) => ({ message: "Inavlid ECMO type" }),
            });
            const ecmoTypes = [
                { value: "PULMONARY", label: "Pulmonary" },
                { value: "CARDIAC", label: "Cardiac" },
                { value: "ECPR", label: "ECPR" },
            ];
            const query = react_1.api.ecmo.delete.useMutation({
                onSuccess: () => {
                    // console.log("ECMO deleted successfully");
                    sonner_1.toast.success("ECMO deleted successfully", {
                        description: `ECMO was deleted on ${(0, functions_1.getCurrentDateTime)()}`,
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
            const ecmo = row.original;
            const [model, setModel] = (0, react_3.useState)(ecmo.model);
            const [serial, setSerial] = (0, react_3.useState)(ecmo.serial);
            const [type, setType] = (0, react_3.useState)(ECMOType.parse(ecmo.type));
            const [inUse, setInUse] = (0, react_3.useState)(ecmo.inUse);
            const handleEdit = () => {
                edit.mutate({ model, inUse, serial, type, id: row.original.id });
            };
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
              <dropdown_menu_1.DropdownMenuItem onClick={() => navigator.clipboard.writeText(ecmo.id.toString())}>
                Copy ECMO ID
              </dropdown_menu_1.DropdownMenuItem>
              <dropdown_menu_1.DropdownMenuSeparator />
              <dropdown_menu_1.DropdownMenuItem onClick={() => handleDelete(ecmo.id)}>
                Delete ECMO
              </dropdown_menu_1.DropdownMenuItem>
              <dropdown_menu_1.DropdownMenuItem>
                <dialog_1.DefaultDialogTrigger>Edit ECMO</dialog_1.DefaultDialogTrigger>
              </dropdown_menu_1.DropdownMenuItem>
            </dropdown_menu_1.DropdownMenuContent>
          </dropdown_menu_1.DropdownMenu>
          <dialog_1.DialogContent className="p-10">
            <label_1.Label>Model</label_1.Label>
            <input_1.Input id="model" defaultValue={row.original.model} onChange={(e) => setModel(e.target.value)}/>
            <label_1.Label>Serial</label_1.Label>
            <input_1.Input id="serial" defaultValue={row.original.serial} onChange={(e) => setSerial(e.target.value)}/>
            <label_1.Label>In Use</label_1.Label>
            <switch_1.Switch id="inUse" checked={inUse} onCheckedChange={(value) => setInUse(value)}/>
            <label_1.Label>Type</label_1.Label>
            <select_1.Select onValueChange={(value) => setType(ECMOType.parse(value))} defaultValue={row.original.type}>
              <select_1.SelectTrigger>
                <select_1.SelectValue placeholder="Select an ECMO type"/>
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
