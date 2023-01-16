
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum CategoryType {
    INCOME = "INCOME",
    EXPENSE = "EXPENSE",
    TRANSFER = "TRANSFER"
}

export enum UserProvider {
    LOCAL = "LOCAL",
    LDAP = "LDAP",
    LINE = "LINE",
    AZURE_AD = "AZURE_AD"
}

export interface CreateCategoryInput {
    type: CategoryType;
    name: string;
    icon: string;
    note?: Nullable<string>;
}

export interface UpdateCategoryInput {
    id: string;
    name?: Nullable<string>;
    icon?: Nullable<string>;
    note?: Nullable<string>;
}

export interface CreateWalletInput {
    name: string;
    icon: string;
    balance: number;
}

export interface UpdateWalletInput {
    id: string;
    name?: Nullable<string>;
    icon?: Nullable<string>;
}

export interface Category {
    id: string;
    type: CategoryType;
    name: string;
    icon: string;
    note?: Nullable<string>;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface IQuery {
    categories(): Nullable<Category>[] | Promise<Nullable<Category>[]>;
    category(id: string): Nullable<Category> | Promise<Nullable<Category>>;
    me(): User | Promise<User>;
    wallets(): Nullable<Wallet>[] | Promise<Nullable<Wallet>[]>;
    wallet(id: string): Nullable<Wallet> | Promise<Nullable<Wallet>>;
}

export interface IMutation {
    createCategory(createCategoryInput: CreateCategoryInput): Category | Promise<Category>;
    updateCategory(updateCategoryInput: UpdateCategoryInput): Category | Promise<Category>;
    deleteCategory(id: string): Category | Promise<Category>;
    createWallet(createWalletInput: CreateWalletInput): Wallet | Promise<Wallet>;
    updateWallet(updateWalletInput: UpdateWalletInput): Wallet | Promise<Wallet>;
    deleteWallet(id: string): Wallet | Promise<Wallet>;
}

export interface User {
    id: string;
    provider: UserProvider;
    provider_uid?: Nullable<string>;
    name: string;
    username?: Nullable<string>;
    lastLoggedIn?: Nullable<DateTime>;
    isActive: boolean;
    createdAt: DateTime;
    updatedAt: DateTime;
    Wallet: Nullable<Wallet>[];
    Category: Nullable<Category>[];
}

export interface Wallet {
    id: string;
    name: string;
    icon: string;
    balance: number;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export type DateTime = any;
type Nullable<T> = T | null;
