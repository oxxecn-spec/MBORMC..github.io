export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // 直接写死你的 Client ID（这样不需要环境变量，避免配置错误）
  const clientId = "Ov23li8pUv6GDuikIMI";
  const clientSecret = "2dbe6a11741871c9ee2550849befb0bc74a36a7";

  // 处理 /api/auth 请求，重定向到 GitHub 授权页
  if (url.pathname === '/api/auth') {
    const redirectUri = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo`;
    return Response.redirect(redirectUri, 302);
  }

  // 处理 GitHub 授权后的回调
  if (url.pathname === '/api/callback') {
    const code = url.searchParams.get('code');
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code })
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
