import * as process from 'process';

export const environment = {
    production: true,
    apiServerUrl: process.env.API_SERVER_URL, // the running FLASK api server url
    auth0: {
        url: process.env.AUTH0_DOMAIN, // the auth0 domain prefix
        audience: process.env.AUTH0_AUDIENCE, // the audience set for the auth0 app
        clientId: process.env.AUTH0_CLIENTID, // the client id generated for the auth0 app
        callbackURL: process.env.AUTH0_CALLBACKURL, // the base url of the running ionic application.
    }
};
