/**
 * @motomation-component id: tea-commerce-state; name: Leaf & Ledger state; family: commerce; tier: 1;
 * deps: platform; what: shared persisted cart, builder and subscription logic with native validation;
 * use-when: static fictional commerce demonstration; avoid-when: real payments or protected accounts;
 * reduced-motion: no travel needed; touch: native 44px controls; a11y: focus, labels and live messages.
 * No user-controlled strings are inserted as HTML. No personal/contact field is persisted or sent.
 */
import {teas,plans,money} from './catalogue.js';
const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
let corrupt=false;
const tea=id=>teas.find(t=>t.id===id);
const schema={
 cart:v=>Array.isArray(v)&&v.length<=20&&v.every(l=>l&&['tea','subscription'].includes(l.kind)&&Number.isInteger(l.quantity)&&l.quantity>=1&&l.quantity<=10&&(l.kind==='tea'?!!tea(l.teaId):!!plans[l.plan]&&Array.isArray(l.teaIds)&&l.teaIds.length===plans[l.plan].count&&new Set(l.teaIds).size===l.teaIds.length&&l.teaIds.every(id=>!!tea(id)))),
 draft:v=>v&&!!plans[v.plan]&&Array.isArray(v.teaIds)&&v.teaIds.length<=3&&v.teaIds.every(id=>!!tea(id)),
 subscription:v=>v&&!!plans[v.plan]&&['active','paused'].includes(v.status)&&typeof v.skipped==='boolean'&&Array.isArray(v.teaIds)&&v.teaIds.length===plans[v.plan].count&&v.teaIds.every(id=>!!tea(id))&&Number.isFinite(Date.parse(v.next)),
 receipt:v=>v&&v.demo===true&&typeof v.ref==='string'&&typeof v.total==='number'&&Array.isArray(v.lines)&&v.lines.every(l=>typeof l.name==='string'&&typeof l.detail==='string'&&typeof l.total==='number')
};
function read(key,fallback){try{const raw=localStorage.getItem(`ll-${key}-v1`);if(!raw)return structuredClone(fallback);const v=JSON.parse(raw);if(!schema[key](v))throw Error('invalid');return v;}catch(e){corrupt=true;return structuredClone(fallback);}}
function storageError(message='Your browser could not save this change. Allow site storage, then try again.'){
 const el=$('[data-storage-error]');if(el){el.textContent=message;el.hidden=false;}
}
function write(key,value){try{localStorage.setItem(`ll-${key}-v1`,JSON.stringify(value));return true;}catch{storageError();return false;}}
let cart=read('cart',[]),draft=read('draft',{plan:'duo',teaIds:[]});
const next=new Date();next.setDate(next.getDate()+30);
let subscription=read('subscription',{plan:'duo',teaIds:['sylhet-black','ilam-green'],status:'active',skipped:false,next:next.toISOString()});
const lineInfo=l=>l.kind==='tea'?{name:tea(l.teaId).name,detail:`${tea(l.teaId).origin} · 50g · one-off`,unit:tea(l.teaId).price,href:`/tea/${l.teaId}`}:{name:plans[l.plan].name,detail:`${plans[l.plan].count} × 50g every month · ${l.teaIds.map(id=>tea(id).name).join(', ')}`,unit:plans[l.plan].price,href:'/subscriptions/build'};
const totals=()=>{const subtotal=cart.reduce((s,l)=>s+lineInfo(l).unit*l.quantity,0),shipping=cart.some(l=>l.kind==='tea')?5:0;return {subtotal,shipping,total:subtotal+shipping};};
function updateCount(){$$('[data-cart-count]').forEach(e=>e.textContent=cart.reduce((n,l)=>n+l.quantity,0));}
function updateTotals(){
 const t=totals();$$('[data-subtotal]').forEach(e=>e.textContent=money(t.subtotal));$$('[data-shipping]').forEach(e=>e.textContent=t.shipping?money(t.shipping):'Included');$$('[data-total]').forEach(e=>e.textContent=money(t.total));
 updateCount();
}
function status(text){const e=$('[data-feedback]');if(e){e.textContent=text;e.hidden=false;}}
function pending(button,text,fn){
 const original=button.textContent;button.disabled=true;button.textContent=text;button.setAttribute('aria-busy','true');
 setTimeout(()=>{try{fn();}finally{button.disabled=false;button.textContent=original;button.removeAttribute('aria-busy');}},120);
}
function renderLines(){
 const holder=$('[data-lines]'),tpl=$('#line-template');if(!holder||!tpl)return;
 holder.replaceChildren();
 cart.forEach((line,index)=>{
  const info=lineInfo(line),node=tpl.content.cloneNode(true);
  $('[data-line-name]',node).textContent=info.name;
  const anchor=$('a[data-line-name]',node);if(anchor)anchor.href=info.href;
  $('[data-line-detail]',node).textContent=info.detail;
  $('[data-line-price]',node).textContent=money(info.unit*line.quantity);
  const input=$('[data-quantity]',node);
  if(input){input.value=line.quantity;input.setAttribute('aria-label',`${info.name} quantity`);input.addEventListener('change',()=>{
   const quantity=Math.max(1,Math.min(10,Math.round(Number(input.value)||1)));
   const nextCart=structuredClone(cart);nextCart[index].quantity=quantity;
   if(write('cart',nextCart)){
    cart=nextCart;input.value=quantity;
    // Update the current row in place: replacing a focused input may trigger a second blur/change.
    const row=input.closest('.cart-line,.bag-item');if(row)$('[data-line-price]',row).textContent=money(info.unit*quantity);
    updateTotals();status('Cart quantity saved.');
   }else input.value=line.quantity;
  });}
  const remove=$('[data-remove]',node);
  if(remove){remove.setAttribute('aria-label',`Remove ${info.name}`);remove.addEventListener('click',()=>{
   const nextCart=cart.filter((_,i)=>i!==index);if(write('cart',nextCart)){cart=nextCart;renderLines();status(`${info.name} removed from cart.`);const focus=cart.length?$('[data-checkout-link]'):$('[data-empty] a');focus?.focus();}
  });}
  holder.append(node);
 });
 updateTotals();
 $$('[data-empty]').forEach(e=>e.hidden=cart.length>0);$$('[data-filled]').forEach(e=>e.hidden=cart.length===0);
 updateCount();
}
$$('[data-add]').forEach(button=>button.addEventListener('click',()=>{
 const id=button.dataset.add;if(!tea(id))return;
 const qty=$('[name="quantity"]');const quantity=Math.max(1,Math.min(10,Math.round(Number(qty?.value)||1)));
 const nextCart=structuredClone(cart),existing=nextCart.find(l=>l.kind==='tea'&&l.teaId===id);
 if(existing)existing.quantity=Math.min(10,existing.quantity+quantity);else nextCart.push({kind:'tea',teaId:id,quantity});
 pending(button,'Adding…',()=>{if(write('cart',nextCart)){cart=nextCart;updateCount();status(`${tea(id).name} added to your cart.`);const next=$('[data-view-cart]');if(next)next.hidden=false;}});
}));
const filter=$('[data-filter]');
if(filter){
 const apply=()=>{const values=Object.fromEntries(new FormData(filter));let count=0;
  $$('[data-product]').forEach(e=>{const match=['origin','type','caffeine'].every(k=>!values[k]||e.dataset[k]===values[k]);e.hidden=!match;if(match)count++;});
  $('[data-result-count]').textContent=`${count} ${count===1?'tea':'teas'}`;
  $('[data-no-results]').hidden=count>0;
 };
 filter.addEventListener('change',apply);filter.addEventListener('reset',()=>setTimeout(apply,0));apply();
}
$$('[data-choose-plan]').forEach(a=>a.addEventListener('click',e=>{
 const plan=a.dataset.choosePlan;if(!plans[plan])return;
 const d={plan,teaIds:draft.teaIds.slice(0,plans[plan].count)};if(write('draft',d))draft=d;else e.preventDefault();
}));
const builder=$('[data-builder]');
if(builder){
 $$('[name="plan"]',builder).forEach(e=>e.checked=e.value===draft.plan);
 $$('[name="tea"]',builder).forEach(e=>e.checked=draft.teaIds.includes(e.value));
 function updateBuilder(save=true){
  const plan=$('[name="plan"]:checked',builder).value,selected=$$('[name="tea"]:checked',builder).map(e=>e.value),p=plans[plan];
  if(save){const d={plan,teaIds:selected};if(write('draft',d))draft=d;}
  $('[data-selected-count]').textContent=`${selected.length} of ${p.count} teas selected`;
  $('[data-plan-price]').textContent=`${money(p.price)} / month`;
  $('[data-builder-submit]').disabled=selected.length!==p.count;
  $$('[name="tea"]',builder).forEach(e=>e.disabled=!e.checked&&selected.length>=p.count);
  $('[data-builder-message]').textContent=selected.length===p.count?'Your monthly selection is ready.':`Choose ${Math.max(0,p.count-selected.length)} more ${p.count-selected.length===1?'tea':'teas'} to continue.`;
 }
 builder.addEventListener('change',e=>{
  if(e.target.name==='plan'){const p=plans[e.target.value];$$('[name="tea"]:checked',builder).slice(p.count).forEach(e=>e.checked=false);}
  updateBuilder();
 });
 builder.addEventListener('submit',e=>{
  e.preventDefault();const plan=$('[name="plan"]:checked',builder).value,teaIds=$$('[name="tea"]:checked',builder).map(e=>e.value);
  if(teaIds.length!==plans[plan].count){$('[data-builder-message]').textContent='Choose the exact number of teas for your plan.';return;}
  const nextCart=cart.filter(l=>l.kind!=='subscription');nextCart.push({kind:'subscription',plan,teaIds,quantity:1});
  pending($('[data-builder-submit]'),'Saving selection…',()=>{if(write('cart',nextCart)){cart=nextCart;location.assign('/checkout');}});
 });updateBuilder(false);
}
function validate(form,region){
 const bad=$$('input,select,textarea',form).filter(el=>!el.checkValidity());$$('[aria-invalid]',form).forEach(e=>e.removeAttribute('aria-invalid'));
 if(bad.length){bad.forEach(e=>e.setAttribute('aria-invalid','true'));region.textContent='Please check the highlighted fields and complete all required details.';region.hidden=false;bad[0].focus();form.reportValidity();return false;}
 region.textContent='';region.hidden=true;return true;
}
const checkout=$('[data-checkout]');
if(checkout){
 checkout.noValidate=true;
 checkout.addEventListener('submit',e=>{
  e.preventDefault();const message=$('[data-form-message]',checkout);
  if(!cart.length){message.hidden=false;message.textContent='Your cart is empty. Choose a tea before placing a demo order.';return;}
  if(!validate(checkout,message))return;
  pending($('button[type="submit"]',checkout),'Creating demo receipt…',()=>{
   const receipt={demo:true,ref:`LL-${Date.now().toString(36).toUpperCase()}`,created:new Date().toISOString(),lines:cart.map(l=>({...lineInfo(l),total:lineInfo(l).unit*l.quantity,quantity:l.quantity})),...totals()};
   const chosen=cart.find(l=>l.kind==='subscription');
   if(chosen){const v={plan:chosen.plan,teaIds:chosen.teaIds,status:'active',skipped:false,next:next.toISOString()};if(!write('subscription',v))return;subscription=v;}
   if(!write('receipt',receipt))return;
   if(!write('cart',[]))return;
   location.assign('/confirmation');
  });
 });
}
const receiptHost=$('[data-receipt]');
if(receiptHost){
 const receipt=read('receipt',null);
 $('[data-no-receipt]').hidden=!!receipt;receiptHost.hidden=!receipt;
 if(receipt){
  $('[data-receipt-ref]').textContent=receipt.ref;$('[data-receipt-total]').textContent=money(receipt.total);
  const list=$('[data-receipt-lines]');receipt.lines.forEach(line=>{const li=document.createElement('li');li.textContent=`${line.name} × ${line.quantity} · ${money(line.total)}`;list.append(li);});
 }
}
function renderSubscription(){
 $$('[data-sub-state]').forEach(e=>e.textContent=subscription.status==='paused'?'Paused':subscription.skipped?'Next delivery skipped':'Active');
 $$('[data-sub-plan]').forEach(e=>e.textContent=plans[subscription.plan].name);
 $$('[data-sub-price]').forEach(e=>e.textContent=`${money(plans[subscription.plan].price)} / month`);
 $$('[data-sub-teas]').forEach(e=>e.textContent=subscription.teaIds.map(id=>tea(id).name).join(' + '));
 $$('[data-sub-next]').forEach(e=>e.textContent=subscription.status==='paused'?'On hold until you resume':new Date(subscription.next).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}));
 const pause=$('[value="pause"]'),resume=$('[value="resume"]'),skip=$('[value="skip"]');
 if(pause)pause.disabled=subscription.status==='paused';if(resume)resume.disabled=subscription.status!=='paused';if(skip)skip.disabled=subscription.status==='paused'||subscription.skipped;
}
const manage=$('[data-management]');
if(manage){
 manage.addEventListener('submit',e=>{
  e.preventDefault();const action=$('[name="action"]:checked',manage)?.value;
  if(!action){status('Choose a subscription change first.');return;}
  const value=structuredClone(subscription);
  if(action==='pause')value.status='paused';
  if(action==='resume'){value.status='active';value.skipped=false;const d=new Date();d.setDate(d.getDate()+30);value.next=d.toISOString();}
  if(action==='skip'){value.skipped=true;const d=new Date(value.next);d.setMonth(d.getMonth()+1);value.next=d.toISOString();}
  pending($('button[type="submit"]',manage),'Saving change…',()=>{
   if(write('subscription',value)){subscription=value;manage.reset();renderSubscription();status(action==='pause'?'Saved. Your subscription is paused.':action==='skip'?'Saved. Your next delivery is skipped.':'Saved. Your subscription is active again.');}
  });
 });renderSubscription();
}
const contact=$('[data-contact]');
if(contact){contact.noValidate=true;contact.addEventListener('submit',e=>{e.preventDefault();const msg=$('[data-form-message]',contact);if(!validate(contact,msg))return;pending($('button[type="submit"]',contact),'Checking message…',()=>{msg.hidden=false;msg.textContent='Message checked locally. Nothing was sent. Email delivery is not connected in this demonstration.';contact.reset();});});}
$('[data-reset]')?.addEventListener('click',()=>{
 if(!confirm('Clear the demo cart, receipt and subscription data in this browser?'))return;
 try{['cart','draft','subscription','receipt'].forEach(k=>localStorage.removeItem(`ll-${k}-v1`));location.reload();}catch{storageError();}
});
$$('img').forEach(img=>{
 const fallback=()=>{if(img.hidden)return;img.hidden=true;const p=document.createElement('p');p.className='image-fallback';p.textContent='Tea illustration unavailable. Product details remain below.';img.after(p);};
 img.addEventListener('error',fallback,{once:true});
 // Eager images may fail before the module executes; do not miss that state.
 if(img.complete&&img.naturalWidth===0)fallback();
});
$$('details[data-menu] a').forEach(a=>a.addEventListener('click',()=>{$('details[data-menu]').open=false;}));
renderLines();renderSubscription();updateCount();
if(corrupt)storageError('Saved browser data could not be read. A safe demo state is shown; try saving again.');
