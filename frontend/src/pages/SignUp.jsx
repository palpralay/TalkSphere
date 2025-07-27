import React, { useState } from "react";
import { MessageSquareHeart } from "lucide-react";
import { Link } from "react-router"; 
import useSignUp from "../hooks/useSignUp.js";
import toast from "react-hot-toast";
const SignUp = () => {
  const [signupData, setSignupData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { isPending, error, signupMutation } = useSignUp();

  const handleSignUp = (e) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!signupData.fullname.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    
    if (!signupData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    
    if (!signupData.password.trim()) {
      toast.error("Please enter a password");
      return;
    }
    
    if (signupData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (!acceptedTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    
    signupMutation(signupData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 relative overflow-hidden"
      data-theme="forest"
    >
      {/* Floating background shapes */}
      <div className="absolute w-72 h-72 bg-primary/20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-secondary/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

      <div className="border border-primary/25 backdrop-blur-lg flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Section - Form */}
        <div className="w-full lg:w-1/2 p-8 flex flex-col">
          {/* Logo */}
          <div className="mb-6 flex items-center gap-2">
            <MessageSquareHeart className="size-9 text-primary animate-bounce" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
              TalkSphere
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error shadow-lg mb-4">
              <p>{error?.response?.data?.message || "An error occurred during signup"}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold">Create an account</h2>
              <p className="text-sm opacity-70">
                Join TalkSphere and start your language learning journey!
              </p>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="input input-bordered w-full focus:ring-2 focus:ring-primary transition-all duration-200"
                value={signupData.fullname}
                onChange={(e) =>
                  setSignupData({ ...signupData, fullname: e.target.value })
                }
                required
                minLength={2}
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full focus:ring-2 focus:ring-primary transition-all duration-200"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered w-full focus:ring-2 focus:ring-primary transition-all duration-200"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
                required
                minLength={6}
              />
              <p className="text-sm opacity-70 mt-1">
                Must be at least 6 characters long.
              </p>
            </div>

            <div className="form-control w-full">
              <label className="label cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    required
                  />
                  <span className="label-text text-sm">
                    I agree to the{" "}
                    <a href="#" className="link link-primary">
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="link link-primary">
                      Privacy Policy
                    </a>
                  </span>
                </div>
              </label>
            </div>

            <button 
              type="submit"
              className="btn btn-primary w-full rounded-xl shadow-md hover:scale-[1.02] transition-transform duration-200"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Signing Up...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <p className="text-sm opacity-70 text-center">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Log In
              </Link>
            </p>
          </form>
        </div>

        {/* Right Section - Illustration */}
      <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-primary/5 to-secondary/5 items-center justify-center">
  <div className="max-w-md p-5 text-center flex flex-col gap-6">
    <img
      src="/signup.svg"
      alt="Signup illustration"
      className="w-full h-auto drop-shadow-lg animate-float"
    />
    <div>
      <h2 className="text-xl font-semibold">
        Connect with language partners worldwide
      </h2>
      <p className="opacity-70">
        Practice conversations, make friends, and improve your skills
      </p>
    </div>
  </div>
</div>

      </div>
    </div>
  );
};

export default SignUp;