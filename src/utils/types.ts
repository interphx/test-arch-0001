export type ElementType<T> =
    T extends ReadonlyArray<infer U> ? U :
    T extends (infer U)[] ? U :
    never;

export type PromiseType<T> =
    T extends Promise<infer U> ? U :
    never;