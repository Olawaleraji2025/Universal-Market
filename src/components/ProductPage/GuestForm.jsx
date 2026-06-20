import { Textarea } from "../ui/textarea";
import { motion } from "framer-motion";
import { Checkbox } from "../ui/checkbox";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldTitle,
} from "../ui/field"
import Button from "../ui/button";
import { Input } from "../ui/input";
import {useDispatch, useSelector} from "react-redux";
import { setStep, resetFlow, SuccessSetStep} from "../../features/shop/FlowContext";

export default function GuestForm() {
const dispatch = useDispatch();
// const flowStep = useSelector((state) => state.flow.step);
// console.log("Current flow step:", flowStep);

return (
     <form className="space-y-4" onSubmit={(e) => {
      e.preventDefault();
    }}>
                  <div className="space-y-2">
                    <Field>
                      <FieldLabel className="text-sm font-semibold text-[#01241a]" htmlFor="fullName">
                        Full Name
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          id="fullName"
                          placeholder="e.g. Raji Olawale"
                          autoComplete="name"
                          className="bg-white"
                        />
                      </FieldContent>
                    </Field>
                  </div>

                  <div className="space-y-2">
                    <Field>
                      <FieldLabel className="text-sm font-semibold text-[#01241a]" htmlFor="contact">
                        WhatsApp or Phone number
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          id="contact"
                          inputMode="tel"
                          autoComplete="tel"
                          className="bg-white"
                          placeholder={`e.g. 234 80...`}
                        />
                      </FieldContent>
                    </Field>
                  </div>

                  <div className="space-y-2">
                    <Field>
                      <FieldLabel className="text-sm font-semibold text-[#01241a]" htmlFor="message">
                        Optional message
                      </FieldLabel>
                      <FieldContent>
                        <Textarea
                          id="message"
                          placeholder="Add any extra details (delivery, condition, etc.)"
                          className="min-h-[90px] resize-none bg-white"
                          
                        />
                      </FieldContent>
                    </Field>
                  </div>

                  <div className="space-y-2 flex ">
                    <Field orientation="horizontal">
        <Checkbox
          id="terms-checkbox"
          name="terms-checkbox"
        />
        <FieldLabel htmlFor="terms-checkbox">
          I agree to be contacted regarding this request.
        </FieldLabel>
      </Field>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-1/2"
                      onClick={() => dispatch(resetFlow())}
                    >
                      Back
                    </Button>
                    <Button
                      // type="submit"
                      className="w-1/2 bg-[#064e3b] hover:bg-emerald-900 text-white"
                      onClick={() => dispatch(SuccessSetStep("success"))}
                    >
                      Submit request
                    </Button>
                  </div>

        
                  <p className="text-xs text-gray-500 leading-relaxed">
                    By submitting, we’ll prepare your WhatsApp request details.
                  </p>
                </form>




)}