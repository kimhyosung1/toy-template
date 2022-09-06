import { SetMetadata } from '@nestjs/common';
import { CommonUserType } from 'src/common/common_type';

export const Scopes = (...scopes: CommonUserType[]) =>
  SetMetadata('scopes', scopes);
