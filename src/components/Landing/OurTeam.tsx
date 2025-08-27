import React from "react";
import ProfileIcon from "/public/landing/ProfileIcons.svg";
import FemaleProfileIcon from "/public/landing/FemaleProfileIcon.svg";
import GitHubIcon from "/public/landing/GitHub.png";
import LinkedInIcon from "/public/landing/Linkedin.png";

// TypeScript interfaces
interface TeamMember {
  name: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

interface TeamSection {
  title: string;
  members: TeamMember[];
}

interface TeamData {
  sections: TeamSection[];
}

const OurTeam: React.FC = () => {
  // TypeScript-typed data
  const teamData: TeamData = {
    sections: [
      {
        title: "Our Team",
        members: [
          {
            name: "Kalpojyoti Koch",
            githubUrl: "https://github.com/kalpokoch",
            linkedinUrl: "https://www.linkedin.com/in/kalpo07/"
          },
          {
            name: "Deep Baro",
            githubUrl: "https://github.com/mrdeeeeep",
            linkedinUrl: "https://www.linkedin.com/in/deepbaro/"
          },
          {
            name: "Swastayan Borah",
            githubUrl: "https://github.com/SwasB1112",
            linkedinUrl: "https://www.linkedin.com/in/swastayan-borah/"
          },
          {
            name: "Theophilas Chapar",
            githubUrl: "https://github.com/Tchap123",
            linkedinUrl: "https://www.linkedin.com/in/tchapar/"
          }
        ]
      },
      {
        title: "Contributors",
        members: [
          {
            name: "Nilim Das",
            githubUrl: "https://github.com/TheNilimNetwork",
            linkedinUrl: "https://www.linkedin.com/in/thenilimnetwork/"
          },
          {
            name: "Bhaskar Daimari",
            githubUrl: "https://github.com/bhaskar-daimari",
            linkedinUrl: "https://www.linkedin.com/in/bhaskar-daimari-58801228b/"
          },
          {
            name: "Bhargav Jyoti Das",
            githubUrl: "https://github.com/BhargavDas8011",
            linkedinUrl: "https://www.linkedin.com/in/bhargav-jyoti-das-67b435368/"
          },
          {
            name: "Parinita Brahma Rabha",
            githubUrl: "https://github.com/Parinita122",
            linkedinUrl: "https://www.linkedin.com/in/parinita-brahmarabha-07514825a/"
          }
        ]
      }
    ]
  };

  // Function to get the appropriate profile icon
  const getProfileIcon = (memberName: string) => {
    return memberName === "Parinita Brahma Rabha" ? FemaleProfileIcon : ProfileIcon;
  };

  return (
    <section className="relative w-full lg:mt-[-150px]">
      {/* Background SVG */}
      <div className="absolute inset-0 -z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1728"
          height="1385"
          viewBox="0 0 1728 1385"
          fill="none"
          className="w-full h-full min-h-[1000px]"
          preserveAspectRatio="none"
        >
          <path
            d="M120.443 1212.31C19.6372 1204.57 -1.78032 1155.29 0.11168 1131.62L0.11168 5.85008C-0.0413783 3.7703 -0.0330166 1.81026 0.11168 0L0.11168 5.85008C1.95996 30.9647 27.3466 73.5399 120.443 80.6941C246.45 90.3774 243.045 124.269 262.343 151.705C281.641 179.141 312.292 206.577 420.136 184.79C527.98 163.002 633.554 155.74 714.153 207.384C778.633 248.7 841.05 253.38 864 253.38C886.95 253.38 949.367 248.7 1013.85 207.384C1094.45 155.74 1200.02 163.002 1307.86 184.79C1415.71 206.577 1446.36 179.141 1465.66 151.705C1484.96 124.269 1481.55 90.3774 1607.56 80.6941C1700.65 73.5399 1726.04 30.9645 1727.89 5.84992V0C1728.03 1.81022 1728.04 3.7702 1727.89 5.84992V1131.62C1729.78 1155.29 1708.36 1204.57 1607.56 1212.31C1481.55 1222 1484.96 1255.89 1465.66 1283.33C1446.36 1310.76 1415.71 1338.2 1307.86 1316.41C1200.02 1294.62 1094.45 1287.36 1013.85 1339C949.367 1380.32 886.95 1385 864 1385C841.05 1385 778.633 1380.32 714.153 1339C633.554 1287.36 527.98 1294.62 420.136 1316.41C312.292 1338.2 281.641 1310.76 262.343 1283.33C243.045 1255.89 246.45 1222 120.443 1212.31Z"
            fill="#F2726F"
          />
          <path
            d="M120.443 1212.31C19.6372 1204.57 -1.78032 1155.29 0.11168 1131.62L0.11168 5.85008C-0.0413783 3.7703 -0.0330166 1.81026 0.11168 0L0.11168 5.85008C1.95996 30.9647 27.3466 73.5399 120.443 80.6941C246.45 90.3774 243.045 124.269 262.343 151.705C281.641 179.141 312.292 206.577 420.136 184.79C527.98 163.002 633.554 155.74 714.153 207.384C778.633 248.7 841.05 253.38 864 253.38C886.95 253.38 949.367 248.7 1013.85 207.384C1094.45 155.74 1200.02 163.002 1307.86 184.79C1415.71 206.577 1446.36 179.141 1465.66 151.705C1484.96 124.269 1481.55 90.3774 1607.56 80.6941C1700.65 73.5399 1726.04 30.9645 1727.89 5.84992V0C1728.03 1.81022 1728.04 3.7702 1727.89 5.84992V1131.62C1729.78 1155.29 1708.36 1204.57 1607.56 1212.31C1481.55 1222 1484.96 1255.89 1465.66 1283.33C1446.36 1310.76 1415.71 1338.2 1307.86 1316.41C1200.02 1294.62 1094.45 1287.36 1013.85 1339C949.367 1380.32 886.95 1385 864 1385C841.05 1385 778.633 1380.32 714.153 1339C633.554 1287.36 527.98 1294.62 420.136 1316.41C312.292 1338.2 281.641 1310.76 262.343 1283.33C243.045 1255.89 246.45 1222 120.443 1212.31Z"
            fill="url(#paint0_linear_54_60)"
            fillOpacity="0.59"
          />
          <defs>
            <linearGradient
              id="paint0_linear_54_60"
              x1="-1.29159e-05"
              y1="55.2634"
              x2="2253.12"
              y2="516.423"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#E5312D" />
              <stop offset="0.505208" stopColor="#B63633" />
              <stop offset="1" stopColor="#3570BD" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {teamData.sections.map((section: TeamSection, sectionIndex: number) => (
          <div key={sectionIndex} className={`${sectionIndex === 0 ? 'pt-[200px] pb-0' : 'py-16'}`}>
            {/* Section Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-quicksand font-bold text-white mb-16 text-center">
              {section.title}
            </h2>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 xl:gap-8 2xl:gap-8 max-w-6xl mx-auto">
              {section.members.map((member: TeamMember, memberIndex: number) => (
                <div
                  key={memberIndex}
                  className="bg-white rounded-3xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Profile Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center">
                      <img 
                        src={getProfileIcon(member.name)} 
                        alt="Profile" 
                        className="w-full h-full rounded-full"
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="text-gray-800 text-lg font-quicksand font-bold mb-6">
                    {member.name}
                  </h3>

                  {/* Social Links */}
                  <div className="flex justify-center space-x-8">
                    {/* GitHub Icon */}
                    <a
                      href={member.githubUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded flex items-center justify-center hover:bg-gray-700 transition-colors duration-300"
                    >
                      <img 
                        src={GitHubIcon} 
                        alt="GitHub" 
                        className="w-full h-full"
                      />
                    </a>

                    {/* LinkedIn Icon */}
                    <a
                      href={member.linkedinUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-300"
                    >
                      <img 
                        src={LinkedInIcon} 
                        alt="LinkedIn" 
                        className="w-full h-full"
                      />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurTeam;
