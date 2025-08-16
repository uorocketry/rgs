<script>
	import {
		Grid,
		Row,
		Column,
		Header,
		HeaderNav,
		HeaderNavItem,
		Content,
		ClickableTile
	} from 'carbon-components-svelte';
</script>

<Content>
	<Grid>
		<Row>
			<Column>
				<ClickableTile href="/comm">
					<h2>Communications</h2>
					<p>Go to Communications</p>
				</ClickableTile>
			</Column>
			<Column>
				<ClickableTile href="/health">
					<h2>Health</h2>
					<p>Go to Health</p>
				</ClickableTile>
			</Column>
			<Column>
				<ClickableTile href="/settings">
					<h2>Settings</h2>
					<p>Go to Settings</p>
				</ClickableTile>
			</Column>
		</Row>
	</Grid>
</Content>
