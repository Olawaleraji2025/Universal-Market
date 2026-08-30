import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
  FieldSeparator,
} from "../../components/ui/field";
import Button from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { resetFlow, SignupSetStep } from "../../features/FlowSlice";
import { loginSchema } from "../../lib/zodSchemas";
import { supabase } from "../../supabaseClient";
import { toast } from "sonner";

export default function LoginForm({
  showBackButton = true,
  onSwitchToSignup,
  onSuccess,
}) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSwitchToSignup = (e) => {
    e?.preventDefault();
    if (onSwitchToSignup) {
      onSwitchToSignup();
    } else {
      dispatch(SignupSetStep("signup"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");

    // 1. Zod Validation
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const formatted = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        formatted[field] = [{ message: issue.message }];
      });
      setFieldErrors(formatted);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      // 2. Supabase Auth Sign In
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        setAuthError("Failed to sign in. Please try again.");
        toast.error(error.message || "Failed to sign in. Please try again.");
        return;
      }

      toast.success("Welcome back! Logged in successfully.");
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      console.error("Login error:", err);
      const errMsg = err?.message || "An unexpected error occurred.";
      setAuthError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="space-y-1 text-center">
        <h2 className="text-lg font-bold text-[#01241a]">Welcome Back</h2>
        <p className="text-sm text-gray-600">
          Login to save your products and track your requests.
        </p>
      </div>

      {authError && (
        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {authError}
        </div>
      )}

      <div className="space-y-2">
        <Field>
          <FieldLabel
            className="text-sm font-semibold text-[#01241a]"
            htmlFor="email"
          >
            Email address
          </FieldLabel>
          <FieldContent>
            <Input
              id="email"
              type="email"
              placeholder="e.g. olawale@gmail.com"
              autoComplete="email"
              className="bg-white"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={isSubmitting}
            />
            <FieldError errors={fieldErrors.email} />
          </FieldContent>
        </Field>
      </div>

      <div className="space-y-2">
        <Field>
          <FieldLabel
            className="text-sm font-semibold text-[#01241a]"
            htmlFor="password"
          >
            Password
          </FieldLabel>
          <FieldContent>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              className="bg-white"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              disabled={isSubmitting}
            />
            <FieldError errors={fieldErrors.password} />
          </FieldContent>
        </Field>
      </div>

      <div className="block gap-3 items-center">
        <Button
          type="submit"
          className="w-full bg-[#064e3b] hover:bg-emerald-900 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">OR</span>
          </div>
        </div>

        <Button
          type="button"
          className="w-full px-6 py-3.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          onClick={handleSwitchToSignup}
          disabled={isSubmitting}
        >
          Create Account
        </Button>

        {showBackButton && (
          <>
            <FieldSeparator className="col-span-2 my-2" />

            <Button
              type="button"
              className="w-full px-6 py-3.5 bg-white text-gray-600 font-medium hover:bg-gray-50 transition-colors my-2 hover:text-black"
              onClick={() => dispatch(resetFlow())}
              disabled={isSubmitting}
            >
              Back
            </Button>
          </>
        )}
      </div>
    </form>
  );
}
