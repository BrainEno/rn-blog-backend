import { EntityTarget, Repository } from 'typeorm';
import { AppDataSource } from '../../AppDataSource';

export default function createBaseService<T>(
  entity: EntityTarget<T>,
  entityStr: string
) {
  abstract class BaseService {
    entityStr: string;
    repository: Repository<T>;
    constructor() {
      this.repository = AppDataSource.getRepository<T>(entity);
    }

    async listAll() {
      return await this.repository.createQueryBuilder(entityStr).getMany();
    }


  }

  return BaseService;
}
