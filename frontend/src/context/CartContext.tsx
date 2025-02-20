import React, { createContext, useContext, useReducer } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
}

interface CartAction {
  type: "ADD_TO_CART" | "REMOVE_FROM_CART" | "UPDATE_QUANTITY";
  payload: CartItem | { id: number; quantity?: number };
}

const initialState: CartState = {
  items: [],
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.items.find((item) => item.id === (action.payload as CartItem).id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === (action.payload as CartItem).id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload as CartItem],
      };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== (action.payload as { id: number }).id),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === (action.payload as { id: number }).id
            ? {
                ...item,
                quantity: (action.payload as { id: number; quantity: number }).quantity,
              }
            : item
        ),
      };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
