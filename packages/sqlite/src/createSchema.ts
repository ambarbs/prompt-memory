export type SchemaExecutor = {
  exec(sql: string): void;
};

export function createSchema(database: SchemaExecutor, schema: string): void {
  database.exec(schema);
}
