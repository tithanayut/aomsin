
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

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

export interface Wallet {
    id: string;
    name: string;
    icon: string;
    balance: number;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface IQuery {
    wallets(): Nullable<Wallet>[] | Promise<Nullable<Wallet>[]>;
    wallet(id: string): Nullable<Wallet> | Promise<Nullable<Wallet>>;
}

export interface IMutation {
    createWallet(createWalletInput: CreateWalletInput): Wallet | Promise<Wallet>;
    updateWallet(updateWalletInput: UpdateWalletInput): Wallet | Promise<Wallet>;
    deleteWallet(id: string): Wallet | Promise<Wallet>;
}

export type DateTime = any;
type Nullable<T> = T | null;
