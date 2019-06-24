import React, {
  useEffect, useReducer
} from 'react'

import {
  Text, TextInput, View, Button
} from 'react-native'
import uuid from 'uuid/v4'
import { API, graphqlOperation } from 'aws-amplify'
import { listRestaurants} from './src/graphql/queries'
import { createRestaurant } from './src/graphql/mutations'
import { onCreateRestaurant } from './src/graphql/subscriptions'

const CLIENTID = uuid()

const initialState = {
  error: null,
  restaurants: [],
  name: '', description: '', city: ''
}

function reducer(state, action) {
  switch(action.type) {
    case 'set':
      return {
        ...state, restaurants: action.restaurants
      }
    case 'add':
      return {
        ...state,
        restaurants: [
          ...state.restaurants, action.restaurant
        ]
      }
    case 'error':
      return {
        ...state, error: true
      }
    case 'updateInput':
      return {
        ...state,
        [action.inputValue]: action.value
      }
    default:
      return state
  }
}

async function CreateRestaurant(state, dispatch) {
  const { name, description, city  } = state
  const restaurant = {
    name, 
    description,
    city,
    clientId: CLIENTID
  }
  
  const restaurants = [...state.restaurants, restaurant]

  dispatch({
    type: 'set',
    restaurants
  })  

  try {
    await API.graphql(graphqlOperation(createRestaurant, {
      input: restaurant
    }))
    console.log('restaurant created!')
  } catch (err) {
    console.log('error creating restaurant...', err)
  }
}

const callDispatch = (value, inputValue, dispatch) => {
  dispatch({
    type: 'updateInput',
    value,
    inputValue
  })
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => {
    getRestaurants()
    const subscriber = API.graphql(graphqlOperation(onCreateRestaurant)).subscribe({
      next: eventData => {
        const restaurant = eventData.value.data.onCreateRestaurant
        if(CLIENTID === restaurant.clientId) return
        dispatch({ type: "add", restaurant })
      }
    })
    return () => subscriber.unsubscribe()
  }, [])

  async function getRestaurants() {
    try {
      const restaurantData = await API.graphql(graphqlOperation(listRestaurants))
      console.log('restaurantData:', restaurantData)
      dispatch({
        type: 'set',
        restaurants: restaurantData.data.listRestaurants.items
      })
    } catch (err) {
      dispatch({ type: 'error' })
      console.log('error fetching restaurants...', err)
    }
  }

  console.log('state: ', state)
  return (
    <View style={styles.container}>
        <TextInput
          placeholder="name"
          style={{ height: 50, margin: 5, backgroundColor: "#ddd" }}
          onChangeText={value => callDispatch(value, 'name', dispatch)}
          value={state.name}
        />
        <TextInput
          placeholder="description"
          style={{ height: 50, margin: 5, backgroundColor: "#ddd" }}
          onChangeText={value => callDispatch(value, 'description', dispatch)}
          value={state.description}
        />
        <TextInput
          placeholder="city"
          style={{ height: 50, margin: 5, backgroundColor: "#ddd" }}
          onChangeText={value => callDispatch(value, 'city', dispatch)}
          value={state.city}
        />
        <Button
          title='Create Restaurant'
          onPress={() => CreateRestaurant(state, dispatch)} 
        />

      {
        state.restaurants.map((restaurant, index) => (
          <View key={index} style={styles.restaurant}>
            <Text>{restaurant.name}</Text>
            <Text>{restaurant.description}</Text>
            <Text>{restaurant.city}</Text>
          </View>
        ))
      }
    </View>
  )
}

const styles = {
  restaurant: {
    padding: 15,
    borderBottomWidth: 2 
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    paddingTop: 80
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
}

export default App