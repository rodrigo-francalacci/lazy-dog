/* React */
import React from 'react';

/* Framer Motion */
import { motion, useViewportScroll, useSpring } from "framer-motion";

/* TYPE MACHINE ANIMATION 
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/  
export const AnimatedTextWord = ({ text }: {text: string} ) => {

const words = text.split(" ");

const container = {
  hidden: {opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChilren: 0.04 * i }
  }),
};

const child = {
  visible: {
    opacity: 1,
    y:0,
    x:0,
    transition:{
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
  hidden: {
    opacity: 0,
    y:0,
    x:-5,
    transition:{
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};


  return (
    
      <motion.div
        style={{overflow: "hidden", display: "flex", flexWrap: "wrap"} } 
        variants={container} 
        initial="hidden" 
        whileInView="visible" /* instead of animate */
        viewport={{once:false, amount:0.2}}>
        {words.map((word, index) => (
          <motion.span variants={child} key={index}>{word}&nbsp;</motion.span>
        ))}
      </motion.div>

  )
}

/* PROGRESS BAR ANIMATION
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/  
export function ProgressBarAnimation() {
  const { scrollYProgress } = useViewportScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (<motion.div className="progress-bar" style={{ scaleX }} />);
}


/*  constants */
export const imageAnimate={
    offscreen:{x:-100, opacity:0},
    onscreen:{
    x:0,
    opacity:1,
    rotate:[0,10,0],
    transition: {type:"spring",
    bounce:0.4,
    duration:1}
  }
  }
  
export const textAnimateX={
    offscreen:{x:'-100vw', opacity:0},
    onscreen:{x:0,
    opacity:1,
    transition: {type:"spring",
    bounce:0.4,
    duration:2}
  }
  }

  export const textAnimateY={
    offscreen:{y:'-8vw', opacity:0},
    onscreen:{y:0,
    opacity:1,
    transition: {type:"spring",
    bounce:0.4,
    duration:2}
  }
  }





