import React from 'react';
import { useRef, useState, RefObject } from 'react';


 /* The C or S around the code could be any letter or word if you would like, 
 and it is called Generics, it makes our utility function here accept 
 the type defined when the RefObject or the state is passed 
 because it can have any type. Using Generics, 
 our function here would be able to return the same type. 

 https://www.typescriptlang.org/docs/handbook/2/generics.html
 */

// to get the value of a ref from `useRef`
export function getRefValue<C>(ref: RefObject<C>) {
    return ref.current as C;
  }
  
  // extension of `useState` to be able to access the state as a ref
  export function useStateRef<S>(
    defaultValue: S
  ): [S, (value: S) => void, RefObject<S>] {
    const ref = useRef<S>(defaultValue);
    const [state, _setState] = useState<S>(defaultValue);
    const setState = (value: S) => {
      _setState(value);
      ref.current = value;
    };
  
    return [state, setState, ref];
  }

// to get the value of a ref from `useRef`
/* export function getRefValue(ref:any) {
    return ref.current as any;
  } */
  
  // extension of `useState` to be able to access the state as a ref
/*   export function useStateRef(
    defaultValue: any
  ){
    const ref = useRef<any>(defaultValue);
    const [state, _setState] = useState<any>(defaultValue);
    console.log(state)
    const setState = (value: any) => {
      _setState(value);
      ref.current = value;
    };
  
    return [state, setState, ref];
  } */