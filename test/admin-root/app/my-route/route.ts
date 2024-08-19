import payload from 'payload'

console.log(payload.db) // undefined

// TypeError: Cannot read properties of undefined (reading 'initializing')
payload.db.initializing.then(() => {
  console.log('initialized')
})

export const GET = () => {
  return Response.json({
    hello: 'elliot',
  })
}
