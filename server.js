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
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen();
