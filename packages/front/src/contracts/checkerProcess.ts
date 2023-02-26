import {
    Contract,
    ContractProvider,
    Sender,
    Address,
    Cell,
    beginCell,
    contractAddress,
    TupleBuilder,
    TupleReader,
    Dictionary,
    Slice,
    DictionaryValue,
    Builder,
    SimpleLibrary
  } from "ton-core";
import { Maybe } from "ton-core/dist/utils/maybe";
import { getIdFromAddress } from "../helpers/identifiers";
import { Profile } from "../models";

export const Opcodes = {
    addChecker: 1,
    addProfile: 2,
    getProfile:3
}

export interface SimpleProfile {
    value: string | null;
}

export function loadSimpleProfile(slice: Slice): SimpleProfile {
    return {
        value: slice.loadStringRefTail()
    };
}
export const SimpleProfileValue: DictionaryValue<SimpleProfile> = {
    serialize(src, builder) {
        storeSimpleProfile(src)(builder);
    },
    parse(src) {
        return {value: src.loadStringTail()};
    },
};
export function storeSimpleProfile(src: SimpleProfile) {
    return (builder: Builder) => {
        builder.storeStringTail(src?.value || '');
    }
}
export default class CheckerProcess implements Contract {
    async getProfile(provider: ContractProvider, profile: Profile) {
        console.log("inside getProfils")
        const {stack} = await provider.get('get_key', [{type: 'int', value: BigInt(profile.id)}]);
        const result = stack.readString()
        return result;
    }
    
    async getProfiles(provider: ContractProvider) {
        const {stack} = await provider.get('get_profiles', []);
        const result = stack.readCell().asSlice().loadDictDirect(Dictionary.Keys.BigUint(256), SimpleProfileValue).values();
        const profiles: Array<Profile> = []
        result.forEach((data: SimpleProfile) => {
            return profiles.push(Profile.getProfileFromString(data.value ?? ''));
        })
        return profiles;
    }
    


    async sendProfile(provider: ContractProvider, via: Sender, wallet: string | null, profile: Profile): Promise<void> {
        if (wallet) {
            const messageBody = beginCell()
            .storeUint(Opcodes.addChecker, 32)
            .storeUint(profile.id, 256)
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