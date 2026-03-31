import { Model, UpdateQuery, QueryFilter } from 'mongoose';

export class BaseRepository<T> {
  // Note: lean() bypasses virtuals, getters/setters and defaults
  // lean() return POJOs (plain JS objects) by skipping instantiating a full Mongoose Document, better query performance
  constructor(protected readonly model: Model<T>) {}

  async findAll(filter: QueryFilter<T> = {}): Promise<T[]> {
    return this.model.find(filter).lean<T[]>();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).lean<T>();
  }

  async create(data: T): Promise<T> {
    return this.model.create(data);
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    const doc = await this.model.findById(id);
    if (!doc) return null;

    doc.set(data); 
    const updated = await doc.save();
    return updated.toObject() as T;
  }

  async remove(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).lean<T>();
  }
}