import { NS } from './ns';
export class SessionNS extends NS {
    async destroy() {
        await this.postJobAll({ action: 'destroySession' });
    }
    async export() {
        return (await this.postJobSingle({ action: 'exportSession' })).payload;
    }
    async import(request) {
        const importSessionResult = (await this.postJobAll({
            action: 'importSession',
            payload: { ...request, reexport: false },
        }))[0].payload;
        return (request.reexport
            ? {
                ...importSessionResult,
                ...(await this.export()),
                reexported: true,
            }
            : importSessionResult);
    }
}
