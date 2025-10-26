/**
 * Test data generator utility
 */
export class TestDataGenerator {
  /**
   * Generate random string
   */
  static randomString(length: number = 10): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  /**
   * Generate random string with capital first letter
   */
  static randomCapitalizedString(length: number = 10): string {
    const str = this.randomString(length - 1);
    const firstChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    return firstChar + str;
  }

  /**
   * Generate random number within range
   */
  static randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate random email
   */
  static randomEmail(): string {
    return `test_${this.randomString(8)}@example.com`;
  }

  /**
   * Generate unique identifier
   */
  static uniqueId(): string {
    return `${Date.now()}_${this.randomString(6)}`;
  }

  /**
   * Generate timestamp-based string
   */
  static timestampString(): string {
    return new Date().toISOString();
  }

  /**
   * Pick random item from array
   */
  static randomFromArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
}

