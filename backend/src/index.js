import { ApolloServer } from 'apollo-server-express'
//const { ApolloServer} = apollo
import { typeDefs, resolvers } from './schema.js'
import {connect, connection} from 'mongoose'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { decodeJWT } from './middleware/auth.js'
dotenv.config()

const PORT = 4001

const app = express()

app.use(cors())

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const token = req.headers.authorization || '';
        if (token) {
            const user = decodeJWT(token);
            return { user };
        }
    }
})

connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true
})

const db = connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  // we're connected!
})

server.applyMiddleware({ app })

app.listen({ port: PORT }, () =>
    console.log(` Server ready at http://localhost:${PORT}${server.graphqlPath}`)
)