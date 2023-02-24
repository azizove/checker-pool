import {
    Contract,
    ContractProvider,
    Sender,
    Address,
    Cell,
    beginCell,
    contractAddress,
    TupleBuilder,
    TupleReader
  } from "ton-core";
import { getIdFromAddress } from "../helpers/identifiers";
import { Profile } from "../models";

export const Opcodes = {
    addChecker: 1,
    addProfile: 2,
    getProfile:3
}

export default class CheckerProcess implements Contract {
    // static createForDeploy(code: Cell, initialCheckerValue: number): CheckerProcess {
    //     const data = beginCell().storeUint(initialCheckerValue, 64).endCell();
    //     const workchain = 0; // deploy to workchain 0
    //     const address = contractAddress(workchain, { code, data });
    //     return new CheckerProcess(address, { code, data });
    // }
    // async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    //     await provider.internal(via, {
    //         value,
    //         body: beginCell()
    //             .endCell(),
    //     })
    // }

    async getCheckerStatus(provider: ContractProvider, wallet: string | null) {
       
            // if(!wallet) throw new Error('address is undefined')
            // const messageBody = getIdFromAddress(wallet);
            const result = await provider.get('get_checker', [/*{type: 'int', value: BigInt(messageBody)}*/]);
            console.log(result.stack)
            return result.stack.readNumber()
        
    }
    async getCheckers(provider: ContractProvider) {
            const result = await provider.get('get_key', [{type: 'int', value: BigInt(484)}]);
            const profile = result.stack.readString();
            return profile;
            
            // return 555
    }
    async sendProfile(provider: ContractProvider, via: Sender, wallet: string | null, profile: Profile) {
        if (wallet) {
            const messageBody = beginCell()
            .storeUint(Opcodes.addChecker, 32)
            .storeUint(484, 256)
            .storeStringTail(profile.getStringData())
            .endCell();
            await provider.internal(via, {
              value: "0.05", // send 0.002 TON for gas
              body: messageBody,
            });   
        }
        
    }

    constructor(
        readonly address: Address,
        readonly init?: { code: Cell, data: Cell },
    ) {}
}