import Cookies from 'js-cookie';

export const setToken = (data) => {
  if (typeof window === 'undefined') return;
  Cookies.set('pmm-user', data);
};
