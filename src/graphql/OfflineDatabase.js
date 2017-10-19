import {SQLite} from 'expo'

class OfflineDatabase {
  constructor() {
    this._db = SQLite.openDatabase({ name: 'offlinemaps.db' })
  }

  async run(query, qParams=[]) {
    return new Promise((resolve, reject) => {
      this._db.transaction(transaction =>
        transaction.executeSql(
          query,
          qParams,
          (transaction, { rows: { _array } }) => resolve(_array),
          (transaction, error) => reject(error)
        ))
    })
  }

  async bootstrap() {
    await this.run(`
      CREATE TABLE IF NOT EXISTS content (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        service TEXT NOT NULL,
        imdb REAL NOT NULL
      );
    `)

    await this.run(`
      INSERT INTO content VALUES (null, 'Breaking Bad', 'Netflix', 9.5);
      INSERT INTO content VALUES (null, 'Cosmos: A Spacetime Odyssey', 'Netflix', 9.3);
      INSERT INTO content VALUES (null, 'Sherlock', 'Netflix', 9.2);
      INSERT INTO content VALUES (null, 'Transparent', 'Amazon', 7.9);
    `)
  }
}

export default OfflineDatabase
