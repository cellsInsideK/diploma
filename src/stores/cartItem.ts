export interface CartItem {
  id: string;
  title: string;
  price: number;
  type: string;
  image: string;
  desc: string;
  milk: Topping[] | null;
  toppings: Topping[] | null;
}

export interface LocalCartItem extends CartItem {
  localId: number;
  quantity: number;
  selectedMilk: string;
  selectedTopping: string;
}

export interface DeliveryItem {
  id: string;
  items: LocalCartItem[];
  tel: string;
  address: string;
  comment: string;
  status: string;
  date: string;
  totalPrice: number;
  reason: string;
}

export interface Topping {
  label: string;
  value: string;
  price: number;
}
