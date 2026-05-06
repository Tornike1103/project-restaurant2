import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, take } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

type RefreshResponse = {
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
  accessToken?: string;
  refreshToken?: string;
  token?: string;
};

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const API_BASE = 'https://restaurantapi.stepacademy.ge/';
  const API_KEY = '6f035f63-b2c6-4f9b-95ef-bd6b74a706d3';

  if (!req.url.startsWith(API_BASE)) {
    return next(req);
  }

  const accessTokenFromStorage = localStorage.getItem('accessToken');
  // Preserve Authorization coming from Api.defaultHeaders(true)
  const authorizationFromRequest = req.headers.get('Authorization');
  const authorizationToUse =
    authorizationFromRequest ?? (accessTokenFromStorage ? `Bearer ${accessTokenFromStorage}` : null);

  return next(
    req.clone({
      setHeaders: {
        // Always set these
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
        // Only set Authorization if we already have it (prevents overwriting/stripping)
        ...(authorizationToUse ? { Authorization: authorizationToUse } : {}),
      },
    })
  );
};
