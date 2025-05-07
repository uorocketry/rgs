// Defines the type for dashboard component loaders - Use `any` for flexibility
export type DashboardComponentLoader = () => Promise<any>;

// Map of component names to their async loaders
export const dashboard_components: Record<string, DashboardComponentLoader> = {
	RocketNavBall: async () => {
		return (await import('$lib/components/Dashboard/RocketNavBall/RocketNavBall.svelte')).default;
	},
	Map: async () => {
		return (await import('$lib/components/Dashboard/Map/Map.svelte')).default;
	},
	RadioStatus: async () => {
		return (await import('$lib/components/Dashboard/RadioStatus/RadioStatus.svelte')).default;
	},
	RocketMotion: async () => {
		return (await import('$lib/components/Dashboard/RocketMotion/RocketMotion.svelte')).default;
	},
	RocketStatus: async () => {
		return (await import('$lib/components/Dashboard/RocketStatus/RocketStatus.svelte')).default;
	},
	Pressure: async () => {
		return (await import('$lib/components/Dashboard/Pressure/Pressure.svelte')).default;
	},
	Altitude: async () => {
		return (await import('$lib/components/Dashboard/Altitude/Altitude.svelte')).default;
	},
	IMUTemp: async () => {
		return (await import('$lib/components/Dashboard/IMUTemp/IMUTemp.svelte')).default;
	},
	Acceleration: async () => {
		return (await import('$lib/components/Dashboard/Acceleration/Acceleration.svelte')).default;
	},
	VerticalVelocity: async () => {
		return (await import('$lib/components/Dashboard/VerticalVelocity/VerticalVelocity.svelte')).default;
	},
	PrimaryFlightDisplay: async () => {
		return (await import('$lib/components/Dashboard/PrimaryFlightDisplay/PrimaryFlightDisplay.svelte')).default;
	}
};

// Export just the keys for use in the 'Add Component' action
export const layoutComponentsString = Object.keys(dashboard_components);

