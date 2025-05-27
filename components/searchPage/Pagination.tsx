"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import useStore from "../../zustand/store"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { EVENTS_QUERY } from "./Search"

interface PaginationButtonsProps {
  initialPage?: number
  onPageChange?: (page: number) => void
}

let maxPage = -1;
let isFirstRender = true;
export default function PaginationButtons({ nextServer, initialPage = 1, onPageChange }: PaginationButtonsProps) {
  const nextPage = useStore((state) => state.isNextPage)
  const [currentPage, setCurrentPage] = useState(initialPage);
  console.log("currentPage is", currentPage);

  const searchCriteria = useStore((state) => state.searchCriteria);
  const tags = useStore((state) => state.tags);
  console.log(searchCriteria);
  console.log("maxPage", maxPage)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['events', currentPage],
    queryFn: async () => {
      useStore.setState({ events: null });
      const copy = {
        contains: searchCriteria?.copy?.contains || "",
        city: searchCriteria?.copy?.city || "",
        country: searchCriteria?.copy?.country || "",
        date: searchCriteria?.copy?.date || "",
        page: currentPage,
        tags
      };
      console.log("tastasrtra", copy)
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
      console.log("GraphQL result:", result.data); // Log the result for debugging
      const rawEvents = result.data.events;
      if (rawEvents.length <= 10) {
        useStore.setState({ isNextPage: false })
        maxPage = currentPage;
      }
      console.log("rawEvents", rawEvents)
      const events = await Promise.all(
        rawEvents.slice(0, 10).map(async (event) => {
          // const image = await getImageUrl(event.title);
          const image = 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg'
          return {
            ...event,
            image,
          };
        })
      );
      console.log("events", events)
      useStore.setState({ events });
      console.log("GraphQL response:", result.data.events); // Log the response for debugging
      return result;  // Return result only once
    },
    enabled: false,
  });

  useEffect(() => {
    if (isFirstRender) {
      isFirstRender = false;
      return;
    }

    const fetchData = async () => {
      await refetch();
    };

    fetchData();
  }, [currentPage]);
  useEffect(() => {
    setCurrentPage(1);

  }, [searchCriteria, tags]);

  useEffect(() => {
    useStore.setState({ isNextPage: nextServer });
  }, [nextServer])

  const handlePrevious = async () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0 })
    }
  };

  const handleNext = async () => {
    setCurrentPage(prev => prev + 1);
    window.scrollTo({ top: 0 })
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-2">
      {currentPage > 1 && (
        <button
          onClick={handlePrevious}
          className="flex items-center justify-center p-2 rounded-md border border-gray-300 hover:bg-gray-50 bg-gray-100"
          aria-label="Previous page"
          disabled={isLoading}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      <button
        className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 bg-gray-100 font-medium"
        aria-current="page"
        aria-label={`Page ${currentPage}`}
      >
        {currentPage}
      </button>

      {(nextPage || (maxPage !== -1 && currentPage < maxPage)) && (
        <button
          onClick={handleNext}
          className="flex items-center justify-center p-2 rounded-md border border-gray-300 hover:bg-gray-50 bg-gray-100"
          aria-label="Next page"
          disabled={isLoading}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}