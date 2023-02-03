import {Blockchain} from '@ton-community/sandbox'
import {Cell, toNano} from 'ton-core'
import {checker} from '../wrappers/checker'
import '@ton-community/test-utils'
import {compile} from '@ton-community/blueprint'

describe('checker', () => {
    let code: Cell

    beforeAll(async () => {
        code = await compile('checker')
    })

    it('should deploy', async () => {
        const blockchain = await Blockchain.create()

        const checker = blockchain.openContract(await checker.createFromConfig({}, code))

        const deployer = await blockchain.treasury('deployer')

        const deployResult = await checker.sendDeploy(deployer.getSender(), toNano('0.05'))

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: checker.address,
            deploy: true,
        })
    })
})
