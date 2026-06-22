import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldLabel, FieldContent, FieldError } from "../ui/field";
import Button from "../ui/button";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";

import { resetFlow, SuccessSetStep } from "../../features/shop/FlowContext";
import { validateGuestForm } from "../../Hooks/FormValidatorZod";
import { validate, errors, resetForm } from "../../features/shop/formValidation";


export default function GuestForm() {
  const dispatch = useDispatch();
  const guestFormState = useSelector((state) => state.guestForm);
  const { formData = {}, errors: fieldErrors = {} } = guestFormState;
  

  const updateField = (patch) => {
    // Store all form values in Redux slice
    dispatch(validate({ ...formData, ...patch }));
  };

   const handleContinueShopping = () => {
    dispatch(resetForm());
    dispatch(resetFlow());
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const result = validateGuestForm(formData);


    if (!result.valid) {
      dispatch(errors(result.errors));
      return;
    } 
    dispatch(errors({}));
    // TODO: call API to save form submission using result.data
    dispatch(SuccessSetStep());

  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Field>
          <FieldLabel
            className="text-sm font-semibold text-[#01241a]"
            htmlFor="fullName"
          >
            Full Name
          </FieldLabel>
          <FieldContent>
            <Input
              id="fullName"
              placeholder="e.g. Raji Olawale"
              autoComplete="name"
              className="bg-white"
              value={formData.fullName ?? ""}
              onChange={(e) => updateField({ fullName: e.target.value })}
            />
            <FieldError errors={fieldErrors.fullName} />
          </FieldContent>
        </Field>
      </div>

      <div className="space-y-2">
        <Field>
          <FieldLabel
            className="text-sm font-semibold text-[#01241a]"
            htmlFor="contact"
          >
            WhatsApp or Phone number
          </FieldLabel>
          <FieldContent>
            <Input
              id="contact"
              inputMode="tel"
              autoComplete="tel"
              className="bg-white"
              placeholder={`e.g. 234 80...`}
              value={formData.contact ?? ""}
              onChange={(e) => updateField({ contact: e.target.value })}
            />
            <FieldError errors={fieldErrors.contact} />
          </FieldContent>
        </Field>
      </div>

      <div className="space-y-2">
        <Field>
          <FieldLabel
            className="text-sm font-semibold text-[#01241a]"
            htmlFor="message"
          >
            Optional message
          </FieldLabel>
          <FieldContent>
            <Textarea
              id="message"
              placeholder="Add any extra details (delivery, condition, etc.)"
              className="min-h-[90px] resize-none bg-white"
              value={formData.message ?? ""}
              onChange={(e) => updateField({ message: e.target.value })}
            />
            <FieldError errors={fieldErrors.message} />
          </FieldContent>
        </Field>
      </div>

      {/* <div className="space-y-2 flex">
        <Field orientation="horizontal">
          <Checkbox
            id="terms-checkbox"
            name="terms-checkbox"
            checked={!!formData.termsAccepted}
            onCheckedChange={(checked) =>
              updateField({ termsAccepted: !!checked })
            }
          />
          <FieldLabel htmlFor="terms-checkbox">
            I agree to be contacted regarding this request.
          </FieldLabel>
        </Field>
      </div>
        <div>
          <FieldError errors={fieldErrors.termsAccepted} />

        </div> */}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="w-1/2"
          onClick={() => handleContinueShopping()}
        >
          Back
        </Button>
        <Button
          className="w-1/2 bg-[#064e3b] hover:bg-emerald-900 text-white"
          type="submit"
        >
          Submit request
        </Button>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed">
        By submitting, we’ll prepare your WhatsApp request details.
      </p>
    </form>
  );
}

