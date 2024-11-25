/**
 * This file contains some typescript utility types, mostly related to avoiding limitations with the type resolution in tsoa
 *
 * @module
 */


type MergeTypes<T1, T2> = {
    [K in keyof T1 | keyof T2]: K extends keyof T2
      ? T2[K]
      : K extends keyof T1
      ? T1[K]
      : never;
};


// type MergeTypes<T1 extends object, T2 extends object> = Pick<
//   T1 & T2,
//   keyof T1 | keyof T2
// >;

type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type MakeRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;



type TransformKeys<T, OmitKeys extends keyof T, OptionalKeys extends keyof T, RequiredKeys extends keyof T> =
    Omit<
        Omit<T, OptionalKeys | RequiredKeys>
            & Partial<Pick<T, OptionalKeys>>
            & Required<Pick<T, RequiredKeys>>,
        OmitKeys
    >;


// https://github.com/lukeautry/tsoa/issues/1067
// This doesnt mark them as truly optional though - properties will have to be provided as undefined
type TransformKeysNoIntersections<
    T,
    OmitKeys extends keyof T = never,
    OptionalKeys extends keyof T = never,
    RequiredKeys extends keyof T = never
> = Omit<{
        [P in keyof T]: P extends OptionalKeys
            ? T[P] | undefined // Mark as optional
            : P extends RequiredKeys
            ? T[P] // Keep as required
            : T[P]; // Keep as is
    }, OmitKeys>;





// Omit<> doesnt use any interscctions anyway so I prefer the above because its simpler
// type TransformKeysNoIntersections<T, OmitKeys extends keyof T, OptionalKeys extends keyof T, RequiredKeys extends keyof T> = {
//     [P in keyof T as P extends OmitKeys ? never : P]: P extends OptionalKeys
//         ? T[P] | undefined // Mark as optional
//         : P extends RequiredKeys
//         ? T[P] // Keep as required
//         : T[P]; // Keep as is
// };

/** Type representing the properties of an instance  */
type InstanceProperties<InstanceType> = {
    [K in keyof InstanceType]: InstanceType[K];
};

/** Type representing (keyof T | undefined)[] */
type KeysOrUndefined<T> = T extends Array<infer U> ? U : never;

export type {
    MergeTypes,
    MakeOptional, MakeRequired,
    TransformKeysNoIntersections as TransformKeys,
    // TransformKeys,
    InstanceProperties,
    KeysOrUndefined
}