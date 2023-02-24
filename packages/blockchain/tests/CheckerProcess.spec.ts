import { Blockchain } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { CheckerProcess } from '../wrappers/CheckerProcess';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('CheckerProcess', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('CheckerProcess');
    });

    it('should deploy', async () => {
        const blockchain = await Blockchain.create();

        const checkerProcess = blockchain.openContract(
            await CheckerProcess.createFromConfig(
                {
                    id: 0,
                    counter: 0,
                },
                code
            )
        );

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await checkerProcess.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: checkerProcess.address,
            deploy: true,
        });
    });

    it('should  add checker', async () => {
        const blockchain = await Blockchain.create();

        const checkerProcess = blockchain.openContract(
            await CheckerProcess.createFromConfig(
                {
                    id: 0,
                    counter: 0,
                },
                code
            )
        );

        const deployer = await blockchain.treasury('deployer');
        const deployResult = await checkerProcess.sendDeploy(deployer.getSender(), toNano('0.05'));
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: checkerProcess.address,
            deploy: true,
        });
        const sendCheckerResult = await checkerProcess.sendChecker(deployer.getSender());
        expect(sendCheckerResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: checkerProcess.address,
            success: true,
        });
        const checkerAfter = await checkerProcess.getChecker();
        // console.log("checkerAfter",checkerAfter.readTuple())
    });

    // it.skip('should increase counter', async () => {
    //     const blockchain = await Blockchain.create()

    //     const checkerProcess = blockchain.openContract(await CheckerProcess.createFromConfig({
    //         id: 0,
    //         counter: 0,
    //     }, code))

    //     const deployer = await blockchain.treasury('deployer')

    //     const deployResult = await checkerProcess.sendDeploy(deployer.getSender(), toNano('0.05'))

    //     expect(deployResult.transactions).toHaveTransaction({
    //         from: deployer.address,
    //         to: checkerProcess.address,
    //         deploy: true,
    //     })

    //     const increaseTimes = 3
    //     for (let i = 0; i < increaseTimes; i++) {
    //         console.log(`increase ${i+1}/${increaseTimes}`)

    //         const increaser = await blockchain.treasury('increaser' + i)

    //         const counterBefore = await checkerProcess.getCounter()

    //         console.log('counter before increasing', counterBefore)

    //         const increaseBy = Math.floor(Math.random() * 100)

    //         console.log('increasing by', increaseBy)

    //         const increaseResult = await checkerProcess.sendIncrease(increaser.getSender(), {
    //             increaseBy,
    //             value: toNano('0.05'),
    //         })

    //         expect(increaseResult.transactions).toHaveTransaction({
    //             from: increaser.address,
    //             to: checkerProcess.address,
    //             success: true,
    //         })

    //         const counterAfter = await checkerProcess.getCounter()

    //         console.log('counter after increasing', counterAfter)

    //         expect(counterAfter).toBe(counterBefore + increaseBy)
    //     }
    // })
});
