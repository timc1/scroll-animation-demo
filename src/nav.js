import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { Link } from "@reach/router";

export default React.forwardRef(function Nav(
  { sections, beginningContent, endContent, isShowing, currentSection },
  ref
) {
  const scalerRef = useRef(null);
  useEffect(
    () => {
      const {
        top: topOfBeginning,
        bottom: bottomOfTop
      } = beginningContent.current.getBoundingClientRect();
      const {
        bottom: bottomOfEnd
      } = endContent.current.getBoundingClientRect();

      // We will be using totalHeight to calculate how much content is left oto scroll
      const totalHeight = bottomOfEnd - topOfBeginning;

      // Setup our scroll event
      const scrollEvent = () => {
        if (topOfBeginning <= window.scrollY) {
          const percentage = (window.scrollY / totalHeight).toFixed(2);
          scalerRef.current.style.transform = `scaleY(${percentage})`;
        } else {
          scalerRef.current.style.transform = `scaleY(0)`;
        }
      };

      if (isShowing) {
        window.addEventListener("scroll", scrollEvent);
      } else {
        window.removeEventListener("scroll", scrollEvent);
        // Reset scroller to 0
        scalerRef.current.style.transform = `scaleY(0)`;
      }

      // Cleanup before unmount
      return () => window.removeEventListener("scroll", scrollEvent);
    },
    [isShowing]
  );

  return (
    <Aside ref={ref} isShowing={isShowing}>
      <Items>
        {sections.map(section => (
          <Item key={section.id} isActive={section.id === currentSection}>
            <NavLink to="#" tabIndex={isShowing ? 0 : -1}>
              {section.header}
            </NavLink>
          </Item>
        ))}
        <li ref={scalerRef} className="scaler" aria-hidden="true" />
      </Items>
    </Aside>
  );
});

// styles
const Aside = styled.aside`
  position: sticky;
  top: 50%;
  opacity: ${props => (props.isShowing ? 1 : 0)};
  transition: opacity 0.25s ease-out;
  mix-blend-mode: difference;
  padding-left: 25px;
`;

const Items = styled.ul`
  position: absolute;
  top: 0;
  transform: translateY(-50%);
  margin: 0 0 0 25px;
  padding: 0 0 0 25px;
  list-style: none;
  display: grid;
  grid-gap: 20px;

  &::before {
    content: "";
    background: rgba(212, 212, 212, 0.4);
    position: absolute;
    top: -50%;
    bottom: -50%;
    width: 1px;
  }

  .scaler {
    background: #fff;
    position: absolute;
    top: -50%;
    bottom: -50%;
    width: 1px;
    transform-origin: 0 0;
    transform: scaleY(0);
    transition: transform 0.25s ease-out;
  }
`;

const Item = styled.li`
  > a {
    color: ${props => (props.isActive ? "#fff" : "rgba(78, 78, 78, 0.5)")};
  }
`;

const NavLink = styled(Link)`
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  padding: 8px 15px;
  font-size: 12px;
  font-family: sans-serif;
  text-transform: uppercase;
`;
