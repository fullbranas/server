const { ApolloServer } = require("apollo-server");
const dns = require('dns');
const { get } = require("./service");
const FINAL_DOMAIN = '.com';

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
    
    type DomainDetail{
        link: String
        available: Boolean
        prefix: String
        suffix: String
    }
    
    type Mutation {
        save(item: PieceOfDomainInput): PieceOfDomain
        delete(id: Int): Boolean
        domains: [Domain],
        domainDetail(name: String): DomainDetail
    }
`;

const items = [];

const resolvers = {
    Query: {
        pieces: async (_, params) => await get(params.type)
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
            const prefixes = await get(KEYWORDS.PREFIX);
            const suffixes = await get(KEYWORDS.SUFFIX);

            for(const prefix of prefixes){
                const prefixText = prefix.text;

                for(const suffix of suffixes){
                    const suffixText = suffix.text;
                    const name = `${prefixText}${suffixText}${FINAL_DOMAIN}`.toLowerCase();
                    const link = `https://checkout.hostgator.com.br/?a=add&sld=${name}&tld=${FINAL_DOMAIN}&domaincycle=1&pid=5&billingcycle=annually&promocode=PRATODAHORA35HG&titan=1&titanSource=1`;
                    const available = await isDomainAvailable(name);

                    domains.push({ name, link, available, prefix: prefixText, suffix: suffixText });
                }
            }

            return domains;
        },
        async domainDetail(_, { name }){
            if(!name) return null;

            const domains = await this.domains();
            const domain = domains.find(item => item.name === name);

            if(!domain) return null;

            const { link, available, prefix, suffix } = domain;

            return { link, available, prefix, suffix };
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen();
