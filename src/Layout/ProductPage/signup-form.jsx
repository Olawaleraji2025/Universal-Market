import { useState } from "react";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { loginSetStep, resetFlow } from "../../features/FlowSlice";
import Button from "../../components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "../../components/ui/field";
import { Input } from "../../components/ui/input";
import { signupSchema } from "../../lib/zodSchemas";
import { supabase } from "../../supabaseClient";
import { toast } from "sonner";

export function SignupForm({
  className,
  showBackButton = true,
  onSwitchToLogin,
  onSuccess,
  ...props
}) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupError, setSignupError] = useState("");

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

  const handleSwitchToLogin = (e) => {
    e?.preventDefault();
    if (onSwitchToLogin) {
      onSwitchToLogin();
    } else {
      dispatch(loginSetStep("login"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError("");

    // 1. Zod Validation (validates fields and checks password === confirmPassword)
    const result = signupSchema.safeParse(formData);
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
      // 2. Supabase Auth Sign Up with metadata in options.data for database trigger
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name.trim(),
            phone_number: formData.phone_number.trim(),
          },
        },
      });

      if (error) {
        setSignupError(error.message);
        toast.error(error.message || "Failed to create account.");
        return;
      }

      if (data?.session) {
        toast.success("Account created and logged in successfully!");
      } else {
        toast.success(
          "Account created! Please check your email to confirm your account."
        );
      }

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      console.error("Signup error:", err);
      const errMsg = err?.message || "An unexpected error occurred.";
      setSignupError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div className="space-y-1 text-center">
        <h2 className="text-lg font-bold text-[#01241a]">Create your account</h2>
        <p className="text-sm text-gray-600">
          Enter your details below to create your account
        </p>
      </div>

      {signupError && (
        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {signupError}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <FieldGroup>
          <Field>
            <FieldLabel
              htmlFor="full_name"
              className="text-sm font-semibold text-[#01241a]"
            >
              Full Name
            </FieldLabel>
            <Input
              id="full_name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              required
              className="bg-white"
              value={formData.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
              disabled={isSubmitting}
            />
            <FieldError errors={fieldErrors.full_name} />
          </Field>

          <Field>
            <FieldLabel
              htmlFor="phone_number"
              className="text-sm font-semibold text-[#01241a]"
            >
              Phone Number
            </FieldLabel>
            <Input
              id="phone_number"
              type="tel"
              placeholder="080 123...."
              autoComplete="tel"
              required
              className="bg-white"
              value={formData.phone_number}
              onChange={(e) => handleChange("phone_number", e.target.value)}
              disabled={isSubmitting}
            />
            <FieldError errors={fieldErrors.phone_number} />
          </Field>

          <Field>
            <FieldLabel
              htmlFor="email"
              className="text-sm font-semibold text-[#01241a]"
            >
              Email
            </FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="olawale@example.com"
              autoComplete="email"
              required
              className="bg-white"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={isSubmitting}
            />
            <FieldError errors={fieldErrors.email} />
          </Field>

          <Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel
                  htmlFor="password"
                  className="text-sm font-semibold text-[#01241a]"
                >
                  Password
                </FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Min 6 characters"
                  required
                  className="bg-white"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  disabled={isSubmitting}
                />
                <FieldError errors={fieldErrors.password} />
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold text-[#01241a]"
                >
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat password"
                  required
                  className="bg-white"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  disabled={isSubmitting}
                />
                <FieldError errors={fieldErrors.confirmPassword} />
              </Field>
            </div>
          </Field>

          <Field>
            <Button
              type="submit"
              className="w-full bg-[#064e3b] hover:bg-emerald-900 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
            <FieldDescription className="text-center mt-3 text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                className="underline text-green-800 font-semibold cursor-pointer hover:text-green-950 inline p-0 bg-transparent border-none"
                onClick={handleSwitchToLogin}
                disabled={isSubmitting}
              >
                Sign in
              </button>
            </FieldDescription>
          </Field>

          {showBackButton && (
            <Button
              type="button"
              className="w-full px-6 py-3.5 bg-white text-gray-600 font-medium hover:bg-gray-50 transition-colors my-2 hover:text-black"
              onClick={() => dispatch(resetFlow())}
              disabled={isSubmitting}
            >
              Back
            </Button>
          )}
        </FieldGroup>
      </form>
    </div>
  );
}
