# Watson Solutions Lab Starter Application

## IMPORTANT: THIS README SHOULD BE REPLACED WITH THE APPLICATION SPECIFIC README FILE.

Check out the Github [Wiki](https://github.ibm.com/Watson-Solutions-Lab/wsl-lb-ng2-bootstrap-starter-app/wiki) for more information about this starter app.

## Prerequisites

Required if you plan to run the application locally.

## Node and NPM

Install 'node.js' -- Right now we are at the 7.9.x version.  You can get the download from [here](https://nodejs.org/en/download/current/).  This will give you `npm` and `node`.

## Loopback CLI

Install 'loopback-cli' globally so you can use the 'lb' commands for models/etc:
```
npm install -g loopback-cli
```

## Cloudfoundry and Bluemix CLI's

To deploy the application and manage services from the command line, you would need these CLI's

Follow the instructions on the [Cloudfoundry CLI page](https://github.com/cloudfoundry/cli#downloads) to download and install the CLI.

## Getting Started

To get started, clone this application and remove the remote the git references. Issue the following command:

```
git clone git@github.ibm.com:Watson-Solutions-Lab/wsl-lb-ng2-bootstrap-starter-app.git <MY-APP-DIRECTORY>
rm -rf <MY-APP-DIRECTORY>/.git
```

where ```<MY-APP-DIRECTORY>``` is replaced by the directory that you will use to build your application.

At this point, the content of the starter app will be cloned and all external references will be removed. A new git repo can be initiated with no old references to the starter app repo.

The application comes with a number of sample integrations.  The sample integrations have credentials that are saved in the
.env file.  The .env file should be modified as soon as you clone this application.

## Loopback configuration

The server component to this starter application is implemented in Loopback.io.

## Testing configuration values

This application provides a limited set of test specs to validate provided environment variables. To run this validation, issue the following command.

```
npm run test
```

## Starting the app

Before starting the application locally, the user must install the required dependencies. Issue the following command at the project root level

```
npm install
```

Once the dependencies are installed, the application can be started in 2 ways.

### Development Mode:

This mode will build and serve the complete application and will rebuild and restart when it detects changes to the source. Issue the following command to start the application in development mode. Additionally, the browser will automatically refresh on changes:

```
npm run develop
```

### Standard Mode:

This mode will build and serve the complete application but it will not rebuild and restart when it detects changes to the source. Issue the following command to start the application in standard mode:

```
npm run serve
```

### General

This starter application consist of a number of sample components.  Once the application is cloned, the samples should either be removed or renamed to application specific components.  No Accelerator should contain any references to the sample components.
