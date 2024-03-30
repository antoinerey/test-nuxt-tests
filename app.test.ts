import {it, expect} from 'vitest'
import App from './app.vue'
import {mount, flushPromises} from "@vue/test-utils";
import {h, Suspense} from "vue";

async function mountSuspense(Component: ReturnType<typeof defineComponent>) {
    const TestComponent = defineComponent({
        render() {
            return h(Suspense, h(Component))
        },
    })

    const wrapper = mount(TestComponent)
    await flushPromises();

    return wrapper
}

it('can mount', async () => {
    const wrapper = await mountSuspense(App)
    expect(wrapper.text()).toContain('Welcome to Nuxt!')
})

it.todo('can shallow mount', () => {
    // ...
});
