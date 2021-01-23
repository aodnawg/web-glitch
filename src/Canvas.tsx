import React, { useEffect, useRef } from "react";
import P5 from "p5";

import sketch from "./sketch";
const Canvas: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current === null) {
      return;
    }
    ref.current.querySelector("canvas")?.setAttribute("class", "canvas");
    const p = new P5(sketch, ref.current);
    return () => {
      p.remove();
    };
  });
  return <div ref={ref} style={{}}></div>;
};

export default Canvas;
