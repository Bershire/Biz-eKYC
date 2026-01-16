import { PartialData } from 'src/@types/safety';
import { Simplify } from 'type-fest';

export type ElementOf<T> = T extends (infer E)[] ? Simplify<E> : never;
export type BaseResponse<T> = PartialData<T>;
