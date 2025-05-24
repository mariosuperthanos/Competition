import Events from "../../../components/searchPage/Events";
import PaginationButtons from "../../../components/searchPage/Pagination";
import EventSearchForm from "../../../components/searchPage/Search";
import defaultData from "../../../library/searchEvents/defaultData";
export default async function SearchEventsPage() {
  const { events: dummy, existNextPage } = await defaultData();

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <EventSearchForm />
          <Events eventsArray={dummy} />
          <PaginationButtons nextServer={existNextPage} />
        </div>
      </div>
    </>
  );
}
