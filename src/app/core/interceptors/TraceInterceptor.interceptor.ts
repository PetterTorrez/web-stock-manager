import { HttpInterceptorFn } from '@angular/common/http';

export const traceInterceptor: HttpInterceptorFn = (req, next) => {
  const modifiedReq = req.clone({
    headers: req.headers.set('X-Correlation-ID', crypto.randomUUID()),
  });

  return next(modifiedReq);
};
