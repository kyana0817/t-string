import { describe } from 'node:test';
import { it, expect } from 'vitest';
import { t, ValidationError } from '../src/index.js';


describe('simple t-string', () => {
  it('single template string', () => {
    const _t = t`Hello, ${'text'}!`;
    const result = _t.str({ text: 'World' });
    expect(result).toBe('Hello, World!');
  });

  it('multiple keys template string', () => {
    const _t = t<{ 0: number, 1: number, result: number }>`Sum of ${0} and ${1} is ${'result'}.`;
    const result = _t.str(2, 3, { result: 5 });
    expect(result).toBe('Sum of 2 and 3 is 5.');
  });

  it('multiple named keys template string', () => {
    const _t = t<{ name: string; age: number }>`Name: ${'name'}, Age: ${'age'}`;
    const result = _t.str({ name: 'Alice', age: 30 });
    expect(result).toBe('Name: Alice, Age: 30');
  });
});

describe('t-string with validation', () => {
  it('validates number inputs', () => {
    const _t = t<{ age: number }>`Age: ${'age'}`.validate({
      age: (value) => typeof value === 'number' && value >= 0,
    });
    const result = _t.str({ age: 25 });
    expect(result).toBe('Age: 25');
  });
  it('throws error on invalid input', () => {
    const _t = t<{ age: number }>`Age: ${'age'}`.validate({
      age: (value) => typeof value === 'number' && value >= 0,
    });
    expect(() => _t.str({ age: -5 }))
      .toThrowError(ValidationError);
  });
});
