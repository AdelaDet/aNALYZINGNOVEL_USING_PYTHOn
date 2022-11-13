const neo4j = require('neo4j-driver').v1

const graphenedbURL = process.env.GRAPHENEDB_BOLT_URL || 'bolt://localhost'
const graphenedbUser = process.env.GRAPHENEDB_BOLT_USER || 'neo4j'
const graphened