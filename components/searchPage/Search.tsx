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
import { useState } from "react";
import useStore from "../../zustand/store";
import getImageUrl from "../../library/searchEvents/getS3Image";

const formSchema = z.object({
  eventName: z.string().min(2, {
    message: "Event name must be at least 2 characters.",
  }),
  country: z.string().min(1, {
    message: "Please select a country.",
  }),
  city: z.string().min(1, {
    message: "Please enter a city.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
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
  date: string;
  refresh?: boolean; // Optional property to trigger a refresh
}

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
        date: ""  // Ignore date for now as mentioned in your code
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
      const rawEvents = result.data.events;

      const events = await Promise.all(
        rawEvents.map(async (event) => {
          const image = await getImageUrl(event.title); 
          // const image = 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg'
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
      date: new Date(),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Update search parameters to trigger the query
    setSearchParams((prev) => ({
      contains: values.eventName,
      city: values.city,
      country: values.country,
      date: values.date.toISOString(),
      refresh: !prev?.refresh, // Toggle refresh to trigger re-fetch
    }));
  }

  // Access events data
  const events = data?.data?.events || [];

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="eventName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter event name or keyword" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Enter country name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Enter city name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
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
          Error loading events: {error.toString()}
        </div>
      )}

      {searchParams && events.length === 0 && !isLoading && !error && (
        <div className="mt-6 p-4 border border-gray-200 bg-gray-50 rounded">
          No events found with the provided criteria.
        </div>
      )}
    </div>
  );
}