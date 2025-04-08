import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CreateUserComp from "../../../components/createUserComp.tsx/createUserComp";

const CreateEventPage = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);

  if (!session) {
    return redirect("/auth/login");
  }

  return <CreateUserComp />;
};

export default CreateEventPage;
