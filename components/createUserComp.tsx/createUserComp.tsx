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
import { useSession } from "next-auth/react";

let firstTime = true;
// if the country is not writted corect, then the county field wont be displayed
let firstTimeCity = true;

const CreateUserComp = () => {
  // form based on schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Python meeting",
      description: "gkdjfkgjdkgkdfnglsgklnsklgksgdg",
      date: undefined,
      startHour: "12:00 PM",
      finishHour: "12:00 PM",
      country: "Romania",
      city: "",
      map: false,
      lat: "40",
      lng: "26",
    },
  });

  // function that tells if the data from interactive map is OK
  // This function is getting passed into the MapComponent(it sends the data back)
  const updateUIonClick = (city: string, country: string) => {
    console.log(city, country);
    if (city !== undefined) {
      form.setValue("city", removeDiacritics(city));
      form.clearErrors(`city`);
      form.setValue("map", true);
    }
    form.setValue("country", removeDiacritics(country));
    form.clearErrors(`country`);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // it also verify JWT token
      const request = await axios.post(
        "http://localhost:3000/api/createEvent",
        values
      );

      if (request.status == 200) {
        console.log("success");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // funciton that validate text input from "country" and "county" fields
  const validate = async (value: string, mode: "country" | "city") => {
    try {
      const REQ_URL =
        mode === "country"
          ? `https://api.opencagedata.com/geocode/v1/json?q=${value.trim()}&key=1815f05342614d459cd09ea741dcfc58`
          : `https://api.opencagedata.com/geocode/v1/json?q=${value.trim()},${form.getValues(
              "country"
            )}&key=1815f05342614d459cd09ea741dcfc58`;

      const req = await axios.get(REQ_URL);
      const data =
        mode === "country"
          ? req.data?.results[0]?.components?.country
          : req.data?.results[0]?.components?.county;
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
          const lat2 = req.data.results[1].geometry.lat;
          const lng2 = req.data.results[1].geometry.lng;
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-md w-full bg-white p-6 rounded-lg shadow-md"
      >
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Field */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start Hour Field */}
        <FormField
          control={form.control}
          name="startHour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Hour</FormLabel>
              <FormControl>
                <TimePicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Finish Hour Field */}
        <FormField
          control={form.control}
          name="finishHour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Finish Hour</FormLabel>
              <FormControl>
                <TimePicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Country Field */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter country"
                  {...field}
                  onChange={async (e) => {
                    field.onChange(e);
                    if (e.target.value.trim() === "") {
                      form.setError("country", {
                        type: "manual",
                        message: "This field is required",
                      });
                      return;
                    }
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
                  }}
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors?.country?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        {/* City Field */}
        {firstTime === false && (
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter city"
                    {...field}
                    onChange={async (e) => {
                      field.onChange(e);
                      if (e.target.value.trim() === "") {
                        form.setError("city", {
                          type: "manual",
                          message: "This field is required",
                        });
                        return;
                      }
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
                    }}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors?.city?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        )}
        {/* Map Field */}
        <MapComponent
          key={"gagga"}
          lat={lat}
          lng={lng}
          shouldRender={!firstTimeCity}
          settings={{ purpose: "interactive", passData: updateUIonClick }}
        />

        {/* Submit Button */}
        <Button type="submit" style={{ marginTop: "55px" }}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default CreateUserComp;
