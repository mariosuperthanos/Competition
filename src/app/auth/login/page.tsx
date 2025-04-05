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
    <div className="flex justify-center items-center min-h-screen">
      <Card className="max-w-sm w-full mx-4">
        <AuthForm mode={"login"} />
      </Card>
    </div>
  );
};

export default LoginPage;
