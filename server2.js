var express = require("express");
var express_graphql = require("express-graphql");
var { buildSchema } = require("graphql");
var cors = require("cors");
const api_helper = require("./API_helper");
const request = require("request");

// GraphQL schema
var schema = buildSchema(`
    type Query {
        allCourses: [Course]
        course(id: Int!): Course
        courses(topic: String): [Course]
        dig: Dig
    },
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    },
    type Dig {
      host: String
      responsetime: Int
      recordtype: String
      checkedata: String
      location: String
      result: [String]
    }
`);
var coursesData = [
  {
    id: 1,
    title: "The Complete Node.js Developer Course",
    author: "Andrew Mead, Rob Percival",
    description:
      "Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!",
    topic: "Node.js",
    url: "https://codingthesmartway.com/courses/nodejs/"
  },
  {
    id: 2,
    title: "Node.js, Express & MongoDB Dev to Deployment",
    author: "Brad Traversy",
    description:
      "Learn by example building & deploying real-world Node.js applications from absolute scratch",
    topic: "Node.js",
    url: "https://codingthesmartway.com/courses/nodejs-express-mongodb/"
  },
  {
    id: 3,
    title: "JavaScript: Understanding The Weird Parts",
    author: "Anthony Alicea",
    description:
      "An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.",
    topic: "JavaScript",
    url: "https://codingthesmartway.com/courses/understand-javascript/"
  }
];
var app = express();
var getCourse = function(args) {
  var id = args.id;
  return coursesData.filter(course => {
    return course.id == id;
  })[0];
};
var getCourses = function(args) {
  if (args.topic) {
    var topic = args.topic;
    return coursesData.filter(course => course.topic === topic);
  } else {
    return coursesData;
  }
};
const getAllCourses = () => {
  console.log(coursesData);
  return coursesData;
};

let theDig = null;

const runDig = request(
  "http://sonarliteremote1.constellix.com/dig/usnyc01-mon02.nodes.constellix.net/dnsmadeeasy.com/8.8.4.4?recordtype=A",
  { json: true },
  (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    console.log(body);
    theDig = body;
  }
);

const getDig = () => {
  console.log(theDig);
  return theDig;
};

var root = {
  allCourses: getAllCourses,
  course: getCourse,
  courses: getCourses,
  dig: getDig
};
// Create an express server and a GraphQL endpoint
var app = express();

app.use(
  "/graphql",
  cors(),
  express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

app.listen(4000, () =>
  console.log("Express GraphQL Server Now Running On localhost:4000/graphql")
);
