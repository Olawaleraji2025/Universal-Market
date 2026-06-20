import { useDispatch } from "react-redux";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldSeparator,
} from "../ui/field";
import Button from "../ui/button";
import { Input } from "../ui/input";

import { resetFlow } from "../../features/shop/FlowContext";

export default function LoginForm() {
  const dispatch = useDispatch();

  return (
    <form className="space-y-4">
      <div className="space-y-1 text-center">
        <h2 className="text-lg font-bold text-[#01241a]">Welcome Back</h2>
        <p className="text-sm text-gray-600">
          Login to save your products and track your requests.
        </p>
      </div>

      <div className="space-y-2">
        <Field>
          <FieldLabel className="text-sm font-semibold text-[#01241a]" htmlFor="email">
            Email address
          </FieldLabel>
          <FieldContent>
            <Input
              id="email"
              type="email"
              placeholder="e.g. olawale@gmail.com"
              autoComplete="email"
              className="bg-white"
            />
          </FieldContent>
        </Field>
      </div>

      <div className="space-y-2">
        <Field>
          <FieldLabel className="text-sm font-semibold text-[#01241a]" htmlFor="password">
            Password
          </FieldLabel>
          <FieldContent>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              className="bg-white"
            />
          </FieldContent>
        </Field>
      </div>

      <div className="block gap-3 items-center">
        <Button
          type="submit"
          className="w-full bg-[#064e3b] hover:bg-emerald-900 text-white"
        >
          Login
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
          type="submit"
          className="w-full px-6 py-3.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
        
          Create Account
        </Button>

        <FieldSeparator className="col-span-2" />

        <Button
          type="button"
          className="w-full px-6 py-3.5 bg-white text-gray-600 font-medium hover:bg-gray-50 transition-colors my-2 hover:text-black"
          onClick={() => dispatch(resetFlow())}
        >
          Back
        </Button>
      </div>
    </form>
  );
}

