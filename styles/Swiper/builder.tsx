import React from 'react'

type SlideProps ={
    imagesURL: string[],
    productName: string
}

export function build_JSX_Slides({imagesURL, productName }: SlideProps){

    const items=
        imagesURL.map((item: any) => {
          return (
            <img
              src={item} alt={item} draggable={false}
              style={{
                width: "99%",
                height: "auto",
                margin: "0 auto",
                userSelect: "none",
              }}  
            />
          );
        })
      
}
