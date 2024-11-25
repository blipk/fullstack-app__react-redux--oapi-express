/**
 * This file contains some typescript type utils used by the redux store
 * @module
 */



type AtLeastOne<T extends Record<string, unknown>> = keyof T extends infer K
  ? K extends string
    ? Pick<T, K & keyof T> & Partial<T>
    : never
  : never

type NonUndefined<T, Default = never> = T extends undefined ? Default : T;

type Pluralize<S extends string, Match extends string, Template extends string> = S extends Match ? `${Template}s` : `${Template}`;


export type { AtLeastOne, NonUndefined, Pluralize }