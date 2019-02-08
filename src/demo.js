import React, { useReducer, useRef } from "react";
import styled from "@emotion/styled";

import Nav from "./nav";
import useIntersectionObserver from "./use-intersection-observer";

const reducer = (state, action) => {
  switch (action.type) {
    case "SHOW_NAV":
      return {
        ...state,
        isNavShowing: true
      };
    case "HIDE_NAV": {
      return {
        ...state,
        isNavShowing: false
      };
    }
    case "TOGGLE_SECTION":
      return {
        ...state,
        currentlyFocusedSection: action.payload.sectionId
      };
    default:
      return state;
  }
};

const initialState = {
  isNavShowing: false,
  currentlyFocusedSection: ""
};

export default function Demo() {
  const navRef = useRef(null);
  const bannerRef = useRef(null);
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const productsRef = useRef(null);
  const pricingRef = useRef(null);
  const jobsRef = useRef(null);

  const sections = [
    { id: "home", header: "Home", ref: homeRef },
    { id: "about", header: "About", ref: aboutRef },
    { id: "products", header: "Products", ref: productsRef },
    { id: "pricing", header: "Pricing", ref: pricingRef },
    { id: "jobs", header: "Jobs", ref: jobsRef }
  ];

  const [state, dispatch] = useReducer(reducer, initialState);

  // An IntersectionObserver hook for showing the <Nav /> when
  // the <Banner /> leaves the view.
  useIntersectionObserver({
    refs: [bannerRef],
    callback: ({ isIntersecting }) => {
      if (isIntersecting) {
        dispatch({ type: "HIDE_NAV" });
      } else {
        dispatch({ type: "SHOW_NAV" });
      }
    },
    options: {
      // a threshold of 0 will trigger our IntersectionObserver at the
      // base of the element – a threshold of 1 would trigger at the top.
      threshold: [0]
    }
  });

  // An IntersectionObserver hook for updating which navigation
  // list item is currently in focus, based on which DOM element
  // is currently in the viewport.
  let currentSection, previousSection;
  useIntersectionObserver({
    refs: [homeRef, aboutRef, productsRef, pricingRef, jobsRef],
    callback: ({ isIntersecting, target }) => {
      const sectionData = target.getAttribute("data-section-id");

      if (isIntersecting) {
        dispatch({
          type: "TOGGLE_SECTION",
          payload: {
            sectionId: sectionData
          }
        });

        previousSection = currentSection;
        currentSection = sectionData;
      } else {
        if (currentSection === sectionData && previousSection) {
          currentSection = previousSection;

          dispatch({
            type: "TOGGLE_SECTION",
            payload: {
              sectionId: previousSection
            }
          });
        }
      }
    },
    options: {
      root: navRef.current,
      threshold: [0.5]
    }
  });

  return (
    <Container>
      <Nav
        ref={navRef}
        sections={sections}
        beginningContent={homeRef}
        endContent={jobsRef}
        isShowing={state.isNavShowing}
        currentSection={state.currentlyFocusedSection}
      />
      <Section ref={bannerRef} data-section-id="banner">
        <Heading>Banner</Heading>
      </Section>
      {sections.map(section => (
        <Section
          key={section.id}
          data-section-id={section.id}
          ref={section.ref}
        >
          <Heading>{section.header}</Heading>
        </Section>
      ))}
    </Container>
  );
}

// styles
const Container = styled.div`
  section:first-of-type {
    background: #25283c;
    color: #fdffdf;
  }
  section:nth-of-type(2) {
    background: #fff6e2;
    color: #000;
  }
  section:nth-of-type(3) {
    background: #200623;
    color: #fff;
  }
  section:nth-of-type(4) {
    background: #ffda83;
    color: #042996;
  }
  section:nth-of-type(5) {
    background: #00674a;
    color: #fff;
  }
  section:nth-of-type(6) {
    background: #fff;
    color: #000;
  }
`;

const Section = styled.section`
  height: 100vh;
  display: grid;
  place-items: center;
`;

const Heading = styled.h1`
  margin: 0;
  font-size: 3rem;
`;
