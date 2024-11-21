// /* eslint-disable prettier/prettier */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import {
//   DeepPartial,
//   DeleteResult,
//   EntityManager,
//   EntityTarget,
//   FindOptions,
//   FindManyOptions,
//   FindOneOptions,
//   Repository,
//   SaveOptions,
//   RootFilterOperators,
//   QueryBuilder,
// } from 'typeorm';
// import {
//   IDefaultOptions,
//   IGetMetaProps,
//   IMeta,
//   IPaginateResult,
// } from '../paginate-result.interface';
// import { IDefaultPaginationOptions } from 'src/shared/interface/index.interface';

// @Injectable()
// export class AbstractService<T> {
//   protected constructor(
//     private readonly repository: Repository<T>,
//     private readonly entityClass: EntityTarget<T>,
//     protected readonly entityName?: string,
//   ) {}

//   protected DEFAULTOPTIONS: IDefaultOptions = { limit: 10, page: 1 };

//   protected getMeta({ total, data, limit, page }: IGetMetaProps): IMeta {
//     let meta: Partial<IMeta> = { totalItems: total, count: data?.length };
//     meta = { ...meta, itemsPerPage: limit, currentPage: page };
//     meta = { ...meta, totalPages: Math.ceil(total / limit) };
//     return meta as IMeta;
//   }

//   async findAll(
//     condition?: FindManyOptions<T>,
//     // @TransactionManager() transactionManager?: EntityManager,
//   ): Promise<T[]> {
//     return await this.repository.find(condition);
//   }

//   async create(
//     data: DeepPartial<T>,
//     // @TransactionManager() transactionManager?: EntityManager,
//   ): Promise<T> {
//     const newRecord = this.repository.create(data);
//     try {
//       return await this.repository.save(newRecord as DeepPartial<T>);
//     } catch (e) {
//       console.error(e);
//     }
//   }

//   async save(
//     data: DeepPartial<T>,
//     // @TransactionManager() transactionManager?: EntityManager,
//   ) {
//     return await this.repository.save(data as DeepPartial<T>);
//   }
//   async createMany(
//     data: DeepPartial<T>[],
//     // @TransactionManager() transactionManager?: EntityManager,
//   ): Promise<T[]> {
//     const newRecords = this.repository.create(data);
//     return await this.repository.save(newRecords as DeepPartial<T[]>);
//   }

//   async findOne(
//     condition: FindOneOptions<T>,
//     // @TransactionManager() transactionManager?: EntityManager,
//   ): Promise<T> {
//     try {
//       return await this.repository.findOne(condition);
//     } catch (error) {
//       console.error(error);
//       throw new InternalServerErrorException();
//     }
//   }

//   async findOneOrFail(
//     condition: FindOneOptions<T>,
//     // @TransactionManager() transactionManager?: EntityManager,
//   ): Promise<T> {
//     return await this.repository.findOneOrFail(condition);
//   }

//   async findByIds(
//     condition: string[] | number[],
//     // @TransactionManager() transactionManager?: EntityManager,
//   ): Promise<T[]> {
//     return await this.repository.findByIds(condition);
//   }

//   async count(
//     condition: FindManyOptions<T>,
//     // @TransactionManager() transactionManager?: EntityManager,
//   ): Promise<number> {
//     return await this.repository.count(condition);
//   }

//   async find(
//     condition: FindManyOptions<T>, //| RootFilterOperators<T>,
//     options = this.DEFAULTOPTIONS,
//   ): Promise<IPaginateResult<T[]>> {
//     const { limit = 100, page = 1 } = options;
//     const query = { ...condition, take: limit, skip: (page - 1) * limit };
//     const [data, total] = await this.repository.findAndCount(query);
//     const meta = this.getMeta({ total, data, limit, page });
//     return { data, meta };
//   }

//   // async find(
//   //   condition: FindManyOptions<T>,
//   //   options: { limit?: number; page?: number } = this.DEFAULTOPTIONS,
//   // ): Promise<IPaginateResult<T[]>> {
//   //   const limit = options.limit ?? 10;
//   //   const page = options.page ?? 1;
//   //   //console.log(options)
//   //   const query = {
//   //     ...condition,
//   //     take: limit,
//   //     skip: (page - 1) * limit,
//   //   };
//   //   const [data, total] = await this.repository.findAndCount(query);
//   //   const meta = this.getMeta({ total, data, limit, page });
//   //   return { data, meta };
//   // }
//   async update(
//     id: any, // string | number,
//     data: DeepPartial<T>,
//     // @TransactionManager() transactionManager?: EntityManager,
//   ): Promise<T> {
//     const exists = await this.repository.findOne(id);
//     if (!exists)
//       throw new Error(`${this.entityName || 'Record'} Does Not Exist`);
//     return await this.repository.save({ id, ...exists, ...data });
//   }

//   async updateWhere(
//     condition: FindOneOptions<T>,
//     data: DeepPartial<T>,
//     // @TransactionManager() transactionManager?: EntityManager,
//   ): Promise<T> {
//     const exists = await this.repository.findOne(condition);
//     if (!exists)
//       throw new Error(`${this.entityName || 'Record'} Does Not Exist`);
//     return await this.repository.save({ ...exists, ...data });
//   }

//   async updateManyWhere(
//     condition: RootFilterOperators<T> | FindOneOptions<T>,
//     data: DeepPartial<T>,
//     // @TransactionManager() transactionManager?: EntityManager,
//   ): Promise<T[]> {
//     const exists = await this.repository.find(
//       condition.where ? condition.where : condition,
//     );
//     if (!exists)
//       throw new Error(`${this.entityName || 'Record'} Does Not Exist`);
//     if (exists.length === 0) return exists;
//     const updateData = exists.map((item) => ({ ...item, ...data }));
//     return await this.repository.save(updateData);
//   }

//   async softRemove(
//     condition: FindOneOptions<T>,
//     saveOptions?: SaveOptions,
//     // @TransactionMan .ager() transactionManager?: EntityManager,
//   ): Promise<{ message: string }> {
//     const exists = await this.repository.findOne(condition);
//     if (!exists)
//       throw new Error(`${this.entityName || 'Record'} Does Not Exist`);
//     const record = this.repository.create(exists as DeepPartial<T>);
//     await this.repository.softRemove(record as DeepPartial<T>, saveOptions);
//     return { message: `${this.entityName || 'Record'} Deleted Successfully` };
//   }

//   async delete(
//     id: string | number | string[] | number[],
//     // @TransactionManager() transactionManager?: EntityManager,
//   ): Promise<DeleteResult> {
//     return await this.repository.delete(id);
//   }

//   async deleteWhere(
//     condition: RootFilterOperators<T>,
//     // @TransactionManager() transactionManager?: EntityManager,
//   ): Promise<DeleteResult> {
//     const { where } = condition; // Assuming where is the deletion criteria

//     return await this.repository.delete(where);
//   }

//   async query(query: string, id: string): Promise<T[]> {
//     return await this.repository.query(query, [id]);
//   }
//   async queryArr(query: string, id: string[]): Promise<T[]> {
//     return await this.repository.query(query, [...id]);
//   }

//   // async sqlQuery(query: string): Promise<T[]> {
//   //   return this.repository.query(query);
//   // }

//   // async beginTransaction(): Promise<EntityManager> {
//   //   return await this.repository.manager.transaction(
//   //     async (transactionManager) => {
//   //       return transactionManager;
//   //     },
//   //   );
//   // }

//   // async commitTransaction(): Promise<void> {
//   //   let queryRunner;
//   //   try {
//   //     queryRunner = this.repository.manager.connection.createQueryRunner();
//   //     await queryRunner.startTransaction();

//   //     // Your code inside the transaction

//   //     await queryRunner.commitTransaction();
//   //   } catch (error) {
//   //     // Handle transaction errors here
//   //     console.error('Error during transaction:', error);
//   //     await queryRunner.rollbackTransaction(); // Rollback on error
//   //     throw error; // Re-throw the error to propagate it
//   //   } finally {
//   //     await queryRunner.release(); // Release the query runner
//   //   }

//   //   return Promise.resolve(); // Explicitly return a Promise that resolves to void
//   // }
//   // async rollbackTransaction(): Promise<void> {
//   //   let queryRunner;

//   //   try {
//   //     const connection = this.repository.manager.connection; // Get the connection
//   //     queryRunner = connection.createQueryRunner();
//   //     await queryRunner.startTransaction();

//   //     // Your code inside the transaction

//   //     // ...
//   //   } catch (error) {
//   //     // Handle transaction errors here
//   //     console.error('Error during transaction:', error);
//   //     await queryRunner.rollbackTransaction(); // Rollback on error
//   //     throw error; // Re-throw the error to propagate it
//   //   } finally {
//   //     await queryRunner.release(); // Release the query runner
//   //   }

//   //   return Promise.resolve(); // Explicitly return a Promise that resolves to void
//   // }
//   // async isInTransaction(manager: EntityManager): Promise<boolean> {
//   //   const connection = manager.connection; // Get the connection
//   //   const queryRunner = connection.createQueryRunner(); // Create a query runner
//   //   const hasActiveQueryRunner = await queryRunner.hasActiveTransaction(); // Check for active transaction
//   //   await queryRunner.release(); // Release the query runner
//   //   return hasActiveQueryRunner;
//   // }
// }

import { Injectable } from '@nestjs/common';
import {
  DeepPartial,
  DeleteResult,
  EntityManager,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  QueryRunner,
  Repository,
  RootFilterOperators,
  SaveOptions,
  getConnection,
  getManager,
} from 'typeorm';
import {
  IDefaultOptions,
  IGetMetaProps,
  IMeta,
  IPaginateResult,
  PaginateResult,
} from '../paginate-result.interface';
import dataSource from 'src/shared/config/data.source';
@Injectable()
export class AbstractService<T> {
  private dataSource: typeof dataSource;

  protected constructor(
    private readonly repository: Repository<T>,
    private readonly entityClass: EntityTarget<T>,
    protected readonly entityName?: string,
  ) {
    this.dataSource = dataSource;
  }

  protected DEFAULTOPTIONS: IDefaultOptions = { limit: 10, page: 1 };

  protected getMeta({ total, data, limit, page }: IGetMetaProps): IMeta {
    let meta: Partial<IMeta> = { totalItems: total, count: data?.length };
    meta = { ...meta, itemsPerPage: limit, currentPage: page };
    meta = { ...meta, totalPages: Math.ceil(total / limit) };
    return meta as IMeta;
  }

  async findAll(
    condition?: FindManyOptions<T>,
    transactionManager?: EntityManager,
  ): Promise<T[]> {
    if (transactionManager) {
      return await transactionManager.find(this.entityClass, condition);
    } else {
      return await this.repository.find(condition);
    }
  }

  async create(
    data: DeepPartial<T>,
    transactionManager?: EntityManager,
  ): Promise<T> {
    if (transactionManager) {
      const newRecord = transactionManager.create(this.entityClass, data);
      return await transactionManager.save(newRecord);
    } else {
      const newRecord = this.repository.create(data);
      return await this.repository.save(newRecord as DeepPartial<T>);
    }
  }

  async createMany(
    data: DeepPartial<T>[],
    transactionManager?: EntityManager,
  ): Promise<T[]> {
    if (transactionManager) {
      const newRecords = transactionManager.create(this.entityClass, data);
      return await transactionManager.save(newRecords);
    } else {
      const newRecords = this.repository.create(data);
      return await this.repository.save(newRecords as DeepPartial<T[]>);
    }
  }

  async findOne(
    condition: FindOneOptions<T>,
    transactionManager?: EntityManager,
  ): Promise<T> {
    if (transactionManager) {
      return await transactionManager.findOne(this.entityClass, condition);
    } else {
      return await this.repository.findOne(condition);
    }
  }

  async findOneOrFail(
    condition: FindOneOptions<T>,
    transactionManager?: EntityManager,
  ): Promise<T> {
    if (transactionManager) {
      return await transactionManager.findOneOrFail(
        this.entityClass,
        condition,
      );
    } else {
      return await this.repository.findOneOrFail(condition);
    }
  }

  async findByIds(
    ids: string[] | number[],
    transactionManager?: EntityManager,
  ): Promise<T[]> {
    if (transactionManager) {
      return await transactionManager.findByIds(this.entityClass, ids);
    } else {
      return await this.repository.findByIds(ids);
    }
  }

  async count(
    condition: FindManyOptions<T>,
    transactionManager?: EntityManager,
  ): Promise<number> {
    if (transactionManager) {
      return await transactionManager.count(this.entityClass, condition);
    } else {
      return await this.repository.count(condition);
    }
  }

  async find(
    condition: FindManyOptions<T>,
    options = this.DEFAULTOPTIONS,
  ): Promise<IPaginateResult<T[]>> {
    const { limit = 10, page = 1 } = options;
    const query = { ...condition, take: limit, skip: (page - 1) * limit };
    const [data, total] = await this.repository.findAndCount(query);
    const meta = this.getMeta({ total, data, limit, page });
    return { data, meta };
  }

  async update(
    id: any,
    data: DeepPartial<T>,
    transactionManager?: EntityManager,
  ): Promise<T> {
    if (transactionManager) {
      //   const exists = (await transactionManager.findOne(this.entityClass, {
      //     where: { id },
      //   })) as any;
      const exists = await this.repository.findOne(id);

      if (!exists)
        throw new Error(`${this.entityName || 'Record'} Does Not Exist`);
      const updateInput = transactionManager.create(this.entityClass, {
        id,
        ...exists,
        ...data,
      });
      return await transactionManager.save(updateInput);
    } else {
      //   const exists = await this.repository.findOne({ where: { id } });
      const exists = await this.repository.findOne(id);

      if (!exists)
        throw new Error(`${this.entityName || 'Record'} Does Not Exist`);
      return await this.repository.save({ id, ...exists, ...data });
    }
  }

  async updateWhere(
    condition: FindOneOptions<T>,
    data: DeepPartial<T>,
    transactionManager?: EntityManager,
  ): Promise<T> {
    if (transactionManager) {
      const exists = await transactionManager.findOne(
        this.entityClass,
        condition,
      );
      if (!exists)
        throw new Error(`${this.entityName || 'Record'} Does Not Exist`);
      return await transactionManager.save({ ...exists, ...data });
    } else {
      const exists = await this.repository.findOne(condition);
      if (!exists)
        throw new Error(`${this.entityName || 'Record'} Does Not Exist`);
      return await this.repository.save({ ...exists, ...data });
    }
  }

  async updateManyWhere(
    condition: FindOneOptions<T>,
    data: DeepPartial<T>,
    transactionManager?: EntityManager,
  ): Promise<T[]> {
    if (transactionManager) {
      const exists = await transactionManager.find(this.entityClass, condition);
      if (!exists || exists.length === 0) return [];
      const updateData = exists.map((item) => ({ ...item, ...data }));
      return await transactionManager.save(updateData);
    } else {
      const exists = await this.repository.find(condition);
      if (!exists || exists.length === 0) return [];
      const updateData = exists.map((item) => ({ ...item, ...data }));
      return await this.repository.save(updateData);
    }
  }

  async softRemove(
    condition: FindOneOptions<T>,
    saveOptions?: SaveOptions,
    transactionManager?: EntityManager,
  ): Promise<{ message: string }> {
    if (transactionManager) {
      const exists = await transactionManager.findOne(
        this.entityClass,
        condition,
      );
      if (!exists)
        throw new Error(`${this.entityName || 'Record'} Does Not Exist`);
      const record = transactionManager.create(
        this.entityClass,
        exists as DeepPartial<T>,
      );
      await transactionManager.softRemove(record, saveOptions);
      return { message: `${this.entityName || 'Record'} Deleted Successfully` };
    } else {
      const exists = await this.repository.findOne(condition);
      if (!exists)
        throw new Error(`${this.entityName || 'Record'} Does Not Exist`);
      const record = this.repository.create(exists as DeepPartial<T>);
      await this.repository.softRemove(record as DeepPartial<T>, saveOptions);
      return { message: `${this.entityName || 'Record'} Deleted Successfully` };
    }
  }

  async restore(
    condition: FindOneOptions<T>,
    transactionManager?: EntityManager,
  ): Promise<{ message: string }> {
    if (transactionManager) {
      const exists = await transactionManager.findOne(this.entityClass, {
        ...condition,
        withDeleted: true,
      });
      if (!exists)
        throw new Error(`${this.entityName || 'Record'} Does Not Exist`);
      await transactionManager.restore(
        this.entityClass,
        (condition as any).where?.id,
      );
      return {
        message: `${this.entityName || 'Record'} Restored Successfully`,
      };
    } else {
      const exists = await this.repository.findOne({
        ...condition,
        withDeleted: true,
      });
      if (!exists)
        throw new Error(`${this.entityName || 'Record'} Does Not Exist`);
      const id = (condition as any).where?.id;
      if (!id) {
        throw new Error('ID is required to restore the record');
      }
      await this.repository.restore(id);
      return {
        message: `${this.entityName || 'Record'} Restored Successfully`,
      };
    }
  }

  async delete(
    id: string | number | string[] | number[],
    transactionManager?: EntityManager,
  ): Promise<DeleteResult> {
    if (transactionManager) {
      return await transactionManager.delete(this.entityClass, id);
    } else {
      return await this.repository.delete(id);
    }
  }

  async deleteWhere(
    condition: RootFilterOperators<T>,
    transactionManager?: EntityManager,
  ): Promise<DeleteResult> {
    if (transactionManager) {
      return await transactionManager.delete(this.entityClass, condition);
    } else {
      const { where } = condition; // Assuming where is the deletion criteria

      return await this.repository.delete(where);
    }
  }

  // protected async executeInTransaction<T>(
  //   action: (entityManager: EntityManager) => Promise<T>,
  // ): Promise<T> {
  //   const connection = getConnection(); // Get the default connection
  //   const queryRunner = connection.createQueryRunner(); // Create a new query runner

  //   await queryRunner.startTransaction(); // Start a new transaction

  //   try {
  //     const result = await action(queryRunner.manager); // Execute the action with the entity manager

  //     await queryRunner.commitTransaction(); // Commit the transaction if everything is successful
  //     return result;
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction(); // Rollback the transaction in case of an error
  //     throw error; // Re-throw the error to be handled by the caller
  //   } finally {
  //     await queryRunner.release(); // Release the query runner
  //   }
  // }

  protected async executeInTransaction<T>(
    action: (entityManager: EntityManager) => Promise<T>,
  ): Promise<T> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner(); // Create a new query runner

    await queryRunner.connect(); // Establish a connection
    await queryRunner.startTransaction(); // Start a new transaction

    try {
      const result = await action(queryRunner.manager); // Execute the action with the entity manager

      await queryRunner.commitTransaction(); // Commit the transaction if everything is successful
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction(); // Rollback the transaction in case of an error
      throw error; // Re-throw the error to be handled by the caller
    } finally {
      await queryRunner.release(); // Release the query runner
    }
  }
}
