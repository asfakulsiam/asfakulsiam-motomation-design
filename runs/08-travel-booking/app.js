/* Srimangal Hills functional frontend. Uses bundled demo catalog and localStorage.
 * @motomation-component
 * id: srimangal-local-booking; name: Local booking controller; family: commerce;
 * tier: 1; deps: none; what: date calendar, booking steps and persisted local reservation;
 * use-when: guest booking demo; avoid-when: live inventory;
 * reduced-motion: instant state feedback; touch: native controls and >=44px targets;
 * a11y: labels, inline errors, live status, native navigation, calendar buttons.
 */
(()=>{
'use strict';
const data=window.STAY_DATA, $=(q,root=document)=>root.querySelector(q), $$=(q,root=document)=>[...root.querySelectorAll(q)];
const KEYS={draft:'srimangal-draft-v1',bookings:'srimangal-bookings-v1',messages:'srimangal-messages-v1'};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>'BDT '+Number(n).toLocaleString('en-GB');
const localDate=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const today=localDate(new Date()),dayAfter=(s,n)=>{const d=new Date(s+'T12:00:00');d.setDate(d.getDate()+n);return localDate(d);};
const fmt=s=>s?new Date(s+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):'Not selected';
let storageProblem='';
function read(key,fallback){try{const x=localStorage.getItem(key);return x?JSON.parse(x):fallback;}catch{storageProblem='Saved data could not be read. Your browser may be blocking storage. You can still explore the rooms.';return fallback;}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{storageProblem='This browser could not save your details. Allow site storage and try again. No reservation was saved.';return false;}}
let saved=read(KEYS.draft,{});if(!saved||typeof saved!=='object'||Array.isArray(saved))saved={};
let draft={room:'garden-veranda',checkin:'',checkout:'',guests:2,experience:'',name:'',email:'',phone:'',notes:'',...saved};
if(!data.rooms.some(r=>r.slug===draft.room))draft.room=data.rooms[0].slug;
if(!data.experiences.some(e=>e.slug===draft.experience))draft.experience='';
if(!Number.isInteger(Number(draft.guests))||Number(draft.guests)<1)draft.guests=2;
draft.guests=Number(draft.guests);
for(const field of ['checkin','checkout','name','email','phone','notes'])if(typeof draft[field]!=='string')draft[field]='';
for(const field of ['checkin','checkout'])if(draft[field]&&!/^\d{4}-\d{2}-\d{2}$/.test(draft[field]))draft[field]='';
const room=()=>data.rooms.find(r=>r.slug===draft.room)||data.rooms[0];
const experience=()=>data.experiences.find(e=>e.slug===draft.experience);
const nights=()=>Math.max(0,Math.round((new Date(draft.checkout+'T12:00:00')-new Date(draft.checkin+'T12:00:00'))/86400000))||0;
const total=()=>room().price*nights()+(experience()?.price||0)*draft.guests;
const persist=()=>write(KEYS.draft,draft);
const go=url=>{window.location.href=url;};
function announce(message){const el=$('#global-status');el.textContent=message;el.hidden=false;}
function bookings(){const x=read(KEYS.bookings,[]);return Array.isArray(x)?x.filter(b=>b&&b.draft&&typeof b.reference==='string'):[];}
function blocked(date,slug=draft.room){
 const day=new Date(date+'T12:00:00').getDate();
 const roomIndex=data.rooms.findIndex(r=>r.slug===slug);
 // Published demo fixture: two unavailable nights per room each month.
 if(day===17+roomIndex||day===18+roomIndex)return true;
 return bookings().some(b=>b.draft.room===slug&&date>=b.draft.checkin&&date<b.draft.checkout);
}
function validateDates(){
 if(!draft.checkin||!draft.checkout)return 'Choose both a check-in and a check-out date.';
 if(!Number.isFinite(new Date(draft.checkin+'T12:00:00').getTime())||!Number.isFinite(new Date(draft.checkout+'T12:00:00').getTime()))return 'Enter valid calendar dates.';
 if(draft.checkin<today)return 'Choose a check-in date today or later.';
 if(draft.checkout<=draft.checkin)return 'Check-out must be after check-in.';
 if(nights()>14)return 'This online demo accepts stays of up to 14 nights. Choose a shorter stay.';
 if(draft.checkin>dayAfter(today,365)||draft.checkout>dayAfter(today,366))return 'Choose dates within the next year.';
 for(let d=draft.checkin;d<draft.checkout;d=dayAfter(d,1))if(blocked(d))return `${fmt(d)} is unavailable for ${room().name}. Choose different dates or another room.`;
 return '';
}
function validateGuests(){return draft.guests<1||draft.guests>room().capacity?`This room sleeps up to ${room().capacity}. Choose fewer guests or a larger room.`:'';}
function validateDetails(){
 if(draft.name.trim().length<2)return 'Enter your full name (at least two characters).';
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email))return 'Enter a valid email address.';
 if(draft.phone.trim().replace(/[^\d]/g,'').length<7)return 'Enter a phone number with at least seven digits.';
 if(draft.notes.length>500)return 'Keep your requests to 500 characters or fewer.';
 return '';
}
function showError(form,message,field){
 const el=$('.form-error',form)||$('#date-error');if(el){el.textContent=message;el.hidden=!message;}
 if(field){field.setAttribute('aria-invalid','true');field.focus();}
}
async function acknowledge(form,workingLabel,action){
 const submit=$('[type="submit"]',form),old=submit.textContent;
 showError(form,'');submit.disabled=true;submit.textContent=workingLabel;submit.setAttribute('aria-busy','true');form.setAttribute('aria-busy','true');
 try{
  const response=await fetch('/data/response.json',{cache:'no-store'});
  if(!response.ok)throw new Error('The demonstration request could not finish. Your details are still here. Check your connection and try again.');
  const result=await response.json();if(result.ok===false)throw new Error('The demonstration response was not accepted. Try again.');
  await action();
 }catch(e){showError(form,e.message||'Something went wrong. Try again.');}
 finally{submit.disabled=false;submit.textContent=old;submit.removeAttribute('aria-busy');form.removeAttribute('aria-busy');}
}
function summary(){
 const el=$('#stay-summary');if(!el)return;
 const r=room(),e=experience(),n=nights();
 el.innerHTML=`<p class="eyebrow">YOUR LITTLE ESCAPE</p><img src="/assets/${esc(r.image)}" alt="Illustrative ${esc(r.name)}" width="600" height="450"><h2>${esc(r.name)}</h2><p class="summary-meta">${esc(r.bed)} · Up to ${r.capacity} guests</p><dl class="summary-dates"><div><dt>CHECK-IN</dt><dd>${fmt(draft.checkin)}</dd></div><div><dt>CHECK-OUT</dt><dd>${fmt(draft.checkout)}</dd></div></dl><div class="summary-row"><span>${draft.guests} ${draft.guests===1?'guest':'guests'}${n?` · ${n} ${n===1?'night':'nights'}`:''}</span><a href="/booking/dates">Edit dates</a></div><div class="summary-row"><span>${money(r.price)} × ${n||'…'} nights</span><strong>${money(r.price*n)}</strong></div>${e?`<div class="summary-row"><span>${esc(e.name)}<small>${money(e.price)} × ${draft.guests} guests</small></span><strong>${money(e.price*draft.guests)}</strong></div>`:''}<div class="summary-total"><span>Stay total</span><strong>${money(total())}</strong></div><p class="small-note">Demo total, all displayed charges included.<br>No payment is taken. No platform fee.</p><a href="/cancellation-policy" class="summary-policy">Read the cancellation policy ↗</a>`;
 imageStates(el);
}
const options=()=>data.rooms.map(r=>`<option value="${r.slug}" ${draft.room===r.slug?'selected':''}>${esc(r.name)} · ${money(r.price)}</option>`).join('');
function guard(panel,step){
 const error=step>=2?validateDates():'';
 const guestError=step>=3?validateGuests():'';
 const detailsError=step>=4?validateDetails():'';
 if(error||guestError||detailsError){panel.innerHTML=`<div class="notice"><h2>Let’s finish ${error?'your dates':guestError?'your guest count':'your details'} first.</h2><p>${esc(error||guestError||detailsError)}</p><a class="btn" href="/booking/${error?'dates':guestError?'guests':'details'}">Return to ${error?'dates':guestError?'guests':'details'} ↗</a></div>`;summary();return false;}
 return true;
}
let calendarMonth;
function renderDates(){
 const panel=$('#booking-panel');if(!panel)return;
 calendarMonth=new Date((draft.checkin||dayAfter(today,1))+'T12:00:00');calendarMonth.setDate(1);
 panel.innerHTML=`<div class="notice compact"><span class="status-dot" aria-hidden="true"></span><p>Demo availability, saved on this device. Live inventory and channel sync are not connected.</p></div><form id="dates-form" novalidate><label for="booking-room">Your room<select id="booking-room" name="room">${options()}</select></label><div class="two-fields"><label for="checkin">Check-in<input id="checkin" name="checkin" type="date" required min="${today}" max="${dayAfter(today,365)}" value="${esc(draft.checkin)}"></label><label for="checkout">Check-out<input id="checkout" name="checkout" type="date" required min="${dayAfter(today,1)}" max="${dayAfter(today,366)}" value="${esc(draft.checkout)}"></label></div><div class="calendar" id="calendar" aria-label="Room availability calendar"></div><p id="date-selection" class="selection-note" role="status"></p><p class="form-error error" id="date-error" role="alert" hidden></p><div class="form-bottom"><a href="/rooms" class="text-link">Compare rooms</a><button class="btn" type="submit">Continue to guests ↗</button></div><p class="small-note">Check-in from 2:00 pm · Check-out by 11:00 am.<br>Choose up to 14 nights. Rates include breakfast.</p></form>`;
 $('#booking-room').addEventListener('change',ev=>{draft.room=ev.target.value;draft.guests=Math.min(draft.guests,room().capacity);persist();renderCalendar();summary();updateSelection();showError(panel,'');});
 ['checkin','checkout'].forEach(key=>$('#'+key).addEventListener('change',ev=>{
  draft[key]=ev.target.value;if(key==='checkin'&&draft.checkin){$('#checkout').min=dayAfter(draft.checkin,1);calendarMonth=new Date(draft.checkin+'T12:00:00');calendarMonth.setDate(1);}
  persist();renderCalendar();summary();updateSelection();showError(panel,'');ev.target.removeAttribute('aria-invalid');
 }));
 $('#dates-form').addEventListener('submit',ev=>{
  ev.preventDefault();draft.checkin=$('#checkin').value;draft.checkout=$('#checkout').value;
  const error=validateDates();if(error){showError(ev.target,error,$('#checkin'));return;}
  acknowledge(ev.target,'Saving your dates…',()=>{if(!persist())throw Error(storageProblem);go('/booking/guests');});
 });
 renderCalendar();summary();updateSelection();
}
function updateSelection(){
 const el=$('#date-selection');if(el)el.textContent=draft.checkin&&draft.checkout?`${fmt(draft.checkin)} to ${fmt(draft.checkout)} · ${nights()} nights`:draft.checkin?`Arrive ${fmt(draft.checkin)}. Now choose a check-out date.`:'Select an arrival day, then a departure day. Or use the date fields above.';
}
function renderCalendar(){
 const el=$('#calendar');if(!el)return;
 const y=calendarMonth.getFullYear(),m=calendarMonth.getMonth(),first=new Date(y,m,1),offset=(first.getDay()+6)%7,count=new Date(y,m+1,0).getDate();
 const monthText=first.toLocaleDateString('en-GB',{month:'long',year:'numeric'});
 const initial=new Date(today+'T12:00:00');initial.setDate(1);
 const max=new Date(initial);max.setMonth(max.getMonth()+12);
 let days='';
 for(let i=0;i<offset;i++)days+='<span class="calendar-blank" aria-hidden="true"></span>';
 for(let i=1;i<=count;i++){
  const date=localDate(new Date(y,m,i)),past=date<today,unavailable=blocked(date),selected=date===draft.checkin||date===draft.checkout,inRange=draft.checkin&&draft.checkout&&date>draft.checkin&&date<draft.checkout;
  days+=`<button type="button" data-day="${date}" class="calendar-day ${selected?'selected':''} ${inRange?'in-range':''}" ${past||unavailable?'disabled':''} aria-label="${fmt(date)}, ${past?'past date':unavailable?'unavailable':selected?'selected':'available'}" aria-pressed="${selected?'true':'false'}">${i}</button>`;
 }
 el.innerHTML=`<div class="calendar-heading"><h2 id="calendar-title" aria-live="polite">${monthText}</h2><div><button class="icon-button" type="button" id="prev-month" aria-label="Previous month" ${first<=initial?'disabled':''}>←</button><button class="icon-button" type="button" id="next-month" aria-label="Next month" ${first>=max?'disabled':''}>→</button></div></div><div class="calendar-grid weekday" aria-hidden="true">${['M','T','W','T','F','S','S'].map(d=>`<span>${d}</span>`).join('')}</div><div class="calendar-grid" role="group" aria-labelledby="calendar-title">${days}</div><div class="calendar-key"><span><i class="key-available"></i>Available</span><span><i class="key-selected"></i>Selected</span><span><i class="key-unavailable"></i>Unavailable</span></div>`;
 $('#prev-month').addEventListener('click',()=>{calendarMonth.setMonth(m-1);renderCalendar();$('#prev-month').focus();});
 $('#next-month').addEventListener('click',()=>{calendarMonth.setMonth(m+1);renderCalendar();$('#next-month').focus();});
 $$('[data-day]',el).forEach(btn=>btn.addEventListener('click',()=>{
  const d=btn.dataset.day;
  if(!draft.checkin||draft.checkout||d<=draft.checkin){draft.checkin=d;draft.checkout='';}
  else draft.checkout=d;
  $('#checkin').value=draft.checkin;$('#checkout').value=draft.checkout;$('#checkout').min=dayAfter(draft.checkin,1);
  persist();renderCalendar();summary();updateSelection();showError($('#dates-form'),'');
  $(`[data-day="${d}"]`)?.focus();
 }));
}
function renderGuests(){
 const panel=$('#booking-panel');if(!guard(panel,2))return;
 panel.innerHTML=`<form id="guests-form" novalidate><h2>A room for ${room().capacity===1?'one':`up to ${room().capacity}`}.</h2><p>All guests, including children, count towards the room capacity. No extra beds are available.</p><label for="guest-count">Number of guests<select id="guest-count" name="guests">${[1,2,3,4].map(n=>`<option value="${n}" ${n===draft.guests?'selected':''}>${n} ${n===1?'guest':'guests'}${n>room().capacity?' (needs a larger room)':''}</option>`).join('')}</select></label><p class="small-note">${esc(room().name)} · ${esc(room().bed)} · Maximum ${room().capacity} guests.<br><a href="/rooms">Compare rooms for a larger party</a>.</p><fieldset class="experience-options"><legend>Add a little to your stay</legend><p class="small-note">Optional. One experience, priced per person.</p><label class="radio-option"><input type="radio" name="experience" value="" ${!draft.experience?'checked':''}><span>Just the room, thank you<small>No experience charge</small></span></label>${data.experiences.map(e=>`<label class="radio-option"><input type="radio" name="experience" value="${e.slug}" ${draft.experience===e.slug?'checked':''}><span>${esc(e.name)}<small>${esc(e.duration)} · ${money(e.price)} / person</small></span></label>`).join('')}</fieldset><p class="form-error error" role="alert" hidden></p><div class="form-bottom"><a class="text-link" href="/booking/dates">Back to dates</a><button class="btn" type="submit">Continue to details ↗</button></div></form>`;
 $('#guest-count').addEventListener('change',ev=>{draft.guests=Number(ev.target.value);persist();summary();showError(panel,validateGuests());});
 $$('[name="experience"]').forEach(input=>input.addEventListener('change',()=>{draft.experience=input.value;persist();summary();}));
 $('#guests-form').addEventListener('submit',ev=>{ev.preventDefault();const error=validateGuests();if(error){showError(ev.target,error,$('#guest-count'));return;}acknowledge(ev.target,'Saving your guests…',()=>{if(!persist())throw Error(storageProblem);go('/booking/details');});});
 summary();
}
function renderDetails(){
 const panel=$('#booking-panel');if(!guard(panel,3))return;
 panel.innerHTML=`<form id="details-form" novalidate><h2>The lead guest</h2><p class="small-note">Required fields are marked *. Details are stored on this device only.</p><label for="guest-name">Full name *<input id="guest-name" name="name" required minlength="2" maxlength="100" autocomplete="name" value="${esc(draft.name)}"></label><div class="two-fields"><label for="guest-email">Email address *<input id="guest-email" type="email" name="email" required maxlength="180" autocomplete="email" value="${esc(draft.email)}"></label><label for="guest-phone">Phone number *<input id="guest-phone" type="tel" name="phone" required minlength="7" maxlength="30" autocomplete="tel" value="${esc(draft.phone)}"></label></div><label for="guest-notes">Anything we should know?<textarea id="guest-notes" name="notes" rows="4" maxlength="500">${esc(draft.notes)}</textarea></label><p class="small-note">Access needs, arrival plans or dietary requests. Optional, up to 500 characters. Avoid sensitive personal information.</p><p class="form-error error" role="alert" hidden></p><div class="form-bottom"><a class="text-link" href="/booking/guests">Back to guests</a><button class="btn" type="submit">Review my stay ↗</button></div><p class="small-note">Your information stays local. <a href="/privacy">Read our privacy notice</a>.</p></form>`;
 const fields={name:'guest-name',email:'guest-email',phone:'guest-phone',notes:'guest-notes'};
 for(const [key,id] of Object.entries(fields))$('#'+id).addEventListener('input',ev=>{draft[key]=ev.target.value;ev.target.removeAttribute('aria-invalid');persist();});
 $('#details-form').addEventListener('submit',ev=>{
  ev.preventDefault();for(const [k,id] of Object.entries(fields))draft[k]=$('#'+id).value.trim();
  const error=validateDetails();if(error){const key=draft.name.length<2?'name':!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)?'email':'phone';showError(ev.target,error,$('#'+fields[key]));return;}
  acknowledge(ev.target,'Saving your details…',()=>{if(!persist())throw Error(storageProblem);go('/booking/review');});
 });
 summary();
}
function renderReview(){
 const panel=$('#booking-panel');if(!guard(panel,4))return;
 panel.innerHTML=`<form id="review-form" novalidate><div class="review-block"><div class="review-title"><h2>Your room and dates</h2><a href="/booking/dates">Edit</a></div><p><strong>${esc(room().name)}</strong><br>${fmt(draft.checkin)} to ${fmt(draft.checkout)}<br>${nights()} nights · ${draft.guests} guests</p><p class="small-note">Check-in from 2:00 pm · Check-out by 11:00 am.</p></div><div class="review-block"><div class="review-title"><h2>Lead guest</h2><a href="/booking/details">Edit</a></div><p>${esc(draft.name)}<br>${esc(draft.email)}<br>${esc(draft.phone)}</p>${draft.notes?`<p class="note">${esc(draft.notes)}</p>`:''}</div><div class="review-block"><div class="review-title"><h2>Experience</h2><a href="/booking/guests">Edit</a></div><p>${experience()?esc(experience().name):'Just the room, thank you.'}</p></div><fieldset class="payment-options"><legend>Payment</legend><label class="radio-option"><input type="radio" name="payment" value="property" checked><span>Pay at the house<small>Demonstration only. No payment or real booking.</small></span></label><label class="radio-option disabled-option"><input type="radio" name="payment" value="card" disabled><span>Pay online<small>Unavailable: payment integration is not connected.</small></span></label></fieldset><div class="notice"><strong>Before you save this stay</strong><p>This creates a local demonstration reservation, not a real booking. No email is sent and no room is held with a property.</p></div><label class="checkbox-option"><input id="policy-consent" name="consent" type="checkbox" required><span>I have read the <a href="/house-rules">house rules</a>, <a href="/cancellation-policy">cancellation policy</a> and <a href="/terms">terms</a>, and understand this is a local demonstration.</span></label><p class="form-error error" role="alert" hidden></p><div class="review-total"><span>Total for your stay</span><strong>${money(total())}</strong></div><button class="btn btn-full" type="submit">Confirm local reservation ↗</button><a href="/booking/details" class="text-link back-link">Back to details</a></form>`;
 $('#policy-consent').addEventListener('change',ev=>{ev.target.removeAttribute('aria-invalid');showError($('#review-form'),'');});
 $('#review-form').addEventListener('submit',ev=>{
  ev.preventDefault();if(!$('#policy-consent').checked){showError(ev.target,'Please read and accept the policies and demonstration notice.',$('#policy-consent'));return;}
  acknowledge(ev.target,'Saving your reservation…',()=>{
   const error=validateDates()||validateGuests()||validateDetails();if(error)throw Error(error);
   const records=bookings();
   const booking={demo:true,reference:'SH-'+Date.now().toString(36).toUpperCase(),status:'local-demo',createdAt:new Date().toISOString(),draft:{...draft},total:total()};
   records.push(booking);if(!write(KEYS.bookings,records))throw Error(storageProblem);
   go('/booking/confirmation');
  });
 });
 summary();
}
function download(name,text,status){
 const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');
 a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);
 if(status)status.textContent='Your notes have been downloaded for offline reading.';
}
function renderConfirmation(){
 const panel=$('#confirmation'),records=bookings(),b=records.at(-1);
 if(!b){panel.innerHTML=`<p class="eyebrow">YOUR STAY</p><h1>There’s a room<br>to come back to.</h1><p>No local reservation is saved on this device yet. Start with a room, or continue a draft stay.</p><div class="empty-actions"><a class="btn" href="/rooms">Find my room ↗</a><a class="btn btn-outline" href="/booking/dates">Continue a draft stay</a></div>`;return;}
 const r=data.rooms.find(r=>r.slug===b.draft.room)||data.rooms[0],e=data.experiences.find(e=>e.slug===b.draft.experience);
 panel.innerHTML=`<div class="confirmation-mark" aria-hidden="true">✓</div><p class="eyebrow">SAVED ON THIS DEVICE</p><h1>Your quiet days,<br>all noted down.</h1><p class="confirmation-intro">Thank you, ${esc(b.draft.name.split(' ')[0])}. Your demonstration stay is saved locally.</p><div class="notice"><strong>This is not a real reservation.</strong><p>No room has been held, no payment taken and no email sent. Keep this page on the same browser to view it again.</p></div><div class="confirmation-ticket"><div class="ticket-top"><span>LOCAL REFERENCE</span><strong>${esc(b.reference)}</strong></div><div class="ticket-body"><img src="/assets/${esc(r.image)}" alt="Illustrative ${esc(r.name)}" width="600" height="450"><div><h2>${esc(r.name)}</h2><p>${fmt(b.draft.checkin)} to ${fmt(b.draft.checkout)}<br>${b.draft.guests} guests · ${esc(r.bed)}</p>${e?`<p>${esc(e.name)}</p>`:''}<p><strong>${money(b.total)}</strong> · No payment taken</p></div></div></div><div class="confirmation-actions"><a class="btn" href="/getting-there">Plan how to get here ↗</a><button class="btn btn-outline" id="download-stay">Download stay details ↓</button></div><p id="download-status" class="small-note" role="status"></p><div class="next-notes"><div><h2>Keep these details close.</h2><p>Download the summary before your connection gets patchy. This local record stays in this browser until you remove it.</p></div><div><h2>Need a different plan?</h2><p>Remove this local reservation to release its demo dates, then choose a different stay.</p><button class="text-button" id="remove-booking">Remove local reservation</button><p id="remove-status" role="status" class="small-note"></p></div></div>`;
 $('#download-stay').addEventListener('click',()=>download('srimangal-hills-stay.txt',`SRIMANGAL HILLS GUESTHOUSE\nFICTIONAL PROPERTY. LOCAL DEMONSTRATION ONLY.\nReference: ${b.reference}\nRoom: ${r.name}\nArrival: ${fmt(b.draft.checkin)} from 2 pm\nDeparture: ${fmt(b.draft.checkout)} by 11 am\nGuests: ${b.draft.guests}\nLead guest: ${b.draft.name}\nExperience: ${e?.name||'None'}\nDemo total: ${money(b.total)}\nNo room held, no payment taken, no email sent.\nNo real property address supplied. Do not travel based on this demo.\n`, $('#download-status')));
 let armed=false;$('#remove-booking').addEventListener('click',ev=>{
  if(!armed){armed=true;ev.target.textContent='Confirm removal of this local reservation';$('#remove-status').textContent='Press again to remove. This cannot be undone.';return;}
  if(write(KEYS.bookings,records.filter(x=>x.reference!==b.reference))){renderConfirmation();announce('Local reservation removed. Its demo dates are available again.');}
  else $('#remove-status').textContent=storageProblem;
 });
 imageStates(panel);
}
function imageStates(root=document){
 $$('img',root).forEach(img=>{img.dataset.state=img.complete&&img.naturalWidth?'loaded':'loading';img.addEventListener('load',()=>img.dataset.state='loaded',{once:true});img.addEventListener('error',()=>{img.dataset.state='error';img.alt=img.alt+' (image unavailable)';},{once:true});});
}
// Public discovery controls.
$$('[data-book-room]').forEach(btn=>btn.addEventListener('click',()=>{draft.room=btn.dataset.bookRoom;draft.guests=Math.min(draft.guests,room().capacity);persist();go('/booking/dates');}));
if($('#home-search')){
 $('#home-checkin').min=today;$('#home-checkout').min=dayAfter(today,1);
 $('#home-checkin').value=draft.checkin;$('#home-checkout').value=draft.checkout;$('#home-guests').value=String(draft.guests);
 $('#home-checkin').addEventListener('change',ev=>$('#home-checkout').min=dayAfter(ev.target.value||today,1));
 $('#home-search').addEventListener('click',()=>{
  draft.checkin=$('#home-checkin').value;draft.checkout=$('#home-checkout').value;draft.guests=Number($('#home-guests').value);
  if(draft.checkin&&draft.checkout&&(draft.checkout<=draft.checkin||draft.checkin<today)){const el=$('#home-error');el.textContent='Choose an arrival today or later and a departure after arrival.';el.hidden=false;return;}
  const fitting=data.rooms.find(r=>r.capacity>=draft.guests);if(fitting)draft.room=fitting.slug;
  persist();go('/availability');
 });
}
if($('#room-filter')){
 const filter=$('#room-filter');
 const apply=()=>{const n=Number(filter.value);let count=0;$$('.room-card').forEach(card=>{card.hidden=Number(card.dataset.capacity)<n;if(!card.hidden)count++;});$('#room-count').textContent=`${count} ${count===1?'room':'rooms'} · Demo rates per night, BDT`;$('#room-empty').hidden=count!==0;};
 filter.addEventListener('change',apply);$('#reset-filter').addEventListener('click',()=>{filter.value='0';apply();});
}
$$('[data-add-experience]').forEach(btn=>{
 const slug=btn.dataset.addExperience;
 const update=()=>{const selected=draft.experience===slug;btn.textContent=selected?'Remove from my stay':'Add to my stay ↗';btn.setAttribute('aria-pressed',String(selected));$('#continue-stay').hidden=!selected;};
 update();btn.addEventListener('click',()=>{draft.experience=draft.experience===slug?'':slug;if(persist()){$('#experience-status').textContent=draft.experience?'Added to your stay. Choose your room and dates next, or continue your existing booking.':'Experience removed. Your room selection is unchanged.';update();}else $('#experience-status').textContent=storageProblem;});
});
if($('#contact-form'))$('#contact-form').addEventListener('submit',ev=>{
 ev.preventDefault();const f=ev.target,name=$('#contact-name'),email=$('#contact-email'),message=$('#contact-message');
 if(name.value.trim().length<2){showError(f,'Please enter your full name.',name);return;}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)){showError(f,'Please enter a valid email address.',email);return;}
 if(message.value.trim().length<5){showError(f,'Please write your question (at least five characters).',message);return;}
 acknowledge(f,'Saving your message…',()=>{const messages=read(KEYS.messages,[]);messages.push({demo:true,name:name.value.trim(),email:email.value.trim(),message:message.value.trim(),createdAt:new Date().toISOString()});if(!write(KEYS.messages,messages))throw Error(storageProblem);const success=$('.form-success',f);success.textContent='Your message is saved on this device. It has not been sent to a guesthouse.';success.hidden=false;f.reset();});
});
$$('input,textarea,select').forEach(input=>input.addEventListener('input',()=>input.removeAttribute('aria-invalid')));
if($('#load-map'))$('#load-map').addEventListener('click',()=>{
 const panel=$('.map-placeholder'),status=document.createElement('p'),frame=document.createElement('iframe'),fallback=document.createElement('p');
 status.className='map-loading';status.setAttribute('role','status');status.textContent='Loading the Srimangal town map…';
 frame.title='Srimangal town orientation map, not the guesthouse location';
 frame.src='https://www.openstreetmap.org/export/embed.html?bbox=91.716%2C24.288%2C91.751%2C24.322&layer=mapnik&marker=24.305%2C91.733';
 frame.width='600';frame.height='440';frame.loading='eager';frame.referrerPolicy='strict-origin-when-cross-origin';
 fallback.className='small-note';fallback.textContent='If the map does not load, use the arrival notes. This is a town marker, not a property address.';
 panel.replaceChildren(status,frame,fallback);
 frame.addEventListener('load',()=>{status.textContent='Town map frame loaded. Map tiles need an internet connection.';});
});
if($('#download-arrival'))$('#download-arrival').addEventListener('click',()=>download('srimangal-arrival-notes.txt','SRIMANGAL HILLS: ARRIVAL NOTES\nFictional property. No actual guesthouse address or property pin is supplied.\nTown: Srimangal, Moulvibazar, Bangladesh.\nRail: check services to Srimangal station with your operator.\nRoad: plan only to Srimangal town. A real booking must supply final directions.\nDemo check-in: 2 pm. Demo check-out: 11 am.\nDo not travel to this fictional guesthouse.\n',$('#arrival-status')));
if($('#clear-data')){
 let armed=false;$('#clear-data').addEventListener('click',ev=>{
  if(!armed){armed=true;ev.target.textContent='Confirm clearing all saved guesthouse data';$('#clear-status').textContent='Press again to permanently clear drafts, reservations and messages on this device.';return;}
  try{Object.values(KEYS).forEach(k=>localStorage.removeItem(k));$('#clear-status').textContent='All saved guesthouse data has been cleared from this device.';ev.target.disabled=true;}catch{$('#clear-status').textContent='Browser storage could not be cleared. Use your browser site-data settings.';}
 });
}
const page=document.body.dataset.page;
if(page==='availability'||page==='dates')renderDates();
if(page==='guests')renderGuests();
if(page==='details')renderDetails();
if(page==='review')renderReview();
if(page==='confirmation')renderConfirmation();
if(storageProblem)announce(storageProblem);
imageStates();
// External changes are surfaced rather than silently overwriting edits in another tab.
window.addEventListener('storage',ev=>{if(Object.values(KEYS).includes(ev.key)){announce('Your saved stay changed in another tab. Reload this page to see the latest details.');if(page==='confirmation')renderConfirmation();}});
})();
