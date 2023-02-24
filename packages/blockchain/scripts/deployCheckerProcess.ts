import {beginCell, toNano} from 'ton-core'
import {CheckerProcess} from '../wrappers/CheckerProcess'
import {compile, NetworkProvider} from '@ton-community/blueprint'

export async function run(provider: NetworkProvider) {
    const checkerProcess = CheckerProcess.createFromConfig({
        id: Math.floor(Math.random() * 10000),
    }, await compile('CheckerProcess'))

    await provider.deploy(checkerProcess, toNano('0.05'))

    // const openedContract = provider.open(checkerProcess)

    // console.log('ID', await openedContract.getID())
}
