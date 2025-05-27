"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Tags } from "lucide-react";
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
import TagSelector from "../testFolder/tagsSelector";


const formSchema = z.object({
  eventName: z.string(),
  country: z.string(),
  city: z.string(),
  date: z.date(),
});

// GraphQL query
export const EVENTS_QUERY = `
  query GetEvents(
    $contains: String
    $city: String
    $country: String
    $date: String
    $tags: [String!]
    $page: Int
  ) {
    events(
      contains: $contains
      city: $city
      country: $country
      date: $date
      tags: $tags
      page: $page
    ) {
      id
      title
      city
      country
      startHour
      tags
      description
      slug
      timezone
    }
  }
`;



// Type for search parameters
interface SearchParams {
  contains: string;
  city: string;
  country: string;
  date: string;
  refresh?: boolean;
}

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
let searchParams = {
  contains: "",
  country: "",
  city: "",
  date: "",
  refresh: true
};

export default function EventSearchForm() {
  const [selectedTags, setSelectedTags] = useState([]);

  // Setup the query with the searchParams dependency
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      if (!searchParams) return { data: { events: [] } };

      const copy = {
        contains: searchParams.contains,
        city: searchParams.city,
        country: searchParams.country,
        date: searchParams.date,
        tags: selectedTags
      };
      useStore.setState({ searchCriteria: { copy } });
      useStore.setState({ tags: selectedTags });

      const result = await axios.post("http://localhost:3000/api/graphql", {
        query: EVENTS_QUERY,
        variables: copy,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (result.data.data === null) {
        throw new Error('No events were found with the provided criteria');
      }
      console.log("GraphQL result:", result); // Log the result for debugging
      const rawEvents = result.data.data.events;
      console.log("search events length", rawEvents.length)

      if (rawEvents.length === 11) {
        useStore.setState({ isNextPage: true })
      } else {
        useStore.setState({ isNextPage: false })
      }

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
    enabled: false,
    retry: false
  });
  console.log("use query error", error);

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
    searchParams = {
      contains: values.eventName,
      city: values.city,
      country: values.country,
      date: values.date !== "" ? values.date.toISOString() : "", // Toggle refresh to trigger re-fetch
    };
    refetch();
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
          <p className="">Select tags</p>
          <TagSelector selectedTags={selectedTags} tags={interestTags} onChange={setSelectedTags} maxSelection={24} />

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