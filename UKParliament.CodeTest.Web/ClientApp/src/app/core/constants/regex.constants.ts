export const REGEX = {
    NAME: /^[A-Za-z ,.'\-]+$/,
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PHONE: /^\+?[0-9]{10,15}$/,
    POSTCODE: /^[A-Za-z0-9 ]{3,10}$/,
    DATE: /^\d{4}-\d{2}-\d{2}$/ // YYYY-MM-DD format
  } as const;
  