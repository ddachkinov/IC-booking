import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extract tenant ID from header or subdomain
    const tenantId = req.headers['x-tenant-id'] as string;

    if (!tenantId) {
      // Try to extract from subdomain
      const host = req.headers.host;
      if (host) {
        const subdomain = host.split('.')[0];
        // In production, you would map subdomain to tenant ID via database lookup
        req['tenantId'] = subdomain;
      }
    } else {
      req['tenantId'] = tenantId;
    }

    // For now, we'll allow requests without tenant ID for auth endpoints
    // In production, you should validate tenant exists
    next();
  }
}
