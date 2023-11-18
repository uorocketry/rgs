TODO

<script>
    const {
        VITE_DB_REST_PORT,
    } = import.meta.env;

    let isLoading = true;
    let pbMessage = "";
    let latency = 0;
    
    async function pbHealthCheck(){
        const startTime = performance.now();

        try{
            const res = await fetch(

            `http://127.0.0.1:${VITE_DB_REST_PORT}/api/health`,
            
            {
            method: "GET",
            }
            );
            if (res.status === 200) {
                console.info("PocketBase server started successfully");
                pbMessage = "ONLINE"
            }
            else{
                console.info("Pocketbase server start unsuccessful");
                pbMessage = "NOT ONLINE"
            }
        }
        catch (e) {
            pbMessage = "" + e + "";
        }
        finally{
            const endTime = performance.now();
            latency = endTime - startTime;
            isLoading = false;
        }
    }

    pbHealthCheck();
    </script>

<main>
    <p>VITE_DB_REST_PORT: {VITE_DB_REST_PORT}</p>

    <p>PB HEALTHCHECK</p>
    {#if isLoading}
        <p>Loading...</p>
    {:else}
        <p>{pbMessage}</p>
        <p>Latency: {latency.toFixed(2)} milliseconds</p>
    {/if}

</main>
