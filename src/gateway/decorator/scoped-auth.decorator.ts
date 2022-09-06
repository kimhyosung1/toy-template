import { applyDecorators, UseGuards } from '@nestjs/common';
import { CommonUserType } from 'src/common/common_type';
import { KHSAuthGuard } from '../guard/khs-auth.guard';
import { ScopeAuthGuard } from '../guard/scope-auth.guard';
import { Scopes } from './scopes.decorator';


export function ScopedAuth(scopes: CommonUserType[]) {
  return applyDecorators(
    Scopes(...scopes),
    UseGuards(KHSAuthGuard, ScopeAuthGuard),
  );
}
