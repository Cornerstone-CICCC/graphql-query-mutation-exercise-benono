"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const uuid_1 = require("uuid");
// Products dataset
let products = [
    { id: "1", productName: "Apple", price: 3.99, qty: 2 },
    { id: "2", productName: "Banana", price: 1.99, qty: 3 },
    { id: "3", productName: "Orange", price: 2.0, qty: 4 },
    { id: "4", productName: "Mango", price: 5.5, qty: 5 },
    { id: "5", productName: "Watermelon", price: 8.99, qty: 2 },
];
// Type Definitions
const typeDefs = `#graphql
  type Product {
    id: ID!
    productName: String
    price: Float
    qty: Int
  }

  type Query {
    products: [Product]
    getProductById(id: ID!): Product
    getProductTotalPrice(id: ID!): Float # multiply product price with its qty
    getTotalQtyOfProducts: Int # sum of all qty of all products
  }

  type Mutation {
    addProduct(productName: String, price: Float, qty: Int): Product
    updateProduct(id: ID!, productName: String, price: Float, qty: Int): Product
    deleteProduct(id: ID!): Product
  }
`;
// Resolvers - Finish This
const resolvers = {
    Query: {
        products: () => products,
        getProductById: (_, { id }) => {
            return products.find((product) => product.id === id);
        },
        getProductTotalPrice: (_, { id }) => {
            const product = products.find((product) => product.id === id);
            return product ? product.price * product.qty : 0;
        },
        getTotalQtyOfProducts: () => {
            return products.reduce((acc, product) => acc + product.qty, 0);
        },
    },
    Mutation: {
        addProduct: (_, { productName, price, qty, }) => {
            const newProduct = { id: (0, uuid_1.v4)(), productName, price, qty };
            products.push(newProduct);
            return newProduct;
        },
        updateProduct: (_, { id, productName, price, qty, }) => {
            const productIndex = products.findIndex((product) => product.id === id);
            if (productIndex !== -1) {
                products[productIndex] = { id, productName, price, qty };
                return products[productIndex];
            }
            return null;
        },
        deleteProduct: (_, { id }) => {
            const productIndex = products.findIndex((product) => product.id === id);
            if (productIndex !== -1) {
                return products.splice(productIndex, 1)[0];
            }
            return null;
        },
    },
};
// Create Apollo Server
const server = new server_1.ApolloServer({
    typeDefs,
    resolvers,
});
// Start Apollo Server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = yield (0, standalone_1.startStandaloneServer)(server);
    console.log(`Server is running on ${url}...`);
});
startServer();
