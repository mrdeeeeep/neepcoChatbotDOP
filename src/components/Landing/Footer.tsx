import React from "react";
import { Link } from "react-router-dom";

const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="white" aria-hidden="true" {...props}>
    <path fillRule="evenodd" clipRule="evenodd"
      d="M12 .5C5.73.5.98 5.24.98 11.52c0 4.86 3.15 8.97 7.52 10.42.55.11.75-.24.75-.54 0-.27-.01-1.16-.02-2.1-3.06.67-3.71-1.3-3.71-1.3-.5-1.27-1.22-1.61-1.22-1.61-.99-.67.08-.66.08-.66 1.1.08 1.67 1.12 1.67 1.12.98 1.67 2.58 1.19 3.21.91.1-.71.38-1.19.7-1.46-2.44-.28-5-1.22-5-5.43 0-1.2.43-2.18 1.14-2.95-.11-.28-.5-1.41.11-2.94 0 0 .95-.3 3.12 1.13a10.77 10.77 0 0 1 2.84-.38c.96 0 1.93.13 2.84.38 2.17-1.43 3.12-1.13 3.12-1.13.61 1.53.23 2.66.11 2.94.71.77 1.14 1.75 1.14 2.95 0 4.22-2.57 5.14-5.02 5.41.39.33.74.98.74 1.98 0 1.43-.01 2.58-.01 2.93 0 .3.2.66.76.54 4.36-1.45 7.51-5.56 7.51-10.42C23.02 5.24 18.27.5 12 .5z" />
  </svg>
);

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="white" aria-hidden="true" {...props}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.001 2.5 2.5 0 0 1 0-5zM3.5 9h3v12h-3V9zm7 0h2.877v1.64h.041c.4-.76 1.38-1.64 2.84-1.64 3.04 0 3.6 2.03 3.6 4.67V21H17v-6.21c0-1.48-.027-3.38-2.06-3.38-2.06 0-2.38 1.61-2.38 3.27V21H10.5V9z" />
  </svg>
);

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative">
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-10">
        {/* Brand and short blurb */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="text-2xl font-bold font-quicksand tracking-tight">RAG based Chatbot on NEEPCO's DOP </div>
            <p className="mt-3 max-w-prose font-quicksand text-sm text-neutral-400">
              An Internship Project that we did during our time in NEEPCO Shillong.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Pages</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/" className="hover:text-black">Home</Link></li>
              <li><Link to="/chat" className="hover:text-black">LIVE DEMO</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Social</h4>
            <div className="mt-4 w-20 h-auto flex items-center">
              {/* Keep href empty for now so they can be set later */}
              <a
                href="https://github.com/mrdeeeeep/neepcoChatbotDOP"
                aria-label="GitHub"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 transition"
              >
                <GitHubIcon className="h-auto w-10" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-neutral-800" />

        {/* Bottom row */}
        <div className="flex flex-col-reverse items-start justify-between gap-4 md:flex-row md:items-center">
          <p className="text-xs text-neutral-500">
            © {year} Project Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
