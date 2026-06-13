
export const HowToOrder = () => {
  return ( 

      <section className="px-6 py-20 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-[#01241a] text-center mb-8">How to Order</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { num: "01", title: "Browse Products", desc: "Find the perfect gadget from our daily updated inventory.", color: "bg-indigo-50" },
            { num: "02", title: "Request Item", desc: "Click request to send the item details to our team instantly.", color: "bg-emerald-50" },
            { num: "03", title: "Chat & Close", desc: "Confirm availability and arrange for pickup or delivery.", color: "bg-blue-50" }
          ].map((step, i) => (
            <div key={i} className={`${step.color} p-10 rounded-2xl text-center`}>
              <span className="text-6xl font-bold opacity-10 block mb-6">{step.num}</span>
              <h3 className="text-xl font-bold text-[#01241a] mb-4">{step.title}</h3>
              <p className="text-gray-500 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section> )}