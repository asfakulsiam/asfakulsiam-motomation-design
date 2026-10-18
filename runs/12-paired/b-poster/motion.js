// Cross-document transitions are progressive enhancement. A rapid navigation may
// legitimately skip one; handle only that native rejection, never application errors.
function observeTransition(event){
 const transition=event.viewTransition;
 if(!transition)return;
 transition.ready.catch(error=>{
  if(error?.name==='AbortError'||/transition.*skip|skip.*transition/i.test(error?.message||''))return;
  setTimeout(()=>{throw error;},0);
 });
}
window.addEventListener('pagereveal',observeTransition);
window.addEventListener('pageswap',observeTransition);
// Chromium can reject an internal cross-document promise before pagereveal.
// A skipped transition is a normal navigation fallback, not a failed cart action.
window.addEventListener('unhandledrejection',event=>{
 const error=event.reason;
 if(error instanceof DOMException&&error.message==='Transition was skipped')event.preventDefault();
});
