import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (_route, _state) => {
  const token = localStorage.getItem('access_token');
  return !!token;
};
