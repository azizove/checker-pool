import stringHash from 'string-hash';

export const getIdFromAddress = (address: string): number => {
    return stringHash(address);
}