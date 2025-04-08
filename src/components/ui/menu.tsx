// src/components/Menu.js
import React from 'react';
import { Card } from './card';
import SimpleCard from './simplecard';
import  TrailCard  from './trailcard';

const Menu = () => {
  return (
    <section className="py-16 ">
      <div className="max-w-7xl mx-auto text-center">
          <TrailCard />
      </div>
    </section>
  );
};

export default Menu;
export { }
