import { HttpInterceptorFn } from '@angular/common/http';

export const imageCacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Cache Pokemon sprite images for 30 days
  if (req.url.includes('raw.githubusercontent.com/PokeAPI/sprites')) {
    const modifiedReq = req.clone({
      setHeaders: {
        'Cache-Control': 'public, max-age=2592000, immutable', // 30 days
      },
    });
    return next(modifiedReq);
  }

  return next(req);
};
