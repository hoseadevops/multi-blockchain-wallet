/* globals it, describe, expect */

import * as assert from 'assert';
import { generateMulti, createWalletByMnemonicMulti, validateMnemonic, generateMnemonic, createWalletByMnemonic, signTransaction } from '../src';

const SAMPLE_MNEMONIC = 'robot leisure pipe wave drop quote lift vicious vacuum tattoo consider town';
describe('Bancor Module', () => {
    it('should generate multi blockchain wallets by the same mnemonic', () => {
        const wallets = generateMulti();

        wallets.forEach(wallet => {
            assert(wallet.keyPair.privateKey);
        });
    });

    it('should create multi blockchain wallets by provided mnemonic', () => {
        const mnemonic = SAMPLE_MNEMONIC;
        const wallets = createWalletByMnemonicMulti(mnemonic);

        wallets.forEach(wallet => {
            assert(wallet.keyPair.privateKey);
            assert(wallet.keyPair.publicKey);
        });
    });

    it('validate mnemonic', () => {
        const mnemonicValid = SAMPLE_MNEMONIC;
        assert(validateMnemonic(mnemonicValid));

        const mnemonicInvalid = 'ecolo## escape broken alarm source decorate jewel gadget clean surround version';
        assert(!validateMnemonic(mnemonicInvalid));
    });

    it('should generate a valid mnemonic', () => {
        const mnemonic = generateMnemonic();
        assert(validateMnemonic(mnemonic));
    });

    it('should sign a sample EOS transaciton', async () => {
        const wallet = createWalletByMnemonic(SAMPLE_MNEMONIC, 'eos');

        const privateKey = wallet.keyPair.privateKey;
        const transaciton = {
            chainId: '12345',
            serializedTransaction: new Uint8Array([0, 16, 32, 128, 255])
        };
        const signedTransaction = await signTransaction('eos', transaciton, privateKey);
        assert(signedTransaction[0].includes('SIG'));
    });

    it('should sign a sample Ethereum transaciton', () => {
        const wallet = createWalletByMnemonic(SAMPLE_MNEMONIC, 'ethereum');
        const privateKey = wallet.keyPair.privateKey;
        const rawTransaction = { from: '0x26ac3cd6ffc1d006a56fb9cbe7bbafdff4a2efb9', value: '0x2386f26fc10000', to: '0xa56d14a49c9a81fffaef02649f007593aa33cede', gasPrice: '0x3b9aca00', nonce: '0x1', gasLimit: '0x5208' };
        const signedTransaction = signTransaction('ethereum', rawTransaction, privateKey);

        assert(signedTransaction.length == 218);
    });
});
