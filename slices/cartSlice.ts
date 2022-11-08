
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/* Types */
type PayloadType ={
  id: string;
  title: string;
  shortDetails: string;
  price: number;
  personalized: 'yes' | "no";
  dogName: string | undefined;
  imgURL: string;
  quantity: number;
  
}

type ItemCart = PayloadType;

type CartState = {
    cart: ItemCart[];
    subtotal: number;
    numberOfItems: number;
  }

/* Aux Functions */
function calcSubtotal(items: PayloadType[]){
    let sum = 0;
    for (let index = 0; index < items.length; index++) {
        sum += items[index].price*items[index].quantity;
    }
    return sum
}

function calcNumberOfItems(items: PayloadType[]){
    let output = 0;
    for (let index = 0; index < items.length; index++) {
      output += items[index].quantity;
    }
    return output
}

/* Set the initial value */
const initialState: CartState = {
    cart: [],
    subtotal: 0,
    numberOfItems: 0,
  }

/* Create the cart slice */
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  
  reducers: {
    /*addToCart --> Receives the item object to be added to the state as payload. 
    To add the item, we first check if it already exists using the find method; 
    if it does, we increment its quantity, but if not, 
    we add it to the state using the push method. */
    addToCart: (state, action: PayloadAction<PayloadType>) => {
      const itemInCart = state.cart.find((item) => (item.id === action.payload.id));

      if (itemInCart) {
        itemInCart.quantity = itemInCart.quantity + action.payload.quantity;
      } else {
        state.cart.push({ ...action.payload, quantity: action.payload.quantity });
      }

      state.subtotal = calcSubtotal(state.cart);
      state.numberOfItems = calcNumberOfItems(state.cart)
    },

    /*incrementQuantity --> Receives an item ID as payload, 
    used to find the item in the state using the find method and then increment its quantity by 1. */
    incrementQuantity: (state, action: PayloadAction<{id: string}>) => {
      const item = state.cart.find((item) => (item.id === action.payload.id));
      item!.quantity++;
      state.subtotal = calcSubtotal(state.cart);
      state.numberOfItems = calcNumberOfItems(state.cart)
    },

    /*decrementQuantity --> This reducer receives an item ID as payload. 
    Using the ID, we find and decrement the item quantity 
    in the state only when its quantity is greater than 1. */
    decrementQuantity: (state, action: PayloadAction<{id: string}>) => {
      const item = state.cart.find((item) => (item.id === action.payload.id));
      if (item!.quantity === 1) {
        item!.quantity = 1
      } else {
        item!.quantity--;
      }
      state.subtotal = calcSubtotal(state.cart);
      state.numberOfItems = calcNumberOfItems(state.cart)
    },

    /*removeItem --> Receives the item ID as a payload which is 
    then used to remove from the state using the filter method. */
    removeItem: (state, action:PayloadAction<{id: string}>) => {
      const removeItem = state.cart.filter((item) => (item.id !== action.payload.id)); 
      state.cart = removeItem;
      state.subtotal = calcSubtotal(state.cart);
      state.numberOfItems = calcNumberOfItems(state.cart)
    },
  },
});

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeItem,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;