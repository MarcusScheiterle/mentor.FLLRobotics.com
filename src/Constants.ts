export const validateEmail = (email: string): boolean => {
  return (
    email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) !== null
  );
};

export const validateMediumPassword = (password: string) => {
  const hasDigit = password.match(/\d/) !== null;
  const hasSpecialChar = password.match(/[!@#$%^&*]/) !== null;
  return password.length >= 8 && hasDigit && hasSpecialChar;
};

export const validateUsername = (username: string): boolean => {
  return username.match(/^([A-Za-z0-9]|-._){4,20}$/) !== null;
};
