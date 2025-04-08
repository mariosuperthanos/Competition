const typeDefs = `#graphql
  type User {
    id: String!
    name: String!
    email: String!
    password: String!
    hostedEvents: [Event!]
  }
  type Event{
    id: String!
    title: String!
    hosts: [User!]
    description: String!
    date: String!
    startHour: String!
    finishHour: String!
    country: String!
    city: String!
    lat: Number!
    lng: Number! 
  }
  type Query{
    
  }
`
export default typeDefs;