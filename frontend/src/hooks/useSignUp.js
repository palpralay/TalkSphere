import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const useSignUp = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Account created successfully!");
      // Navigate to onboarding or home page
      navigate("/onboarding");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create account");
    },
  });

  return { isPending, error, signupMutation: mutate };
};
export default useSignUp;
