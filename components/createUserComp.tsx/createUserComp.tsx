"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TimePicker from "./time-picker";
import axios from "axios";
import { empty } from "@prisma/client/runtime/library";
import removeDiacritics from "../../library/converters/removeDiacritics";
import MapComponent from "../event/Map";
import "mapbox-gl/dist/mapbox-gl.css";
import { timeToMinutes } from "../../library/converters/timeToMinutes";
import { formSchema } from "../../library/schemas/create-event";
import { getCsrfToken, useSession } from "next-auth/react";
import formatData from "../../library/converters/formatData";
import convertObjToForm from "../../library/converters/convertObjToForm";
import getTimeZone from "../../library/converters/getTimeZone";
import { useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query"; // TanStack Query for dynamic data fetching


import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import getLocation from "../../library/map/getLocation";
import TagSelector from "../testFolder/tagsSelector";
import slugify from "slugify";


const interestTags = [
  "Cycling",
  "Music",
  "Reading",
  "Fitness",
  "Art",
  "Networking",
  "Technology",
  "Gaming",
  "Photography",
  "Cooking",
  "Volunteering",
  "Dance",
  "Outdoor",
  "Startup",
  "Workshop",
  "Meditation",
  "Hiking",
  "Coding",
  "Film",
  "Theater",
  "Language Exchange",
  "Travel",
  "Food Tasting",
  "Debate",
]



let firstTime = true;
// if the country is not writted corect, then the county field wont be displayed
let firstTimeCity = true;

const CreateUserComp = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { data: session } = useSession();

  // form based on schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: undefined,
      startHour: "",
      finishHour: "",
      country: "",
      city: "",
      map: false,
      lat: "",
      lng: "",
      timezone: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      console.log(data);
      const valuesCopy = { ...data };
      // console.log(data.getValues().file);
      const formattedStartH = formatData(data.date.toString(), valuesCopy.startHour);
      const formattedEndH = formatData(data.date.toString(), valuesCopy.finishHour);

      const timezone = await getTimeZone(parseFloat(data.lat), parseFloat(data.lng));
      const { country, city } = await getLocation(parseFloat(data.lat), parseFloat(data.lng));
      const csrfToken = await getCsrfToken();
      console.log("csrfToken", csrfToken);

      valuesCopy.country = removeDiacritics(country);
      valuesCopy.city = removeDiacritics(city);
      valuesCopy.startHour = formattedStartH;
      valuesCopy.finishHour = formattedEndH;
      valuesCopy.timezone = timezone;
      const hostName = session?.user?.name;
      valuesCopy.hostName = hostName;
      console.log("valuesCopy", session);
      valuesCopy.tags = selectedTags;
      console.log("valuesCopy", valuesCopy);
      const slug = slugify(data.title, { lower: true, strict: true });
      const slugHref = `/events/${slug}`;
      const userId = session.token.id;

      const formData = convertObjToForm(valuesCopy);
      // console.log(formData.file);
      console.log('13131', formData);

      const response = await axios.post("http://localhost:3000/api/createEvent", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "csrf-token": csrfToken,
        },
        withCredentials: true,
      });
      const eventId = response.data.data.id;
      console.log("eventId", eventId)
      const changeButtonState = await axios.post("http://localhost:3000/api/buttonState", { userId, eventId, buttonState: "host" }, {
        headers: {
          "Content-Type": "application/json",
          "csrf-token": csrfToken,
        },
        withCredentials: true,
      })
      console.log(response.data);
      return slugHref;
    }, onError: (error) => {
      console.error("There was an error from the server"); // aici ai răspunsul de la backend
    }, onSuccess: (slugHref) => {
      console.log("The event was created successfully!"); // aici ai răspunsul de la backend
      setTimeout(() => {
        window.location.href = slugHref;
      }, 1000);
    }
  });

  // function that tells if the data from interactive map is OK
  // This function is getting passed into the MapComponent(it sends the data back)
  const updateUIonClick = (city: string, country: string, lat: string, lng: string) => {
    console.log(city, country);
    if (city !== undefined) {
      form.setValue("city", removeDiacritics(city));
      form.clearErrors(`city`);
      form.setValue("map", true);
      form.setValue("lat", lat.toString());
      form.setValue("lng", lng.toString());
    }
    form.setValue("country", removeDiacritics(country));
    form.clearErrors(`country`);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", values);
    mutation.mutate(values);
  };

  // funciton that validate text input from "country" and "county" fields
  const validate = async (value: string, mode: "country" | "city") => {
    try {
      const REQ_URL =
        mode === "country"
          ? `https://api.opencagedata.com/geocode/v1/json?q=${value.trim()}&key=1815f05342614d459cd09ea741dcfc58&language=en`
          : `https://api.opencagedata.com/geocode/v1/json?q=${value.trim()},${form.getValues("country")}&key=1815f05342614d459cd09ea741dcfc58&language=en`;

      const req = await axios.get(REQ_URL);

      const components = req.data.results[0].components;

      const data =
        mode === "country"
          ? components?.country
          : components?.county ||
          components?.city ||
          components?.town ||
          components?.hamlet ||
          components?.suburb ||
          components?.municipality ||
          components?.locality ||
          components?.state ||
          components?.state_district ||
          components?.district ||
          components?.region
        ;
      const cleanedText = removeDiacritics(data);
      console.log(cleanedText);
      console.log(value);
      // compare the country/county from API with the input field
      if (cleanedText.toLowerCase() === value.toLowerCase()) {
        // console.log(123);
        // reset
        form.setValue(mode, cleanedText);
        form.clearErrors(mode);
        if (mode === "city") {
          const lat2 = req.data?.results[1]?.geometry.lat || req.data?.results[0]?.geometry.lat;
          const lng2 = req.data?.results[1]?.geometry.lng || req.data?.results[0]?.geometry.lng;
          form.setValue("lat", lat2.toString());
          form.setValue("lng", lng2.toString());
          firstTimeCity = false;
        }
        if (mode === "country") {
          firstTime = false;
        }

        return true;
      }
    } catch (err) {
      return false;
    }
  };

  const lat = form.watch("lat");
  const lng = form.watch("lng");
  // console.log(lat, lng)

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-lg w-full bg-white p-6 rounded-lg shadow-md"
        >
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input className="border-2 border-gray-300" placeholder="Enter title" {...field} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="p-1"> </div>

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input className="border-2 border-gray-300" placeholder="Enter description" {...field} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="p-1"> </div>

          {/* Date Field */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                        value={field.value ? dayjs(field.value) : null} // convertim Date -> Dayjs ca să înțeleagă DatePicker
                        onChange={(newValue) => {
                          const dateValue = newValue ? newValue.toDate() : null; // convertim Dayjs -> Date
                          field.onChange(dateValue);
                        }}
                      // slotProps={{
                      //   textField: {
                      //     className: "w-60",
                      //     error: !!form.formState.errors.date,
                      //     helperText: form.formState.errors.date?.message,
                      //   }
                      // }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="p-1"> </div>

          {/* Start Hour Field */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <FormField
              control={form.control}
              name="startHour"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel>Start Hour</FormLabel>
                  <FormControl>
                    <DesktopTimePicker
                      value={field.value ? dayjs(field.value, "HH:mm A") : null}
                      onChange={(date) => {
                        if (date) {
                          const formattedTime = date.format("hh:mm A"); // ex: "03:45 PM"
                          field.onChange(formattedTime);
                        } else {
                          field.onChange("");
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </LocalizationProvider>

          <div className="p-1"> </div>

          {/* Finish Hour Field */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <FormField
              control={form.control}
              name="finishHour"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel>Finish Hour</FormLabel>
                  <FormControl>
                    <DesktopTimePicker
                      value={field.value ? dayjs(field.value, "hh:mm A") : null}
                      onChange={(date) => {
                        if (date) {
                          const formattedTime = date.format("hh:mm A"); // ex: "03:45 PM"
                          field.onChange(formattedTime);
                        } else {
                          field.onChange("");
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </LocalizationProvider>



          {/* Country Field */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => {
              const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

              return (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input className="border-2 border-gray-300"
                      placeholder="Enter country"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);

                        if (debounceTimeout.current) {
                          clearTimeout(debounceTimeout.current);
                        }

                        debounceTimeout.current = setTimeout(async () => {
                          if (e.target.value.trim() === "") {
                            form.setError("country", {
                              type: "manual",
                              message: "This field is required",
                            });
                            return;
                          }
                          console.log(e.target.value);

                          const validationResult = await validate(
                            e.target.value,
                            "country"
                          );
                          if (validationResult !== true) {
                            form.setError("country", {
                              type: "manual",
                              message: "This country does not exist",
                            });
                          }
                        }, 600); // 600 ms debounce
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500">
                    {form.formState.errors?.country?.message}
                  </FormMessage >
                </FormItem>
              );
            }}
          />


          {/* City Field */}
          {firstTime === false && (
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => {
                const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

                return (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input className="border-2 border-gray-300"
                        placeholder="Enter city"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);

                          if (debounceTimeout.current) {
                            clearTimeout(debounceTimeout.current);
                          }

                          debounceTimeout.current = setTimeout(async () => {
                            if (e.target.value.trim() === "") {
                              form.setError("city", {
                                type: "manual",
                                message: "This field is required",
                              });
                              return;
                            }
                            console.log(e.target.value);

                            const validationResult = await validate(
                              e.target.value,
                              "city"
                            );
                            if (validationResult !== true) {
                              form.setError("city", {
                                type: "manual",
                                message: "This city does not exist",
                              });
                            }
                          }, 600); // 600 ms debounce
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500">
                      {form.formState.errors?.city?.message}
                    </FormMessage >
                  </FormItem>
                );
              }}
            />
          )}
          {/* Map Field */}
          {!firstTimeCity && (
            <>
              <p className="pt-2">Click on the meetup location on the map</p>
              <MapComponent
                key={"gagga"}
                lat={lat}
                lng={lng}
                shouldRender={!firstTimeCity}
                settings={{ purpose: "interactive", passData: updateUIonClick }}
              />
            </>
          )}
          {/* File Upload Field */}
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Image</FormLabel>
                <FormControl>
                  <Input className="border-2 border-gray-300"
                    type="file"
                    onChange={(e) => {
                      field.onChange(e.target.files);
                    }}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          {mutation.isError && (
            <p className="pt-3 text-red-500">There was an error from the server</p>
          )}
          {mutation.isSuccess && (
            <p className="pt-3">The event was created successfully!</p>
          )}
          <div className="pt-2"> </div>

          {/* Tags Field */}
          <p className="pb-2">Select up to 5 tags(optional)</p>
          <TagSelector selectedTags={selectedTags} tags={interestTags} onChange={setSelectedTags} maxSelection={5} />

          {/* Submit Button */}
          <Button disabled={mutation.isPending} type="submit" className="mt-6 bg-black text-white">
            {mutation.isPending ? "Creating..." : "Create Event"}
          </Button>
        </form>
      </Form>
    </div>
  )
};

export default CreateUserComp;
