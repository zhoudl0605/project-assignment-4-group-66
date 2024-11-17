import "typescript-desc";

declare type RequestSuccessResponse = {
    data: any;
    limit?: number;
    skip?: number;
    total?: number;
};

declare type RequestErrorResponse = {
    status: string;
    statusCode: number;
    message: string;
};

declare type DbQueryResult<T> = {
    data: T;
    limit?: number;
    skip?: number;
    total?: number;
};
