import { redirect } from "next/navigation";
import Events from "../../../components/searchPage/Events";
import PaginationButtons from "../../../components/searchPage/Pagination";
import EventSearchForm from "../../../components/searchPage/Search";
import checkJWT from "../../../library/create-eventAPI/checkJWT";
import defaultData from "../../../library/searchEvents/defaultData";
import { get } from "http";
import { fetchFilteredEvents } from "../../../library/searchEvents/searchQuery";
import EventCard from "../../../components/searchPage/EventCard";
import { Filter, Grid3X3, List, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SearchPage2 from "../../../components/searchPage/SearchPage";

const popularTags = ["Technology", "Music", "Art", "Business", "Sports"]

export default async function SearchEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  try {
    await checkJWT();
  } catch (err) {
    return redirect("/auth/login");
  }
  let events, existNextPagePagination;
  const filtersRaw = await searchParams;
  const filters = Array.isArray(filtersRaw.tags) ? filtersRaw : { ...filtersRaw, tags: filtersRaw.tags ? [filtersRaw.tags] : [] };
  console.log("filters", filters);
  if (Object.keys(filters).length === 0 || (Object.keys(filters).length === 1 && filters.tags && filters.tags.length === 0)) {
    console.log("No filters provided, using default data");
    const { events: dummy, existNextPage } = await defaultData();
    events = dummy;
    existNextPagePagination = existNextPage;
  } else {
    console.log("Filters provided, fetching filtered events");
    const unfilteredEvents = await fetchFilteredEvents(filters);
    events = unfilteredEvents.slice(0, 9);
    existNextPagePagination = unfilteredEvents.length > 9;
    console.log("events", events);
  }


  return (
    <>
      <SearchPage2 events={events} existNext={existNextPagePagination} />
    </>
  );
}
