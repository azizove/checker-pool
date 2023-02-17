import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from "ton-core";

export type CheckerConfig = {
    id: number;
}

export function checkerConfigToCell(config: CheckerConfig): Cell {
    return beginCell()
        .endCell()
}

export class Checker implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell, data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new Checker(address)
    }

    static createFromConfig(config: CheckerConfig, code: Cell, workchain = 0) {
        const data = checkerConfigToCell(config)
        const init = { code, data }
        return new Checker(contractAddress(workchain, init), init)
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATLY,
            body: beginCell()
                .endCell(),
        })
    }
}