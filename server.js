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
        prefixes: [PieceOfDomain]
        sufixes: [PieceOfDomain]
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
        prefixes: () => items.filter(item => item.type === KEYWORDS.PREFIX),
        sufixes: () => items.filter(item => item.type === KEYWORDS.SUFIX)
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen();
