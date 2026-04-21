export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const clientId = env.GITHUB_CLIENT_ID;

  // 处理 /api/auth 请求，将用户重定向到 GitHub 授权页
  if (url.pathname === '/api/auth') {
    const redirectUri = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo`;
    return Response.redirect(redirectUri, 302);
  }

  // 处理 GitHub 授权后的回调
  if (url.pathname === '/api/callback') {
    // ... 回调处理逻辑 ...
    return new Response("Callback received", { status: 200 });
  }

  return new Response('Not Found', { status: 404 });
}
