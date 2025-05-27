"use server"

import { redirect } from "next/navigation";
import TagSelectorPageComp from "../../../components/TagSelector"
import checkJWT from "../../../library/create-eventAPI/checkJWT";

export default async function TagSelector() {
  try {
    await checkJWT();
  } catch (err) {
    return redirect("/auth/login");
  }
  return (
    <TagSelectorPageComp />
  )
}
