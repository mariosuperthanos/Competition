import { gql } from "graphql-tag";

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    hostedEvents: [Event!]!
    timezone: String!
  }

  type Event {
    id: ID!
    title: String!
    description: String!
    date: String!
    startHour: String!
    finishHour: String!
    country: String!
    city: String!
    lat: Float!
    lng: Float!
    slug: String!
    timezone: String!
    hostName: String!
    tags: [String!]!
    host: User!
  }

  type Notification {
    id: ID!
    title: String!
    message: String!
    date: String!
    purpose: String!
    read: Boolean!
    recipient: String!
  }

  type Query {
    event(slug: String!): Event!
    events(
      contains: String
      city: String
      country: String
      date: String
      tags: [String!]
      page: Int 
    ): [Event!]!
  }
`

export default typeDefs;
