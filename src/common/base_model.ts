import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BaseModel {
  @ApiProperty()
  @Expose()
  readonly createdAt?: string | null;

  @ApiProperty()
  @Expose()
  readonly updatedAt?: string | null;
}
