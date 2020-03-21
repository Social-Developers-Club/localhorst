// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Payload, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    const payload = {
      type: 'message',
      attachments: [],
      suggestedActions: [{
        type: "postBack",
        title: "Einzelhandel",
        value: "Einzelhandel"
      }, {
        type: "postBack",
        title: "Dienstleistung",
        value: "Dienstleistung"
      }, {
        type: "postBack",
        title: "Einzelunternehmer / Freiberuflich / Künstler",
        value: "Freiberuflich"
      }, {
        type: "postBack",
        title: "Gastronomie",
        value: "Gastronomie"
      }, {
        type: "postBack",
        title: "Freizeit / Unterhaltung / Kultur",
        value: "Kultur"
      }]
    };

    agent.add(new Payload(agent.UNSPECIFIED, payload));
  }

  function companyType(agent) {
    const payload = {
      type: 'message',
      attachments: [],
      suggestedActions: [{
        type: "postBack",
        title: "Finanzielle Hilfe",
        value: "Finanziell"
      }, {
        type: "postBack",
        title: "Das Geschäft am laufen halten",
        value: "Geschäftserhaltung"
      }, {
        type: "postBack",
        title: "Marketing",
        value: "Marketing"
      }, {
        type: "postBack",
        title: "Erfahrungsaustausch mit gleichgesinnten",
        value: "Austausch"
      }, {
        type: "postBack",
        title: "Mitarbeiter und Betrieb",
        value: "Betrieb"
      },]
    }

    agent.add(new Payload(agent.UNSPECIFIED, payload));
  }

  function problemType(agent) {
    const payload = {
      type: 'message',
      attachments: [],
      suggestedActions: [{
        type: "postBack",
        title: "Infos",
        value: "Infos"
      }, {
        type: "postBack",
        title: "Plattformen",
        value: "Plattformen"
      }]
    }

    agent.add(new Payload(agent.UNSPECIFIED, payload));
  }

  function recommendationType(agent) {
    console.log(agent.contexts)

    agent.add('TEST ANALYZE CONTEXTS');
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('CompanyType', companyType);
  intentMap.set('ProblemType', problemType);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
