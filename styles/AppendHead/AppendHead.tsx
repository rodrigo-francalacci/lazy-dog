import React from 'react'
import { useEffect } from 'react';

//Types
interface AppendHeadProps {
  children: React.ReactNode;
}

//===========================================================================================================================
const AppendHead: React.FunctionComponent<AppendHeadProps> = ({children }: AppendHeadProps) => {
  
  useEffect(() => {
    document.head.innerHTML = document.head.innerHTML! + children?.toString.toString!
    }, []);

    return(<></>)
    
 
}

export default AppendHead



