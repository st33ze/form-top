export const requiredValidator = () => ({ value }) => 
  value.trim() ? '' : 'Field required';

export const emailValidator = () => ({ value }) => 
  /\S+@\S+\.\S+/.test(value) ? '' : 'Invalid email';
