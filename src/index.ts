
export type Key = string | number;

export type ValidateFuncs<T extends Array<Key>> = {
  [K in T[number]]: (value: string | number) => boolean;
};

export type ValidatorMap<T extends Array<Key>> = Record<
  T[number],
  (value: string | number) => boolean
>;

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function t<T extends Array<Key>>(
  strings: TemplateStringsArray,
  ...keys: T
) {
  const _validaters = {} as ValidatorMap<T>;
  
  for (const k of keys) {
    _validaters[k as T[number]] = () => true;
  }

  return {
    validate(validaters: Partial<ValidateFuncs<T>>){
      for (const [k, v] of Object.entries(validaters)) {
        _validaters[k as T[number]] = v as (value: string | number) => boolean;
      }
      return this;
    },
    str(...values: (number | string| Record<string, any>)[]) {
      const dict = values[values.length - 1] || {};
      const result = [strings[0]];
      keys.forEach((key, i) => {
        // @ts-expect-error: index signature
        const value = Number.isInteger(key) ? values[key] : dict[key];
        const validate = _validaters[key as T[number]];
        if (!validate(value)) {
          throw new ValidationError(`Invalid value for key "${key}": ${value}`);
        }
        result.push(value, strings[i + 1]);
      });
      return result.join('');
    }
  };
}
