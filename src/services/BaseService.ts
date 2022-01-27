import { EntityTarget, getRepository, Repository } from 'typeorm';

export default function createBaseService<T>(
  entity: EntityTarget<T>,
  entityStr: string
) {
  abstract class BaseService {
    entityStr: string;
    repository: Repository<T>;
    constructor() {
      this.repository = getRepository<T>(entity);
    }

    async listAll() {
      return await this.repository.createQueryBuilder(entityStr).getMany();
    }
  }

  return BaseService;
}
