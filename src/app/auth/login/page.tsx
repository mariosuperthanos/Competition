import AuthForm from "../../../../components/auth/Auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const LoginPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-sm md:max-w-3xl">
        <AuthForm mode={"login"} />
      </div>
    </div>
  );
};

export default LoginPage;
