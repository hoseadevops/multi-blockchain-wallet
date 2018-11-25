import * as bip39 from 'bip39';
import * as bitcoin from 'bitcoinjs-lib';
import { IWallet } from '../common/wallet';
import { address } from 'tronweb';
import { IPlugin } from '../common/plugin';

export const plugin: IPlugin = {
    createWalletByMnemonic(mnemonic) {
        const seed = bip39.mnemonicToSeed(mnemonic);
        const master = bitcoin.bip32.fromSeed(seed);

        const derived = master.derivePath("m/44'/195'/0'/0/0");

        const privateKey = derived.privateKey.toString('hex');
        const publicKey = address.fromPrivateKey(privateKey); // TODO - we use a big library just for this line, we should remove the lib

        return {
            type: 'tron',
            mnemonic: mnemonic,
            address: publicKey,
            keyPair: {
                publicKey: publicKey,
                privateKey: privateKey
            }
        };
    },

    generateWallet(): IWallet {
        const mnemonic = bip39.generateMnemonic();
        return plugin.createWalletByMnemonic(mnemonic);
    }
};