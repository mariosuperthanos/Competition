import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CreateUserComp from "../../../components/createUserComp.tsx/createUserComp";
import checkJWT from "../../../library/create-eventAPI/checkJWT";
import Image from "next/image";

const CreateEventPage = async () => {
  try {
    await checkJWT();
  } catch (err) {
    return redirect("/auth/login");
  }

  return (
    <div className="relative min-h-screen w-full bg-cover bg-center !bg-[url('/concert.jpg')] ">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 z-0"></div>
      <div className="relative z-10">
        <CreateUserComp />
      </div>
    </div>
  );
};

export default CreateEventPage;


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
