import { cn } from "@/lib/utils"
import { useDispatch } from "react-redux" 
import { setStep, loginSetStep, SignupSetStep, resetFlow } from "../../features/shop/FlowContext";
import  Button  from "../ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "../ui/field"
import { Input } from "../ui/input"

export function SignupForm({
  className,
  ...props
}) {

  const dispatch = useDispatch(); 

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input id="name" type="text" placeholder="John Doe" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="PhoneNumber">Phone Number</FieldLabel>
                <Input id="PhoneNumber" type="tel" placeholder="080 123...." required />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" placeholder="olawale@example.com" required />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" type="password" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input id="confirm-password" type="password" required />
                  </Field>
                </Field>
                {/* <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription> */}
              </Field>
              <Field>
                <Button type="submit">Create Account</Button>
                <FieldDescription className="text-center">
                  Already have an account? <span className="underline text-green-800 cursor-pointer"  onClick={() => dispatch(loginSetStep("login"))}>Sign in</span>
                </FieldDescription>
              </Field>
              <Button
          type="button"
          className="w-full px-6 bg-white text-gray-600 font-medium hover:bg-gray-50 transition-colors my-2 hover:text-black"
          onClick={() => dispatch(resetFlow())}
        >
          Back
        </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      {/* <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription> */}
    </div>
  );
}
