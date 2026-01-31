export default {
	async fetch(req, env) {
	  const url = new URL(req.url)
	  const key = url.pathname.slice(1)
  
	  if (!key) {
		return new Response("Missing file key", { status: 400 })
	  }
  
	  // GET/HEAD are public so browser can load media without a secret
	  if (req.method === "GET" || req.method === "HEAD") {
		const object = await env.CAP_BUCKET.get(key)
		if (!object) return new Response("Not Found", { status: 404 })
		if (req.method === "HEAD") {
		  return new Response(null, {
			headers: {
			  "Content-Type":
				object.httpMetadata?.contentType || "application/octet-stream",
			},
		  })
		}
		return new Response(object.body, {
		  headers: {
			"Content-Type":
			  object.httpMetadata?.contentType || "application/octet-stream",
		  },
		})
	  }

	  // Require auth for mutating methods
	  const auth = req.headers.get("authorization") || ""
	  const secret = env.R2_WORKER_SECRET || env.AUTH_TOKEN || ""
	  if (!secret || auth !== `Bearer ${secret}`) {
		return new Response("Unauthorized", { status: 401 })
	  }

	  // PUT = upload
	  if (req.method === "PUT") {
		const contentType =
		  req.headers.get("content-type") || "application/octet-stream"
		await env.CAP_BUCKET.put(key, req.body, {
		  httpMetadata: { contentType },
		})
		return new Response("Uploaded", { status: 200 })
	  }
  
	  // DELETE
	  if (req.method === "DELETE") {
		await env.CAP_BUCKET.delete(key)
		return new Response("Deleted", { status: 200 })
	  }
  
	  return new Response("Method Not Allowed", { status: 405 })
	}
  }
  