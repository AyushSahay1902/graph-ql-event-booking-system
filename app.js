const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql');
const app = express();

app.use(bodyParser.json());

const events = ['Rome Cooking Dish', 'Sailing','Coding'];

app.use('/graphql', graphqlHTTP({
  //configure graphql api
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }
    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }
    type RootQuery {
      events: [Event!]!
    }
    type RootMutation {
      createEvent(event: EventInput): Event
      deleteEvent(name: String): String
    }
    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => {
      return events
    },
    createEvent: (args) => {
      const event = {
        _id: Math.random().toString(),
        title: args.event.title,
        description: args.event.description,
        price: +args.event.price,
        date: args.event.date
      }
    events.push(event);
    return event;
    },
    deleteEvent: (args) => {
      const eventName = args.name;
      const eventIndex = events.findIndex(event => event === eventName);
      if (eventIndex === -1) {
        return "Event not found";
      }
      events.splice(eventIndex, 1);
      return "Event deleted successfully";
    }
  }
}));

app.listen(3000);