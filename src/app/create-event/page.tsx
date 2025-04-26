import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CreateUserComp from "../../../components/createUserComp.tsx/createUserComp";
import checkJWT from "../../../library/create-eventAPI/checkJWT";

const CreateEventPage = async () => {
  try {
    await checkJWT();
  } catch (err) {
    return redirect("/auth/login");
  }

  return <CreateUserComp />;
};

export default CreateEventPage;
