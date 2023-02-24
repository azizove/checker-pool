import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from "ton-core";

export type CheckerProcessConfig = {
    id: number
}

export function checkerProcessConfigToCell(config: CheckerProcessConfig): Cell {
    return beginCell()
        .storeInt(config.id, 32)
        .storeDict()
        .endCell()
}


export const Opcodes = {
    addChecker: 1,
    addProfile: 2,
    getProfile:3
}

export class CheckerProcess implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell, data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new CheckerProcess(address)
    }

    static createFromConfig(config: CheckerProcessConfig, code: Cell, workchain = 0) {
        const data = checkerProcessConfigToCell(config)
        const init = { code, data }
        return new CheckerProcess(contractAddress(workchain, init), init)
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATLY,
            body: beginCell()
                .endCell(),
        })
    }

    

    async getChecker(provider: ContractProvider) {
        const result = await provider.get('get_checker', []);
        console.log(result.stack)
        return result.stack
    }
    async sendChecker(provider: ContractProvider, via: Sender) {
        const messageBody = beginCell()
        .storeUint(Opcodes.addChecker, 32)
        .storeUint(0, 64)
        .endCell();
        await provider.internal(via, {
          value: "0.002", // send 0.002 TON for gas
          body: messageBody,
        });
    }
}