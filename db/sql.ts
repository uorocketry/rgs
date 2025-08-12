/**
 * Remove line comments (--) and block comments (/* *\/) from SQL,
 * collapse empty lines, and split into statements by semicolon.
 * This is a simplistic splitter and will not handle semicolons inside strings.
 */
export function parseSqlStatements(sql: string): string[] {
  // Remove block comments
  const noBlock = sql.replace(/\/\*[\s\S]*?\*\//g, "");
  // Remove line comments
  const noLine = noBlock.replace(/^\s*--.*$/gm, "");
  // Collapse blank lines
  const collapsed = noLine.replace(/\n\s*\n/g, "\n");
  // Split by semicolon
  const raw = collapsed.split(";");
  // Normalize and filter empties
  return raw
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export interface StatementExecutor {
  execute(sql: string): Promise<void>;
}


