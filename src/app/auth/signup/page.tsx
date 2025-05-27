import AuthForm from "../../../../components/auth/Auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SignInPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 md:p-10 ">
      <div className="w-full max-w-sm md:max-w-3xl">
        <AuthForm mode={"signUp"} />
      </div>
    </div>
  );
};

{/* <div className="flex justify-center items-center min-h-screen">
<Card className="max-w-sm w-full mx-4"> */}

export default SignInPage;
