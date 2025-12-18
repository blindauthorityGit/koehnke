// lib/sanity.js
import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: '2ra4cm8j',
  dataset: 'production',
  apiVersion: '2024-01-01',
//   useCdn: process.env.NODE_ENV === 'production',
})
