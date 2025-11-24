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

describe('t-string with transfer', () => {
  it('transfers number to string', () => {
    const _t = t<{ age: number }>`Age: ${'age'}`.transfer({
      age: (value) => `${value} years old`,
    });
    const result = _t.str({ age: 30 });
    expect(result).toBe('Age: 30 years old');
  });

  it('validates and transfers', () => {
    const _t = t<{ age: number }>`Age: ${'age'}`.validate({
      age: (value) => typeof value === 'number' && value >= 0,
    }).transfer({
      age: (value) => `${value} years old`,
    });
    const result = _t.str({ age: 40 });
    expect(result).toBe('Age: 40 years old');
  });
  it('throws error on invalid input before transfer', () => {
    const _t = t<{ age: number }>`Age: ${'age'}`.validate({
      age: (value) => typeof value === 'number' && value >= 0,
    }).transfer({
      age: (value) => `${value} years old`,
    });
    expect(() => _t.str({ age: -10 }))
      .toThrowError(ValidationError);
  });
});

describe('larger t-string example', () => {
  it('complex example with validation and transfer', () => {
    const _t = t<{ name: string; age: number; score: number }>`Student: ${'name'}, Age: ${'age'}, Score: ${'score'}`.validate({
      age: (value) => typeof value === 'number' && value >= 0,
      score: (value) => typeof value === 'number' && value >= 0 && value <= 100,
    }).transfer({
      name: (value) => value.toUpperCase(),
      age: (value) => `${value} years`,
      score: (value) => `${value}/100`,
    });
    const result = _t.str({
      name: 'Bob', age: 22, score: 88 
    });
    expect(result).toBe('Student: BOB, Age: 22 years, Score: 88/100');
  });
  it('duplicated keys with validation and transfer', () => {
    const _t = t<{ value: number }>`Value: ${'value'}, Double: ${'value'}`.validate({
      value: (v) => typeof v === 'number' && v >= 0,
    }).transfer({
      value: (v) => v * 2,
    });
    const result = _t.str({ value: 15 });
    expect(result).toBe('Value: 30, Double: 30');
  });
});
