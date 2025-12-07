import React from "react";

const Airplane = "/landing/paperairplane.svg";

// TypeScript interfaces
interface TimelineItem {
  year: string;
  content: string[];
}

interface TimelineData {
  title: string;
  items: TimelineItem[];
}

const OurSolution: React.FC = () => {
  // TypeScript-typed data
  const timelineData: TimelineData = {
    title: "Our Solution",
    items: [
      {
        year: "Project Kickoff & Planning",
        content: [
          "Team set-up",
          "Define project scope & objectives",
          "Set up project management tools"
        ]
      },
      {
        year: "Data Preparation & Backend Setup",
        content: [
          "Collection & cleaning of policy documents",
          "Prepare and format custom dataset",
          "Quantize and fine-tune TinyLlama 1.1B",
          "Initial model evaluation"
        ]
      },
      {
        year: "Backend & Frontend Integration",
        content: [
          "Backend & Frontend Integration",
          "Set up vector database for retrieval",
          "Develop and connect Netlify frontend",
          "API integration between frontend and backend"
        ]
      },
      {
        year: "Testing, Launch & Iteration",
        content: [
          "Internal QA and bug fixes",
          "User testing and feedback collection",
        ]
      }
    ]
  };

  return (
    <section className="relative w-full lg:mt-[40px]">
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
            fill="#3570BD"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Our Solution Section */}
        <div className="relative pt-60 pb-24">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-quicksand font-bold text-white mb-32 text-center">
            {timelineData.title}
          </h2>

          {/* Paper Airplane SVG - positioned with consistent spacing across large screens */}
          <div className="absolute top-80 right-4 md:right-8 lg:right-20 xl:right-20 2xl:right-20 w-16 md:w-20 lg:w-28 xl:w-28 2xl:w-28">
            <img src={Airplane} alt="airplane" className="w-full h-auto" />
          </div>

          {/* Timeline Container */}
          <div className="relative max-w-10xl mx-auto">
            {/* Timeline Points Container */}
            <div className="relative">
              {/* Horizontal dotted line */}
              <div className="hidden lg:block absolute top-0 left-0 right-0 h-px">
                <div className="w-full h-px border-t-2 border-dotted border-white/50"></div>
              </div>

              {/* Timeline Items */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8 xl:gap-8 2xl:gap-8">
                {timelineData.items.map((item: TimelineItem, index: number) => (
                  <div key={index} className="relative">
                    {/* Vertical connector line */}
                    <div className="hidden lg:block absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-16 bg-white/40"></div>
                    
                    {/* Timeline dot */}
                    <div className="hidden lg:block absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-2 h-2 bg-white rounded-full"></div>
                    
                    {/* Content */}
                    <div className="pt-20 lg:pt-24 lg:ml-24 xl:ml-24 2xl:ml-24 text-center lg:text-left">
                      {/* Year */}
                      <div className="text-white text-2xl md:text-3xl font-quicksand font-semibold mb-8">
                        {item.year}
                      </div>
                      
                      {/* Content items */}
                      <div className="text-white/90 text-sm md:text-base leading-relaxed font-quicksand font-semibold tracking-wide space-y-3">
                        {item.content.map((contentItem: string, contentIndex: number) => (
                          <p 
                            key={contentIndex} 
                            className={contentIndex === 0 ? "font-medium" : ""}
                          >
                            {contentItem}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurSolution;
