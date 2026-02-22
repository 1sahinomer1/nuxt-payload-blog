import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Posts } from './src/collections/Posts'
import { Authors } from './src/collections/Authors'
import { Media } from './src/collections/Media'
import { Users } from './src/collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseUrl = process.env.DATABASE_URL || ''

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required. Use a PostgreSQL connection string.')
}

const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
const serverUrl = process.env.SERVER_URL || (vercelUrl ? `https://${vercelUrl}` : 'http://localhost:3001')
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'

const corsOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  frontendUrl,
  serverUrl,
].filter((v, i, a) => Boolean(v) && a.indexOf(v) === i)

export default buildConfig({
  serverURL: serverUrl,

  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [Posts, Authors, Media, Users],

  plugins: [
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],

  editor: lexicalEditor(),

  db: postgresAdapter({
    pool: {
      connectionString: databaseUrl,
    },
  }),

  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-in-production',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  cors: corsOrigins,
  csrf: corsOrigins,
})
