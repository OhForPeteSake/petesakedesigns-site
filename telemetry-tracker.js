(()=>{const base=(window.PETESAKE_TELEMETRY_ENDPOINT||'').replace(/\/$/,'');if(!base)return;let session=sessionStorage.getItem('ofs-visit-session');if(!session){session=crypto.randomUUID();sessionStorage.setItem('ofs-visit-session',session);}const send=(type,label='')=>{const body=JSON.stringify({type,label,session});try{if(navigator.sendBeacon){navigator.sendBeacon(base+'/event',new Blob([body],{type:'text/plain'}));return;}}catch(e){}fetch(base+'/event',{method:'POST',headers:{'Content-Type':'text/plain'},body,keepalive:true}).catch(()=>{});};window.PeteSakeTrackEvent=send;send('page_view',location.pathname);// Consent gating is enforced by cookie-consent.js, which loads this file only after opt-in.
// The listener tracks link intent, not completed bookings or delivered messages.
const socialHosts = new Map([
 ['linkedin.com','LinkedIn'],['behance.net','Behance'],['instagram.com','Instagram'],
 ['github.com','GitHub'],['artstation.com','ArtStation'],['creativepool.com','Creativepool'],
 ['facebook.com','Facebook'],['x.com','X'],['twitter.com','X'],['t.me','Telegram'],
 ['discordapp.com','Discord'],['discord.com','Discord']
]);
document.addEventListener('click',e=>{
 const a=e.target.closest('a[href]');if(!a)return;
 const href=a.getAttribute('href')||'';
 let url;try{url=new URL(href,location.href)}catch{return;}
 const host=url.hostname.toLowerCase().replace(/^www\./,'');
 if(/\.(pdf|docx)(?:$|[?#])/i.test(url.pathname+url.search)) {send('cv_download',url.pathname);return;}
 if(url.protocol==='mailto:'){send('email_click','Email');return;}
 if(host==='calendly.com'||host.endsWith('.calendly.com')){send('booking_click','Calendly');return;}
 if(url.origin===location.origin&&/\/contact\.html$/i.test(url.pathname)){send('contact', 'Contact page');return;}
 for(const [domain,name] of socialHosts){if(host===domain||host.endsWith('.'+domain)){send('social_click',name);return;}}
},true);
})();
