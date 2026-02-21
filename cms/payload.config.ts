import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Posts } from './src/collections/Posts'
import { Authors } from './src/collections/Authors'
import { Media } from './src/collections/Media'
import { Users } from './src/collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseUrl = process.env.DATABASE_URL || 'file:./data/payload.db'
const isPostgres = databaseUrl.startsWith('postgres')

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

  editor: lexicalEditor(),

  db: isPostgres
    ? postgresAdapter({ pool: { connectionString: databaseUrl } })
    : sqliteAdapter({ client: { url: databaseUrl } }),

  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-in-production',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  cors: corsOrigins,
  csrf: corsOrigins,
})
