import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
    const supabase = createClient(
        'https://zaqibyyhxbncbgefnzxc.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphcWlieXloeGJuY2JnZWZuenhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MjY4NzEsImV4cCI6MjA5NDUwMjg3MX0.v5WOb7WpB1fci3BZxYd6E97gmAga7JKSbUI01V_EXTE'
    )

    return {
        provide: {
            supabase
        }
    }
})