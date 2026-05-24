export const useSupabase = () => {
    const { $supabase } = useNuxtApp()
    return $supabase
}

export const useAuth = () => {
    const supabase = useSupabase()

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        return { data, error }
    }

    const logout = async () => {
        await supabase.auth.signOut()
    }

    const getUser = async () => {
        const { data } = await supabase.auth.getUser()
        return data.user
    }

    return { login, logout, getUser }
}