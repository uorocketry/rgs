<!-- TODO: Refactor needed,  -->
<script lang="ts">
	export let msg: Message;

	function formatData(data: unknown) {
		// Fixed decimal places for floats
		if (typeof data === 'number' && data % 1 !== 0) {
			return data.toFixed(4);
		}
		return data;
	}

	let timeFormat = new Intl.DateTimeFormat('en', {
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric'
	});
</script>

<div class="card card-compact bg-base-200 shadow-xl">
	<div class="card-body gap-0 !p-2">
		<div class="card-title">
			{msg.sender}
			<div class="flex-1 text-end">
				<p class="text-sm">
					{timeFormat.format(1)}
				</p>
			</div>
		</div>
		<table class="table table-compact">
			<thead>
				<tr>
					<th>Property</th>
					<th>Value</th>
				</tr>
			</thead>
			<tbody>
				{#each Object.entries(msg) as [key, value]}
					{#if value && key !== 'timestamp' && key !== 'sender'}
						{#each Object.entries(value) as [componentId, componentData]}
							{#if componentData}
								<tr>
									<td>{componentId}</td>
									<td class="p-0 m-0">
										<table>
											{#each Object.entries(componentData) as [sensorName, sensorData]}
												<tr>
													{#if sensorData}
														<td>{sensorName}</td>
														<td class="p-0 m-0">
															<table>
																{#each Object.entries(sensorData) as [dataKey, dataValue]}
																	<tr>
																		<td>{dataKey}</td>
																		{#if dataValue}
																			<td class="p-0 m-0">
																				<table>
																					{#each Object.entries(dataValue) as [subKey, subValue]}
																						<tr>
																							<td>{subKey}</td>
																							<td>{formatData(subValue)}</td>
																						</tr>
																					{/each}
																				</table>
																			</td>
																		{/if}
																	</tr>
																{/each}
															</table>
														</td>
													{:else}
														<td>{sensorName}</td>
														<td>{sensorData}</td>
													{/if}
												</tr>
											{/each}
										</table>
									</td>
								</tr>
							{:else}
								<tr>
									<td>{key} - {componentId}</td>
									<td>{componentId}</td>
								</tr>
							{/if}
						{/each}
					{/if}
				{/each}
			</tbody>
		</table>
	</div>
</div>
