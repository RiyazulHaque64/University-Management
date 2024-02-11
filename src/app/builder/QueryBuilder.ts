import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public queryModel: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(queryModel: Query<T[], T>, query: Record<string, unknown>) {
    this.queryModel = queryModel;
    this.query = query;
  }
  search(studentSearchableField: string[]) {
    if (this?.query?.searchTerm) {
      this.queryModel = this.queryModel.find({
        $or: studentSearchableField.map(
          (field) =>
            ({
              [field]: { $regex: this?.query?.searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }
    return this;
  }
  filter() {
    const filterQueryObj = { ...this.query };
    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    excludeFields.forEach((field) => delete filterQueryObj[field]);
    this.queryModel = this.queryModel.find(filterQueryObj as FilterQuery<T>);
    return this;
  }
  sort() {
    const sort =
      (this?.query?.sort as string)?.split(',')?.join(' ') || 'createdAt';
    this.queryModel = this.queryModel.sort(sort as string);
    return this;
  }
  paginate() {
    const limit = Number(this?.query?.limit) || 10;
    const page = Number(this?.query?.page) || 1;
    const skip = (page - 1) * limit;
    this.queryModel = this.queryModel.skip(skip);
    return this;
  }
  limit() {
    const limit = Number(this?.query?.limit) || 10;
    this.queryModel = this.queryModel.limit(limit);
    return this;
  }
  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';
    this.queryModel = this.queryModel.select(fields);
    return this;
  }
  async countTotal() {
    const filter = this.queryModel.getFilter();
    const total = await this.queryModel.model.countDocuments(filter);
    const limit = Number(this?.query?.limit) || 10;
    const page = Number(this?.query?.page) || 1;
    const totalPage = Math.ceil(total / limit);
    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
