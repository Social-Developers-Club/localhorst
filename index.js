// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Payload, Suggestion} = require('dialogflow-fulfillment');
const axios = require('axios')

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

  async function recommendationType(agent) {
    const industryMap = {
      'einzelhandel': 'retail',
      'dienstleistung': 'service',
      'freiberuflich': 'freelancer',
      'gastronomie': 'restaurants',
      'kultur': 'culture',
    };
    const categoryMap = {
      'finanziell': 'financial',
      'geschäftserhaltung': 'business',
      'marketing': 'marketing',
      'austausch': 'network',
      'betrieb': 'operations',
    };
    const typeMap = {
      'infos': 'info',
      'plattform': 'platform',
    };

    let params = agent.contexts.filter(x => x.name === 'companytype')
    console.log(params);
    let { companytype, problemtype, recommendationtype } = params[0].parameters;
    console.log(companytype, problemtype[0], recommendationtype);

    let industry = industryMap[companytype.toLowerCase()];
    let category = categoryMap[problemtype[0].toLowerCase()];
    let type = typeMap[recommendationtype.toLowerCase()];
    console.log(industry, category, type);

    let recommendations = [];
    console.log(`http://sfl-backend.philenius.de/recommendations?type=${type}&industry=${industry}&category=${category}`);
    let response = await axios.get(`http://sfl-backend.philenius.de/recommendations?type=${type}&industry=${industry}&category=${category}`)

    recommendations = response.data;
    console.log(JSON.stringify(recommendations));

    let payload = {
      attachmentLayout: 'carousel',
      attachments: []
    };

    recommendations.forEach(element => {
      console.log(element.id)
      payload.attachments.push(
        {
          title: element.doc.title,
          subtitle: element.doc.description,
          images: [
            {
              url: element.doc.imageUrl || ""
            }
          ],
          buttons: [{
            type: 'postBack',
            title: element.doc.link,
            value: ''
          }]
        }
      );
    });
    console.log('payload:')
    console.log(payload)

    agent.add(new Payload(agent.UNSPECIFIED, payload));
    console.log('added to agent');
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('CompanyType', companyType);
  intentMap.set('ProblemType', problemType);
  intentMap.set('RecommendationType', recommendationType);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
