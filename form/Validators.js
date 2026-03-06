export const required = () => ({ value }) => 
  value.trim() ? '' : 'Field required';

export const noEdgeSpaces = () => ({ value }) =>
  value.trim() === value ? '': 'Field can\'t start or end with spaces';

export const minLength = (length) => ({ value }) => 
  value.length >= length ? '': `Field has to be at least ${length} characters`;

export const email = () => ({ value }) => 
  /\S+@\S+\.\S+/.test(value) ? '' : 'Invalid email';