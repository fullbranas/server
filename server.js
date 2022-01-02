const { ApolloServer } = require("apollo-server");
const dns = require('dns');

const KEYWORDS = {
    PREFIX: "prefix",
    SUFFIX: "suffix"
};

const isDomainAvailable = url => new Promise(resolve => dns.resolve(url, error => resolve(!!error)));

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
        available: Boolean
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
    { id: 3, text: "Se", type: KEYWORDS.SUFFIX },
    { id: 4, text: "Ji", type: KEYWORDS.SUFFIX }
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
        async domains(){
            const domains = [];
            const prefixes = items.filter(item => item.type === KEYWORDS.PREFIX);
            const suffixes = items.filter(item => item.type === KEYWORDS.SUFFIX);

            for(const prefix of prefixes){
                for(const suffix of suffixes){
                    const name = `${prefix.text}${suffix.text}.com`.toLowerCase();
                    const link = `https://checkout.hostgator.com.br/?a=add&sld=${name}&tld=.com.br&domaincycle=1&pid=5&billingcycle=annually&promocode=PRATODAHORA35HG&titan=1&titanSource=1`;
                    const available = await isDomainAvailable(name);

                    domains.push({ name, link, available });
                }
            }

            return domains;
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen();
