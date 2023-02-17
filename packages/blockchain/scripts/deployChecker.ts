import {toNano} from 'ton-core'
import {Checker} from '../wrappers/Checker'
import {compile, NetworkProvider} from '@ton-community/blueprint'

export async function run(provider: NetworkProvider) {
    const checker = Checker.createFromConfig({
        id: Math.floor(Math.random() * 10000)
    }, await compile('Checker'))

    await provider.deploy(checker, toNano('0.05'))

    const openedContract = provider.open(checker)

    // run methods on `openedContract`
}
