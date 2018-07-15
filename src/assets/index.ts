import { PromiseType } from 'utils/types';

async function getAssets() {
    return {
        images: {
            gateAndBase    : await import('assets/images/gate-and-base.png') as string,
            gateOrBase     : await import('assets/images/gate-or-base.png')  as string,
            gateNotBase    : await import('assets/images/gate-not-base.png') as string,
            gateNotSelected: await import('assets/images/gate-not-selected.png') as string,            
        }
    };
}

export let assets: PromiseType<ReturnType<typeof getAssets>> = {} as any;

export async function loadAssets() {
    let loadedAssets = await getAssets();
    Object.assign(assets, loadedAssets);
}
