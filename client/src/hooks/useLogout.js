import { useDispatch } from "react-redux";
import { userLoggedOut } from "../features/authSlice";
import { toast } from "sonner";
import { persistor } from "../app/store";
import { useLogoutUserMutation } from "../features/api/authApi";

const useLogout = () => {
  const dispatch = useDispatch();
  const [logoutUser] = useLogoutUserMutation();

  const logout = async () => {
    try {
      // 1️⃣ Tell server to clear cookie
      await logoutUser().unwrap();

      // 2️⃣ Clear redux state immediately
      dispatch(userLoggedOut());

      // 3️⃣ Clear persisted redux store
      await persistor.purge();

      // 4️⃣ Clear RTK Query cache & redirect via full reload
      toast.success("Logged out successfully");
      window.location.href = "/login"; // ⬅ required for RTK Query

    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  return logout;
};

export default useLogout;






