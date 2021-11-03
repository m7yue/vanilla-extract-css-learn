import React from "react";

import {
  themeClass,
  titleClass,
  menuClass,
  menuItemsClass,
  menuItemClass,
  sectionStyle,
  vars
} from "./index.css";

console.log(vars)

const CreateTheme = () => (
  <div className={themeClass}>
    <header className={menuClass}>
      <h1 className={titleClass}>Hello World!</h1>

      <ul className={menuItemsClass}>
        <li>
          <a className={menuItemClass} href="#">
            Hello
          </a>
        </li>
        <li>
          <a className={menuItemClass} href="#">
            World
          </a>
        </li>
        <li>
          <a className={menuItemClass} href="#">
            Vanilla
          </a>
        </li>
        <li>
          <a className={menuItemClass} href="#">
            Extract
          </a>
        </li>
      </ul>
    </header>

    <section className={sectionStyle}>
      <p>Body contents here!</p>
    </section>
  </div>
);

export default CreateTheme