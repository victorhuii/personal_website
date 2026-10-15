import {
  useEffect,
  useState,
} from "react";

import "./App.css";
import "./styles/motion.css";
import "./styles/intro.css";
import "./styles/creation.css";
import "./styles/ripple.css";
import "./styles/landing.css";
import "./styles/page-entrance.css";
import WorkPage from "./pages/WorkPage";

import TopHeader from "./components/TopHeader";
import Footer from "./components/Footer";

import AboutPage from "./pages/AboutPage";
import IntroPage from "./pages/IntroPage";
import LandingPage from "./pages/LandingPage";
import RipplePage from "./pages/RipplePage";


function pageFromHash() {
  const page =
    window.location.hash
      .replace(
        /^#\//,
        ""
      )
      .toLowerCase();


  /*
  No hash = landing page.
  */

  if (
    !page ||
    page === "home"
  ) {
    return "home";
  }


  /*
  Old links continue working.

  Art + Intro both open
  the Portfolio page.
  */

  if (
    page === "art" ||
    page === "intro" ||
    page === "portfolio"
  ) {
    return "portfolio";
  }


  /*
  Old hand-character creation
  route goes home now.
  */

  if (
    page === "creation"
  ) {
    return "home";
  }


  if (
    [
      "work",
      "about",
      "creation-2",
    ].includes(
      page
    )
  ) {
    return page;
  }


  return "home";
}



export default function App() {
  const [
    page,
    setPage,
  ] =
    useState(
      pageFromHash
    );


  useEffect(() => {
    function handleHashChange() {
      const nextPage =
        pageFromHash();


      setPage(
        nextPage
      );


      /*
      Whenever we navigate to a
      separate page, begin at top.
      */

      const root =
        document.documentElement;


      const previousBehavior =
        root.style.scrollBehavior;


      root.style.scrollBehavior =
        "auto";


      window.scrollTo({
        top: 0,

        left: 0,

        behavior:
          "auto",
      });


      root.style.scrollBehavior =
        previousBehavior;
    }


    window.addEventListener(
      "hashchange",
      handleHashChange
    );


    return () => {
      window.removeEventListener(
        "hashchange",
        handleHashChange
      );
    };
  }, []);


  /*
  =====================================
  LANDING PAGE
  =====================================
  */

  if (
    page === "home"
  ) {
    return (
      <LandingPage />
    );
  }


  /*
  =====================================
  PORTFOLIO

  Your old intro / art collage.
  =====================================
  */

  if (
    page === "portfolio"
  ) {
    return (
      <IntroPage
        onEnter={() => {
          window.location.hash =
            "#/about";
        }}
      />
    );
  }


  /*
  =====================================
  PARTICLE STUDY
  =====================================
  */

  if (
    page === "creation-2"
  ) {
    return (
      <RipplePage />
    );
  }


  /*
  =====================================
  ABOUT PAGE

  Completely separate from Landing.
  =====================================
  */

  if (
    page === "about"
  ) {
    return (
      <div className="page">

        <TopHeader
          page="about"
        />


        <AboutPage />


        <Footer />

      </div>
    );
  }


  /*
  =====================================
  WORK

  Still blank until you build it.
  =====================================
  */

  if (
    page === "work"
  ) {
    return (
      <div className="page">

        <TopHeader page={sitePage} />
        {sitePage === "work" ? (
          <><WorkPage /><Footer /></>
        ) : sitePage === "about" ? (
          <><AboutPage /><Footer /></>
        ) : (
          /* Keep your existing Portfolio/other-tab rendering here. */
          <main className="blank-page" />
        )}

      </div>
    );
  }


  return (
    <LandingPage />
  );
}