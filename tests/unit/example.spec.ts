import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import HomePage from '@/views/HomePage.vue';

describe('HomePage.vue', () => {
  it('explains how to configure Supabase when credentials are missing', async () => {
    const wrapper = mount(HomePage);
    await flushPromises();

    expect(wrapper.text()).toContain('Entre na sua conta');
    expect(wrapper.text()).toContain('Conecte seu projeto Supabase');
    expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeDefined();
  });
});
