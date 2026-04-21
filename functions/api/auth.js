export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    
    // 直接在这里写死你的 Client ID 和 Client Secret
    const client_id = "Ov23li8pUv6GDuikIMI";      // 替换成你的 Client ID
    const client_secret = "2dbe6a11741871c9ee2550849befb0bc74a36a7"; // 替换成你的 Client Secret

    if (url.pathname === '/api/auth') {
        const redirectUri = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo`;
        return Response.redirect(redirectUri, 302);
    }

    if (url.pathname === '/api/callback') {
        const code = url.searchParams.get('code');
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ client_id: client_id, client_secret: client_secret, code })
        });
        const tokenData = await tokenResponse.json();
        const html = `<script>
            window.opener.postMessage({ auth: { token: "${tokenData.access_token}" } }, '*');
            window.close();
        </script>`;
        return new Response(html, { headers: { 'Content-Type': 'text/html' } });
    }

    return new Response('Not Found', { status: 404 });
}
