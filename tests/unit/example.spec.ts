import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import HomePage from '@/views/HomePage.vue';

describe('HomePage.vue', () => {
  it('keeps the login interactive and offers a demo when Supabase is not configured', async () => {
    const wrapper = mount(HomePage);
    await flushPromises();

    expect(wrapper.text()).toContain('Entre na sua conta');
    expect(wrapper.text()).toContain('Login real indisponível neste ambiente');
    expect(wrapper.text()).toContain('Experimentar em modo demonstração');
    expect(wrapper.get('#auth-email').attributes('disabled')).toBeUndefined();
    expect(wrapper.get('#auth-password').attributes('disabled')).toBeUndefined();
    expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeUndefined();
  });
});
