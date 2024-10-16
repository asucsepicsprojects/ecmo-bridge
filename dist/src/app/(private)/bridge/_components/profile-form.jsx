"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileForm = ProfileForm;
const zod_1 = require("@hookform/resolvers/zod");
const react_hook_form_1 = require("react-hook-form");
const zod_2 = require("zod");
const button_1 = require("~/components/ui/button");
const form_1 = require("~/components/ui/form");
const input_1 = require("~/components/ui/input");
const react_1 = require("react");
const react_2 = require("~/trpc/react");
const react_3 = require("react");
const navigation_1 = require("next/navigation");
const sonner_1 = require("sonner");
const functions_1 = require("~/server/api/functions");
const formSchema = zod_2.z.object({
    name: zod_2.z.string().min(8).max(100),
    location: zod_2.z.string().min(1).max(150),
    coordinates: zod_2.z.object({
        lat: zod_2.z.number(),
        lng: zod_2.z.number(),
    }),
});
function ProfileForm() {
    const [error, setError] = (0, react_1.useState)(false);
    const router = (0, navigation_1.useRouter)();
    const inputRef = (0, react_3.useRef)(null); // Strongly typed ref for TypeScript
    (0, react_3.useEffect)(() => {
        if (!inputRef.current)
            return;
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
        const geocoder = new google.maps.Geocoder();
        autocomplete.setFields(["address_components", "formatted_address"]);
        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.formatted_address)
                return;
            form.setValue("location", place.formatted_address);
            geocoder.geocode({ address: place.formatted_address }, (results, status) => {
                if (status === "OK" && results !== null) {
                    const lat = results[0]?.geometry.location.lat() || 0;
                    const lng = results[0]?.geometry.location.lng() || 0;
                    form.setValue("coordinates", { lat, lng });
                }
            });
        });
        return () => {
            // Cleanup function to prevent memory leaks
            if (autocomplete && autocomplete.unbindAll) {
                autocomplete.unbindAll();
            }
        };
    }, []);
    const createHospital = react_2.api.hospital.create.useMutation({
        onSuccess: () => {
            // console.log("added successfully.");
            sonner_1.toast.success("Hospital info updated successfully", {
                description: `Hospital info was updated on ${(0, functions_1.getCurrentDateTime)()}`,
            });
            router.refresh();
        },
        onError: (error) => {
            // console.error("error", error);
            sonner_1.toast.error(error.message);
        },
    });
    // 1. Define your form.
    const form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(formSchema),
        defaultValues: {
            name: "",
            location: "",
            coordinates: { lat: 0, lng: 0 },
        },
    });
    const { data, isLoading } = react_2.api.hospital.get.useQuery();
    (0, react_3.useEffect)(() => {
        if (data && !isLoading) {
            // Reset form with fetched data once it's available
            form.reset({
                name: data.name,
                location: data.location,
                coordinates: data.coordinates || { lat: 0, lng: 0 },
            });
        }
    }, [data, isLoading, form]);
    // 2. Define a submit handler.
    function onSubmit(values) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        try {
            createHospital.mutate(values);
        }
        catch (e) {
            sonner_1.toast.error("Error updating hospital info.");
        }
    }
    if (error) {
        return <div>Error</div>;
    }
    return (<form_1.Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-8">
        <form_1.FormField control={form.control} name="name" render={({ field }) => (<form_1.FormItem>
              <form_1.FormLabel>Name</form_1.FormLabel>
              <form_1.FormControl>
                <input_1.Input placeholder="For eg: Phoenix Children" {...field}/>
              </form_1.FormControl>
              <form_1.FormDescription>
                This is your hospital's name. This name will be displayed
                everywhere including the match-list.
              </form_1.FormDescription>
              <form_1.FormMessage />
            </form_1.FormItem>)}/>
        <form_1.FormField control={form.control} name="location" render={({ field }) => (<form_1.FormItem>
              <form_1.FormLabel>Location</form_1.FormLabel>
              <form_1.FormControl>
                <input_1.Input id="my-input-searchbox" ref={inputRef} placeholder="Choose..."/>
              </form_1.FormControl>
              <form_1.FormDescription>
                Choose the location for your hospital. This is used to calculate
                coordinates of your hospital.
              </form_1.FormDescription>
              <form_1.FormMessage />
            </form_1.FormItem>)}/>
        <div>
          <button_1.Button type="submit" className="bg-primary-purple-900 hover:bg-primary-purple-400">
            Submit
          </button_1.Button>
        </div>
      </form>
    </form_1.Form>);
}
