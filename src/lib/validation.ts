/**
 * Input validation and sanitization utilities
 * Protects against XSS, injection attacks, and malformed data
 */

/**
 * Sanitize string input - removes dangerous characters
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .slice(0, 1000) // Limit length
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate phone number format (flexible international format)
 */
export function isValidPhone(phone: string): boolean {
  // Allow digits, spaces, dashes, parentheses, and optional leading +
  const phoneRegex = /^[+]?[\d\s\-()]{7,20}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate name (letters, spaces, hyphens, apostrophes)
 */
export function isValidName(name: string): boolean {
  const nameRegex = /^[a-zA-Z\s\-'.]{2,100}$/;
  return nameRegex.test(name);
}

/**
 * Validate date string (YYYY-MM-DD format)
 */
export function isValidDateString(dateStr: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) return false;
  
  const date = new Date(dateStr);
  const now = new Date();
  
  // Check if date is valid and reasonable (not in future, not more than 150 years ago)
  return !isNaN(date.getTime()) && 
         date <= now && 
         date.getFullYear() > now.getFullYear() - 150;
}

/**
 * Validate positive integer
 */
export function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && 
         Number.isInteger(value) && 
         value > 0;
}

/**
 * Sanitize member data for creation/update
 */
export function sanitizeMemberInput(data: unknown): {
  valid: boolean;
  errors: string[];
  data?: {
    name: string;
    email?: string;
    phone?: string;
    birthday: string;
  };
} {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Invalid input data'] };
  }
  
  const input = data as Record<string, unknown>;
  
  // Validate name
  const name = sanitizeString(input.name);
  if (!name || !isValidName(name)) {
    errors.push('Invalid name format');
  }
  
  // Validate email (optional but must be valid if provided)
  let email: string | undefined;
  if (input.email) {
    email = sanitizeString(input.email);
    if (!isValidEmail(email)) {
      errors.push('Invalid email format');
    }
  }
  
  // Validate phone (optional but must be valid if provided)
  let phone: string | undefined;
  if (input.phone) {
    phone = sanitizeString(input.phone).replace(/\s+/g, '');
    if (!isValidPhone(phone)) {
      errors.push('Invalid phone format');
    }
  }
  
  // Validate birthday
  const birthday = sanitizeString(input.birthday);
  if (!birthday || !isValidDateString(birthday)) {
    errors.push('Invalid birthday format (use YYYY-MM-DD)');
  }
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  return {
    valid: true,
    errors: [],
    data: { name, email, phone, birthday }
  };
}

/**
 * Sanitize attendance record input
 */
export function sanitizeAttendanceInput(data: unknown): {
  valid: boolean;
  errors: string[];
  data?: {
    date: string;
    attendanceRecords: Array<{ memberId: number; present: boolean }>;
  };
} {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Invalid input data'] };
  }
  
  const input = data as Record<string, unknown>;
  
  // Validate date
  const date = sanitizeString(input.date);
  if (!date || !isValidDateString(date)) {
    errors.push('Invalid date format (use YYYY-MM-DD)');
  }
  
  // Validate attendance records
  if (!Array.isArray(input.attendanceRecords)) {
    errors.push('attendanceRecords must be an array');
  } else {
    for (const record of input.attendanceRecords) {
      if (!record || typeof record !== 'object') {
        errors.push('Invalid attendance record');
        break;
      }
      const r = record as Record<string, unknown>;
      if (!isPositiveInteger(r.memberId)) {
        errors.push('Invalid memberId in attendance record');
        break;
      }
      if (typeof r.present !== 'boolean') {
        errors.push('Invalid present value in attendance record');
        break;
      }
    }
  }
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  return {
    valid: true,
    errors: [],
    data: {
      date,
      attendanceRecords: (input.attendanceRecords as Array<{ memberId: number; present: boolean }>)
    }
  };
}
