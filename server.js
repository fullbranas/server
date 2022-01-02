const { ApolloServer } = require("apollo-server");

const KEYWORDS = {
    PREFIX: "prefix",
    SUFIX: "sufix"
};

const typeDefs = `
    type PieceOfDomain {
        id: Int
        type: String
        text: String
    }
    
    type Query {
        pieces(type: String): [PieceOfDomain]
    }
    
    input PieceOfDomainInput {
        type: String
        text: String
    }
    
    type Mutation {
        save(item: PieceOfDomainInput): PieceOfDomain
        delete(id: Int): Boolean
    }
`;

const items = [
    { id: 1, text: "Am", type: KEYWORDS.PREFIX },
    { id: 2, text: "Po", type: KEYWORDS.PREFIX },
    { id: 3, text: "Se", type: KEYWORDS.SUFIX },
    { id: 4, text: "Ji", type: KEYWORDS.SUFIX }
];

const resolvers = {
    Query: {
        pieces: (_, params) => items.filter(item => item.type === params.type)
    },
    Mutation: {
        save(_, { item }){
            item.id = items[items.length - 1]?.id + 1 || 1;

            items.push(item);

            return item;
        },
        delete(_, { id }){
            const ids = items.map(item => item.id);

            items.splice(ids.indexOf(id), 1);

            return true;
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen();
