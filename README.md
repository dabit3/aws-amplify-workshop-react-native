# Building Mobile Applications with React Native & AWS Amplify

In this workshop we'll learn how to build cloud-enabled mobile applications with React Native & [AWS Amplify](https://aws-amplify.github.io/).

![](header.jpg)

### Topics we'll be covering:

- [Authentication](https://github.com/dabit3/aws-amplify-workshop-react-native#adding-authentication)
- [GraphQL API with AWS AppSync](https://github.com/dabit3/aws-amplify-workshop-react-native#adding-a-graphql-api-with-aws-appsync)
- [Serverless Functions](https://github.com/dabit3/aws-amplify-workshop-react-native#adding-a-serverless-function)
- [REST API with a Lambda Function](https://github.com/dabit3/aws-amplify-workshop-react-native#adding-a-rest-api)
- [Analytics](https://github.com/dabit3/aws-amplify-workshop-react-native#adding-analytics)
- [Adding Storage with Amazon S3](https://github.com/dabit3/aws-amplify-workshop-react-native#working-with-storage)
- [Multiple Serverless Environments](https://github.com/dabit3/aws-amplify-workshop-react-native#multiple-serverless-environments)
- [Removing / Deleting Services](https://github.com/dabit3/aws-amplify-workshop-react-native#removing-services)

## Redeeming the AWS Credit   

1. Visit the [AWS Console](https://console.aws.amazon.com/console).
2. In the top right corner, click on __My Account__.
![](dashboard1.jpg)
3. In the left menu, click __Credits__.
![](dashboard2.jpg)

## Getting Started - Creating the React Native Application

To get started, we first need to create a new React Native project & change into the new directory using either the [React Native CLI](https://facebook.github.io/react-native/docs/getting-started.html) (See __Building Projects With Native Code__ in the documentation) or [Expo CLI](https://facebook.github.io/react-native/docs/getting-started).

We can use the React Native CLI or Expo to create a new app:

### If you're using the React Native CLI (you're not using Expo)

Change into the app directory & install the dependencies

```bash
$ npx react-native init RNAmplify

$ cd RNAmplify

$ npm install --save aws-amplify aws-amplify-react-native uuid amazon-cognito-identity-js

# or

$ yarn add aws-amplify aws-amplify-react-native uuid amazon-cognito-identity-js
```

Next, for iOS you need to install the pods:

```sh
$ cd ios

$ pod install --repo-update

$ cd ..
```

### If you are using Expo

```bash
$ npx expo init RNAmplify

> Choose a template: blank

$ cd RNAmplify

$ npm install --save aws-amplify aws-amplify-react-native uuid

# or

$ yarn add aws-amplify aws-amplify-react-native uuid
```

### Running the app

Next, run the app:

```sh
$ react-native run-ios

# or if running android

$ react-native run-android

# or, if using expo

$ expo start
```

## Installing the CLI & Initializing a new AWS Amplify Project

### Installing the CLI

Next, we'll install the AWS Amplify CLI:

```bash
$ npm install -g @aws-amplify/cli
```

Now we need to configure the CLI with our credentials:

```js
$ amplify configure
```

> If you'd like to see a video walkthrough of this configuration process, click [here](https://www.youtube.com/watch?v=fWbM5DLh25U).

Here we'll walk through the `amplify configure` setup. Once you've signed in to the AWS console, continue:
- Specify the AWS Region: __your preferred region__
- Specify the username of the new IAM user: __amplify-workshop-user__
> In the AWS Console, click __Next: Permissions__, __Next: Tags__, __Next: Review__, & __Create User__ to create the new IAM user. Then, return to the command line & press Enter.
- Enter the access key of the newly created user:   
  accessKeyId: __(<YOUR_ACCESS_KEY_ID>)__   
  secretAccessKey:  __(<YOUR_SECRET_ACCESS_KEY>)__
- Profile Name: __amplify-workshop-user__

### Initializing A New AWS Amplify Project

> Make sure to initialize this Amplify project in the root of your new React Native application

```bash
$ amplify init
```

- Enter a name for the project: __RNAmplify__
- Enter a name for the environment: __dev__
- Choose your default editor: __Visual Studio Code (or your favorite editor)__   
- Please choose the type of app that you're building __javascript__   
- What javascript framework are you using __react-native__   
- Source Directory Path: __/__   
- Distribution Directory Path: __/__
- Build Command: __npm run-script build__   
- Start Command: __npm run-script start__   
- Do you want to use an AWS profile? __Y__
- Please choose the profile you want to use: __amplify-workshop-user__

Now, the AWS Amplify CLI has iniatilized a new project & you will see a couple of new files & folders: __amplify__ & __aws-exports.js__. These files hold your project configuration.

### Configuring the React Native application

The next thing we need to do is to configure our React Native application to be aware of our new AWS Amplify project. We can do this by referencing the auto-generated __aws-exports.js__ file that is now in our root folder.

To configure the app, open __index.js__ and add the following code below the last import:

```js
// index.js
import Amplify from 'aws-amplify'
import config from './aws-exports'
Amplify.configure(config)
```

Now, our app is ready to start using our AWS services.

## Adding Authentication

To add authentication, we can use the following command:

```sh
$ amplify add auth
```

- Do you want to use default authentication and security configuration? __Default configuration__   
- How do you want users to be able to sign in when using your Cognito User Pool? __Username__ (keep default) 
- What attributes are required for signing up? __Email__ (keep default)

Now, we'll run the push command and the cloud resources will be created in our AWS account.

```bash
$ amplify push
```

To view the new Cognito authentication service at any time after its creation, run the following command:

```sh
$ amplify console auth
```

### Using the withAuthenticator component

To add authentication, we'll go into __App.js__ and first import the `withAuthenticator` HOC (Higher Order Component) from `aws-amplify-react`:

```js
// App.js
import { withAuthenticator } from 'aws-amplify-react-native'
```

Next, we'll wrap our default export (the App component) with the `withAuthenticator` HOC:

```js
export default withAuthenticator(App, {
  includeGreetings: true
})
```

Now, we can run the app and see that an Authentication flow has been added in front of our App component. This flow gives users the ability to sign up & sign in.

To refresh, you can use one of the following commands:

```sh
# iOS Simulator
CMD + d # Opens debug menu
CMD + r # Reloads the app

# Android Emulator
CTRL + m # Opens debug menu
rr # Reloads the app
```

### Accessing User Data

We can access the user's info now that they are signed in by calling `Auth.currentAuthenticatedUser()`.

```js
// App.js
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';

import { withAuthenticator } from 'aws-amplify-react-native'

import { Auth } from 'aws-amplify' 

class App extends React.Component {
  async componentDidMount() {
    const user = await Auth.currentAuthenticatedUser()
    console.log('user:', user)
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Hello World</Text>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 28
  }
})

export default withAuthenticator(App, {
  includeGreetings: true
})
```

### Signing out with a custom Sign Out button

We can also sign the user out using the `Auth` class & calling `Auth.signOut()`. This function returns a promise that is fulfilled after the user session has been ended & AsyncStorage is updated.

Because `withAuthenticator` holds all of the state within the actual component, we must have a way to rerender the actual `withAuthenticator` component by forcing React to rerender the parent component.

To do so, let's make a few updates:

```js
// App.js
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';

import { withAuthenticator } from 'aws-amplify-react-native'

import { Auth } from 'aws-amplify' 

class App extends React.Component {
  async componentDidMount() {
    const user = await Auth.currentAuthenticatedUser()
    console.log('user:', user)
  }
  signOut = () => {
    Auth.signOut()
      .then(() => this.props.onStateChange('signedOut'))
      .catch(err => console.log('err: ', err))
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Hello World</Text>
        <Text onPress={this.signOut}>Sign Out</Text>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 28
  }
})

export default withAuthenticator(App);

```

### Custom authentication strategies

> This section is an overview and is considered an advanced part of the workshop. If you are not comfortable writing a custom authentication flow, I would read through this section and use it as a reference in the future. If you'd like to jump to the next section, click [here](https://github.com/dabit3/aws-amplify-workshop-react-native#adding-a-graphql-api-with-aws-appsync).

The `withAuthenticator` component is a really easy way to get up and running with authentication, but in a real-world application we probably want more control over how our form looks & functions.

Let's look at how we might create our own authentication flow.

To get started, we would probably want to create input fields that would hold user input data in the state. For instance when signing up a new user, we would probably need 3 user inputs to capture the user's username, email, & password.

To do this, we could create some initial state for these values & create an event handler that we could attach to the form inputs:

```js
// initial state
state = {
  username: '', password: '', email: ''
}

// event handler
onChangeText = (key, value) => {
  this.setState({ [key]: value })
}

// example of usage with TextInput
<TextInput
  placeholder='username'
  value={this.state.username}
  style={{ width: 300, height: 50, margin: 5, backgroundColor: "#ddd" }}
  onChangeText={v => this.onChange('username', v)}
/>
```

We'd also need to have a method that signed up & signed in users. We can us the Auth class to do thi. The Auth class has over 30 methods including things like `signUp`, `signIn`, `confirmSignUp`, `confirmSignIn`, & `forgotPassword`. Thes functions return a promise so they need to be handled asynchronously.

```js
// import the Auth component
import { Auth } from 'aws-amplify'

// Class method to sign up a user
signUp = async() => {
  const { username, password, email } = this.state
  try {
    await Auth.signUp({ username, password, attributes: { email }})
  } catch (err) {
    console.log('error signing up user...', err)
  }
}
```

## Adding a GraphQL API with AWS AppSync

To add a GraphQL API, we can use the following command:

```sh
amplify add api
```

Answer the following questions

- Please select from one of the above mentioned services __GraphQL__   
- Provide API name: __RestaurantAPI__   
- Choose the default authorization type for the API __API key__   
- Enter a description for the API key __public__
- After how many days from now the API key should expire __7__
- Do you want to configure advanced settings for the GraphQL API __No__
- Do you have an annotated GraphQL schema? __N__   
- Do you want a guided schema creation? __Y__   
- What best describes your project: __Single object with fields (e.g. “Todo” with ID, name, description)__   
- Do you want to edit the schema now? (Y/n) __Y__   

> When prompted, update the schema to the following:   

```graphql
type Restaurant @model {
  id: ID!
  clientId: String
  name: String!
  description: String!
  city: String!
}
```

To mock and test the API locally, you can run the mock command:

```bash
$ amplify mock api

? Choose the code generation language target: javascript
? Enter the file name pattern of graphql queries, mutations and subscriptions: src/graphql/**/*.js
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions: Y
? Enter maximum statement depth [increase from default if your schema is deeply nested]: 2
```

This should start an AppSync Mock endpoint:

```
AppSync Mock endpoint is running at http://10.219.99.136:20002
```

Open the endpoint in the browser to use the GraphiQL Editor.

From here, we can now test the API.

### Adding mutations from within the GraphiQL Editor.

In the GraphiQL editor, execute the following mutation to create a new restaurant in the API:

```graphql
mutation createRestaurant {
  createRestaurant(input: {
    name: "Nobu"
    description: "Great Sushi"
    city: "New York"
  }) {
    id name description city
  }
}
```

Now, let's query for the restaurant:

```graphql
query listRestaurants {
  listRestaurants {
    items {
      id
      name
      description
      city
    }
  }
}
```

We can even add search / filter capabilities when querying:

```graphql
query searchRestaurants {
  listRestaurants(filter: {
    city: {
      contains: "New York"
    }
  }) {
    items {
      id
      name
      description
      city
    }
  }
}
```

Or, get an individual restaurant by ID:

```graphql
query getRestaurant {
  getRestaurant(id: "RESTAURANT_ID") {
    name
    description
    city
  }
}
```

### Interacting with the GraphQL API from our client application - Querying for data

Now that the GraphQL API is created we can begin interacting with it!

The first thing we'll do is perform a query to fetch data from our API.

To do so, we need to define the query, execute the query, store the data in our state, then list the items in our UI.

```js
// App.js
import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
} from 'react-native';

// imports from Amplify library
import { withAuthenticator } from 'aws-amplify-react-native'
import { API, graphqlOperation } from 'aws-amplify'

// import the GraphQL query
import { listRestaurants } from './src/graphql/queries'

class App extends React.Component {
  // define some state to hold the data returned from the API
  state = {
    restaurants: []
  }
  // execute the query in componentDidMount
  async componentDidMount() {
    try {
      const restaurantData = await API.graphql(graphqlOperation(listRestaurants))
      console.log('restaurantData:', restaurantData)
      this.setState({
        restaurants: restaurantData.data.listRestaurants.items
      })
    } catch (err) {
      console.log('error fetching restaurants...', err)
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        {
          this.state.restaurants.map((restaurant, index) => (
            <View key={index}>
              <Text>{restaurant.name}</Text>
              <Text>{restaurant.description}</Text>
              <Text>{restaurant.city}</Text>
            </View>
          ))
        }
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default withAuthenticator(App, { includeGreetings: true });

```

## Performing mutations

 Now, let's look at how we can create mutations. The mutation we will be working with is `createRestaurant`.

```js
// App.js
import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TextInput,
  Button
} from 'react-native';

// imports from Amplify library
import { withAuthenticator } from 'aws-amplify-react-native'
import { API, graphqlOperation } from 'aws-amplify'

// import the GraphQL query
import { listRestaurants } from './src/graphql/queries'
// import the GraphQL mutation
import { createRestaurant } from './src/graphql/mutations'

// create client ID
import uuid from 'uuid/v4'
const CLIENTID = uuid()

class App extends React.Component {
  // add additional state to hold form state as well as restaurant data returned from the API
  state = {
    name: '', description: '', city: '', restaurants: []
  }
  // execute the query in componentDidMount
  async componentDidMount() {
    try {
      const restaurantData = await API.graphql(graphqlOperation(listRestaurants))
      console.log('restaurantData:', restaurantData)
      this.setState({
        restaurants: restaurantData.data.listRestaurants.items
      })
    } catch (err) {
      console.log('error fetching restaurants...', err)
    }
  }
  // this method calls the API and creates the mutation
  createRestaurant = async() => {
    const { name, description, city  } = this.state
    // store the restaurant data in a variable
    const restaurant = {
      name, description, city, clientId: CLIENTID
    }
    // perform an optimistic response to update the UI immediately
    const restaurants = [...this.state.restaurants, restaurant]
    this.setState({
      restaurants,
      name: '', description: '', city: ''
      })
    try {
      // make the API call
      await API.graphql(graphqlOperation(createRestaurant, {
        input: restaurant
      }))
      console.log('item created!')
    } catch (err) {
      console.log('error creating restaurant...', err)
    }
  }
  // change form state then user types into input
  onChange = (key, value) => {
    this.setState({ [key]: value })
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TextInput
          style={{ height: 50, margin: 5, backgroundColor: "#ddd" }}
          onChangeText={v => this.onChange('name', v)}
          value={this.state.name} placeholder='name'
        />
        <TextInput
          style={{ height: 50, margin: 5, backgroundColor: "#ddd" }}
          onChangeText={v => this.onChange('description', v)}
          value={this.state.description} placeholder='description'
        />
        <TextInput
          style={{ height: 50, margin: 5, backgroundColor: "#ddd" }}
          onChangeText={v => this.onChange('city', v)}
          value={this.state.city} placeholder='city'
        />
        <Button onPress={this.createRestaurant} title='Create Restaurant' />
        {
          this.state.restaurants.map((restaurant, index) => (
            <View key={index} style={styles.row}>
              <Text>{restaurant.name}</Text>
              <Text>{restaurant.description}</Text>
              <Text>{restaurant.city}</Text>
            </View>
          ))
        }
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    padding: 10
  }
})

export default withAuthenticator(App, { includeGreetings: true });

```

## Challenge

Recreate this functionality in Hooks

> For direction, check out the tutorial [here](https://medium.com/open-graphql/react-hooks-for-graphql-3fa8ebdd6c62)

> For the solution to this challenge, view the [hooks](graphqlHooks.js) file.

## Adding a Serverless Function

### Adding a basic Lambda Function

To add a serverless function, we can run the following command:

```sh
$ amplify add function
```

> Answer the following questions

- Provide a friendly name for your resource to be used as a label for this category in the project: __basiclambda__
- Provide the AWS Lambda function name: __basiclambda__
- Choose the function template that you want to use: __Hello world function__
- Do you want to access other resources created in this project from your Lambda function? __N__
- Do you want to edit the local lambda function now? __Y__

> This should open the function package located at __amplify/backend/function/basiclambda/src/index.js__.

Edit the function to look like this, & then save the file.

```js
exports.handler = (event, context, callback) => {
  console.log('event: ', event)
  const body = {
    message: "Hello world!"
  }
  const response = {
    statusCode: 200,
    body
  }
  callback(null, response)
}
```

Next, we can test this out by running:

```sh
$ amplify function invoke basiclambda
```

- Provide the name of the script file that contains your handler function: __index.js__
- Provide the name of the handler function to invoke: __handler__
- Provide the relative path to the event: __event.json__

You'll notice the following output from your terminal:

```sh
Testing function locally
event:  { key1: 'value1', key2: 'value2', key3: 'value3' }

Success!  Message:
------------------
{"statusCode":200,"body":{"message":"Hello world!"}}

Done.
Done running invoke function.
```

_Where is the event data coming from? It is coming from the values located in event.json in the function folder (__amplify/backend/function/basiclambda/src/event.json__). If you update the values here, you can simulate data coming arguments the event._

Feel free to test out the function by updating `event.json` with data of your own.

### Adding a function running an express server and invoking it from an API call (http)

Next, we'll build a function that will be running an [Express](https://expressjs.com/) server inside of it.

This new function will fetch data from a cryptocurrency API & return the values in the response.

To get started, we'll create a new function:

```sh
$ amplify add function
```

> Answer the following questions

- Provide a friendly name for your resource to be used as a label for this category in the project: __cryptofunction__
- Provide the AWS Lambda function name: __cryptofunction__
- Choose the function template that you want to use: __Serverless express function (Integration with Amazon API Gateway)__
- Do you want to access other resources created in this project from your Lambda function? __N__
- Do you want to edit the local lambda function now? __Y__

This should open the function package located at __amplify/backend/function/cryptofunction/src/index.js__. You'll notice in this file, that the event is being proxied into an express server:

```js
exports.handler = (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  awsServerlessExpress.proxy(server, event, context);
};
```

Instead of updating the handler function itself, we'll instead update __amplify/backend/function/cryptofunction/src/app.js__ which has the actual server code we would like to be working with.

Here, in __amplify/backend/function/cryptofunction/src/app.js__, we'll add the following code & save the file:

```js
// amplify/backend/function/cryptofunction/src/app.js

// you should see this code already there 👇:
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});
// below the above code, add the following code 👇
const axios = require('axios')

app.get('/coins', function(req, res) {
  let apiUrl = `https://api.coinlore.com/api/tickers?start=0&limit=10`
  
  if (req && req.query) {
    const { start = 0, limit = 10 } = req.query
    apiUrl = `https://api.coinlore.com/api/tickers/?start=${start}&limit=${limit}`
  }

  axios.get(apiUrl)
    .then(response => {
      res.json({
        coins: response.data.data
      })
    })
    .catch(err => res.json({ error: err }))
})
```

In the above function we've used the axios library to call another API. In order to use axios, we need be sure that it will be installed by updating the package.json for the new function:

```sh
$ cd amplify/backend/function/cryptofunction/src

$ npm install axios

$ cd ../../../../../
```

Next, change back into the root directory.

Now we can test this function out:

```sh
$ amplify function invoke cryptofunction

? Provide the name of the script file that contains your handler function: index.js
? Provide the name of the handler function to invoke: handler
? Provide the relative path to the event: event.json
```

This will start up the node server. We can then make `curl` requests agains the endpoint:

```sh
curl 'localhost:3000/coins'
```

If we'd like to test out the query parameters, we can update the __event.json__ to add the following:

```json
{
    "httpMethod": "GET",
    "path": "/coins",
    "queryStringParameters": {
        "start": "0",
        "limit": "1"
    }
}
```

When we invoke the function these query parameters will be passed in & the http request will be made immediately.

## Adding a REST API

Now that we've created the cryptocurrency Lambda function let's add an API endpoint so we can invoke it via http.

To add the REST API, we can use the following command:

```sh
amplify add api
```

> Answer the following questions

- Please select from one of the above mentioned services __REST__   
- Provide a friendly name for your resource that will be used to label this category in the project: __cryptoapi__   
- Provide a path (e.g., /items): __/coins__   
- Choose lambda source __Use a Lambda function already added in the current Amplify project__   
- Choose the Lambda function to invoke by this path: __cryptofunction__   
- Restrict API access __Y__
- Who should have access? __Authenticated users only__
- What kind of access do you want for Authenticated users __read/create/update/delete__
- Do you want to add another path? (y/N) __N__     

Now the resources have been created & configured & we can push them to our account: 

```bash
amplify push
```

### Interacting with the new API

Now that the API is created we can start sending requests to it & interacting with it.

Let's request some data from the API:

```js
// src/App.js
import React from 'react'
import { View, Text } from 'react-native'
import { API } from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react-native'

class App extends React.Component {
  state = {
    coins: []
  }
  async componentDidMount() {
    try {
      // const data = await API.get('cryptoapi', '/coins')
      const data = await API.get('cryptoapi', '/coins?limit=5&start=100')
      console.log('data from Lambda REST API: ', data)
      this.setState({ coins: data.coins })
    } catch (err) {
      console.log('error fetching data..', err)
    }
  }
  render() {
    return (
      <View>
        {
          this.state.coins.map((c, i) => (
            <View key={i}>
              <Text>{c.name}</Text>
              <Text>{c.price_usd}</Text>
            </View>
          ))
        }
      </View>
    )
  }
}

export default withAuthenticator(App, { includeGreetings: true })
```

## Adding Analytics

To add analytics, we can use the following command:

```sh
amplify add analytics
```

> Next, we'll be prompted for the following:

- Provide your pinpoint resource name: __amplifyanalytics__   
- Apps need authorization to send analytics events. Do you want to allow guest/unauthenticated users to send analytics events (recommended when getting started)? __Y__   
- overwrite YOURFILEPATH-cloudformation-template.yml __Y__

### Recording events

Now that the service has been created we can now begin recording events.

To record analytics events, we need to import the `Analytics` class from Amplify & then call `Analytics.record`:

```js
import { Analytics } from 'aws-amplify'

state = {username: ''}

async componentDidMount() {
  try {
    const user = await Auth.currentAuthenticatedUser()
    this.setState({ username: user.username })
  } catch (err) {
    console.log('error getting user: ', err)
  }
}

recordEvent = () => {
  Analytics.record({
    name: 'My test event',
    attributes: {
      username: this.state.username
    }
  })
}

<Button onPress={this.recordEvent} title='Record Event' />
```

## Working with Storage

To add storage, we can use the following command:

```sh
amplify add storage
```

> Answer the following questions   

- Please select from one of the below mentioned services __Content (Images, audio, video, etc.)__
- Please provide a friendly name for your resource that will be used to label this category in the
 project: __rnworkshopstorage__
- Please provide bucket name: __YOUR_UNIQUE_BUCKET_NAME__
- Who should have access: __Auth users only__
- What kind of access do you want for Authenticated users?

```sh
❯◉ create/update
 ◉ read
 ◉ delete
```


```sh
amplify push
```

Now, storage is configured & ready to use.

What we've done above is created configured an Amazon S3 bucket that we can now start using for storing items.

For example, if we wanted to test it out we could store some text in a file like this:

```js
import { Storage } from 'aws-amplify'

// create function to work with Storage
addToStorage = () => {
  Storage.put('textfiles/mytext.txt', `Hello World`)
    .then (result => {
      console.log('result: ', result)
    })
    .catch(err => console.log('error: ', err));
}

// add click handler
<Button onPress={this.addToStorage} title='Add to Storage' />
```

This would create a folder called `textfiles` in our S3 bucket & store a file called __mytext.txt__ there with the code we specified in the second argument of `Storage.put`.

If we want to read everything from this folder, we can use `Storage.list`:

```js
readFromStorage = () => {
  Storage.list('textfiles/')
    .then(data => console.log('data from S3: ', data))
    .catch(err => console.log('error fetching from S3', err))
}
```

If we only want to read the single file, we can use `Storage.get`:

```js
readFromStorage = () => {
  Storage.get('textfiles/mytext.txt')
    .then(data => {
      console.log('data from S3: ', data)
      fetch(data)
        .then(r => r.text())
        .then(text => {
          console.log('text: ', text)
        })
        .catch(e => console.log('error fetching text: ', e))
    })
    .catch(err => console.log('error fetching from S3', err))
}
```

If we wanted to pull down everything, we can use `Storage.list`:

```js
readFromStorage = () => {
  Storage.list('')
    .then(data => console.log('data from S3: ', data))
    .catch(err => console.log('error fetching from S3', err))
}
```

## Multiple Serverless Environments

Now that we have our API up & running, what if we wanted to update our API but wanted to test it out without it affecting our existing version?

To do so, we can create a clone of our existing environment, test it out, & then deploy & test the new resources.

Once we are happy with the new feature, we can then merge it back into our main environment. Let's see how to do this!

### Creating a new environment

To create a new environment, we can run the `env` command:

```sh
amplify env add

> Do you want to use an existing environment? No
> Enter a name for the environment: apiupdate
> Do you want to use an AWS profile? Yes
> Please choose the profile you want to use: appsync-workshop-profile
```

Now, the new environment has been initialize, & we can deploy the new environment using the `push` command:

```sh
amplify push
```

Now that the new environment has been created we can get a list of all available environments using the CLI:

```sh
amplify env list
```

Let's update the GraphQL schema to add a new field. In __amplify/backend/api/RestaurantAPI/schema.graphql__  update the schema to the following:

```graphql
type Restaurant @model {
  id: ID!
  clientId: String
  name: String!
  type: String
  description: String!
  city: String!
}

type ModelRestaurantConnection {
	items: [Restaurant]
	nextToken: String
}

type Query {
  listAllRestaurants(limit: Int, nextToken: String): ModelRestaurantConnection
}
```

In the schema we added a new field to the __Restaurant__ definition to define the type of restaurant:

```graphql
type: String
```

Now, we can run amplify push again to update the API:

```sh
amplify push
```

To test this out, we can go into the [AppSync Console](https://console.aws.amazon.com/appsync) & log into the API.

You should now see a new API called __RestaurantAPI-apiupdate__. Click on this API to view the API dashboard.

If you click on __Schema__ you should notice that it has been created with the new __type__ field. Let's try it out.

To test it out we need to create a new user because we are using a brand new authentication service. To do this, open the app & sign up.

In the API dashboard, click on __Queries__.

Next, click on the __Login with User Pools__ link.

Copy the __aws_user_pools_web_client_id__ value from your __aws-exports__ file & paste it into the __ClientId__ field.

Next, login using your __username__ & __password__.

Now, create a new mutation & then query for it:

```graphql
mutation createRestaurant {
  createRestaurant(input: {
    name: "Nobu"
    description: "Great Sushi"
    city: "New York"
    type: "sushi"
  }) {
    id name description city type
  }
}

query listRestaurants {
  listAllRestaurants {
    items {
      name
      description
      city
      type
    }
  }
}
```

### Merging the new environment changes into the main environment.

Now that we've created a new environment & tested it out, let's check out the main environment.

```sh
amplify env checkout local
```

Next, run the `status` command:

```sh
amplify status
```

You should now see an __Update__ operation:

```
Current Environment: local

| Category | Resource name   | Operation | Provider plugin   |
| -------- | --------------- | --------- | ----------------- |
| Api      | RestaurantAPI   | Update    | awscloudformation |
| Auth     | cognito75a8ccb4 | No Change | awscloudformation |
```

To deploy the changes, run the push command:

```sh
amplify push
```

Now, the changes have been deployed & we can delete the `apiupdate` environment:

```sh
amplify env remove apiupdate

Do you also want to remove all the resources of the environment from the cloud? Y
```

Now, we should be able to run the `list` command & see only our main environment:

```sh
amplify env list
```

## Removing Services

If at any time, or at the end of this workshop, you would like to delete a service from your project & your account, you can do this by running the `amplify remove` command:

```sh
amplify remove auth

amplify push
```

If you are unsure of what services you have enabled at any time, you can run the `amplify status` command:

```sh
amplify status
```

`amplify status` will give you the list of resources that are currently enabled in your app.

## Deleting the project

To delete the entire project, run the `delete` command:

```sh
amplify delete
```


<!-- ### GraphQL Subscriptions

Next, let's see how we can create a subscription to subscribe to changes of data in our API.

To do so, we need to define the subscription, listen for the subscription, & update the state whenever a new piece of data comes in through the subscription.

```js
// import the subscription
import { onCreateRestaurant } from './src/graphql/subscriptions'

// define the subscription in the class
subscription = {}

// subscribe in componentDidMount
componentDidMount() {
  this.subscription = API.graphql(
    graphqlOperation(onCreateRestaurant)
  ).subscribe({
      next: eventData => {
        console.log('eventData', eventData)
        const restaurant = eventData.value.data.onCreateRestaurant
        if(CLIENTID === restaurant.clientId) return
        const restaurants = [...this.state.restaurants, restaurant]
        this.setState({ restaurants })
      }
  });
}

// remove the subscription in componentWillUnmount
componentWillUnmount() {
  this.subscription.unsubscribe()
}
``` -->