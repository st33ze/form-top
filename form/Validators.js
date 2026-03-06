export const required = () => ({ value }) => 
  value.trim() ? '' : 'Field required';

export const noEdgeSpaces = () => ({ value }) =>
  value.trim() === value ? '': 'Field can\'t start or end with spaces';

export const email = () => ({ value }) => 
  /\S+@\S+\.\S+/.test(value) ? '' : 'Invalid email';