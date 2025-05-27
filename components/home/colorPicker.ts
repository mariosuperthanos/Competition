const getColorForTag = (tag: string) => {
  switch (tag) {
    case "Cycling":
      return "bg-green-100 text-green-800";
    case "Music":
      return "bg-purple-100 text-purple-800";
    case "Reading":
      return "bg-yellow-100 text-yellow-800";
    case "Fitness":
      return "bg-red-100 text-red-800";
    case "Art":
      return "bg-pink-100 text-pink-800";
    case "Networking":
      return "bg-blue-100 text-blue-800";
    case "Technology":
      return "bg-indigo-100 text-indigo-800";
    case "Gaming":
      return "bg-orange-100 text-orange-800";
    case "Photography":
      return "bg-teal-100 text-teal-800";
    case "Cooking":
      return "bg-lime-100 text-lime-800";
    case "Volunteering":
      return "bg-amber-100 text-amber-800";
    case "Dance":
      return "bg-rose-100 text-rose-800";
    case "Outdoor":
      return "bg-emerald-100 text-emerald-800";
    case "Startup":
      return "bg-cyan-100 text-cyan-800";
    case "Workshop":
      return "bg-sky-100 text-sky-800";
    case "Meditation":
      return "bg-fuchsia-100 text-fuchsia-800";
    case "Hiking":
      return "bg-lime-100 text-lime-800";
    case "Coding":
      return "bg-zinc-100 text-zinc-800";
    case "Film":
      return "bg-neutral-100 text-neutral-800";
    case "Theater":
      return "bg-stone-100 text-stone-800";
    case "Language Exchange":
      return "bg-violet-100 text-violet-800";
    case "Travel":
      return "bg-yellow-200 text-yellow-900";
    case "Food Tasting":
      return "bg-orange-200 text-orange-900";
    case "Debate":
      return "bg-red-200 text-red-900";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default getColorForTag;