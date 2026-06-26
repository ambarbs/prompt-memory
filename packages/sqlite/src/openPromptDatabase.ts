import Database from 'better-sqlite3';
import { createSchema } from './createSchema.js';
import { PromptRepository } from './promptRepository.js';
import { schema } from './schema.js';

export function openPromptRepository(databasePath: string): PromptRepository {
  const database = new Database(databasePath);

  createSchema(database, schema);

  return new PromptRepository(database);
}
