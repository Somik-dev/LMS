import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLoadUserQuery } from "./features/api/authApi";
import { userLoggedIn } from "./features/authSlice";
import LoadingSpinner from "./components/LoadingSpinner";

const Custom = ({ children }) => {
  const dispatch = useDispatch();
  const { data, isLoading, isSuccess } = useLoadUserQuery();

  useEffect(() => {
    if (isSuccess && data?.user) {
      dispatch(userLoggedIn(data.user));
      localStorage.setItem("user", JSON.stringify(data.user)); // optional
    }
  }, [isSuccess, data, dispatch]);

  if (isLoading) return <LoadingSpinner />;

  return <>{children}</>;
};

export default Custom;
