<script lang="ts">
	import InputField from '@components/common/InputField.svelte';
	import { INPUT } from '$lib/helpers/form.helper';
	import type { FormFailure } from '$lib/server/response';
</script>

<InputField
  placeholder="example@exemple.com"
  title="Email"
  name={INPUT.EMAIL}
/>
<InputField
  placeholder="123456"
  title="Password"
  name={INPUT.PASSWORD}
/>
