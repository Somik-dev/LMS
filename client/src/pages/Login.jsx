import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "../features/authSlice";


const Login = () => {
  const dispatch = useDispatch();

  const [signUpInput, setsignUpInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginInput, setloginInput] = useState({ email: "", password: "" });

  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerisLoading,
      isSuccess: registerisSuccess,
    },
  ] = useRegisterUserMutation();
  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginisLoading,
      isSuccess: loginisSuccess,
    },
  ] = useLoginUserMutation();

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;

    if (type === "signup") {
      setsignUpInput({ ...signUpInput, [name]: value });
    } else {
      setloginInput({ ...loginInput, [name]: value });
    }
  };

  const navigate = useNavigate();

  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signUpInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;
    await action(inputData);
  };

  useEffect(() => {
    if (registerisSuccess && registerData) {
      toast.success(registerData.message || "Signup successful");
    }
    if (registerError) {
      toast.error(registerError?.data?.message || "Signup failed");
    }
    if (loginisSuccess && loginData) {
      toast.success(loginData.message || "Login successful");
    
      // ✅ Save to localStorage
      localStorage.setItem("user", JSON.stringify(loginData.user));
    
      // ✅ Update Redux state
      dispatch(userLoggedIn(loginData.user));
    
      navigate("/");
    }
    
    
    if (loginError) {
      toast.error(loginError?.data?.message || "Login failed");
    }
  }, [registerisSuccess, registerData, registerError, loginisSuccess, loginData, loginError,navigate]);
  

  return (
    <div className="flex items-center justify-center mt-20">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="Signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="Signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>
                Create a new account and signup when you are done
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  required={true}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  name="name"
                  value={signUpInput.name}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Email</Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  required={true}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  name="email"
                  value={signUpInput.email}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Password</Label>
                <Input
                  type="password"
                  required={true}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  name="password"
                  value={signUpInput.password}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleRegistration("signup")}
                disabled={registerisLoading}
              >
                {registerisLoading ? (
                  <>
                    {" "}
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "SignUp"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Login your password here . After signup,you will be logged in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="username">Email</Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  required={true}
                  onChange={(e) => changeInputHandler(e, "login")}
                  name="email"
                  value={loginInput.email}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Password</Label>
                <Input
                  type="password"
                  required={true}
                  onChange={(e) => changeInputHandler(e, "login")}
                  name="password"
                  value={loginInput.password}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleRegistration("login")}
                disabled={loginisLoading}
              >
                {loginisLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
