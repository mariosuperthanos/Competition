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
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10 bg-gray-100">
      <div className="w-full max-w-sm md:max-w-3xl">
        <AuthForm mode={"login"} />
      </div>
    </div>
  );
};

export default LoginPage;
