"use server"

import dynamic from 'next/dynamic';
// import EventSearchForm from "./Search"
import PaginationButtons from "./Pagination"
import Events from "./Events"
import Header from "./Header"
const EventSearchForm = dynamic(() => import('./Search'));
// const PaginationButtons = dynamic(() => import('./Pagination'));
// const Events = dynamic(() => import('./Events'));
// const Header = dynamic(() => import('./Header'));

const popularTags = ["Technology", "Music", "Art", "Business", "Sports"]

const SearchPage2 = ({ events, existNext }) => {
  return (
    <div className="w-full h-[1000px] bg-gradient-to-r from-blue-800/20 to-blue-300/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300/20 to-cyan-600/20" />
        <div className="relative container mx-auto px-4 py-16">
          <Header />
          <EventSearchForm />
          <Events eventsArray={events} />
          <PaginationButtons nextServer={existNext} />
        </div>
      </div>
    </div>
  );
}

export default SearchPage2;