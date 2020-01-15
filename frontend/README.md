# Ensemble Casting Agency Frontend

## Getting Setup

> _tip_: this frontend is designed to work with [Flask-based Backend](../backend). It is recommended you setup and run the backend first.

### Installing Dependencies

#### Installing Node and NPM

This project depends on Nodejs and Node Package Manager (NPM). Before continuing, you must download and install Node (the download includes NPM) from [https://nodejs.com/en/download](https://nodejs.org/en/download/).

#### Installing Ionic Cli

The Ionic Command Line Interface is required to serve and build the frontend. Instructions for installing the CLI  is in the [Ionic Framework Docs](https://ionicframework.com/docs/installation/cli).

#### Installing project dependencies

This project uses NPM to manage software dependencies. NPM Relies on the package.json file located in the `frontend` directory of this repository. After cloning, open your terminal and run:

```bash
npm install
```

>_tip_: **npm i** is shorthand for **npm install**

## Required Tasks

### Configure Enviornment Variables

Ionic uses a configuration file to manage environment variables.

- Open `./src/environments/environments.ts` and ensure each variable reflects the system you stood up for the backend.

>_tip_: a sample **environment.ts** file had been included

## Running Your Frontend in Dev Mode

To run the development server, cd into the `frontend` directory and run:

```bash
ionic serve
```

or

```bash
npm run start:serve
```

### Testing live project

 The live project can be accessed via [Heroku](https://ensemble-pro.herokuapp.com/)
 I have also provided some fake tokens for login for the different roles to make testing easy, simply click on one of the three roles on the login page.

 Also feel free to walk through the project set up and try out the Auth0 authentication implemented on the frontend.
