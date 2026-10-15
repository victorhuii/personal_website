import {
  useEffect,
  useState,
} from "react";

import {
  SITE,
} from "../content/siteContent";


const FOOTER_NAV = [
  {
    label:
      "WORK",
    href:
      "#/work",
  },

  {
    label:
      "PORTFOLIO",
    href:
      "#/portfolio",
  },

  {
    label:
      "ABOUT",
    href:
      "#/about",
  },
];


function Clock() {
  const [
    now,
    setNow,
  ] =
    useState(
      new Date()
    );

  useEffect(() => {
    const timer =
      setInterval(
        () =>
          setNow(
            new Date()
          ),
        1000
      );

    return () =>
      clearInterval(
        timer
      );
  }, []);

  const hour =
    now.getHours() %
      12 ||
    12;

  const minute =
    String(
      now.getMinutes()
    ).padStart(
      2,
      "0"
    );

  return (
    <span>
      {hour}

      <span className="colon">
        :
      </span>

      {minute}{" "}

      {now.getHours() >=
      12
        ? "PM"
        : "AM"}
    </span>
  );
}


export default function Footer() {
  return (
    <footer className="footer gutter">
      <div className="container">

        <div className="footer-top">

          <div>
            <div className="footer-name">
              {
                SITE.name
              }
            </div>

            <p className="footer-cta">
              {
                SITE.footerCta
              }
            </p>

            <a
              href={`mailto:${SITE.email}`}
            >
              {
                SITE.email
              }
            </a>
          </div>

          <div className="footer-links">
            {FOOTER_NAV.map(
              ({
                label,
                href,
              }) => (
                <a
                  key={
                    label
                  }
                  href={
                    href
                  }
                >
                  {
                    label
                  }
                </a>
              )
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            Built with React ♡
          </span>

          <Clock />
        </div>
      </div>
    </footer>
  );
}