import Image from "next/image";
import checkJWT from "../../library/create-eventAPI/checkJWT";
import { redirect } from "next/navigation";
import getTags from "../../library/getUserData.ts/getTags";
import ModalTags from "../../components/home/ModalTags";
import HomePage from "../../components/home/HomePage";
import defaultData from "../../library/searchEvents/defaultData";


export default async function Home() {
  let userId: string | undefined;
  let tags: any;
  let events: any[];

  try {
    userId = await checkJWT();
    tags = await getTags(userId);
  } catch (err) {
    return redirect("/auth/login");
  }
  const data = await defaultData(tags);
  events = data.events;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <HomePage categories={tags} events={events} defaultTag={"all"} />
    </div>
  );
}
