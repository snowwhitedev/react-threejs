import React from 'react';
import { NavLink } from 'react-router-dom';
import './SideBar.css';

import styles from "./css.module.css";

const SideBar = () => {
  return (
    <ul className="side-menu">
      <li>
        <NavLink to="/" exact className="side-nav-item">
          Simple Cubic
        </NavLink>
      </li>
      <li>
        <NavLink to="/simple/line" exact className="side-nav-item">
          Simple Line
        </NavLink>
      </li>
      <li>
        <NavLink to="/simple/text" exact className="side-nav-item">
          Simple Text
        </NavLink>
      </li>
      <li>
        <NavLink to="/animation/cloth" exact className="side-nav-item">
          Animation Cloth
        </NavLink>
      </li>
      <li>
        <NavLink to="/animation/keyframes" exact className="side-nav-item">
          Animation Keyframes
        </NavLink>
      </li>
      <li>
        <NavLink to="/animation/skinning/morph" exact className="side-nav-item">
          Animation Skinning Morph
        </NavLink>
      </li>
      <li><p className={styles.testcss}>This is test item</p></li>
    </ul>
  )
};

export default SideBar;
