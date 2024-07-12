import * as SQLite from 'expo-sqlite';

async function getDB() {
  const db = await SQLite.openDatabaseAsync('little_lemon');
  return db;
}

export async function createTable() {
  const db = await getDB();
  try {
    // await db.execAsync('DELETE FROM menu');
    const result = await db.execAsync('CREATE TABLE IF NOT EXISTS menu (id integer primary key not null, title text, description text, price text, imageFileName text, category text);');
    return result;
  } catch(err) {
    console.log(err);
  }
}

export async function getMenuItems() {
  const db = await getDB();
  try {
    const result = await db.getAllAsync('SELECT * FROM menu');
    return result;
  } catch(err) {
    console.log(err);
  }
  return [];
}

export async function saveMenuItems(menuItems) {
  const db = await getDB();
  const sql = 'INSERT INTO menu (title, description, price, imageFileName, category) VALUES ($title, $description, $price, $imageFileName, $category)';
  const statement = await db.prepareAsync(sql);
  try {
    for (let item of menuItems) {
      await statement.executeAsync({
        $title: item.title,
        $description: item.description,
        $price: item.price,
        $imageFileName: item.imageFileName,
        $category: item.category
      });
    }
  } catch(err) {
    console.log(err);
  } finally {
    await statement.finalizeAsync();
  }
}

export async function filterByQueryAndCategories(query, activeCategories) {
  let sql = 'SELECT * FROM menu';
  const clauses = [];
  if (activeCategories.length > 0) {
    const categoryClause = activeCategories.length > 1
    ? `category IN (${activeCategories.map(c => `'${c}'`).join(',')})`
    : `category = '${activeCategories[0]}'`;
    clauses.push(categoryClause);
  }
  if (query) {
    const queryClause = `title LIKE '%${query}%'`;
    clauses.push(queryClause);
  }
  if (clauses.length) {
    sql += ` WHERE ${clauses.join(' AND ')}`;
  }
  const db = await getDB();
  try {
    const result = await db.getAllAsync(sql);
    return result;
  } catch(err) {
    console.log(err);
  }
  return [];
}
