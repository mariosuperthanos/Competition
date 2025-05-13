"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import useStore from "../../zustand/store";
import getImageUrl from "../../library/searchEvents/getS3Image";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import removeDiacritics from "../../library/converters/removeDiacritics";
import axios from "axios";


const formSchema = z.object({
  eventName: z.string(),
  country: z.string(),
  city: z.string(),
  date: z.date(),
});

// GraphQL query
const EVENTS_QUERY = `
  query GetEvents($contains: String, $city: String, $country: String, $date: String) {
    events(contains: $contains, city: $city, country: $country, date: $date) {
      id
      title
      city
      country
      startHour
    }
  }
`;

// Type for search parameters
interface SearchParams {
  contains: string;
  city: string;
  country: string;
  date: string | string;
  refresh?: boolean; // Optional property to trigger a refresh
}

let firstTime = true;

export default function EventSearchForm() {
  // State to store search parameters
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  // Setup the query with the searchParams dependency
  const { data, isLoading, error } = useQuery({
    queryKey: ['events', searchParams],
    queryFn: async () => {
      if (!searchParams) return { data: { events: [] } };

      const copy = {
        contains: searchParams.contains,
        city: searchParams.city,
        country: searchParams.country,
        date: searchParams.date  // Ignore date for now as mentioned in your code
      };

      const response = await fetch("http://localhost:3000/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: EVENTS_QUERY,
          variables: copy,
        }),
      });


      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      if (!result.data) {
        throw new Error("No events found with the provided criteria.");
      }
      console.log("GraphQL result:", result); // Log the result for debugging
      const rawEvents = result.data.events;

      const events = await Promise.all(
        rawEvents.map(async (event) => {
          // const image = await getImageUrl(event.title);
          const image = 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg'
          return {
            ...event,
            image,
          };
        })
      );
      useStore.setState({ events });
      console.log("GraphQL response:", result.data.events); // Log the response for debugging
      return result;  // Return result only once
    },
    enabled: !!searchParams, // Only run when searchParams exists
  });

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      eventName: "",
      country: "",
      city: "",
      date: "",
    },
  });

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
      form.clearErrors(mode);
      // compare the country/county from API with the input field
      if (cleanedText.toLowerCase() === value.toLowerCase()) {
        if (mode === "country") {
          firstTime = false;
        }

        return true;
      }
    } catch (err) {
      return false;
    }
  };


  function onSubmit(values: z.infer<typeof formSchema>) {
    // Update search parameters to trigger the query
    setSearchParams((prev) => ({
      contains: values.eventName,
      city: values.city,
      country: values.country,
      date: values.date !== "" ? values.date.toISOString() : "",
      refresh: !prev?.refresh, // Toggle refresh to trigger re-fetch
    }));
  }

  // Access events data
  const events = data?.data?.events || [];

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md sm:w-full mb-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <FormField
            control={form.control}
            name="eventName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter event name or keyword" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                          console.log(e.target.value);
                          const validationResult = await validate(
                            e.target.value,
                            "country",

                          );
                          if (validationResult !== true && e.target.value !== "") {
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
                            console.log(e.target.value);
                            const validationResult = await validate(
                              e.target.value,
                              "city",
                            );
                            if (validationResult !== true && e.target.value !== "") {
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
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue) => {
                          const dateValue = newValue ? newValue.toDate() : null;
                          field.onChange(dateValue);
                        }}
                        slotProps={{
                          textField: {
                            className: "w-full sm:w-60",
                            error: !!form.formState.errors.date,
                            helperText: form.formState.errors.date?.message,
                          }
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-black text-white hover:bg-black/80 transition-colors duration-200 ease-in-out"
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </form>
      </Form>

      {/* Display results */}
      {error && (
        <div className="mt-6 p-4 border border-red-300 bg-red-50 text-red-700 rounded">
          {error.toString()}
        </div>
      )}

      {/* {searchParams && events.length === 0 && !isLoading && !error && (
        <div className="mt-6 p-4 border border-gray-200 bg-gray-50 rounded">
          No events found with the provided criteria.
        </div>
      )} */}
    </div>
  );
}  