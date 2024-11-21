import { Injectable } from '@nestjs/common';
import {
  DeepPartial,
  DeleteResult,
  EntityManager,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  Repository,
  RootFilterOperators,
  SaveOptions,
  getManager,
} from 'typeorm';
import {
  IDefaultOptions,
  IGetMetaProps,
  IMeta,
  IPaginateResult,
  PaginateResult,
} from '../paginate-result.interface';

@Injectable()
export class AbstractService<T> {
  protected constructor(
    private readonly repository: Repository<T>,
    private readonly entityClass: EntityTarget<T>,
    protected readonly entityName?: string,
  ) {}

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

  // Helper function to execute code in a transaction
  async runInTransaction<T>(
    runInTransaction: (manager: EntityManager) => Promise<T>,
  ): Promise<T> {
    return await getManager().transaction(
      async (transactionalEntityManager) => {
        return await runInTransaction(transactionalEntityManager);
      },
    );
  }
}
