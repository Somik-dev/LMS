import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { School, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DarkMode } from "@/DarkMode";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogin = () => navigate("/login");

  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-gray-800 border-gray-200 fixed top-0 left-0 right-0 z-10">
      {/* Desktop */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center h-full px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <School size={30} />
          <Link to="/">
            <h1 className="font-extrabold text-2xl">E-Learning</h1>
          </Link>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-6">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/My-Learning">My Learning</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/Profile">Edit Profile</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  Log out
                </DropdownMenuItem>
                {user?.role === "instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleLogin}>
                Login
              </Button>
              <Button onClick={handleLogin}>SignUp</Button>
            </div>
          )}

          <DarkMode />
        </div>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-2xl">E-Learning</h1>
        <MobileNavbar user={user} logout={logout} />
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = ({ user, logout }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="rounded-full bg-gray-200">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex flex-col text-center">
        <SheetHeader className="flex flex-row items-center justify-between mt-3">
          <SheetTitle>E-Learning</SheetTitle>
          <DarkMode />
        </SheetHeader>

        <nav className="flex flex-col space-y-4 mt-6 text-base">
          {user ? (
            <>
              <Link to="/My-Learning">My Learning</Link>
              <Link to="/Profile">Edit Profile</Link>
              <span onClick={logout} className="cursor-pointer text-red-500">
                Log Out
              </span>
              {user?.role === "instructor" && (
                <SheetFooter className="mt-auto mb-4">
                  <SheetClose asChild>
                    <Link to="/admin/dashboard">
                      <Button type="button">Dashboard</Button>
                    </Link>
                  </SheetClose>
                </SheetFooter>
              )}
            </>
          ) : (
            <div className="flex flex-col space-y-3">
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/login">SignUp</Link>
              </Button>
            </div>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
