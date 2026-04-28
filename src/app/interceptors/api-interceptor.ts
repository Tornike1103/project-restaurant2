import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('https://restaurantapi.stepacademy.ge/')) {
    const clonedReq = req.clone({
      setHeaders: {
        'X-API-Key': '6f035f63-b2c6-4f9b-95ef-bd6b74a706d3',
        'Content-Type': 'application/json',
      }
    });
    return next(clonedReq);
  }
   
  return next(req);
};
