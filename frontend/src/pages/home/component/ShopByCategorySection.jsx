import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Building2, House, Coins } from "lucide-react";

const landCategories = [
  {
    _id: "agriculture-land",
    name: "Agriculture Land",
    query: "agriculture land",
    icon: Leaf,
    gradient: "from-green-500 to-emerald-600",
  },
  {
    _id: "industrial-land",
    name: "Industrial Land",
    query: "industrial land",
    icon: Building2,
    gradient: "from-slate-600 to-gray-800",
  },
  {
    _id: "residential-land",
    name: "Residential Land",
    query: "residential land",
    icon: House,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    _id: "commercial-land",
    name: "Commercial Land",
    query: "commercial land",
    icon: Coins,
    gradient: "from-amber-500 to-orange-600",
  },
];

const getCategoryDestination = (category) => {
  const query = String(category.query || category.name || "").trim();
  return `/search?q=${encodeURIComponent(query)}`;
};

const ShopByCategorySection = () => {
  return (
    <section className="bg-gradient-to-b from-white via-white to-cyan-50/70 pt-2 pb-2 md:py-10">
      <div className="max-w-[86rem] mx-auto px-2 sm:px-6 lg:px-8">
        <div className="mb-3 sm:mb-5">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <span className="h-px w-12 sm:w-24 bg-slate-400"></span>
            <h2 className="text-base sm:text-2xl font-extrabold tracking-tight text-slate-900 text-center whitespace-nowrap">
              Shop by Category
            </h2>
            <span className="h-px w-12 sm:w-24 bg-slate-400"></span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-x-1.5 gap-y-1 sm:gap-6 lg:w-fit lg:mx-auto lg:justify-items-center">
          {landCategories.map((category) => {
            const Icon = category.icon;
            const destination = getCategoryDestination(category);

            return (
              <Link
                key={category._id}
                to={destination}
                className="group aspect-[0.92/1] sm:aspect-square lg:aspect-[0.9/1] rounded-lg sm:rounded-2xl border border-slate-200/80 bg-white p-1 sm:p-3 lg:p-2 lg:max-w-[190px] lg:mx-auto shadow-[0_4px_10px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(14,116,144,0.18)]"
                aria-label={category.name}
                title={category.name}
              >
                <div
                  className={`w-full h-full rounded-md sm:rounded-xl bg-gradient-to-br ${category.gradient} text-white flex flex-col items-center justify-center gap-0.5 sm:gap-2 lg:gap-1.5 px-1 sm:px-2 lg:px-1.5 text-center`}
                >
                  <Icon className="w-5 h-5 sm:w-10 sm:h-10 lg:w-8 lg:h-8 drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]" />
                  <span className="text-[8px] sm:text-sm lg:text-xs font-bold leading-none sm:leading-tight">
                    {category.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategorySection;
