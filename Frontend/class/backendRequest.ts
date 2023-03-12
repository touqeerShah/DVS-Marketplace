export type Response = {
    status: number;
    data: any;
    message: string;
    nonce?: string,
    issuedAt?: string,
    statement?: string,
    chainId?: number,
    uri?: string,
}