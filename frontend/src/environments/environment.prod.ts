
export const environment = {
    production: true,
    apiServerUrl: 'https://ensemble-movies.herokuapp.com/api/v1', // the running FLASK api server url
    auth0: {
        url: 'dev-7d54-828.auth0.com', // the auth0 domain prefix
        audience: 'ensemble', // the audience set for the auth0 app
        clientId: '3M60ex70HYUjaHBIDC9l1v0XOfT11hep', // the client id generated for the auth0 app
        callbackURL: 'dev-7d54-828.auth0.com', // the base url of the running ionic application.
    }
};
