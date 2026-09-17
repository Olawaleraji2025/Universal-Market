import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  PackageSearch,
  X,
  Search,
  Phone,
  User,
  Wallet,
  ListChecks,
  Send,
  Loader2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { TbCurrencyNaira } from "react-icons/tb";
import { supabase } from "../../supabaseClient";
import { requestItemSchema } from "../../lib/zodSchemas";
import { selectCurrentUser, selectUserProfile } from "../../features/authSlice";

import Button from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { toast } from 'sonner';

// /**
//  * RequestModal
//  * ------------
//  * A custom, animated modal for requesting an item that the user could not
//  * find in the Shop / product list. It is self-contained and reusable
//  * anywhere (Homepage CTA, Shop, Product page).
//  *
//  * Form validation is handled by Zod via react-hook-form's zodResolver,
//  * so the form is validated right before it is sent to Supabase.
//  *
//  * Usage:
//  *   const [open, setOpen] = useState(false);
//  *   <RequestModal open={open} onClose={() => setOpen(false)} />
//  */

const SUGGESTED_ITEMS = [
  "iPhone",
  "Samsung Galaxy",
  "MacBook",
  "PS5",
  "AirPods",
  "Smart TV",
  "Refrigerator",
  "Washing Machine",
];

const CATEGORY_OPTIONS = [
  "Phones",
  "Laptops",
  "Gadgets",
  "Audio & Studio Equipment",
  "Home Appliances",
  "Real Estate",
  "Cars & Motorcycles",
  "Other",
];

const initialForm = {
  userName: "",
  ItemName: "",
  ItemCategory: "",
  ItemBudget: "",
  ItemDetails: "",
  UserPhoneNumber: "",
};

/**
 * Budget helpers
 * ---------------
 * We keep the *display* string (e.g. "50,000") in form state so users can type
 * commas comfortably, but always persist a clean numeric value to the database.
 */
const sanitizeBudgetInput = (value) => value.replace(/[^\d,]/g, "");
const parseBudgetToNumber = (value) => {
  if (value == null) return null;
  const cleaned = String(value).replace(/,/g, "").trim();
  if (!cleaned) return null;
  const num = Number(cleaned);
  return Number.isFinite(num) && num > 0 ? num : null;
};

export default function RequestModal({ open, onClose, initialItemName = "" }) {
  const currentUser = useSelector(selectCurrentUser);
  const userProfile = useSelector(selectUserProfile);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [submitError, setSubmitError] = useState("");
  const [requestId, setRequestId] = useState("");

  // react-hook-form + Zod schema validation.
  // Errors are shown after a submit attempt, but cleared live as the user edits.
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(requestItemSchema),
    defaultValues: {
      ...initialForm,
      userName:
        userProfile?.full_name ||
        currentUser?.user_metadata?.full_name ||
        currentUser?.user_metadata?.name ||
        "",
      ItemName: initialItemName || initialForm.ItemName,
      UserPhoneNumber:
        userProfile?.phone_number ||
        userProfile?.phone ||
        currentUser?.user_metadata?.phone_number ||
        currentUser?.user_metadata?.phone ||
        currentUser?.phone ||
        "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // Keep the ItemName in sync if a parent passes a new initialItemName
  useEffect(() => {
    if (!open) return;
    if (initialItemName && initialItemName.trim()) {
      setValue("ItemName", initialItemName, { shouldValidate: true, shouldDirty: true });
    }
  }, [initialItemName, open, setValue]);

  // Autofill name and contact if user is logged in
  useEffect(() => {
    if (!open) return;

    const currentName = getValues("userName");
    if (!currentName) {
      const autofillName =
        userProfile?.full_name ||
        currentUser?.user_metadata?.full_name ||
        currentUser?.user_metadata?.name ||
        "";
      if (autofillName) {
        setValue("userName", autofillName, { shouldValidate: true, shouldDirty: false });
      }
    }

    const currentPhone = getValues("UserPhoneNumber");
    if (!currentPhone) {
      const autofill =
        userProfile?.phone_number ||
        userProfile?.phone ||
        currentUser?.user_metadata?.phone_number ||
        currentUser?.user_metadata?.phone ||
        currentUser?.phone ||
        "";
      if (autofill) {
        setValue("UserPhoneNumber", autofill, { shouldValidate: true, shouldDirty: false });
      }
    }
  }, [open, currentUser, userProfile, getValues, setValue]);

  const form = watch();

  const getRequestUserName = async () => {
    if (!currentUser?.id) {
      return {
        userName: "Guest",
        userPhoneNumber: "",
        UserPhoneNumber: "",
        toString() {
          return this.userName;
        },
      };
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone_number")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (error) throw error;

      const userName =
        data?.full_name ||
        userProfile?.full_name ||
        currentUser?.user_metadata?.full_name ||
        currentUser?.user_metadata?.name ||
        currentUser?.email?.split("@")[0] ||
        "Guest";

      const userPhoneNumber =
        data?.phone_number ||
        userProfile?.phone_number ||
        userProfile?.phone ||
        currentUser?.user_metadata?.phone_number ||
        currentUser?.user_metadata?.phone ||
        currentUser?.phone ||
        "";

      return {
        userName,
        userPhoneNumber,
        UserPhoneNumber: userPhoneNumber,
        toString() {
          return this.userName;
        },
      };
    } catch {
      const userName =
        userProfile?.full_name ||
        currentUser?.user_metadata?.full_name ||
        currentUser?.user_metadata?.name ||
        currentUser?.email?.split("@")[0] ||
        "Guest";

      const userPhoneNumber =
        userProfile?.phone_number ||
        userProfile?.phone ||
        currentUser?.user_metadata?.phone_number ||
        currentUser?.user_metadata?.phone ||
        currentUser?.phone ||
        "";

      return {
        userName,
        userPhoneNumber,
        UserPhoneNumber: userPhoneNumber,
        toString() {
          return this.userName;
        },
      };
    }
  };

  // Lock body scroll while the modal is open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Close on Escape key.
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // handleSubmit from react-hook-form runs zodResolver validation first.
  // If the data is invalid, it stops here and populates `errors`.
  const onSubmit = async (data) => {
    setSubmitError("");
    setRequestId(`UM-${Math.floor(100000 + Math.random() * 900000)}`);

    try {
      const { userName: fallbackUserName, userPhoneNumber, UserPhoneNumber } = await getRequestUserName();
      const submittedName = (
        data.userName ||
        fallbackUserName ||
        userProfile?.full_name ||
        currentUser?.user_metadata?.full_name ||
        currentUser?.user_metadata?.name ||
        "Guest"
      ).trim();

      const payload = {
        user_id: currentUser?.id || null,
        userName: submittedName || 'Guest',
        status: "pending",
        ReqType: "Custom Request",
        ItemName: (data.ItemName || data.itemName || "").trim(),
        UserPhoneNumber: (data.UserPhoneNumber || data.contact || userPhoneNumber || UserPhoneNumber || "").trim(),
        ItemDetails: (data.ItemDetails || data.details || "").trim(),
        // "450,000" -> 450000   |   "" -> null
        ItemBudget: parseBudgetToNumber(data.ItemBudget ?? data.budget),
        ItemCategory: data.ItemCategory || data.category || null,
      };

      const { error } = await supabase.from("All_Requests").insert([payload]);
      console.log("payload: ", payload);

      if (error) {
        // Graceful fallback so the demo still shows success even if the
        // table schema differs from the payload columns.
        toast.error("Failed to submit request. Please try again.");
        setStatus("idle");
        console.log({error})
      } else {
        toast.success("Request submitted successfully!");
        setStatus("success");
      }
    } catch (err) {
      toast.error("Failed to submit request. Please try again.");
      setStatus("idle");
    }
  };

  const resetAndClose = () => {
    reset(initialForm);
    setStatus("idle");
    setSubmitError("");
    onClose();
  };

  const handleStartOver = () => {
    reset(initialForm);
    setStatus("idle");
    setSubmitError("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[#01241a]/60 backdrop-blur-sm"
            onClick={resetAndClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Request an item"
            className="relative w-full max-w-lg max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-white/20"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
          >
            {/* ---------- Header ---------- */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#01241a] px-6 py-5 text-white">
              {/* decorative blobs */}
              <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-emerald-400/20 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-emerald-300/10 blur-2xl" />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
                    <PackageSearch className="size-6 text-emerald-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold leading-tight">Request an Item</h2>
                    <p className="text-xs text-emerald-100/80">
                      Can't find it? We'll source it for you.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={resetAndClose}
                  aria-label="Close request modal"
                  className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* ---------- Body ---------- */}
            <div className="max-h-[calc(90vh-80px)] overflow-y-auto px-6 py-5">
              {status === "success" ? (
                <SuccessView
                  form={form}
                  requestId={requestId}
                  onStartOver={handleStartOver}
                  onClose={resetAndClose}
                />
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  {/* Item Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="ItemName" className="flex items-center gap-1.5 text-sm font-semibold text-[#01241a]">
                      <Search className="size-4 text-[#064e3b]" />
                      Item Name
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="ItemName"
                      {...register("ItemName")}
                      placeholder="e.g. iPhone 14 Pro Max 256GB"
                      className="h-11 bg-white border-gray-200 focus:border-emerald-500"
                    />
                    {errors.ItemName && (
                      <p className="text-xs font-medium text-red-600">{errors.ItemName.message}</p>
                    )}
                  </div>

                  {/* Quick-pick chips */}
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_ITEMS.map((item) => {
                      const active =
                        form.ItemName?.trim().toLowerCase() === item.toLowerCase();
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            setValue("ItemName", item, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                            active
                              ? "border-[#064e3b] bg-[#064e3b] text-white"
                              : "border-gray-200 bg-white text-gray-600 hover:border-emerald-400 hover:text-[#064e3b]"
                          }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>

                  {/* Category + Budget */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="ItemCategory" className="flex items-center gap-1.5 text-sm font-semibold text-[#01241a]">
                        <ListChecks className="size-4 text-[#064e3b]" />
                        Category
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="ItemCategory"
                        {...register("ItemCategory")}
                        className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                      >
                        <option value="" disabled>
                          Select category
                        </option>
                        {CATEGORY_OPTIONS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      {errors.ItemCategory && (
                        <p className="text-xs font-medium text-red-600">{errors.ItemCategory.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="ItemBudget" className="flex items-center gap-1.5 text-sm font-semibold text-[#01241a]">
                        <Wallet className="size-4 text-[#064e3b]" />
                        Estimated Budget
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <TbCurrencyNaira className="size-4" />
                        </span>
                        <Input
                          id="ItemBudget"
                          {...register("ItemBudget")}
                          onChange={(e) =>
                            setValue(
                              "ItemBudget",
                              sanitizeBudgetInput(e.target.value),
                              { shouldValidate: true, shouldDirty: true }
                            )
                          }
                          onBlur={() => {
                            const current = String(getValues("ItemBudget") || "");
                            setValue(
                              "ItemBudget",
                              current
                                ? Number(current.replace(/,/g, "")).toLocaleString()
                                : "",
                              { shouldValidate: true, shouldDirty: true }
                            );
                          }}
                          placeholder="e.g. 450,000"
                          inputMode="numeric"
                          className="h-11 bg-white border-gray-200 pl-9 focus:border-emerald-500"
                        />
                      </div>
                      {errors.ItemBudget && (
                        <p className="text-xs font-medium text-red-600">{errors.ItemBudget.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5">
                    <label htmlFor="ItemDetails" className="flex items-center gap-1.5 text-sm font-semibold text-[#01241a]">
                      <Sparkles className="size-4 text-[#064e3b]" />
                      Item Details / Specs
                    </label>
                    <Textarea
                      id="ItemDetails"
                      {...register("ItemDetails")}
                      placeholder="Condition, model, quantity, preferred delivery, etc."
                      className="min-h-[90px] resize-none bg-white border-gray-200 focus:border-emerald-500"
                    />
                    {errors.ItemDetails && (
                      <p className="text-xs font-medium text-red-600">{errors.ItemDetails.message}</p>
                    )}
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="userName" className="flex items-center gap-1.5 text-sm font-semibold text-[#01241a]">
                      <User className="size-4 text-[#064e3b]" />
                      Full Name
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="userName"
                      {...register("userName")}
                      placeholder="e.g. Raji Olawale"
                      autoComplete="name"
                      className="h-11 bg-white border-gray-200 focus:border-emerald-500"
                    />
                    {errors.userName && (
                      <p className="text-xs font-medium text-red-600">{errors.userName.message}</p>
                    )}
                  </div>

                  {/* Contact */}
                  <div className="space-y-1.5">
                    <label htmlFor="UserPhoneNumber" className="flex items-center gap-1.5 text-sm font-semibold text-[#01241a]">
                      <Phone className="size-4 text-[#064e3b]" />
                      WhatsApp / Phone Number
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="UserPhoneNumber"
                      {...register("UserPhoneNumber")}
                      placeholder="e.g. 234 80 1234 5678"
                      inputMode="tel"
                      autoComplete="tel"
                      className="h-11 bg-white border-gray-200 focus:border-emerald-500"
                    />
                    {errors.UserPhoneNumber && (
                      <p className="text-xs font-medium text-red-600">{errors.UserPhoneNumber.message}</p>
                    )}
                  </div>

                  {submitError && (
                    <p className="text-sm font-medium text-red-600">{submitError}</p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 flex-1 border-gray-200 text-gray-600"
                      onClick={resetAndClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || status === "submitting"}
                      className="h-11 flex-[1.4] bg-[#064e3b] text-white hover:bg-emerald-900"
                    >
                      {(isSubmitting || status === "submitting") ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="size-4" />
                          Submit request
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-center text-xs text-gray-400">
                    We'll confirm availability on WhatsApp shortly.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Success view ---------- */
function SuccessView({ form, requestId, onStartOver, onClose }) {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated check */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
        className="flex size-20 items-center justify-center rounded-full bg-emerald-100 ring-8 ring-emerald-50"
      >
        <motion.svg
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="size-10 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </motion.svg>
      </motion.div>

      <h3 className="mt-5 text-xl font-bold text-[#01241a]">Request submitted!</h3>
      <p className="mt-1.5 max-w-xs text-sm text-gray-500">
        We've received your request for{" "}
        <span className="font-semibold text-[#01241a]">{form.ItemName || form.itemName || "your item"}</span>.
        Our team will reach out on WhatsApp shortly.
      </p>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 w-full rounded-2xl border border-gray-100 bg-gray-50 p-4 text-left"
      >
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CheckCircle2 className="size-4 text-emerald-600" />
          <span className="font-medium text-[#01241a]">Request ID:</span>
          <span className="font-mono text-emerald-700">{requestId}</span>
        </div>
        {form.userName && (
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <User className="size-4 text-emerald-600" />
            <span className="font-medium text-[#01241a]">Name:</span>
            <span>{form.userName}</span>
          </div>
        )}
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
          <Phone className="size-4 text-emerald-600" />
          <span className="font-medium text-[#01241a]">Contact:</span>
          <span>{form.UserPhoneNumber || form.contact}</span>
        </div>
      </motion.div>

      <div className="mt-6 flex w-full flex-col gap-3">
        <Button
          type="button"
          onClick={onStartOver}
          className="h-11 w-full bg-[#064e3b] text-white hover:bg-emerald-900"
        >
          <RefreshCw className="size-4" />
          Submit another request
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="h-11 w-full border-gray-200 text-gray-600"
        >
          Close
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </motion.div>
  );
}
