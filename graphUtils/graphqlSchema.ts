import {gql} from "graphql-tag";

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    hostedEvents: [Event!]
  }
  type Event{
    id: ID!
    title: String!
    hosts: [User!]
    description: String!
    date: String!
    startHour: String!
    finishHour: String!
    country: String!
    city: String!
    lat: Float!
    lng: Float!
    slug: String!
  }
  type Query{
    event(slug: String!): Event!
    events(contains: String, city: String, country: String, date: String): [Event!]!
  }
`
export default typeDefs;