import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { globSync } from 'glob';
import { gql } from 'graphql-tag';
import { DocumentNode } from 'graphql';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadSchema(): DocumentNode {
    const srcDir = path.resolve(__dirname, '../');
    const schemaFiles = globSync('**/*.graphql', { cwd: srcDir, absolute: true });

    if (schemaFiles.length === 0) {
        return gql`
            type Query {
                _empty: String
            }
            type Mutation {
                _empty: String
            }
        `;
    }

    const schemas = schemaFiles.map(file => fs.readFileSync(file, 'utf-8'));
    const combinedSchemaString = schemas.join('\n\n');
    return gql(combinedSchemaString);
}
