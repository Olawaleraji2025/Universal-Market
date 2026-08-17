import { useState } from "react";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import { Field, FieldLabel, FieldContent, FieldError } from "../../components/ui/field";
import Button from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { guestFormSchema } from "../../lib/zodSchemas";
import { setClickedProduct } from "../../features/productDetailsClicked";
import { supabase } from "../../supabaseClient";
import { resetFlow, SuccessSetStep } from "../../features/FlowSlice";
import { validate, errors, resetForm } from "../../Hooks/formValidation";
import { useParams } from "react-router-dom";
import useShopProducts from "../../Hooks/useShopProducts";
import { toast } from 'sonner';



export default function GuestForm() {
  const dispatch = useDispatch();


  // This state tracks any submission error messages to display to the user.
const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // This will get the selected product's ID from the URL parameters and fetch the product data.
   const { id } = useParams();
const { data: products = [] } = useShopProducts({
    staleTime: 5 * 60 * 1000,
});


    const clickedProduct = useSelector((state) => state.productDetailsClicked?.clickedProduct);
 const selectedProduct =
    clickedProduct?.id != null ? clickedProduct : products.find((p) => String(p.id) === String(id));

const rawPrice = selectedProduct?.ProductPrice != null ? selectedProduct.ProductPrice : null;

   // This will reset the form and refresh the page
    const handleContinueShopping = () => {
      dispatch(resetForm());
      dispatch(resetFlow());
    };
    
    // This will get the user inputs from the store
const guestFormState = useSelector((state) => state.guestForm);

// These are the form data and field errors from the Redux store
  const { formData = {}, errors: fieldErrors = {} } = guestFormState;

 // Updates the Redux form slice with the latest input values.
  // This is the function responsible for synchronizing form data into Redux.
  const updateField = (patch) => {
    const nextFormData = { ...formData, ...patch };
    dispatch(validate(nextFormData)); // This dispatch updates the Redux store with the new form data and triggers validation. 
  };

const onSubmit = async (values) => {
  setIsSubmitting(true);
  setSubmissionError("");

  if (!selectedProduct) {
    setSubmissionError("Product not found. Please try again.");
    setIsSubmitting(false);
    return;
  }

  dispatch(setClickedProduct(selectedProduct));

  // Validate exactly what we are about to submit
  const result = guestFormSchema.safeParse(values);


  // Step 2: If the Guard says "No!"
  if (!result.success) {
    const nextErrors = {};
    // Loop through mistakes and format them for your UI
    result.error.issues.forEach((issue) => {
      const field = issue.path[0];
      nextErrors[field] = [{ message: issue.message }];
    });
    
    dispatch(errors(nextErrors)); // Show errors in the UI
    setIsSubmitting(false);
    return;
  }

  // Step 3: If the Guard says "Yes!", send to Supabase
  const payload = {
    userName: values.fullName,
    userNumber: values.contact,
    userMessages: values.message ?? "",

    // Ensure the mapping matches your Supabase table expectations
    itemImage: selectedProduct?.ProductName ?? null,
    itemPrice: rawPrice ?? null,
    itemName: selectedProduct?.imageUrl ?? null,
  };

  const { error } = await supabase.from("UsersRequests").insert([payload]);


  if (error) {
    // setSubmissionError(error.message);
     toast.error("Failed to submit request. Please try again.");
  } else {
    dispatch(SuccessSetStep());
  }
  setIsSubmitting(false);
};


return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();

        onSubmit({
          fullName: formData.fullName ?? "",
          contact: formData.contact ?? "",
          message: formData.message ?? "",
          termsAccepted: !!formData.termsAccepted,
        });
      }}
    >

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

      <div className="space-y-2 flex">
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
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="w-1/2"
          onClick={handleContinueShopping}
        >
          Back
        </Button>
        <Button
          className="w-1/2 bg-[#064e3b] hover:bg-emerald-900 text-white"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit request"}
        </Button>
      </div>

      {submissionError ? (
        <p className="text-sm text-red-600">{submissionError}</p>
      ) : null}

      <p className="text-xs text-gray-500 leading-relaxed">
        By submitting, we’ll prepare your WhatsApp request details.
      </p>
    </form>
  );
}

