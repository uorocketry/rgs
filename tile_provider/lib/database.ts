import { Database } from "bun:sqlite";

export interface Tile {
  zoom: number;
  x: number;
  y: number;
  blob: Uint8Array;
}

export interface TileQuery {
  get: (zoom: number, x: number, y: number) => { blob: Uint8Array } | null | undefined;
  run: (zoom: number, x: number, y: number, blob: Uint8Array) => void;
}

export class TileDatabase {
  private db: Database;
  private getTileQuery!: TileQuery;
  private saveTileQuery!: TileQuery;

  constructor(db: Database) {
    this.db = db;
    this.initializeQueries();
    this.initializeSchema();
  }

  private initializeSchema() {
    // First create the basic table if it doesn't exist
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tiles (
        zoom INTEGER,
        x INTEGER,
        y INTEGER,
        blob BLOB,
        PRIMARY KEY (zoom, x, y)
      );
    `);
  
    // Then add the created_at column if it doesn't exist
    try {
      this.db.exec(`
        ALTER TABLE tiles 
        ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      `);
    } catch (error) {
      // Column might already exist, which is fine
      if (!(error instanceof Error && error.message.includes('duplicate column'))) {
        console.warn('Note: created_at column might already exist');
      }
    }
  
    // Create the index if it doesn't exist
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_tiles_created_at ON tiles(created_at);
    `);
  }

  private initializeQueries() {
    this.getTileQuery = this.db.query(
      "SELECT blob FROM tiles WHERE zoom = ? AND x = ? AND y = ?"
    ) as unknown as TileQuery;
    
    this.saveTileQuery = this.db.prepare(
      "INSERT OR REPLACE INTO tiles (zoom, x, y, blob) VALUES (?, ?, ?, ?)"
    ) as unknown as TileQuery;
  }

  getTile(zoom: number, x: number, y: number): Uint8Array | null {
    try {
      const result = this.getTileQuery.get(zoom, x, y);
      return result ? result.blob : null;
    } catch (error) {
      console.error(`Error getting tile ${zoom}/${x}/${y}:`, error);
      return null;
    }
  }

  saveTile(zoom: number, x: number, y: number, blob: Uint8Array): boolean {
    try {
      this.saveTileQuery.run(zoom, x, y, blob);
      return true;
    } catch (error) {
      console.error(`Error saving tile ${zoom}/${x}/${y}:`, error);
      return false;
    }
  }

  hasTile(zoom: number, x: number, y: number): boolean {
    return this.getTile(zoom, x, y) !== null;
  }

  batchCheckTiles(tiles: Tile[]): Set<string> {
    const existingTiles = new Set<string>();
    
    // Process tiles in batches
    for (let i = 0; i < tiles.length; i += 100) {
      const batch = tiles.slice(i, i + 100);
      const placeholders = batch.map(() => '(?, ?, ?)').join(',');
      
      try {
        const query = this.db.prepare(`
          SELECT zoom, x, y 
          FROM tiles 
          WHERE (zoom, x, y) IN (${placeholders})
        `);
        
        const params = batch.flatMap(tile => [tile.zoom, tile.x, tile.y]);
        const results = query.all(...params) as Tile[];
        
        results.forEach(tile => {
          existingTiles.add(`${tile.zoom}/${tile.x}/${tile.y}`);
        });
      } catch (error) {
        console.error('Error in batch check:', error);
      }
    }
    
    return existingTiles;
  }

  cleanupOldTiles(daysOld: number = 30): number {
    try {
      const result = this.db.prepare(`
        DELETE FROM tiles 
        WHERE created_at < datetime('now', '-' || ? || ' days')
      `).run(daysOld);
      
      return result.changes;
    } catch (error) {
      console.error('Error cleaning up old tiles:', error);
      return 0;
    }
  }
} 