export function vbLog(message?: any, ...optionalParams: any[]): void {
    console.log('(vuebook) ', __filename, ' ', message, ...optionalParams);
}
