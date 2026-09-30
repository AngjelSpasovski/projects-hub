import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

const SESSION_KEY = 'projects-hub-moria-entry';

@Injectable({ providedIn: 'root' })
export class GateAccessService {
  hasEntered(): boolean {
    return sessionStorage.getItem(SESSION_KEY) === 'granted';
  }

  enter(): void {
    sessionStorage.setItem(SESSION_KEY, 'granted');
  }

  leave(): void {
    sessionStorage.removeItem(SESSION_KEY);
  }
}

export const gateAccessGuard: CanActivateFn = () => {
  const access = inject(GateAccessService);
  const router = inject(Router);
  return access.hasEntered() ? true : router.parseUrl('/welcome');
};

export const gateWelcomeGuard: CanActivateFn = () => {
  const access = inject(GateAccessService);
  const router = inject(Router);
  return access.hasEntered() ? router.parseUrl('/admin/dashboard') : true;
};
