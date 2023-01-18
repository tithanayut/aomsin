
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum TransactionType {
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
    type: TransactionType;
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

export interface CreateTransactionInput {
    datetime?: Nullable<DateTime>;
    type: TransactionType;
    walletId: string;
    categoryId: string;
    amount: number;
    note?: Nullable<string>;
}

export interface CreateTransferTransactionInput {
    datetime?: Nullable<DateTime>;
    fromWalletId: string;
    toWalletId: string;
    categoryId: string;
    amount: number;
    note?: Nullable<string>;
}

export interface UpdateTransactionInput {
    id: string;
    datetime?: Nullable<DateTime>;
    fromWalletId?: Nullable<string>;
    toWalletId?: Nullable<string>;
    categoryId?: Nullable<string>;
    amount?: Nullable<number>;
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
    type: TransactionType;
    name: string;
    icon: string;
    note?: Nullable<string>;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface IQuery {
    categories(): Nullable<Category>[] | Promise<Nullable<Category>[]>;
    category(id: string): Nullable<Category> | Promise<Nullable<Category>>;
    transactions(): Nullable<Transaction>[] | Promise<Nullable<Transaction>[]>;
    transaction(id: string): Nullable<Transaction> | Promise<Nullable<Transaction>>;
    me(): User | Promise<User>;
    wallets(): Nullable<Wallet>[] | Promise<Nullable<Wallet>[]>;
    wallet(id: string): Nullable<Wallet> | Promise<Nullable<Wallet>>;
}

export interface IMutation {
    createCategory(createCategoryInput: CreateCategoryInput): Category | Promise<Category>;
    updateCategory(updateCategoryInput: UpdateCategoryInput): Category | Promise<Category>;
    deleteCategory(id: string): Category | Promise<Category>;
    createTransaction(createTransactionInput: CreateTransactionInput): Transaction | Promise<Transaction>;
    createTransferTransaction(CreateTransferTransactionInput: CreateTransferTransactionInput): Transaction | Promise<Transaction>;
    updateTransaction(updateTransactionInput: UpdateTransactionInput): Transaction | Promise<Transaction>;
    deleteTransaction(id: string): Nullable<Transaction> | Promise<Nullable<Transaction>>;
    createWallet(createWalletInput: CreateWalletInput): Wallet | Promise<Wallet>;
    updateWallet(updateWalletInput: UpdateWalletInput): Wallet | Promise<Wallet>;
    deleteWallet(id: string): Wallet | Promise<Wallet>;
}

export interface Transaction {
    id: string;
    datetime: DateTime;
    type: TransactionType;
    wallet: Wallet;
    category: Category;
    amount: number;
    note?: Nullable<string>;
    transferWallet?: Nullable<Wallet>;
    createdAt: DateTime;
    updatedAt: DateTime;
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
    wallet: Nullable<Wallet>[];
    category: Nullable<Category>[];
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
