import { describe, it, expect } from 'vitest';
import { validateTaskText, formatDate } from './helpers';

describe('validateTaskText', () => {
  it('should return an error for an empty string', () => {
    expect(validateTaskText('')).toBe('Task text is required.');
  });

  it('should return an error for a whitespace-only string', () => {
    expect(validateTaskText('   ')).toBe('Task text is required.');
  });

  it('should return an error for a tab-only string', () => {
    expect(validateTaskText('\t\n')).toBe('Task text is required.');
  });

  it('should return no error for a normal string', () => {
    expect(validateTaskText('Buy milk')).toBe('');
  });

  it('should return no error for exactly 200 characters', () => {
    const text = 'a'.repeat(200);
    expect(validateTaskText(text)).toBe('');
  });

  it('should return an error for 201 characters', () => {
    const text = 'a'.repeat(201);
    expect(validateTaskText(text)).toBe('Task cannot be longer than 200 characters.');
  });

  it('should trim before checking length — 200 chars with surrounding spaces should be valid', () => {
    const text = ' ' + 'a'.repeat(200) + ' ';
    expect(validateTaskText(text)).toBe('');
  });
});

describe('formatDate', () => {
  it('should format an ISO string in en-NZ locale with day first', () => {
    const iso = '2024-03-15T09:00:00.000Z';
    const result = formatDate(iso);
    expect(result).toMatch(/15/);
    expect(result).toMatch(/2024/);
  });

  it('should return a string', () => {
    expect(typeof formatDate(new Date().toISOString())).toBe('string');
  });

  it('should not throw for a valid ISO string', () => {
    expect(() => formatDate('2023-01-01T00:00:00.000Z')).not.toThrow();
  });
});