import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { setStep, loginSetStep} from "../../features/shop/FlowContext";

import { MessageCircle, User, Check, Star, ArrowRight } from "lucide-react";
import { TbCurrencyNaira } from "react-icons/tb";
import { IoCloseCircleOutline } from "react-icons/io5";

import GuestForm from "./GuestForm";
import LoginForm from "./LoginForm";
import {SignupForm} from "./signup-form"
import { SuccessPage } from "./SuccessPage";

const guestBenefits = [
  "Quick Request",
  "No Sign-Up Required",
  "Instant WhatsApp Contact",
];

const accountBenefits = [
  "Save Favorites",
  "Track Request History",
  "Faster Future Requests",
];

export default function RequestModal({ open, onClose }) {
  const clickedProduct = useSelector(
    (state) => state.productDetailsClicked?.clickedProduct
  );
  const flowStep = useSelector((state) => state.flow.step);
  const dispatch = useDispatch();

const showImage = flowStep === "chooser" || flowStep === "guest" || flowStep === "login" || flowStep === "signup";

  if (!open) return null;


  return (
    <div className="fixed inset-0 z-50" aria-hidden={false}>
      <div className="absolute inset-[-3] bg-black/50" />

      <div className="relative min-h-full flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Request product"
            className="w-full max-w-lg bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden overflow-y-scroll max-h-140"
            >
            {showImage && (
            <div>

            <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-4">
              <div>
                {/* <h2 className="text-lg font-bold text-[#01241a]">Request Item</h2> */}
                <p className="text-lg font-bold text-[#01241a] text-center">
                  Complete your request.
                </p>
              </div>
              <IoCloseCircleOutline size={24} onClick={onClose} />
            </div>

            

            <div>
              <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100"
            >
              <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm">
                <img
                  src={clickedProduct?.imageUrl}
                  alt={clickedProduct?.ProductName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                  {clickedProduct?.ProductCategory}
                </p>
                <h3 className="text-sm font-semibold text-gray-900 leading-snug truncate pr-2">
                  {clickedProduct?.ProductName}
                </h3>
              </div>

              <div className="flex-shrink-0 text-right">
                <p className="text-lg font-bold text-gray-900 flex items-center">
                  <TbCurrencyNaira />
                  {clickedProduct?.ProductPrice?.toLocaleString?.()}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">Pre-owned</p>
              </div>
            </motion.div>
            </div>
            </div>

        )}

              {flowStep === "guest" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="mt-1 p-4"
                >
                  <GuestForm />
                </motion.div>
              )}

              {flowStep === "login" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="mt-1 p-4"
                >
                  <LoginForm />
                </motion.div>
              )}

              {flowStep === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="mt-1 p-4"
                >
                  <SuccessPage />
                </motion.div>
              )}

              {flowStep === "signup" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="mt-1 p-4"
                >
                  <SignupForm />
                </motion.div>
              )}

              {flowStep === "chooser" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1 p-4 scroll-auto"
                >
                  <motion.div>
                    <button
                      onClick={() => dispatch(setStep("guest"))}
                      className="group relative w-full text-left rounded-2xl border-2 border-emerald-700 bg-emerald-50 p-5 shadow-sm hover:shadow-md hover:border-emerald-700 hover:bg-emerald-100/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
                    >
                      <span className="absolute -top-3 left-4 inline-flex items-center gap-1 bg-emerald-700 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-sm">
                        <Star className="w-3 h-3 fill-white" />
                        Recommended
                      </span>

                      <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center mb-3 mt-1 shadow-sm group-hover:scale-105 transition-transform duration-200">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>

                      <h4 className="text-base font-bold text-gray-900 mb-1">
                        Continue as Guest
                      </h4>
                      <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                        No account required. Submit your request and continue on WhatsApp.
                      </p>

                      <ul className="space-y-1.5 mb-5">
                        {guestBenefits.map((b) => (
                          <li
                            key={b}
                            className="flex items-center gap-2 text-sm text-emerald-800 font-medium"
                          >
                            <span className="w-4 h-4 rounded-full bg-emerald-700/20 flex items-center justify-center flex-shrink-0">
                              <Check className="w-2.5 h-2.5 text-emerald-700 stroke-[3]" />
                            </span>
                            {b}
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-center justify-between w-full bg-emerald-700 group-hover:bg-emerald-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors duration-150">
                        <span>Continue as Guest</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
                      </div>
                    </button>
                  </motion.div>

                  <motion.div>
                    <button
                      onClick={() => dispatch(loginSetStep("login"))}
                      className="group w-full text-left rounded-2xl border-2 border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-3 mt-1 group-hover:bg-gray-200 transition-colors duration-200">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>

                      <h4 className="text-base font-bold text-gray-900 mb-1">
                        Login or Create Account
                      </h4>
                      <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                        Save products, track requests, and enjoy a faster experience next time.
                      </p>

                      <ul className="space-y-1.5 mb-5">
                        {accountBenefits.map((b) => (
                          <li
                            key={b}
                            className="flex items-center gap-2 text-sm text-gray-600 font-medium"
                          >
                            <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <Check className="w-2.5 h-2.5 text-gray-500 stroke-[3]" />
                            </span>
                            {b}
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-center justify-between w-full border-2 border-gray-200 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors duration-150 group-hover:border-gray-300 group-hover:bg-gray-50">
                        <span>Login / Register</span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform duration-150" />
                      </div>
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
      </div>
  );
}

