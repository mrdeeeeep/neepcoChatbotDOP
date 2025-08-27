import React from "react";

const DOPSection: React.FC = () => {
  return (
    <section className="relative w-full">
      {/* Background SVG */}
      <div className="absolute inset-0 -z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1727"
          height="1349"
          viewBox="0 0 1727 1349"
          fill="none"
          className="w-full h-full min-h-[1200px]"
          preserveAspectRatio="none"
        >
          <path
            d="M119.443 1180.8C18.6372 1173.26 -2.78032 1125.26 -0.88832 1102.21L-0.88832 5.69802C-1.04138 3.6723 -1.03302 1.76321 -0.88832 0L-0.88832 5.69802C0.959959 30.1598 26.3466 71.6284 119.443 78.5967C245.45 88.0283 242.045 121.039 261.343 147.762C280.641 174.485 311.292 201.208 419.136 179.986C526.98 158.765 632.554 151.692 713.153 201.994C777.633 242.235 840.05 246.794 863 246.794C885.95 246.794 948.367 242.235 1012.85 201.994C1093.45 151.692 1199.02 158.765 1306.86 179.986C1414.71 201.208 1445.36 174.485 1464.66 147.762C1483.96 121.039 1480.55 88.0283 1606.56 78.5967C1699.65 71.6284 1725.04 30.1596 1726.89 5.69787V0C1727.03 1.76317 1727.04 3.6722 1726.89 5.69787V1102.21C1728.78 1125.26 1707.36 1173.26 1606.56 1180.8C1480.55 1190.23 1483.96 1223.25 1464.66 1249.97C1445.36 1276.69 1414.71 1303.41 1306.86 1282.19C1199.02 1260.97 1093.45 1253.9 1012.85 1304.2C948.367 1344.44 885.95 1349 863 1349C840.05 1349 777.633 1344.44 713.153 1304.2C632.554 1253.9 526.98 1260.97 419.136 1282.19C311.292 1303.41 280.641 1276.69 261.343 1249.97C242.045 1223.25 245.45 1190.23 119.443 1180.8Z"
            fill="#EBEBEB"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="lg:pt-[20%] relative max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-xl md:text-4xl font-quicksand tracking-wide font-bold text-gray-900 mb-6">
          What is{" "}
          <span className="text-[#3570BD] underline decoration-2 underline-offset-4">
            DOP?
          </span>
        </h2>

        <p className="text-gray-600 text-lg lg:text-2xl font-quicksand tracking-wide font-bold leading-relaxed mb-12">
          The Delegation of Power (DOP) is a foundational document within{" "}
          <span className="text-red-500 font-semibold">NEEPCO</span> (North
          Eastern Electric Power Corporation).
        </p>

        <p className="text-gray-600 font-bold text-lg lg:text-2xl leading-relaxed tracking-wide font-quicksand mb-20">
          In simple terms, the DOP is the official framework that{" "}
          <span className="text-red-500 font-semibold">
            distributes decision-making authority
          </span>{" "}
          across the company. It specifies the exact powers assigned to
          different roles in the organization.
        </p>

        <div className="text-left max-w-6xl mx-auto mt-6">
          <p className="text-gray-600 tracking-wide font-bold lg:text-2xl font-bold mb-3 font-quicksand">
            The main goals of this system are to ensure smooth and effective
            operations by enabling:
          </p>
          <ul className="list-disc tracking-wide pl-10 font-bold space-y-2 text-gray-600 lg:text-2xl font-quicksand space-y-6 marker:text-red-500">
            <li>
              <span className="text-red-500 font-semibold">
                Faster Decision-Making:
              </span>{" "}
              Allowing authorized individuals to make decisions promptly without
              unnecessary delays.
            </li>
            <li>
              <span className="text-red-500 font-semibold">
                Efficient Administration:
              </span>{" "}
              Helping the company’s management and daily work run more smoothly.
            </li>
            <li>
              <span className="text-red-500 font-semibold">
                Clear Accountability:
              </span>{" "}
              Making it clear who is responsible for specific actions and
              decisions.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default DOPSection;
