export default defineNuxtRouteMiddleware(async (to) => {
    const { $supabase } = useNuxtApp()
    const { data } = await $supabase.auth.getUser()

    if (!data.user) {
        return navigateTo('/login')
    }
})