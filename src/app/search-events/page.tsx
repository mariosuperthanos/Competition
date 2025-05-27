import { redirect } from "next/navigation";
import Events from "../../../components/searchPage/Events";
import PaginationButtons from "../../../components/searchPage/Pagination";
import EventSearchForm from "../../../components/searchPage/Search";
import checkJWT from "../../../library/create-eventAPI/checkJWT";
import defaultData from "../../../library/searchEvents/defaultData";
export default async function SearchEventsPage() {
  try {
    await checkJWT();
  } catch (err) {
    return redirect("/auth/login");
  }

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
