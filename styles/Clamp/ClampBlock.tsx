import React from 'react'
import {ClampsArray, clampPropsArray} from './Clamp'

interface ClampBlockProps {
    children: React.ReactNode;
    clamps: clampPropsArray[];
    className?: string;
    tag?: 'div' | 'span' | 'p' | 'section' | 'aside' | 'main' | 'article' | 'label' | 'blockquote' | 'header' | 'h1' | 'h2' | 'h3' | 'h4' | 'code'
  }
  
  const ClampBlock: React.FunctionComponent<ClampBlockProps> = ({children, clamps, className, tag}: ClampBlockProps) =>{
  
    const style = ClampsArray(clamps);


    switch (tag) {

        case "div":
          return <div className={className} style={style}>{children}</div>;
        case "span":
            return <span className={className} style={style}>{children}</span>;
        case "p":
            return <p className={className} style={style}>{children}</p>;
        case 'section' :
            return <section className={className} style={style}>{children}</section>;
        case 'aside':
            return <aside className={className} style={style}>{children}</aside>;
        case 'main':
            return <main className={className} style={style}>{children}</main>;
        case 'article':
            return <article className={className} style={style}>{children}</article>;
        case "label":
            return <label className={className} style={style}>{children}</label>;
        case "blockquote":
            return <blockquote className={className} style={style}>{children}</blockquote>;
        case "header":
            return <header className={className} style={style}>{children}</header>;
        case "h1":
            return <h1 className={className} style={style}>{children}</h1>;
        case "h2":
            return <h2 className={className} style={style}>{children}</h2>;
        case "h3":
            return <h3 className={className} style={style}>{children}</h3>;
        case "h4":
            return <h4 className={className} style={style}>{children}</h4>;
        case "code":
            return <code className={className} style={style}>{children}</code>;

           
        default:
            return <div className={className} style={style}>{children}</div>;
            
      }
  
  }
  
  export default ClampBlock;
  