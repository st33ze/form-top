export const required = () => ({ value }) => 
  value.trim() ? '' : 'Field required';