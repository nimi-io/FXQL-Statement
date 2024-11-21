import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import appConfig from '../../shared/config/index.config';
import { IS_PUBLIC_KEY } from 'src/shared/constants/index.constant';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();

    const authorizationHeader =
      request.headers['authorization'] || request.headers['Authorization'];

    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [bearer, token] = authorizationHeader.split(' ');
    if (bearer.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Invalid Authorization header format');
    }

    // if (await this.redisService.getValue(token)) {
    //   throw new ForbiddenException('Invalid token');
    // }
    try {
      const decodedToken: any = jwt.verify(token, appConfig().secretKey);
      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      // //console.log(
      //   now,
      //   decodedToken.exp,
      //   decodedToken.iat,
      //   decodedToken.exp - decodedToken.iat,
      //   now >= decodedToken.exp,
      // );
      if (!decodedToken || now >= decodedToken.exp) {
        throw new UnauthorizedException('Invalid token');
      }
      // //console.log(decodedToken);

      delete decodedToken.iat;
      delete decodedToken.exp;
      delete decodedToken.nbf;
      delete decodedToken.jti;
      delete decodedToken.iss;
      delete decodedToken.aud;
      delete decodedToken.sub;

      request.user = decodedToken;
      return true;
    } catch (error) {
      // throw new UnauthorizedException('Invalid token');
      throw new ForbiddenException(error, { cause: error });
    }
  }
}

// @Injectable()
// export class CheckTokenExpiryGuard implements CanActivate {
//   constructor(private readonly authService: AuthService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const accessToken = request.cookies['access_token'];

//     if (await this.authService.isTokenExpired(accessToken)) {
//       const refreshToken = request.cookies['refresh_token'];

//       if (!refreshToken) {
//         throw new UnauthorizedException('Refresh token not found');
//       }

//       try {
//         const newAccessToken =
//           await this.authService.getNewAccessToken(refreshToken);
//         request.res.cookie('access_token', newAccessToken, {
//           httpOnly: true,
//         });
//         request.cookies['access_token'] = newAccessToken;
//       } catch (error) {
//         throw new UnauthorizedException('Failed to refresh token');
//       }
//     }
//     return true;
//   }
// }
