import { rm } from 'fs/promises';
import { join } from 'path';
import { getConnection } from 'typeorm';

global.beforeEach(async () => {
  console.log('Running before each');
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (err) {
    console.log(err);
  }
});

global.afterEach(async () => {
  const conn = getConnection();
  await conn.close();
});
