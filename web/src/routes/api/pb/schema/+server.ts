import PocketBase from 'pocketbase';


export async function GET(req) {
    const pb = new PocketBase('http://127.0.0.1:8090');
    await pb.admins.authWithPassword('admin@admin.com', 'admin');

    let res = (await pb.collections.getFullList({
        $autoCancel: false
    })).filter((item) => { return item.name[0] === item.name[0].toUpperCase(); });
    return new Response(JSON.stringify(res));
}
