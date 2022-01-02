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
    
    type Domain {
        name: String
        link: String
    }
    
    type Mutation {
        save(item: PieceOfDomainInput): PieceOfDomain
        delete(id: Int): Boolean
        domains: [Domain]
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
        },
        domains(){
            const domains = [];
            const prefixes = items.filter(item => item.type === KEYWORDS.PREFIX);
            const sufixes = items.filter(item => item.type === KEYWORDS.SUFIX);

            for(const index in prefixes){
                const prefix = prefixes[index].text;

                sufixes.forEach(sufix => {
                    const name = `${prefix}${sufix.text}`;
                    const link = `https://checkout.hostgator.com.br/?a=add&sld=${name}&tld=.com.br&domaincycle=1&pid=5&billingcycle=annually&promocode=PRATODAHORA35HG&titan=1&titanSource=1`;

                    domains.push({ name, link });
                });
            }

            return domains;
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen();
