const NAME = 'flutter/counter'
const INCREMENT = `${NAME}/INCREMENT`
const DECREMENT = `${NAME}/DECREMENT`

const initialState = {
  count: 0,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case INCREMENT:
      return {
        ...state,
        count: state.count + 1
      }
    case DECREMENT:
      return {
        ...state,
        count: state.count - 1
      }
    default:
      return state
  }
}

export function increment() {
  return {type: INCREMENT}
}

export function decrement() {
  return {type: DECREMENT}
}
