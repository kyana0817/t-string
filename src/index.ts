export type Key = string | number;

export type ValidatationMap<T extends Record<Key, unknown>> = {
  [K in keyof T]: (value: T[K]) => boolean;
};

type NumericKeys<T extends Record<Key, unknown>> = Extract<keyof T, number>;
type FiniteNumericKeys<
  T extends Record<Key, unknown>
> = number extends NumericKeys<T> ? never : NumericKeys<T>;
type StringKeys<T extends Record<Key, unknown>> = Extract<keyof T, string>;

type PositionalArgs<
  T extends Record<Key, unknown>,
  Acc extends unknown[] = []
> = Acc['length'] extends FiniteNumericKeys<T>
  ? PositionalArgs<T, [...Acc, T[Acc['length']]]>
  : Acc;

type NamedArgTuple<T extends Record<Key, unknown>> = StringKeys<T> extends never
  ? []
  : [Pick<T, StringKeys<T>>];

export type StrArgs<T extends Record<Key, unknown>> = [
  ...PositionalArgs<T>,
  ...NamedArgTuple<T>
];

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function t<
  T extends Record<Key, unknown>,
  K extends Array<keyof T> = Array<keyof T>
>(strings: TemplateStringsArray, ...keys: K) {
  const _validaters = {} as ValidatationMap<T>;
  
  for (const k of keys) {
    _validaters[k as keyof T] = () => true;
  }

  return {
    validate(validaters: Partial<ValidatationMap<T>>){
      for (const [k, v] of Object.entries(validaters)) {
        _validaters[k as keyof T] = v as (value: T[keyof T]) => boolean;
      }
      return this;
    },
    str(...values: StrArgs<T>) {
      const hasNamedKeys = keys.some((key) => typeof key === 'string');
      const args = [...values];
      const dict: Record<Key, unknown> = hasNamedKeys
        ? (args.pop() as Record<Key, unknown>) ?? {}
        : {};
      const result = [strings[0]];
      keys.forEach((key, i) => {
        const rawValue: unknown = Number.isInteger(key)
          ? args[key as number]
          : dict[key as Key];
        const value = rawValue as T[keyof T];
        const validate = _validaters[key];
        if (!validate(value as T[keyof T])) {
          throw new ValidationError(`Invalid value for key "${String(key)}": ${value}`);
        }
        result.push(String(value), strings[i + 1]);
      });
      return result.join('');
    }
  };
}
