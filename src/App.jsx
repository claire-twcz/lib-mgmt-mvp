import { useEffect } from 'react'
import { supabase } from './services/supabaseClient'

function App() {

  useEffect(() => {

    async function testConnection() {
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
      console.log('Supabase Key Exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)

      const { data, error } = await supabase
        .from('books')
        .select('*')

      console.log('Books:', data)

      if (error) {
        console.error('Error:', error)
      }

    }

    testConnection()

  }, [])

  return (
    <div>
      <h1>Library Management MVP</h1>
      <p>Testing Supabase Connection</p>
    </div>
  )
}

export default App