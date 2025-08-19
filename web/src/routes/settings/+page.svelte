<script lang="ts">
    import { settings } from '$lib/common/settings';
    import BooleanSetting from './components/BooleanSetting.svelte';
    import StringSetting from './components/StringSetting.svelte';
    import NumberSetting from './components/NumberSetting.svelte';
    import EnumSetting from './components/EnumSetting.svelte';
    import UnsupportedSetting from './components/UnsupportedSetting.svelte';
    import { Grid, Row, Column, Tile, Button } from 'carbon-components-svelte';

    function camelCaseToFormatted(str: string) {
        return str.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
    }

    const componentMap: Record<string, any> = {
        boolean: BooleanSetting,
        string: StringSetting,
        number: NumberSetting,
        enum: EnumSetting
    };

    function getComponentForSetting(valueDescription: string): any {
        return componentMap[valueDescription] ?? UnsupportedSetting;
    }
</script>

<Grid padding={true}>
    <Row>
        <Column>
            <h1>Settings</h1>
            <Button kind="secondary" size="small" on:click={() => window.location.reload()}>Hard Reload</Button>
        </Column>
    </Row>

    {#each settings as settingGroup}
        <Row>
            <Column>
                <Tile>
                    <h2 class="cds--type-productive-heading-03">{camelCaseToFormatted(settingGroup.name)}</h2>
                    {#each settingGroup.settings as setting}
                        {@const Component = getComponentForSetting(setting.valueDescription)}
                        <Component {setting} />
                    {/each}
                </Tile>
            </Column>
        </Row>
    {/each}
</Grid>
