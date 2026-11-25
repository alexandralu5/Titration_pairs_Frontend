/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, matchPrecache, precacheAndRoute } from 'workbox-precaching'
import { createPartialResponse } from 'workbox-range-requests'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare const self: ServiceWorkerGlobalScope

void self.skipWaiting()
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

registerRoute(
  ({ url, request, sameOrigin }) =>
    sameOrigin && url.href.startsWith(self.registration.scope) &&
    url.pathname.endsWith('.mp4') && request.headers.has('range'),
  async ({ request }) => {
    const cached = await matchPrecache(request.url)
    return cached ? createPartialResponse(request, cached) : fetch(request)
  },
)

precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

if (import.meta.env.PROD) {
  registerRoute(new NavigationRoute(createHandlerBoundToURL(`${import.meta.env.BASE_URL}index.html`), {
    denylist: [/^\/(?:api|minio)(?:\/|$)/],
  }))
}
