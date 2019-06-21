const express = require("express");
const express_graphql = require("express-graphql");
const { buildSchema } = require("graphql");
const cors = require("cors");
const axios = require('axios');
import schema from 'schema.graphql'

const app = express();

const getCourse = function(args) {
  const id = args.id;
  return coursesData.filter(course => {
    return course.id == id;
  })[0];
};

const getCourses = function(args) {
  if (args.topic) {
    const topic = args.topic;
    return coursesData.filter(course => course.topic === topic);
  } else {
    return coursesData;
  }
};

const getAllCourses = () => {
  console.log(coursesData);
  return coursesData;
};

const getDig = (args) => {
  let reqString = `http://sonarliteremote1.constellix.com/dig/usnyc01-mon02.nodes.constellix.net/${args.host}/8.8.4.4?recordtype=A` 

  return axios.get(reqString).then(function(response){
          return response.data        
      })

  };

  const getDtrace = (args) => {
    let reqString = `http://sonarliteremote1.constellix.com/dig/trace/${args.host}`

    return axios.get(reqString).then(function(response){
      return response.data
    })
  }

const root = {
  dig: getDig,
  dtrace: getDtrace
};

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