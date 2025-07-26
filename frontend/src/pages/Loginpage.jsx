import { useState } from "react";
import { MessageSquareHeart } from "lucide-react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-primary/5 via-base-200 to-secondary/10 relative overflow-hidden"
      data-theme="forest"
    >
      {/* Floating Background Effects */}
      <div className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-secondary/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

      <div className="border border-primary/20 backdrop-blur-lg flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100/80 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* LOGIN FORM */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center">
          {/* Logo */}
          <div className="mb-6 flex items-center gap-2">
            <MessageSquareHeart className="size-9 text-primary animate-bounce" />
            <span className="text-3xl font-extrabold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent animate-text">
              TalkSphere
            </span>
          </div>

          {/* Error message */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response?.data?.message || "Login failed. Try again."}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold">Welcome Back</h2>
              <p className="text-sm text-gray-500">
                Sign in to continue your language learning journey
              </p>
            </div>

            {/* Email */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full focus:ring-2 focus:ring-primary transition-all duration-200"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>

            {/* Password */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered w-full focus:ring-2 focus:ring-primary transition-all duration-200"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-full rounded-xl shadow-md hover:scale-[1.02] transition-transform duration-200"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Redirect */}
            <p className="text-sm text-center text-gray-600">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-primary font-medium hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </div>

        {/* IMAGE SIDE */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-primary/5 to-secondary/5 items-center justify-center">
          <div className="max-w-md p-8 text-center">
            <img
              src="/login.svg"
              alt="Language connection illustration"
              className="w-full h-auto animate-fadeIn"
            />
            <h2 className="text-xl font-semibold mt-6">
              Connect with language partners worldwide
            </h2>
            <p className="opacity-70">
              Practice conversations, make friends, and improve your skills together
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
