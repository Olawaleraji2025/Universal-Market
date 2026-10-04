import React, { useState } from 'react';
import {
  X,
  Play,
  RotateCcw,
  Smartphone,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Eye,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProductDemo({ isOpen, onClose }) {
  const [deviceFrame, setDeviceFrame] = useState('laptop'); // 'laptop' (1280px) | 'mobile' (390px)
  const [activeTab, setActiveTab] = useState('flows'); // 'flows' | 'states'
  const [activeFlow, setActiveFlow] = useState('add'); // 'add' | 'toggle' | 'delete'
  const [flowStep, setFlowStep] = useState(1);

  // States preview selector
  const [activeState, setActiveState] = useState('skeleton');

  // Simulated state for interactive prototype
  const [mockTvStatus, setMockTvStatus] = useState('In Stock');
  const [mockList, setMockList] = useState([
    {
      id: 'demo-1',
      name: 'LG 55" Smart TV 4K OLED',
      category: 'TVs',
      price: 420000,
      status: 'In Stock',
      condition: 'New',
      cover: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=300',
    },
    {
      id: 'demo-2',
      name: 'iPhone 13 Pro 256GB Graphite',
      category: 'Phones',
      price: 650000,
      status: 'In Stock',
      condition: 'Used',
      cover: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=300',
    },
    {
      id: 'demo-3',
      name: 'Hisense Refrigerator Double Door',
      category: 'Refrigerators',
      price: 380000,
      status: 'In Stock',
      condition: 'New',
      cover: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=300',
    },
    {
      id: 'demo-4',
      name: 'PS5 Slim Disc Edition',
      category: 'Gaming Consoles',
      price: 520000,
      status: 'In Stock',
      condition: 'New',
      cover: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=300',
    },
  ]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Interactive Admin Products Prototype"
    >
      <div className="bg-[#f8fafc] w-full max-w-7xl h-[95vh] rounded-[18px] border border-[#e2e8f0] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Prototype Master Top Bar */}
        <div className="bg-[#064e3b] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">
                Universal Market • Admin Products Prototype
              </h2>
              <p className="text-[11px] text-emerald-200">
                1280px Laptop & 390px Mobile viewports • Complete Section 4 Flows & Section 5 States
              </p>
            </div>
          </div>

          {/* Device switcher & tabs */}
          <div className="flex items-center gap-2">
            <div className="bg-emerald-950/60 p-1 rounded-[10px] flex items-center gap-1 border border-emerald-800">
              <button
                type="button"
                onClick={() => setDeviceFrame('laptop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold transition ${
                  deviceFrame === 'laptop'
                    ? 'bg-[#047857] text-white shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>Laptop (1280px)</span>
              </button>

              <button
                type="button"
                onClick={() => setDeviceFrame('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold transition ${
                  deviceFrame === 'mobile'
                    ? 'bg-[#047857] text-white shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (390px)</span>
              </button>
            </div>

            <div className="bg-emerald-950/60 p-1 rounded-[10px] flex items-center gap-1 border border-emerald-800">
              <button
                type="button"
                onClick={() => setActiveTab('flows')}
                className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition ${
                  activeTab === 'flows'
                    ? 'bg-emerald-700 text-white'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                Flows A-B-C
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('states')}
                className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition ${
                  activeTab === 'states'
                    ? 'bg-emerald-700 text-white'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                Screen 5 States
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-900 transition ml-2"
              aria-label="Close prototype"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Prototype Main Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#e2e8f0]/40">
          {/* Left Guide / Steps Controller (300px) */}
          <div className="w-full md:w-80 bg-white border-b md:border-b-0 md:border-r border-[#e2e8f0] p-4 flex flex-col overflow-y-auto shrink-0">
            {activeTab === 'flows' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#475569]">
                    Interactive Flows
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setFlowStep(1);
                      setMockTvStatus('In Stock');
                      toast.info('Prototype reset');
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#047857] hover:underline"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveFlow('add');
                      setFlowStep(1);
                    }}
                    className={`py-1.5 text-xs font-semibold rounded-[8px] transition ${
                      activeFlow === 'add'
                        ? 'bg-white text-[#01241a] shadow-xs'
                        : 'text-[#475569] hover:text-[#01241a]'
                    }`}
                  >
                    A. Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveFlow('toggle');
                      setFlowStep(1);
                    }}
                    className={`py-1.5 text-xs font-semibold rounded-[8px] transition ${
                      activeFlow === 'toggle'
                        ? 'bg-white text-[#01241a] shadow-xs'
                        : 'text-[#475569] hover:text-[#01241a]'
                    }`}
                  >
                    B. Toggle
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveFlow('delete');
                      setFlowStep(1);
                    }}
                    className={`py-1.5 text-xs font-semibold rounded-[8px] transition ${
                      activeFlow === 'delete'
                        ? 'bg-white text-[#01241a] shadow-xs'
                        : 'text-[#475569] hover:text-[#01241a]'
                    }`}
                  >
                    C. Delete
                  </button>
                </div>

                {/* Steps Details */}
                {activeFlow === 'add' && (
                  <div className="space-y-2.5 text-xs">
                    <p className="font-bold text-[#01241a]">Flow A: Add a product</p>
                    <div className="space-y-2">
                      <div
                        onClick={() => setFlowStep(1)}
                        className={`p-2.5 rounded-[8px] border cursor-pointer transition ${
                          flowStep === 1
                            ? 'bg-[#ecfdf5] border-[#047857] text-[#064e3b]'
                            : 'bg-white border-[#e2e8f0]'
                        }`}
                      >
                        1. Products list with "+ Add product"
                      </div>
                      <div
                        onClick={() => setFlowStep(2)}
                        className={`p-2.5 rounded-[8px] border cursor-pointer transition ${
                          flowStep === 2
                            ? 'bg-[#ecfdf5] border-[#047857] text-[#064e3b]'
                            : 'bg-white border-[#e2e8f0]'
                        }`}
                      >
                        2. Fill Name, Category, Price, Condition
                      </div>
                      <div
                        onClick={() => setFlowStep(3)}
                        className={`p-2.5 rounded-[8px] border cursor-pointer transition ${
                          flowStep === 3
                            ? 'bg-[#ecfdf5] border-[#047857] text-[#064e3b]'
                            : 'bg-white border-[#e2e8f0]'
                        }`}
                      >
                        3. Add 3 photos with progress & Cover tag
                      </div>
                      <div
                        onClick={() => setFlowStep(4)}
                        className={`p-2.5 rounded-[8px] border cursor-pointer transition ${
                          flowStep === 4
                            ? 'bg-[#ecfdf5] border-[#047857] text-[#064e3b]'
                            : 'bg-white border-[#e2e8f0]'
                        }`}
                      >
                        4. Add 2 specification rows (Storage, Colour)
                      </div>
                      <div
                        onClick={() => setFlowStep(5)}
                        className={`p-2.5 rounded-[8px] border cursor-pointer transition ${
                          flowStep === 5
                            ? 'bg-[#ecfdf5] border-[#047857] text-[#064e3b]'
                            : 'bg-white border-[#e2e8f0]'
                        }`}
                      >
                        5. Save product (Spinner on button)
                      </div>
                      <div
                        onClick={() => setFlowStep(6)}
                        className={`p-2.5 rounded-[8px] border cursor-pointer transition ${
                          flowStep === 6
                            ? 'bg-[#ecfdf5] border-[#047857] text-[#064e3b]'
                            : 'bg-white border-[#e2e8f0]'
                        }`}
                      >
                        6. Return to list with toast "Product added"
                      </div>
                    </div>
                  </div>
                )}

                {activeFlow === 'toggle' && (
                  <div className="space-y-2.5 text-xs">
                    <p className="font-bold text-[#01241a]">Flow B: Mark out of stock</p>
                    <p className="text-[#475569]">
                      Flip the availability switch on LG 55" Smart TV. It updates immediately with badge and undo toast.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const next = mockTvStatus === 'In Stock' ? 'Out of Stock' : 'In Stock';
                        setMockTvStatus(next);
                        toast(
                          `LG 55" Smart TV marked as ${next.toLowerCase()}`,
                          {
                            action: {
                              label: 'Undo',
                              onClick: () =>
                                setMockTvStatus(
                                  next === 'In Stock' ? 'Out of Stock' : 'In Stock'
                                ),
                            },
                          }
                        );
                      }}
                      className="w-full min-h-[40px] px-3 rounded-[8px] bg-[#047857] text-white font-semibold text-center hover:bg-[#064e3b]"
                    >
                      Trigger Switch ({mockTvStatus === 'In Stock' ? 'Mark Out of Stock' : 'Mark In Stock'})
                    </button>
                  </div>
                )}

                {activeFlow === 'delete' && (
                  <div className="space-y-2.5 text-xs">
                    <p className="font-bold text-[#01241a]">Flow C: Delete Product</p>
                    <p className="text-[#475569]">
                      Opens confirmation dialog with gentle alternative "Mark as out of stock instead".
                    </p>
                    <div className="space-y-2">
                      <div
                        onClick={() => setFlowStep(1)}
                        className={`p-2.5 rounded-[8px] border cursor-pointer ${
                          flowStep === 1 ? 'bg-[#ecfdf5] border-[#047857]' : 'bg-white border-[#e2e8f0]'
                        }`}
                      >
                        1. Admin clicks Delete on LG 55" Smart TV
                      </div>
                      <div
                        onClick={() => setFlowStep(2)}
                        className={`p-2.5 rounded-[8px] border cursor-pointer ${
                          flowStep === 2 ? 'bg-[#ecfdf5] border-[#047857]' : 'bg-white border-[#e2e8f0]'
                        }`}
                      >
                        2. Delete dialog appears with gentle alternative
                      </div>
                      <div
                        onClick={() => {
                          setFlowStep(3);
                          toast.success('Product deleted', {
                            description: 'LG 55" Smart TV has been removed from the shop.',
                          });
                        }}
                        className={`p-2.5 rounded-[8px] border cursor-pointer ${
                          flowStep === 3 ? 'bg-[#ecfdf5] border-[#047857]' : 'bg-white border-[#e2e8f0]'
                        }`}
                      >
                        3. Confirmed delete → Toast "Product deleted"
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Section 5 States Selector */
              <div className="space-y-3 text-xs">
                <span className="font-bold uppercase tracking-wider text-[#475569]">
                  Screen 5 States
                </span>
                <div className="space-y-1.5">
                  {[
                    { id: 'skeleton', label: '1. Loading Skeleton' },
                    { id: 'empty', label: '2. No products yet' },
                    { id: 'nomatch', label: '3. Filter finds nothing' },
                    { id: 'error', label: '4. Load error + Retry' },
                    { id: 'toggle_fail', label: '5. Toggle failed (snap back)' },
                    { id: 'validation', label: '6. Form with inline errors' },
                    { id: 'upload_states', label: '7. Image upload edge cases' },
                    { id: 'unsaved_dialog', label: '8. Unsaved changes dialog' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setActiveState(st.id)}
                      className={`w-full text-left px-3 py-2 rounded-[8px] font-semibold transition ${
                        activeState === st.id
                          ? 'bg-[#047857] text-white shadow-xs'
                          : 'bg-white border border-[#e2e8f0] text-[#01241a] hover:bg-slate-50'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Frame (Simulated Laptop 1280 or Mobile 390) */}
          <div className="flex-1 overflow-auto p-4 sm:p-6 flex justify-center items-start">
            <div
              className={`bg-white rounded-[16px] border border-[#cbd5e1] shadow-xl overflow-hidden transition-all duration-300 ${
                deviceFrame === 'mobile'
                  ? 'w-[390px] min-h-[844px] max-h-[844px] flex flex-col'
                  : 'w-full max-w-[1280px] min-h-[700px]'
              }`}
            >
              {/* Device Frame Window Header */}
              <div className="bg-[#064e3b] text-white px-4 py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="font-semibold text-emerald-200 text-[11px] ml-2">
                    Universal Market Admin • {deviceFrame === 'mobile' ? 'Mobile Viewport (390 x 844)' : 'Laptop Viewport (1280w)'}
                  </span>
                </div>
                <span className="text-[11px] bg-emerald-900 px-2 py-0.5 rounded text-emerald-200">
                  /admin/products
                </span>
              </div>

              {/* Main Content inside the Frame */}
              <div className="p-4 sm:p-6 bg-[#f8fafc] flex-1 overflow-y-auto">
                {activeTab === 'flows' ? (
                  /* ======================================================== */
                  /* FLOW RENDERING                                           */
                  /* ======================================================== */
                  <div className="space-y-5">
                    {/* Top bar of view */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-[#01241a]">
                          {flowStep >= 2 && flowStep <= 5 && activeFlow === 'add'
                            ? 'Add product'
                            : 'Products'}
                        </h1>
                        <p className="text-xs text-[#475569] mt-0.5">
                          {flowStep >= 2 && flowStep <= 5 && activeFlow === 'add'
                            ? 'Create a new product listing.'
                            : 'Manage catalogue and availability.'}
                        </p>
                      </div>

                      {!(flowStep >= 2 && flowStep <= 5 && activeFlow === 'add') && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveFlow('add');
                            setFlowStep(2);
                          }}
                          className="min-h-[44px] px-4 py-2.5 rounded-[10px] bg-[#047857] hover:bg-[#064e3b] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition shadow-xs"
                        >
                          <span>+ Add product</span>
                        </button>
                      )}
                    </div>

                    {/* Step 1 & 6 (Products List View) */}
                    {(flowStep === 1 || flowStep === 6 || activeFlow === 'toggle' || (activeFlow === 'delete' && flowStep !== 2)) && (
                      <div className="space-y-4">
                        {/* Filters mock */}
                        <div className="bg-white rounded-[12px] border border-[#e2e8f0] p-3 flex flex-wrap gap-2 text-xs">
                          <input
                            type="text"
                            placeholder="Search products..."
                            readOnly
                            className="flex-1 min-w-[140px] px-3 py-1.5 border border-[#e2e8f0] rounded-[8px]"
                          />
                          <select className="px-3 py-1.5 border border-[#e2e8f0] rounded-[8px]">
                            <option>All Categories</option>
                          </select>
                          <select className="px-3 py-1.5 border border-[#e2e8f0] rounded-[8px]">
                            <option>All Statuses</option>
                          </select>
                        </div>

                        {/* List items */}
                        <div className="bg-white rounded-[14px] border border-[#e2e8f0] shadow-xs divide-y divide-[#e2e8f0]">
                          {/* LG TV Item (Interactive Toggle & Delete target) */}
                          <div
                            className={`p-3.5 flex items-center justify-between gap-3 transition ${
                              mockTvStatus === 'Out of Stock' ? 'bg-[#f8fafc]/50 text-[#475569]' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=200"
                                alt="LG TV"
                                className="w-12 h-12 rounded-[10px] object-cover shrink-0 border border-[#e2e8f0]"
                              />
                              <div className="min-w-0">
                                <h3 className="text-sm font-bold text-[#01241a] truncate">
                                  LG 55" Smart TV 4K OLED
                                </h3>
                                <p className="text-xs text-[#475569]">
                                  TVs • ₦420,000 • New
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <div
                                onClick={() => {
                                  const next =
                                    mockTvStatus === 'In Stock' ? 'Out of Stock' : 'In Stock';
                                  setMockTvStatus(next);
                                  toast(
                                    `LG 55" Smart TV marked as ${next.toLowerCase()}`,
                                    {
                                      action: {
                                        label: 'Undo',
                                        onClick: () =>
                                          setMockTvStatus(
                                            next === 'In Stock' ? 'Out of Stock' : 'In Stock'
                                          ),
                                      },
                                    }
                                  );
                                }}
                                className="cursor-pointer"
                              >
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                    mockTvStatus === 'In Stock'
                                      ? 'bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0]'
                                      : 'bg-[#e2e8f0] text-[#334155] border border-[#cbd5e1]'
                                  }`}
                                >
                                  {mockTvStatus}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveFlow('delete');
                                  setFlowStep(2);
                                }}
                                className="text-xs font-semibold text-[#b91c1c] hover:bg-rose-50 px-2 py-1 rounded"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          {/* Newly added demo product shown at top if step 6 */}
                          {flowStep === 6 && (
                            <div className="p-3.5 bg-emerald-50/50 flex items-center justify-between gap-3 animate-in fade-in">
                              <div className="flex items-center gap-3">
                                <img
                                  src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=200"
                                  alt="iPhone"
                                  className="w-12 h-12 rounded-[10px] object-cover shrink-0 border border-emerald-300"
                                />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-bold text-[#01241a]">
                                      iPhone 13 Pro 256GB
                                    </span>
                                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                                      New
                                    </span>
                                  </div>
                                  <p className="text-xs text-[#475569]">
                                    Phones • ₦650,000 • Like New
                                  </p>
                                </div>
                              </div>
                              <span className="bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                In stock
                              </span>
                            </div>
                          )}

                          {/* Extra items */}
                          <div className="p-3.5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=200"
                                alt="Fridge"
                                className="w-12 h-12 rounded-[10px] object-cover shrink-0 border border-[#e2e8f0]"
                              />
                              <div className="min-w-0">
                                <h3 className="text-sm font-bold text-[#01241a] truncate">
                                  Hisense Refrigerator Double Door
                                </h3>
                                <p className="text-xs text-[#475569]">
                                  Refrigerators • ₦380,000 • New
                                </p>
                              </div>
                            </div>
                            <span className="bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                              In stock
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2-5: Add Product Form Flow */}
                    {activeFlow === 'add' && flowStep >= 2 && flowStep <= 5 && (
                      <div className="space-y-4 text-xs">
                        {/* Step indicator */}
                        <div className="bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] p-2.5 rounded-[10px] flex items-center justify-between">
                          <span>Step {flowStep} of 5: {flowStep === 2 ? 'Details filled' : flowStep === 3 ? '3 Photos Uploaded (Cover marked)' : flowStep === 4 ? 'Specs added' : 'Saving...'}</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (flowStep < 5) setFlowStep(flowStep + 1);
                              else {
                                setFlowStep(6);
                                toast.success('Product added', {
                                  description: 'iPhone 13 Pro 256GB is now live.',
                                });
                              }
                            }}
                            className="bg-[#047857] text-white px-2.5 py-1 rounded-[6px] font-bold"
                          >
                            Next Step →
                          </button>
                        </div>

                        <div className="bg-white p-4 rounded-[12px] border border-[#e2e8f0] space-y-3">
                          <label className="block font-bold">Product Name</label>
                          <input
                            type="text"
                            value="iPhone 13 Pro 256GB"
                            readOnly
                            className="w-full p-2 border border-[#e2e8f0] rounded-[8px] bg-slate-50"
                          />

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block font-bold">Category</label>
                              <input
                                type="text"
                                value="Phones"
                                readOnly
                                className="w-full p-2 border border-[#e2e8f0] rounded-[8px] bg-slate-50"
                              />
                            </div>
                            <div>
                              <label className="block font-bold">Price</label>
                              <input
                                type="text"
                                value="₦650,000"
                                readOnly
                                className="w-full p-2 border border-[#e2e8f0] rounded-[8px] bg-slate-50"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Photos preview */}
                        <div className="bg-white p-4 rounded-[12px] border border-[#e2e8f0] space-y-2">
                          <label className="block font-bold">Photos (3 added)</label>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="relative rounded-[8px] border-2 border-[#047857] overflow-hidden aspect-square">
                              <img
                                src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=200"
                                alt="Cover"
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute top-1 left-1 bg-[#064e3b] text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                                Cover
                              </span>
                            </div>
                            <div className="relative rounded-[8px] border border-[#e2e8f0] overflow-hidden aspect-square">
                              <img
                                src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=200"
                                alt="Photo 2"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="relative rounded-[8px] border border-[#e2e8f0] overflow-hidden aspect-square">
                              <img
                                src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=200"
                                alt="Photo 3"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Specs preview */}
                        <div className="bg-white p-4 rounded-[12px] border border-[#e2e8f0] space-y-2">
                          <label className="block font-bold">Specifications</label>
                          <div className="space-y-1.5">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value="Storage"
                                readOnly
                                className="w-1/2 p-2 border border-[#e2e8f0] rounded bg-slate-50"
                              />
                              <input
                                type="text"
                                value="256GB"
                                readOnly
                                className="w-1/2 p-2 border border-[#e2e8f0] rounded bg-slate-50"
                              />
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value="Colour"
                                readOnly
                                className="w-1/2 p-2 border border-[#e2e8f0] rounded bg-slate-50"
                              />
                              <input
                                type="text"
                                value="Graphite"
                                readOnly
                                className="w-1/2 p-2 border border-[#e2e8f0] rounded bg-slate-50"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setFlowStep(6);
                              toast.success('Product added', {
                                description: 'iPhone 13 Pro 256GB is now live.',
                              });
                            }}
                            className="px-6 py-2.5 bg-[#047857] text-white font-bold rounded-[8px] flex items-center gap-2"
                          >
                            {flowStep === 5 ? (
                              <span>Saving... (Spinner)</span>
                            ) : (
                              <span>Save product</span>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step C2: Delete Dialog Display */}
                    {activeFlow === 'delete' && flowStep === 2 && (
                      <div className="p-6 bg-white rounded-[14px] border-2 border-rose-200 shadow-lg max-w-md mx-auto space-y-3">
                        <div className="flex items-center gap-2 text-[#b91c1c]">
                          <AlertCircle className="w-5 h-5" />
                          <h3 className="font-bold text-base text-[#01241a]">
                            Delete LG 55" Smart TV?
                          </h3>
                        </div>
                        <p className="text-xs text-[#475569]">
                          This cannot be undone. The product will be removed from the shop.
                        </p>

                        <div>
                          <button
                            type="button"
                            onClick={() => {
                              setMockTvStatus('Out of Stock');
                              setFlowStep(1);
                              toast.info('LG 55" Smart TV marked as out of stock');
                            }}
                            className="text-xs font-semibold text-[#047857] underline underline-offset-2"
                          >
                            Mark as out of stock instead
                          </button>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t">
                          <button
                            type="button"
                            onClick={() => setFlowStep(1)}
                            className="px-3 py-1.5 border rounded text-xs font-semibold"
                          >
                            Keep product
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFlowStep(3);
                              toast.success('Product deleted');
                            }}
                            className="px-4 py-1.5 bg-[#b91c1c] text-white rounded text-xs font-semibold"
                          >
                            Yes, delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* ======================================================== */
                  /* SECTION 5: STATES DEMONSTRATION                         */
                  /* ======================================================== */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h2 className="text-sm font-bold text-[#01241a]">
                        Previewing State: {activeState.replace(/_/g, ' ').toUpperCase()}
                      </h2>
                    </div>

                    {/* 1. SKELETON */}
                    {activeState === 'skeleton' && (
                      <div className="space-y-3 animate-pulse">
                        <div className="h-10 bg-slate-200 rounded-[10px]" />
                        <div className="h-16 bg-slate-200 rounded-[12px]" />
                        <div className="h-16 bg-slate-200 rounded-[12px]" />
                        <div className="h-16 bg-slate-200 rounded-[12px]" />
                      </div>
                    )}

                    {/* 2. EMPTY */}
                    {activeState === 'empty' && (
                      <div className="bg-white rounded-[14px] border border-[#e2e8f0] p-12 text-center max-w-lg mx-auto">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#047857] flex items-center justify-center mx-auto mb-3">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-base text-[#01241a]">No products yet</h3>
                        <p className="text-xs text-[#475569] mt-1 mb-5">
                          Add your first product to start showcasing items to customers.
                        </p>
                        <button
                          type="button"
                          className="px-4 py-2 bg-[#047857] text-white text-xs font-semibold rounded-[8px]"
                        >
                          + Add product
                        </button>
                      </div>
                    )}

                    {/* 3. NOMATCH */}
                    {activeState === 'nomatch' && (
                      <div className="bg-white rounded-[14px] border border-[#e2e8f0] p-12 text-center max-w-lg mx-auto">
                        <AlertCircle className="w-8 h-8 text-[#475569] mx-auto mb-2" />
                        <h3 className="font-bold text-base text-[#01241a]">No products match</h3>
                        <p className="text-xs text-[#475569] mt-1 mb-4">
                          Try searching with different keywords or clear existing filters.
                        </p>
                        <button
                          type="button"
                          className="px-3.5 py-1.5 border border-[#e2e8f0] text-xs font-semibold rounded-[8px]"
                        >
                          Clear filters
                        </button>
                      </div>
                    )}

                    {/* 4. LOAD ERROR */}
                    {activeState === 'error' && (
                      <div className="bg-white rounded-[14px] border border-rose-200 p-8 text-center max-w-lg mx-auto">
                        <AlertCircle className="w-8 h-8 text-[#b91c1c] mx-auto mb-2" />
                        <h3 className="font-bold text-base text-[#01241a]">Failed to load products</h3>
                        <p className="text-xs text-[#475569] mt-1 mb-4">
                          There was a network or server issue fetching the product catalogue.
                        </p>
                        <button
                          type="button"
                          className="px-4 py-2 bg-[#047857] text-white text-xs font-semibold rounded-[8px]"
                        >
                          Retry
                        </button>
                      </div>
                    )}

                    {/* 5. TOGGLE FAILED */}
                    {activeState === 'toggle_fail' && (
                      <div className="p-4 bg-white rounded-[12px] border border-rose-200 space-y-3">
                        <p className="text-xs font-bold text-[#b91c1c]">
                          Toggle Failed Simulation:
                        </p>
                        <p className="text-xs text-[#475569]">
                          When server rejects or network drops, the switch automatically snaps back to its previous position and displays an error toast.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            toast.error('Failed to update availability', {
                              description: 'Database refused connection. Switch reverted.',
                            });
                          }}
                          className="px-3 py-1.5 bg-[#b91c1c] text-white text-xs font-semibold rounded"
                        >
                          Simulate Failed Toggle Action
                        </button>
                      </div>
                    )}

                    {/* 6. VALIDATION ERRORS */}
                    {activeState === 'validation' && (
                      <div className="bg-white rounded-[14px] border border-[#e2e8f0] p-5 space-y-3 text-xs">
                        <h3 className="font-bold text-sm text-[#01241a]">Validation inline errors</h3>
                        <div>
                          <label className="font-semibold block mb-1">Product Name *</label>
                          <input
                            type="text"
                            value=""
                            readOnly
                            className="w-full p-2 border border-[#b91c1c] bg-rose-50/20 rounded"
                          />
                          <p className="text-[#b91c1c] text-[11px] mt-1">
                            Product name must be at least 2 characters long
                          </p>
                        </div>
                        <div>
                          <label className="font-semibold block mb-1">Price *</label>
                          <input
                            type="text"
                            value="0"
                            readOnly
                            className="w-full p-2 border border-[#b91c1c] bg-rose-50/20 rounded"
                          />
                          <p className="text-[#b91c1c] text-[11px] mt-1">
                            Enter a price greater than 0
                          </p>
                        </div>
                        <div>
                          <label className="font-semibold block mb-1">Photos *</label>
                          <p className="text-[#b91c1c] text-[11px] bg-rose-50 p-2 rounded border border-rose-200">
                            Add at least one photo
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 7. UPLOAD STATES */}
                    {activeState === 'upload_states' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-white border border-[#e2e8f0] rounded-[10px]">
                          <p className="font-bold text-[#01241a] mb-1">Over 6 images error:</p>
                          <div className="p-2 bg-rose-50 text-[#b91c1c] rounded border border-rose-200 font-semibold">
                            You can add up to 6 photos.
                          </div>
                        </div>
                        <div className="p-3 bg-white border border-[#e2e8f0] rounded-[10px]">
                          <p className="font-bold text-[#01241a] mb-1">File too large error:</p>
                          <div className="p-2 bg-rose-50 text-[#b91c1c] rounded border border-rose-200 font-semibold">
                            File is too large. Maximum size is 5 MB.
                          </div>
                        </div>
                        <div className="p-3 bg-white border border-[#e2e8f0] rounded-[10px]">
                          <p className="font-bold text-[#01241a] mb-1">Wrong file type error:</p>
                          <div className="p-2 bg-rose-50 text-[#b91c1c] rounded border border-rose-200 font-semibold">
                            Invalid file type. Only JPG, PNG, and WebP are supported.
                          </div>
                        </div>
                        <div className="p-3 bg-white border border-[#e2e8f0] rounded-[10px]">
                          <p className="font-bold text-[#01241a] mb-1">Failed upload tile:</p>
                          <div className="w-20 h-20 rounded border-2 border-[#b91c1c] bg-rose-950/80 text-white flex flex-col items-center justify-center text-[10px] p-1 text-center">
                            <span>Upload failed</span>
                            <span className="text-white underline mt-0.5">Retry</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 8. UNSAVED DIALOG */}
                    {activeState === 'unsaved_dialog' && (
                      <div className="p-5 bg-white rounded-[14px] border border-[#e2e8f0] shadow-md max-w-sm mx-auto space-y-3">
                        <h4 className="font-bold text-sm text-[#01241a]">Discard changes?</h4>
                        <p className="text-xs text-[#475569]">
                          You have unsaved changes on this product form. If you leave now, your changes will be lost.
                        </p>
                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            className="px-3 py-1.5 border rounded text-xs font-semibold"
                          >
                            Keep editing
                          </button>
                          <button
                            type="button"
                            className="px-3 py-1.5 bg-[#b91c1c] text-white rounded text-xs font-semibold"
                          >
                            Discard
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
