import React from 'react';

//To apply the same logic for mobile
/* I created this helper function because in touch events, 
it doesn't return the clientX in the event data, it is stored 
in the changedTouches array. So if changedTouches exists 
in the event data, then we should get the clientX value 
from the first element of it. */
export function getTouchEventData(
  e:
    | TouchEvent
    | MouseEvent
    | React.TouchEvent<HTMLElement>
    | React.MouseEvent<HTMLElement>
) {
  return 'changedTouches' in e ? e.changedTouches[0] : e;
}