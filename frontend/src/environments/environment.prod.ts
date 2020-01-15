
export const environment = {
    production: true,
    apiServerUrl: 'https://ensemble-movies.herokuapp.com/api/v1', // the running FLASK api server url
    auth0: {
        url: 'dev-008kxm8u.auth0.com', // the auth0 domain prefix
        audience: 'ensemble-pro', // the audience set for the auth0 app
        clientId: 'JoNFwlDztC4yJOcy4pLy4EOdH0yYagJ1', // the client id generated for the auth0 app
        callbackURL: 'https://ensemble-pro.herokuapp.com', // the base url of the running ionic application.
    }
};
