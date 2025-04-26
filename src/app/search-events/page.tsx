import Events from "../../../components/searchPage/Events";
import EventSearchForm from "../../../components/searchPage/Search";
import defautlData from "../../../library/searchEvents/defaultData";

export default async function SearchEventsPage() {
  await defautlData();
  // default data for the events
  const dummy = [
    {
      title: "Python meeting",
      startHour: "April 25, 2025, 11:00 PM (CEST)",
      country: "France",
      city: "Paris",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      image:
        "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
    },
    {
      title: "JavaScript Conference",
      startHour: "May 2, 2025, 10:00 AM (CEST)",
      country: "Germany",
      city: "Berlin",
      description:
        "Join developers from around the world to talk about the future of JavaScript, frameworks, and tooling.",
      image:
        "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
    },
    {
      title: "DevOps Meetup",
      startHour: "May 10, 2025, 6:30 PM (CEST)",
      country: "Netherlands",
      city: "Amsterdam",
      description:
        "An event for engineers passionate about cloud, CI/CD, automation, and system reliability.",
      image:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=60",
    },
  ];
  return (
    <>
      <div className="flex flex-col space-y-4">
        <EventSearchForm />
        <Events eventsArray={dummy} />
      </div>
    </>
  );
}
