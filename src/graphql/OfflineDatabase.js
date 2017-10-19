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

      CREATE TABLE IF NOT EXISTS attractions(
        id INT primary key not null,
        destination_id INT references destinations(id),
        geocode_id INT references geocodes(id),
        name TEXT,
        rating NUMERIC,
        rating_weight NUMERIC,
        address TEXT,
        phone TEXT,
        email TEXT,
        hours TEXT,
        pricing INT
      );
      CREATE TABLE IF NOT EXISTS destinations(
        id INT primary key not null,
        name TEXT,
        parent TEXT,
        grandparent TEXT,
        total_attractions INT,
        attraction_cursor INT,
        total_pages INT,
        page_cursor INT
      );
      CREATE TABLE IF NOT EXISTS geocodes(
        id INT primary key not null,
        lat NUMERIC,
        lng NUMERIC
      );
      CREATE TABLE IF NOT EXISTS categories(
        id INT primary key not null,
        name TEXT
      );
      CREATE TABLE IF NOT EXISTS attraction_categories(
        attraction_id INT references attractions(id),
        category_id INT references categories(id),
        UNIQUE (attraction_id, category_id)
      );
      CREATE TABLE IF NOT EXISTS cuisines(
        id INT primary key not null,
        name TEXT
      );
      CREATE TABLE IF NOT EXISTS attraction_cuisines(
        attraction_id INT references attractions(id),
        cuisine_id INT references cuisines(id),
        UNIQUE (attraction_id, cuisine_id)
      );
      CREATE TABLE IF NOT EXISTS images(
        id INT primary key not null,
        attraction_id INT references attractions(id),
        source_url TEXT,
        gallery_url TEXT,
        sm_thumbnail_url TEXT,
        lg_thumbnail_url TEXT
      );

      CREATE TABLE content (
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
