export async function GET(req) {
	try {
		const r = await req.fetch('http://localhost:4000/healthz');
		return r;
	} catch (e) {
		return new Response('Fetch failled', { status: 500 });
	}
}
