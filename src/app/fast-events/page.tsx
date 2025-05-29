import { redirect } from "next/navigation";
import Events from "../../../components/searchPage/Events";
import PaginationButtons from "../../../components/searchPage/Pagination";
import EventSearchForm from "../../../components/searchPage/Search";
import checkJWT from "../../../library/create-eventAPI/checkJWT";
import defaultData from "../../../library/searchEvents/defaultData";
import { get } from "http";
import { fetchFilteredEvents } from "../../../library/searchEvents/searchQuery";
import { Filter, Grid3X3, List, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SearchPage2 from "../../../components/searchPage/SearchPage";
import getUpcomingEventsWithinRange from "../../../library/getFastEventsData/getFastEventData";
import { cookies } from "next/headers";
import CreativeFastEventPage from "../../../components/fastPage/FastPage";

const popularTags = ["Technology", "Music", "Art", "Business", "Sports"]

export default async function FastEvents({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  try {
    await checkJWT();
  } catch (err) {
    return redirect("/auth/login");
  }
  const cookieStore = await cookies()
  const timezone1 = cookieStore.get('timezoneData');
  // console.log("timezone1", timezone1);
  const parsedData = JSON.parse(timezone1?.value!);
  const userCountry = parsedData.data.country;
  const userCity = parsedData.data.city;

  let events, existNextPagePagination;
  const filtersRaw = await searchParams;
  console.log("filtersRaw", filtersRaw);
  if (!filtersRaw.timeRange) {
    events = await getUpcomingEventsWithinRange(userCity, userCountry, 8);
  } else {
    events = await getUpcomingEventsWithinRange(userCity, userCountry, +filtersRaw.timeRange);
  }
  console.log("fast events", events);

  return (
    <>
      <CreativeFastEventPage events={events} selectedRange={filtersRaw?.timeRange || 2} />
    </>
  );
}
