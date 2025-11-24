# t-string

Type-safe template literal helper that lets you combine string interpolation with runtime validation in a single, ergonomic API.

## Highlights
- TypeScript infers every placeholder key or index, so `str()` is fully typed when you provide values.
- Chain `validate()` to register per-key guards and reject invalid data before the string is emitted.
- Distributed with both CommonJS (`lib/`) and ES module (`esm/`) builds plus declaration files, making it ready for consumption in any Node.js or bundler-based project.

## Installation
t-string is not published to the npm registry yet. Install it directly from GitHub:

```bash
npm install github:kyana0817/t-string
# or
pnpm add github:kyana0817/t-string
```

The default branch builds CommonJS output in `lib/`, so you can import it immediately after the install finishes.

## Usage
### Basic template
```ts
import { t } from 't-string';

const greeting = t`Hello, ${'name'}!`;
const result = greeting.str({ name: 'World' });
// => "Hello, World!"
```

### Mixing indexes and keys
```ts
const summary = t`Sum of ${0} and ${1} is ${'result'}.`;
const result = summary.str(2, 3, { result: 5 });
// => "Sum of 2 and 3 is 5."
```

### Adding validation
```ts
import { ValidationError } from 't-string';

const ageLine = t`Age: ${'age'}`.validate({
  age: (value) => typeof value === 'number' && value >= 0,
});

ageLine.str({ age: 25 }); // OK
ageLine.str({ age: -5 }); // ValidationError: Invalid value for key "age": -5
```

## API Reference
### `t\`...\``
Creates a tagged-template builder that exposes `validate()` and `str()`.

- `validate(partialValidators)` — supplies custom validators for any subset of keys. Unspecified keys default to a function that always returns `true`.
- `str(...values)` — injects values into the template. Numeric placeholders read from the positional arguments, string placeholders read from the final object argument. Throws `ValidationError` when a validator fails.

### `ValidationError`
Custom error type that surfaces the failing key and value when validation rejects an input.

## Distribution
t-string publishes multiple artifacts so you can pick the format that fits your toolchain:

- `lib/` — CommonJS build targeting modern Node.js.
- `esm/` — native ES module build produced with `tsc -m esNext`.
- `lib/index.d.ts` — type declarations shared by both entry points.

## License
This project is released under the [MIT License](./LICENSE).
