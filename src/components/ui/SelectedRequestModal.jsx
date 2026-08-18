import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Trash2, MessageCircle, User, Check, ArrowRight } from 'lucide-react';
import { TbCurrencyNaira } from 'react-icons/tb';
import { toast } from 'sonner';
import Button from './button';
import { Textarea } from './textarea';
import { Input } from './input';
import { Checkbox } from './checkbox';
import { guestFormSchema } from '../../lib/zodSchemas';
import { supabase } from '../../supabaseClient';
import { buildWhatsAppUrl, WHATSAPP_NUMBER } from '../../lib/whatsappConfig';

const guestBenefits = [
  'Quick Request',
  'No Sign-Up Required',
  'Instant WhatsApp Contact',
];

const accountBenefits = [
  'Save Favorites',
  'Track Request History',
  'Faster Future Requests',
];

export default function SelectedRequestModal({ open, onClose, selectedProducts = [], onRemoveItem, onConfirm }) {
  const [message, setMessage] = useState('');
  const [step, setStep] = useState('summary');
  const [guestForm, setGuestForm] = useState({ fullName: '', contact: '', termsAccepted: false });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedProducts, setSubmittedProducts] = useState([]);

  useEffect(() => {
    if (!open) {
      setMessage('');
      setGuestForm({ fullName: '', contact: '', termsAccepted: false });
      setFormErrors({});
      setIsSubmitting(false);
      setSubmittedProducts([]);
      setStep('summary');
    }
  }, [open]);

  const total = selectedProducts.reduce((s, p) => s + Number(p.ProductPrice || p.price || 0), 0);

  const handleGuestContinue = (event) => {
    event?.stopPropagation?.();
    setStep('guestForm');
  };

  const handleLoginContinue = (event) => {
    event?.stopPropagation?.();
    onConfirm({ message, mode: 'login' });
    setStep('summary');
  };

  const handleGuestSubmit = async (event) => {
    event.preventDefault();

    const parsed = guestFormSchema.safeParse({
      fullName: guestForm.fullName,
      contact: guestForm.contact,
      message,
      termsAccepted: guestForm.termsAccepted,
    });

    if (!parsed.success) {
      const nextErrors = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] ?? 'form';
        nextErrors[field] = issue.message;
      });
      setFormErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const snapshot = [...selectedProducts];
      const payload = snapshot.map((product) => ({
        userName: parsed.data.fullName,
        userNumber: parsed.data.contact,
        userMessages: parsed.data.message || message || '',
        itemImage: product.imageUrl || product.ImageUrl || product.ProductName || '',
        itemPrice: Number(product.ProductPrice || product.price || 0),
        itemName: product.ProductName || product.name || 'Selected item',
      }));

      const { error } = await supabase.from('UsersRequests').insert(payload);

      if (error) throw error;

      setSubmittedProducts(snapshot);

      onConfirm({
        mode: 'guest',
        message: parsed.data.message || message,
        contact: parsed.data.contact,
        fullName: parsed.data.fullName,
        selectedProducts: snapshot,
      });

      setGuestForm({ fullName: '', contact: '', termsAccepted: false });
      setFormErrors({});
      setStep('success');
    } catch (error) {
      toast.error(error?.message || 'Unable to submit your request right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueWhatsApp = () => {
    const productNames = (submittedProducts.length ? submittedProducts : selectedProducts)
      .map((product) => product.ProductName || product.name)
      .filter(Boolean)
      .join(', ');

    const messageText = `Hello Universal Market, I have submitted a wishlist request for: ${productNames || 'selected items'}. Please confirm availability and next steps.`;
    const url = buildWhatsAppUrl(WHATSAPP_NUMBER, messageText);

    if (!url) {
      toast.error('WhatsApp number is not configured yet.');
      return;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-end justify-center md:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="absolute inset-0 bg-black/50" onClick={onClose} />

          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-2xl rounded-t-2xl bg-white p-4 shadow-2xl md:rounded-3xl md:p-6"
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 40 }}
            onClick={(event) => event.stopPropagation()}
          >
            {step === 'summary' ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#01241a]">Request summary</h3>
                  <button onClick={onClose} aria-label="Close" className="rounded p-1 text-gray-600 hover:bg-gray-100">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
                  {selectedProducts.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 rounded-lg border border-gray-100 p-2">
                      <img src={p.imageUrl || p.ImageUrl} alt={p.ProductName || p.name} className="h-12 w-12 shrink-0 rounded-md object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-[#01241a]">{p.ProductName || p.name}</div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                          <span className="flex items-center font-semibold text-[#01241a]"><TbCurrencyNaira />{Number(p.ProductPrice || p.price || 0).toLocaleString()}</span>
                          <span className="text-gray-300">•</span>
                          <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">{p.ProductStatus || 'Good'}</span>
                        </div>
                      </div>

                      <button onClick={() => onRemoveItem(p.id)} aria-label={`Remove ${p.ProductName || p.name}`} className="rounded p-2 text-red-500 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">Optional message</label>
                  <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Add an optional message for this request (e.g. preferred color, condition)" />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-600">Total: <span className="font-semibold text-[#01241a]">₦{Number(total).toLocaleString()}</span></div>
                  <div className="flex items-center gap-3">
                    <Button type="button" variant="outline" onClick={onClose} className="h-10 border-gray-200 text-gray-600">Cancel</Button>
                    <Button type="button" onClick={() => setStep('authChoice')} className="h-10 bg-[#064e3b] text-white">Continue</Button>
                  </div>
                </div>
              </>
            ) : step === 'success' ? (
              <div className="space-y-6 p-2 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Check className="h-8 w-8" strokeWidth={3} />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-[#01241a]">Request submitted successfully</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    We've received your request. Continue on WhatsApp to discuss availability and purchase.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    type="button"
                    onClick={handleContinueWhatsApp}
                    className="h-11 w-full bg-[#25D366] text-white hover:bg-[#1fb75d]"
                  >
                    Continue on WhatsApp
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="h-11 w-full border-gray-200 text-gray-700"
                  >
                    Back to wishlist
                  </Button>
                </div>
              </div>
            ) : step === 'guestForm' ? (
              <form onSubmit={handleGuestSubmit} className="space-y-4 p-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#01241a]">Guest request details</h3>
                    <p className="text-sm text-gray-500">Complete the form below to send your request.</p>
                  </div>
                  <button type="button" onClick={onClose} aria-label="Close" className="rounded p-1 text-gray-600 hover:bg-gray-100">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <Input
                    value={guestForm.fullName}
                    onChange={(event) => setGuestForm((current) => ({ ...current, fullName: event.target.value }))}
                    placeholder="e.g. John Doe"
                    className="bg-white"
                  />
                  {formErrors.fullName && <p className="text-sm text-red-600">{formErrors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">WhatsApp or phone number</label>
                  <Input
                    value={guestForm.contact}
                    onChange={(event) => setGuestForm((current) => ({ ...current, contact: event.target.value }))}
                    placeholder="e.g. 234 800 000 0000"
                    className="bg-white"
                  />
                  {formErrors.contact && <p className="text-sm text-red-600">{formErrors.contact}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Optional message</label>
                  <Textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Tell us about the item you want, condition, or preferred delivery details."
                    className="min-h-[100px] bg-white"
                  />
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <Checkbox
                    checked={guestForm.termsAccepted}
                    onCheckedChange={(checked) => setGuestForm((current) => ({ ...current, termsAccepted: !!checked }))}
                  />
                  <label className="text-sm text-gray-700">I agree to be contacted regarding this request.</label>
                </div>
                {formErrors.termsAccepted && <p className="text-sm text-red-600">{formErrors.termsAccepted}</p>}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setStep('authChoice')} className="h-10 border-gray-200 text-gray-600">Back</Button>
                  <Button type="submit" disabled={isSubmitting} className="h-10 bg-[#064e3b] text-white">
                    {isSubmitting ? 'Submitting...' : 'Submit request'}
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-[#01241a]">Choose how to continue</p>
                    <p className="text-sm text-gray-500">Sign in or continue without an account.</p>
                  </div>
                  <button onClick={onClose} aria-label="Close" className="rounded p-1 text-gray-600 hover:bg-gray-100">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleGuestContinue}
                    className="group relative w-full text-left rounded-2xl border-2 border-emerald-700 bg-emerald-50 p-5 shadow-sm hover:shadow-md transition-all"
                  >
                    <span className="absolute -top-3 left-4 inline-flex items-center gap-1 bg-emerald-700 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-sm">
                      <Check className="w-3 h-3 fill-white" />
                      Recommended
                    </span>

                    <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center mb-3 mt-1 shadow-sm">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>

                    <h4 className="text-base font-bold text-gray-900 mb-1">Continue as Guest</h4>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">No account required. Submit your request and continue on WhatsApp.</p>

                    <ul className="space-y-1.5 mb-5">
                      {guestBenefits.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-sm text-emerald-800 font-medium">
                          <span className="w-4 h-4 rounded-full bg-emerald-700/20 flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 text-emerald-700 stroke-3" />
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between w-full bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl">
                      <span>Continue as Guest</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleLoginContinue}
                    className="group w-full text-left rounded-2xl border-2 border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-3 mt-1 group-hover:bg-gray-200 transition-colors duration-200">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>

                    <h4 className="text-base font-bold text-gray-900 mb-1">Login / Register</h4>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">Save products, track requests, and enjoy a faster experience next time.</p>

                    <ul className="space-y-1.5 mb-5">
                      {accountBenefits.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                          <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 text-gray-500 stroke-3" />
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between w-full border-2 border-gray-200 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl group-hover:border-gray-300 group-hover:bg-gray-50">
                      <span>Login / Register</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
