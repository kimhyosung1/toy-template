import { BadRequestException } from '@nestjs/common';
import { EntityManager, getConnection, QueryRunner } from 'typeorm';

export const TransactionBlock = async (
  func: (entityManager: EntityManager) => Promise<any>,
  errorHandler?: (err: any) => void,
): Promise<any> => {
  const queryRunner: QueryRunner = getConnection().createQueryRunner();
  try {
    await queryRunner.startTransaction();
    const entityManager: EntityManager = queryRunner.manager;
    const ret = await func(entityManager);
    await queryRunner.commitTransaction();
    return ret;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    if (errorHandler != null) errorHandler(error);
    else {
      console.log('error = ', error)
      throw new BadRequestException();
    }
  } finally {
    await queryRunner.release();
  }
};
