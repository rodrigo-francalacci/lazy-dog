/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type ProcessOrderInput = {
  id: string,
  cart?: Array< CartItem | null > | null,
  total: number,
  token: string,
  address?: string | null,
};

export type CartItem = {
  id: string,
  title?: string | null,
  image?: string | null,
  price?: number | null,
  quantity?: number | null,
};

export enum OrderStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}


export type CreateUserInput = {
  id?: string | null,
  username: string,
  firstName?: string | null,
  lastName?: string | null,
  adress?: string | null,
  stripeOrders?: Array< string | null > | null,
  stripeData?: string | null,
  wishlist?: Array< string | null > | null,
  cartState?: string | null,
};

export type ModelUserConditionInput = {
  username?: ModelStringInput | null,
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  adress?: ModelStringInput | null,
  stripeOrders?: ModelStringInput | null,
  stripeData?: ModelStringInput | null,
  wishlist?: ModelStringInput | null,
  cartState?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type User = {
  __typename: "User",
  id: string,
  username: string,
  firstName?: string | null,
  lastName?: string | null,
  adress?: string | null,
  stripeOrders?: Array< string | null > | null,
  stripeData?: string | null,
  wishlist?: Array< string | null > | null,
  cartState?: string | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type UpdateUserInput = {
  id: string,
  username?: string | null,
  firstName?: string | null,
  lastName?: string | null,
  adress?: string | null,
  stripeOrders?: Array< string | null > | null,
  stripeData?: string | null,
  wishlist?: Array< string | null > | null,
  cartState?: string | null,
};

export type DeleteUserInput = {
  id: string,
};

export type CreateOrderInput = {
  id?: string | null,
  stripeID: string,
  user: string,
  date?: string | null,
  total?: number | null,
  billingAdress?: string | null,
  shippingAdress?: string | null,
  cartState?: string | null,
  products?: Array< string | null > | null,
};

export type ModelOrderConditionInput = {
  stripeID?: ModelStringInput | null,
  user?: ModelStringInput | null,
  date?: ModelStringInput | null,
  total?: ModelFloatInput | null,
  billingAdress?: ModelStringInput | null,
  shippingAdress?: ModelStringInput | null,
  cartState?: ModelStringInput | null,
  products?: ModelStringInput | null,
  and?: Array< ModelOrderConditionInput | null > | null,
  or?: Array< ModelOrderConditionInput | null > | null,
  not?: ModelOrderConditionInput | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Order = {
  __typename: "Order",
  id: string,
  stripeID: string,
  user: string,
  date?: string | null,
  total?: number | null,
  billingAdress?: string | null,
  shippingAdress?: string | null,
  cartState?: string | null,
  products?: Array< string | null > | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type UpdateOrderInput = {
  id: string,
  stripeID?: string | null,
  user?: string | null,
  date?: string | null,
  total?: number | null,
  billingAdress?: string | null,
  shippingAdress?: string | null,
  cartState?: string | null,
  products?: Array< string | null > | null,
};

export type DeleteOrderInput = {
  id: string,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  username?: ModelStringInput | null,
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  adress?: ModelStringInput | null,
  stripeOrders?: ModelStringInput | null,
  stripeData?: ModelStringInput | null,
  wishlist?: ModelStringInput | null,
  cartState?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type ModelOrderFilterInput = {
  id?: ModelIDInput | null,
  stripeID?: ModelStringInput | null,
  user?: ModelStringInput | null,
  date?: ModelStringInput | null,
  total?: ModelFloatInput | null,
  billingAdress?: ModelStringInput | null,
  shippingAdress?: ModelStringInput | null,
  cartState?: ModelStringInput | null,
  products?: ModelStringInput | null,
  and?: Array< ModelOrderFilterInput | null > | null,
  or?: Array< ModelOrderFilterInput | null > | null,
  not?: ModelOrderFilterInput | null,
};

export type ModelOrderConnection = {
  __typename: "ModelOrderConnection",
  items:  Array<Order | null >,
  nextToken?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ProcessOrderMutationVariables = {
  input: ProcessOrderInput,
};

export type ProcessOrderMutation = {
  processOrder?: OrderStatus | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    username: string,
    firstName?: string | null,
    lastName?: string | null,
    adress?: string | null,
    stripeOrders?: Array< string | null > | null,
    stripeData?: string | null,
    wishlist?: Array< string | null > | null,
    cartState?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    username: string,
    firstName?: string | null,
    lastName?: string | null,
    adress?: string | null,
    stripeOrders?: Array< string | null > | null,
    stripeData?: string | null,
    wishlist?: Array< string | null > | null,
    cartState?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    id: string,
    username: string,
    firstName?: string | null,
    lastName?: string | null,
    adress?: string | null,
    stripeOrders?: Array< string | null > | null,
    stripeData?: string | null,
    wishlist?: Array< string | null > | null,
    cartState?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateOrderMutationVariables = {
  input: CreateOrderInput,
  condition?: ModelOrderConditionInput | null,
};

export type CreateOrderMutation = {
  createOrder?:  {
    __typename: "Order",
    id: string,
    stripeID: string,
    user: string,
    date?: string | null,
    total?: number | null,
    billingAdress?: string | null,
    shippingAdress?: string | null,
    cartState?: string | null,
    products?: Array< string | null > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateOrderMutationVariables = {
  input: UpdateOrderInput,
  condition?: ModelOrderConditionInput | null,
};

export type UpdateOrderMutation = {
  updateOrder?:  {
    __typename: "Order",
    id: string,
    stripeID: string,
    user: string,
    date?: string | null,
    total?: number | null,
    billingAdress?: string | null,
    shippingAdress?: string | null,
    cartState?: string | null,
    products?: Array< string | null > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteOrderMutationVariables = {
  input: DeleteOrderInput,
  condition?: ModelOrderConditionInput | null,
};

export type DeleteOrderMutation = {
  deleteOrder?:  {
    __typename: "Order",
    id: string,
    stripeID: string,
    user: string,
    date?: string | null,
    total?: number | null,
    billingAdress?: string | null,
    shippingAdress?: string | null,
    cartState?: string | null,
    products?: Array< string | null > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    username: string,
    firstName?: string | null,
    lastName?: string | null,
    adress?: string | null,
    stripeOrders?: Array< string | null > | null,
    stripeData?: string | null,
    wishlist?: Array< string | null > | null,
    cartState?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      username: string,
      firstName?: string | null,
      lastName?: string | null,
      adress?: string | null,
      stripeOrders?: Array< string | null > | null,
      stripeData?: string | null,
      wishlist?: Array< string | null > | null,
      cartState?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetOrderQueryVariables = {
  id: string,
};

export type GetOrderQuery = {
  getOrder?:  {
    __typename: "Order",
    id: string,
    stripeID: string,
    user: string,
    date?: string | null,
    total?: number | null,
    billingAdress?: string | null,
    shippingAdress?: string | null,
    cartState?: string | null,
    products?: Array< string | null > | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListOrdersQueryVariables = {
  filter?: ModelOrderFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListOrdersQuery = {
  listOrders?:  {
    __typename: "ModelOrderConnection",
    items:  Array< {
      __typename: "Order",
      id: string,
      stripeID: string,
      user: string,
      date?: string | null,
      total?: number | null,
      billingAdress?: string | null,
      shippingAdress?: string | null,
      cartState?: string | null,
      products?: Array< string | null > | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UsersByUsernameQueryVariables = {
  username: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UsersByUsernameQuery = {
  usersByUsername?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      username: string,
      firstName?: string | null,
      lastName?: string | null,
      adress?: string | null,
      stripeOrders?: Array< string | null > | null,
      stripeData?: string | null,
      wishlist?: Array< string | null > | null,
      cartState?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OrdersByUserQueryVariables = {
  user: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelOrderFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type OrdersByUserQuery = {
  ordersByUser?:  {
    __typename: "ModelOrderConnection",
    items:  Array< {
      __typename: "Order",
      id: string,
      stripeID: string,
      user: string,
      date?: string | null,
      total?: number | null,
      billingAdress?: string | null,
      shippingAdress?: string | null,
      cartState?: string | null,
      products?: Array< string | null > | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};
