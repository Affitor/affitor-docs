import Script from 'next/script';

import { POSTHOG_PUBLIC_KEY } from '@/lib/posthog';

// Client pageviews for PostHog project 438505. $host is registered so docs traffic can be told apart from the other sites
// sharing the project; blog pages proxied at affitor.com/blog report that host.
const snippet = `!function(t,e){var o,n,p,r;e.__SV||(window.posthog&&window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once unregister identify reset get_distinct_id opt_in_capturing opt_out_capturing".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('${POSTHOG_PUBLIC_KEY}',{api_host:'https://us.i.posthog.com',person_profiles:'identified_only',capture_pageview:'history_change',loaded:function(ph){try{ph.register({$host:location.hostname})}catch(e){}}});`;

export function PostHog() {
  return (
    <Script id="posthog" strategy="afterInteractive">
      {snippet}
    </Script>
  );
}
