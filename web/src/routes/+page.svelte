<script lang="ts">
	import { LatestImu1Document } from '$lib/gql/graphql';
	import { getContextClient, subscriptionStore } from '@urql/svelte';

	const messages = subscriptionStore({
		client: getContextClient(),
		query: LatestImu1Document
	});

	$: if ($messages) {
		let d = $messages.data;
		if (d) {
		}
	}

	setInterval(() => {
		console.log($messages);
	}, 2000);
</script>

Imu Messages
{#if $messages.fetching && !$messages.data}
	<p>Fetching</p>
{:else if $messages.error}
	<p>Error: {$messages.error.message}</p>
{:else if $messages.data}
	{@const messagesData = $messages.data.rocket_message}
	<p>Num messages: {messagesData.length}</p>
	{#each messagesData as message}
		{@const accelerometer = message.rocket_sensor_message?.rocket_sensor_imu_1}
		<div class="p-2 bg-primary-300 mb-2">
			Component ID: {message.rocket_sensor_message?.component_id} <br />
			IMU STAUS: {message.rocket_sensor_message?.rocket_sensor_imu_1?.status} <br />

			<!-- X / Y /Z  -->

			Accelerometers: X: {accelerometer?.data_vec3ByAccelerometers.x} Y: {accelerometer
				?.data_vec3ByAccelerometers.y} Z: {accelerometer?.data_vec3ByAccelerometers.z} <br />

			<!-- Gyroscopes: {listFmt.format(
				message.rocket_sensor_message?.rocket_sensor_imu_1?.data_vec3ByGyroscopes.map((v) =>
					gyroFmt.format(v)
				)
			)} -->
		</div>
	{/each}
{/if}

<!-- {$messages} -->

<div>
	<article class="article">
		<h1>RGS Ground server</h1>
	</article>
</div>
