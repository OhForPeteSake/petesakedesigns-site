// Submit through FormSubmit AJAX so the visitor stays on the site.
// Only report success after FormSubmit explicitly confirms it.
// Tracking is consent-dependent and requires matching Cloudflare Worker support.
(()=>{
 const form=document.querySelector('form.mission-form');
 const status=document.getElementById('mission-form-status');
 if(!form||!status)return;
 let busy=false;
 form.addEventListener('submit',async event=>{
  if(busy)return;
  event.preventDefault();
  if(!form.reportValidity())return;
  busy=true;
  const button=form.querySelector('button[type="submit"]');
  if(button)button.disabled=true;
  status.textContent='SENDING TRANSMISSION...';
  try{
   const res=await fetch('https://formsubmit.co/ajax/PeteSakeDesigns@hotmail.com',{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
   if(!res.ok)throw new Error('Submission failed');
   const data=await res.json();
   if(data.success!==true&&data.success!=='true')throw new Error(data.message||'Confirmation not received');
   status.textContent='MESSAGE SENT. THANK YOU!';
   form.reset();
   if(typeof window.PeteSakeTrackEvent==='function')window.PeteSakeTrackEvent('form_enquiry','Contact form');
  }catch(error){
   status.textContent='COULD NOT CONFIRM DELIVERY. PLEASE TRY AGAIN OR EMAIL DIRECTLY.';
   console.warn('Contact form:',error);
  }finally{busy=false;if(button)button.disabled=false;}
 });
})();
