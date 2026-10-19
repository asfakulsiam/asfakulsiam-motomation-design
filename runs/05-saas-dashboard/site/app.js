/* @motomation-component
 * id: ledgerly-workspace; name: Working ledger; family: service-ui; tier: 1; deps: none
 * what: Shared route renderer, persisted finance records and native task forms.
 * use-when: Small local single-user ledger; avoid-when: Real authenticated financial service.
 * reduced-motion: Instant feedback; touch: visible >=44px controls; a11y: semantic tables, labelled fields, native dialog.
 */
(() => {
  'use strict';
  const KEY='ledgerly.workspace.v1';
  const app=document.getElementById('app');
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const money=cents=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format((Number(cents)||0)/100);
  const date=value=>new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(value+'T12:00:00Z'));
  const TODAY='2026-10-19'; // The clearly labelled sample ledger's reference date.
  const categories=['Inventory','Supplies','Rent','Shipping','Utilities','Marketing','Travel','Other'];
  let data,readError=false,toast='',page=1,sortKey='date',sortDir=-1;
  let filters={search:'',category:'all',from:'',to:''};
  const clone=()=>structuredClone(window.LedgerlySeed);
  function validWorkspace(x){
    return x&&x.version===1&&Array.isArray(x.transactions)&&Array.isArray(x.customers)&&Array.isArray(x.invoices)&&x.profile&&x.business&&x.notifications
      &&x.transactions.every(t=>t.id&&t.name&&Number.isFinite(t.amount)&&/^\d{4}-\d{2}-\d{2}$/.test(t.date)&&['income','expense'].includes(t.type))
      &&x.invoices.every(i=>i.id&&i.number&&Array.isArray(i.lines)&&i.lines.every(l=>Number.isFinite(l.qty)&&Number.isFinite(l.price)));
  }
  function read(){
    try{const stored=localStorage.getItem(KEY);data=stored?JSON.parse(stored):clone();if(!validWorkspace(data))throw Error('Invalid workspace');readError=false;return true;}
    catch{readError=true;data=clone();return false;}
  }
  read();
  function persist(next,form){
    try{
      localStorage.setItem(KEY,JSON.stringify(next));data=next;readError=false;return true;
    }catch{
      const message='Your changes could not be saved. Browser storage may be full or unavailable. Your entries are still here. Free some space, then try again.';
      if(form)formError(form,message);else notify(message,true);
      return false;
    }
  }
  function select(type,id){
    const next=structuredClone(data);next[type]=id;return persist(next);
  }
  const icon=(name,size=20)=>{
    const paths={
      grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
      arrows:'<path d="M4 7h15m-4-4 4 4-4 4M20 17H5m4-4-4 4 4 4"/>',
      invoice:'<path d="M6 3h9l4 4v14l-4-2-3 2-3-2-3 2zM9 8h5M9 12h7M9 16h4"/>',
      users:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-16a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5v2"/>',
      gear:'<path d="m9 3-1 3-3 1 1 3-2 2 2 2-1 3 3 1 1 3h6l1-3 3-1-1-3 2-2-2-2 1-3-3-1-1-3z"/><circle cx="12" cy="12" r="3"/>',
      plus:'<path d="M12 5v14M5 12h14"/>',
      right:'<path d="M5 12h14m-5-5 5 5-5 5"/>',
      left:'<path d="M19 12H5m5-5-5 5 5 5"/>',
      down:'<path d="m6 9 6 6 6-6"/>',
      search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
      check:'<path d="m5 12 4 4L19 6"/>',
      bank:'<path d="m3 8 9-5 9 5H3zm2 3v7m5-7v7m4-7v7m5-7v7M3 21h18"/>',
      up:'<path d="m7 17 10-10M7 7h10v10"/>',
      out:'<path d="m7 7 10 10M7 17h10V7"/>',
      leaf:'<path d="M20 3C9 2 3 8 5 16c7 3 14-2 15-13ZM4 21 15 9"/>',
      clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      exit:'<path d="M10 3H4v18h6m4-14 5 5-5 5M9 12h10"/>',
      info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v1"/>',
      download:'<path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5"/>',
      wifi:'<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-10 4a5 5 0 0 1 6 0M12 20h.01"/>'
    };
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.invoice}</svg>`;
  };
  const href=(url,label,cls='',extra='')=>`<a href="${url}" class="${cls}" ${extra}>${label}</a>`;
  const button=(label,action,cls='button secondary',extra='')=>`<button type="button" class="${cls}" data-action="${action}" ${extra}>${label}</button>`;
  const customer=id=>data.customers.find(c=>c.id===id)||{name:'Customer removed',email:'',address:''};
  const invoiceTotal=i=>Math.round(i.lines.reduce((s,l)=>s+l.qty*l.price,0)*(1+Number(i.tax||0)/100));
  const status=i=>i.status==='sent'&&i.due<TODAY?'overdue':i.status;
  const badge=(label,kind=label)=>`<span class="badge ${esc(kind)}">${esc(label[0].toUpperCase()+label.slice(1))}</span>`;
  function title(name,desc,actions=''){
    return `<div class="page-heading"><div><div class="eyebrow">YOUR BUSINESS, AT A GLANCE</div><h1>${name}</h1><p>${desc}</p></div><div class="actions">${actions}</div></div>`;
  }
  function shell(content,active=''){
    const nav=[['/dashboard','grid','Overview'],['/transactions','arrows','Transactions'],['/invoices','invoice','Invoices'],['/customers','users','Customers'],['/settings','gear','Settings']];
    app.innerHTML=`<div class="workspace">
      <aside class="sidebar"><a class="wordmark" href="/dashboard" aria-label="Ledgerly overview">ledgerly<span class="brand-dot">.</span></a>
        <div class="business-switch"><span class="business-monogram">JS</span><div><strong>${esc(data.business.name)}</strong><span>Local workspace</span></div></div>
        <nav aria-label="Main navigation">${nav.map(([url,img,label])=>href(url,icon(img)+`<span>${label}</span>`,'nav-link '+(active===label?'selected':''),active===label?'aria-current="page"':'')).join('')}</nav>
        <div class="sidebar-bottom"><div class="quiet-card">${icon('leaf')}<strong>A little clarity, every day.</strong><p>Keep your books close to your business.</p></div>
        ${href('/sign-in',icon('exit')+'<span>Leave demo</span>','nav-link')}</div>
      </aside>
      <div class="main-shell"><header class="topbar"><span class="topbar-path">${esc(active||'Workspace')}</span><div class="topbar-right"><span class="local-indicator"><span></span>Saved on this device</span><a href="/settings#profile" class="avatar" aria-label="Profile settings">${esc((data.profile.name||'A').split(' ').map(n=>n[0]).slice(0,2).join(''))}</a></div></header>
      <div class="demo-strip"><span>${icon('info',16)}<strong>Demo workspace</strong><span>Fictional records. Changes stay in this browser.</span></span>${href('/settings#workspace','Manage data '+icon('right',14))}</div>
      <div id="offline-banner" class="offline-banner" ${navigator.onLine?'hidden':''}>${icon('wifi')} You’re offline. You can still save on this device. Bank sync is unavailable.</div>
      <main id="main" tabindex="-1">${content}</main>
      <footer><span>Ledgerly · Local demo</span><span>Sample reference date: October 19, 2026</span><a href="/offline">Offline guide</a></footer></div></div>
      <div id="toast" class="toast" role="status" hidden></div><dialog id="dialog" aria-labelledby="dialog-title"></dialog>`;
    if(toast){notify(toast);toast='';}
    bindGlobal();
  }
  function notify(text,error=false){
    const el=document.getElementById('toast');if(!el)return;
    el.textContent=text;el.hidden=false;el.classList.toggle('error',error);
    // Persistent until dismissed by a subsequent action; no reading-time deadline.
  }
  function formError(form,message){
    const el=form.querySelector('.form-message');el.textContent=message;el.className='form-message error-message';el.hidden=false;el.setAttribute('role','alert');
    const submit=form.querySelector('button[type=submit]');if(submit){submit.disabled=false;submit.removeAttribute('aria-busy');}
    el.scrollIntoView({block:'nearest',behavior:'instant'});
  }
  function validate(form){
    let first=null;
    for(const input of form.querySelectorAll('input,select,textarea')){
      const invalid=!input.checkValidity();input.setAttribute('aria-invalid',String(invalid));if(invalid&&!first)first=input;
    }
    if(first){const label=form.querySelector(`label[for="${first.id}"]`)?.textContent?.replace('*','').trim()||'required field';formError(form,`Check ${label.toLowerCase()}. ${first.validity.valueMissing?'This field is required.':first.validationMessage}`);first.focus();return false;}
    return true;
  }
  function submit(form,operation){
    if(form.dataset.pending==='true')return;
    form.dataset.pending='true';
    if(!validate(form)){form.dataset.pending='false';return;}
    const result=operation();form.dataset.pending='false';return result;
  }
  const field=(id,label,type='text',value='',extra='')=>`<div class="field"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}" value="${esc(value)}" ${extra}></div>`;
  const textarea=(id,label,value='',extra='')=>`<div class="field full"><label for="${id}">${label}</label><textarea id="${id}" name="${id}" rows="3" ${extra}>${esc(value)}</textarea></div>`;
  const options=(arr,selected)=>arr.map(c=>`<option value="${esc(c)}" ${c===selected?'selected':''}>${esc(c)}</option>`).join('');
  const selectField=(id,label,arr,value)=>`<div class="field"><label for="${id}">${label}</label><select id="${id}" name="${id}" required>${options(arr,value)}</select></div>`;
  const message=()=>'<div class="form-message" role="status" hidden></div>';
  function emptyState(heading,copy,action=''){
    return `<div class="empty-state">${icon('leaf',30)}<h2>${heading}</h2><p>${copy}</p>${action}</div>`;
  }
  function transactionRows(items,compact=false){
    if(!items.length)return emptyState('No transactions yet','Add your first expense, or record a sale to start your ledger.',href('/expenses/new',icon('plus')+' Add expense','button'));
    return `<div class="table-wrap"><table class="records ${compact?'compact':''}" data-entity="transactions"><thead><tr>
      <th scope="col">Transaction</th><th scope="col" ${!compact?`aria-sort="${sortKey==='date'?(sortDir===-1?'descending':'ascending'):'none'}"`:''}>${compact?'Date':button('Date '+(sortKey==='date'?(sortDir===-1?'↓':'↑'):'↕'),'sort-date','sort-button')}</th>
      <th scope="col">Category</th><th scope="col" class="number" ${!compact?`aria-sort="${sortKey==='amount'?(sortDir===-1?'descending':'ascending'):'none'}"`:''}>${compact?'Amount':button('Amount '+(sortKey==='amount'?(sortDir===-1?'↓':'↑'):'↕'),'sort-amount','sort-button')}</th><th scope="col"><span class="sr-only">Detail</span></th>
      </tr></thead><tbody>${items.map(t=>`<tr><td data-label="Transaction"><div class="transaction-name"><span class="transaction-icon ${t.type}">${icon(t.type==='income'?'up':'out',18)}</span><div>${href('/transactions/detail',esc(t.name),'record-link',`data-transaction="${esc(t.id)}"`)}<span class="row-meta">${esc(t.method)}</span></div></div></td>
      <td data-label="Date">${date(t.date)}</td><td data-label="Category"><span class="category-chip">${esc(t.category)}</span></td>
      <td data-label="Amount" class="number amount ${t.type==='income'?'positive':''}">${t.type==='income'?'+':'−'}${money(t.amount)}</td>
      <td class="row-detail">${href('/transactions/detail',icon('right',18),'icon-link',`aria-label="View ${esc(t.name)}" data-transaction="${esc(t.id)}"`)}</td></tr>`).join('')}</tbody></table></div>`;
  }
  function dashboard(){
    const period=data.dashboardPeriod||'month';
    const min=period==='week'?'2026-10-13':'2026-10-01';
    const tx=data.transactions.filter(t=>t.date>=min&&t.date<=TODAY);
    const sales=tx.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
    const spend=tx.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
    const outstanding=data.invoices.filter(i=>i.status==='sent').reduce((s,i)=>s+invoiceTotal(i),0);
    const today=data.transactions.filter(t=>t.date===TODAY);
    const days=Array.from({length:7},(_,j)=>`2026-10-${String(13+j).padStart(2,'0')}`);
    const daily=days.map(day=>({day,income:data.transactions.filter(t=>t.date===day&&t.type==='income').reduce((s,t)=>s+t.amount,0),expense:data.transactions.filter(t=>t.date===day&&t.type==='expense').reduce((s,t)=>s+t.amount,0)}));
    const max=Math.max(100,...daily.flatMap(d=>[d.income,d.expense]));
    const chart=`<div class="cash-chart" role="img" aria-label="Cash in and out by day, October 13 to 19. Exact daily values follow the chart.">
       <div class="chart-axis"><span>${money(max)}</span><span>${money(max/2)}</span><span>$0</span></div><div class="chart-plot"><div class="chart-lines"><i></i><i></i><i></i></div>
       ${daily.map(d=>`<div class="chart-day"><div class="bar-pair"><span class="bar income-bar" style="--bar:${d.income/max}" title="Cash in ${money(d.income)}"></span><span class="bar expense-bar" style="--bar:${d.expense/max}" title="Cash out ${money(d.expense)}"></span></div><span>${date(d.day).split(',')[0]}</span></div>`).join('')}</div></div>`;
    const pending=data.invoices.filter(i=>i.status==='sent').sort((a,b)=>a.due.localeCompare(b.due));
    shell(`${title('Overview','A clear view of your shop’s day.',href('/expenses/new',icon('plus')+' Add expense','button secondary')+href('/invoices/new',icon('plus')+' New invoice','button','data-new-invoice'))}
      <div class="overview-context"><div><span class="store-tag">${icon('leaf',16)} ${esc(data.business.name)}</span><span class="muted">Monday, October 19</span></div><label class="period-label" for="dashboard-period"><span class="sr-only">Overview period</span><select id="dashboard-period"><option value="month" ${period==='month'?'selected':''}>This month</option><option value="week" ${period==='week'?'selected':''}>Last 7 days</option></select></label></div>
      <section class="metrics" aria-label="Financial summary"><div class="metric"><span>Sales</span><strong>${money(sales)}</strong><span class="metric-note">${period==='week'?'Oct 13–19':'Oct 1–19'} · recorded income</span></div><div class="metric"><span>Expenses</span><strong>${money(spend)}</strong><span class="metric-note">${tx.filter(t=>t.type==='expense').length} recorded expenses</span></div><div class="metric"><span>Net cash flow</span><strong class="${sales-spend>=0?'positive':''}">${money(sales-spend)}</strong><span class="metric-note">Sales less expenses</span></div><div class="metric"><span>Outstanding invoices</span><strong>${money(outstanding)}</strong><a href="/invoices">${pending.length} invoices awaiting payment ${icon('right',14)}</a></div></section>
      <div class="dashboard-grid"><section class="panel cash-panel" id="cash-flow"><div class="panel-heading"><div><h2>Money in, money out</h2><p>Your last seven days, side by side.</p></div><div class="chart-legend"><span><i class="legend-in"></i>Cash in</span><span><i class="legend-out"></i>Cash out</span></div></div>${data.transactions.length?chart:emptyState('Your story starts here','Record your first transaction to see cash flow.')}<details class="chart-data"><summary>View daily amounts</summary><table><caption class="sr-only">Daily cash flow</caption><thead><tr><th>Date</th><th>Cash in</th><th>Cash out</th></tr></thead><tbody>${daily.map(d=>`<tr><td>${date(d.day)}</td><td>${money(d.income)}</td><td>${money(d.expense)}</td></tr>`).join('')}</tbody></table></details></section>
      <section class="panel today-panel"><div class="panel-heading"><h2>Today’s position</h2>${icon('clock',19)}</div><p class="muted">October 19 · recorded on this device</p><div class="today-row"><span>Sales recorded</span><strong>${money(today.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0))}</strong></div><div class="today-row"><span>Expenses recorded</span><strong>${money(today.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0))}</strong></div><div class="bank-notice">${icon('bank')}<div><strong>Bank connection</strong><p>Not connected. Bank sync is deferred in this local demo.</p>${href('/settings#bank','View connection settings '+icon('right',14),'text-link')}</div></div></section></div>
      <div class="dashboard-lower"><section class="panel recent-panel"><div class="panel-heading"><h2>Recent transactions</h2>${href('/transactions','View all '+icon('right',16),'text-link')}</div>${transactionRows([...data.transactions].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5),true)}</section>
      <section class="panel due-panel"><div class="panel-heading"><h2>On your radar</h2>${badge(String(pending.length)+' open','neutral')}</div>${pending.length?pending.map(i=>`<a class="due-item" href="/invoices/preview" data-invoice="${esc(i.id)}"><div><strong>${esc(customer(i.customerId).name)}</strong><span>${esc(i.number)} · Due ${date(i.due).split(',')[0]}</span></div><div><strong>${money(invoiceTotal(i))}</strong>${badge(status(i))}</div></a>`).join(''):emptyState('All caught up','No invoices are awaiting payment.')}<a href="/invoices" class="panel-bottom-link">Manage invoices ${icon('right',16)}</a></section></div>`,'Overview');
    document.getElementById('dashboard-period').addEventListener('change',event=>{const next=structuredClone(data);next.dashboardPeriod=event.target.value;if(persist(next))dashboard();});
  }
  function transactions(){
    shell(`${title('Transactions','Every sale and expense, in one place.',button(icon('download')+' Export CSV','export')+href('/expenses/new',icon('plus')+' Add expense','button'))}
      <section class="panel" id="transaction-ledger"><div class="filter-bar">
      <div class="search-field"><label for="transaction-search" class="sr-only">Search transactions</label>${icon('search')}<input id="transaction-search" type="search" placeholder="Search transactions" value="${esc(filters.search)}"></div>
      <div class="field"><label for="category-filter">Category</label><select id="category-filter">${options(['all',...categories,'Sales'],filters.category).replace('>all<','>All categories<')}</select></div>
      ${field('date-from','From','date',filters.from)}${field('date-to','To','date',filters.to)}
      <div class="field mobile-sort"><label for="transaction-sort">Sort by</label><select id="transaction-sort"><option value="date:-1">Date, newest first</option><option value="date:1">Date, oldest first</option><option value="amount:-1">Amount, highest first</option><option value="amount:1">Amount, lowest first</option></select></div>
      ${button('Clear filters','clear','button plain')}</div>
      <div id="filter-message" role="status" class="filter-message" hidden></div><div id="transaction-results"></div></section>`,'Transactions');
    for(const [id,key]of [['transaction-search','search'],['category-filter','category'],['date-from','from'],['date-to','to']]){
      const el=document.getElementById(id);el.addEventListener(id==='transaction-search'?'input':'change',()=>{filters[key]=el.value;page=1;drawResults();});
    }
    const sorting=document.getElementById('transaction-sort');sorting.value=sortKey+':'+sortDir;
    sorting.addEventListener('change',()=>{const [key,dir]=sorting.value.split(':');sortKey=key;sortDir=Number(dir);page=1;drawResults();});
    drawResults();
  }
  function drawResults(){
    const invalid=filters.from&&filters.to&&filters.from>filters.to;
    const messageEl=document.getElementById('filter-message');messageEl.hidden=!invalid;messageEl.textContent='Start date must be on or before end date.';
    let items=invalid?[]:data.transactions.filter(t=>(!filters.search||`${t.name} ${t.note} ${money(t.amount)}`.toLowerCase().includes(filters.search.toLowerCase()))&&(filters.category==='all'||t.category===filters.category)&&(!filters.from||t.date>=filters.from)&&(!filters.to||t.date<=filters.to));
    items.sort((a,b)=>sortDir*(sortKey==='amount'?a.amount-b.amount:a.date.localeCompare(b.date)));
    const total=items.length,pages=Math.max(1,Math.ceil(total/8));page=Math.min(page,pages);
    document.getElementById('transaction-results').innerHTML=`<div class="result-count" aria-live="polite">${total} ${total===1?'transaction':'transactions'}${filters.category!=='all'?' · '+esc(filters.category):''}</div>
      ${total?transactionRows(items.slice((page-1)*8,page*8)):emptyState('No matching transactions',invalid?'Choose a valid date range.':'Try a different search, category or date range.',button('Clear filters','clear'))}
      <div class="pagination"><span>${total?(page-1)*8+1:0}–${Math.min(page*8,total)} of ${total}</span><div>${button(icon('left',18)+' Previous','previous','button plain',page===1?'disabled':'')}<span>Page ${page} of ${pages}</span>${button('Next '+icon('right',18),'next','button plain',page>=pages?'disabled':'')}</div></div>`;
    bindActions(document.getElementById('transaction-results'));
    document.querySelectorAll('#transaction-results [data-transaction]').forEach(a=>a.addEventListener('click',e=>{if(!select('selectedTransaction',a.dataset.transaction))e.preventDefault();}));
  }
  function transactionDetail(){
    const t=data.transactions.find(t=>t.id===data.selectedTransaction)||data.transactions[0];
    if(!t)return shell(title('Transaction detail','Your ledger is empty.')+emptyState('Nothing to open yet','Record your first expense to see its details.',href('/expenses/new','Add expense','button')),'Transactions');
    shell(`${href('/transactions',icon('left',16)+' Back to transactions','back-link')}${title('Transaction detail',t.type==='expense'?'A closer look at this expense.':'A closer look at this sale.')}
      <section class="panel detail-panel"><div class="detail-title"><span class="transaction-icon ${t.type}">${icon(t.type==='income'?'up':'out',24)}</span><div><h2>${esc(t.name)}</h2><p>${date(t.date)}</p></div><strong class="detail-amount ${t.type==='income'?'positive':''}">${t.type==='income'?'+':'−'}${money(t.amount)}</strong></div>
      <dl class="detail-grid"><div><dt>Category</dt><dd>${esc(t.category)}</dd></div><div><dt>Payment method</dt><dd>${esc(t.method)}</dd></div><div><dt>Type</dt><dd>${t.type==='income'?'Income':'Expense'}</dd></div><div><dt>Storage</dt><dd>Saved on this device</dd></div><div class="full"><dt>Notes</dt><dd>${esc(t.note||'No notes added.')}</dd></div></dl><div class="form-footer">${href('/transactions','Back to transactions','button secondary')}${button('Delete transaction','delete-transaction','button danger',`data-id="${esc(t.id)}"`)}</div></section>`,'Transactions');
  }
  function expenseForm(){
    shell(`${href('/dashboard',icon('left',16)+' Back to overview','back-link')}${title('Add expense','Keep the small things accounted for.')}
      <div class="form-layout"><form id="expense-form" class="panel task-form" novalidate data-capability="persisted"><div class="form-section"><h2>Expense details</h2><p class="muted">Required fields are marked with an asterisk.</p><div class="form-grid">
      ${field('merchant','Merchant *','text','','required maxlength="100" autocomplete="organization" placeholder="Who did you pay?"')}
      ${field('amount','Amount (USD) *','number','','required min="0.01" max="9999999" step="0.01" inputmode="decimal" placeholder="0.00"')}
      ${field('expense-date','Date *','date',TODAY,'required')}
      ${selectField('expense-category','Category *',categories,'Inventory')}
      ${selectField('payment-method','Paid with *',['Business card','Bank transfer','Cash'],'Business card')}
      ${textarea('expense-note','Notes','', 'maxlength="1000" placeholder="What was this expense for?"')}</div></div>
      ${message()}<div class="form-footer"><span class="storage-hint">${icon('check',16)} Saved locally, never uploaded</span><div>${href('/dashboard','Cancel','button secondary')}<button class="button" type="submit">Save expense</button></div></div></form>
      <aside class="form-aside"><span class="small-icon">${icon('leaf',26)}</span><h2>A tidy ledger starts here.</h2><p>Record an expense when it happens. Your overview and transactions update as soon as you save.</p><div class="aside-rule"></div><strong>Just on this device</strong><p>This local demo doesn’t upload receipts or connect to a bank.</p></aside></div>`,'Transactions');
    const form=document.getElementById('expense-form');
    form.addEventListener('submit',e=>{e.preventDefault();submit(form,()=>{
      const d=new FormData(form),amount=Math.round(Number(d.get('amount'))*100),merchant=d.get('merchant').trim();
      if(!merchant)return formError(form,'Enter a merchant name, not only spaces.');
      if(!Number.isSafeInteger(amount)||amount<=0)return formError(form,'Enter an amount greater than $0.00.');
      const next=structuredClone(data),id='expense-'+crypto.randomUUID().slice(0,8);
      next.transactions.unshift({id,name:merchant,amount,date:d.get('expense-date'),category:d.get('expense-category'),type:'expense',method:d.get('payment-method'),note:d.get('expense-note').trim(),demo:true});
      next.selectedTransaction=id;next.lastExpense=id;
      if(persist(next,form))location.assign('/expenses/saved');
    });});
  }
  function expenseSaved(){
    const t=data.transactions.find(t=>t.id===data.lastExpense);
    shell(`${title('Expense saved','Your books are up to date on this device.')}<section class="panel confirmation"><span class="success-icon">${icon('check',30)}</span><h2>${t?esc(t.name)+' recorded':'Your expense ledger is ready'}</h2><p>${t?money(t.amount)+' · '+esc(t.category)+' · '+date(t.date):'Add an expense to update your overview.'}</p><p class="muted">Saved in this browser. No bank transaction was created.</p><div class="actions">${href('/dashboard','Back to overview','button')}${href('/expenses/new','Add another expense','button secondary')}${href('/transactions/detail','View transaction','text-link')}</div></section>`,'Transactions');
  }
  function invoices(){
    const filter=data.invoiceFilter||'all';
    const items=data.invoices.filter(i=>filter==='all'||(filter==='overdue'?status(i)==='overdue':i.status===filter));
    const totals=['sent','draft','paid'].map(st=>data.invoices.filter(i=>i.status===st).reduce((s,i)=>s+invoiceTotal(i),0));
    shell(`${title('Invoices','Good work deserves a clear invoice.',href('/invoices/new',icon('plus')+' New invoice','button','data-new-invoice'))}
      <section class="metrics invoice-metrics" aria-label="Invoice totals"><div class="metric"><span>Awaiting payment</span><strong>${money(totals[0])}</strong><span class="metric-note">Includes overdue invoices</span></div><div class="metric"><span>Draft invoices</span><strong>${money(totals[1])}</strong><span class="metric-note">Not yet marked sent</span></div><div class="metric"><span>Paid invoices</span><strong class="positive">${money(totals[2])}</strong><span class="metric-note">Recorded in this workspace</span></div></section>
      <section class="panel"><div class="invoice-tabs" aria-label="Invoice filters">${[['all','All invoices'],['draft','Draft'],['sent','Awaiting payment'],['overdue','Overdue'],['paid','Paid']].map(([val,label])=>button(label,'invoice-filter','tab '+(filter===val?'active':''),`data-value="${val}" aria-pressed="${filter===val}"`)).join('')}</div>
      ${items.length?`<div class="table-wrap"><table class="records invoice-table" data-entity="invoices"><thead><tr><th>Invoice / customer</th><th>Issued</th><th>Due date</th><th>Status</th><th class="number">Amount</th><th><span class="sr-only">Open</span></th></tr></thead><tbody>${items.map(i=>`<tr><td data-label="Invoice"><div>${href('/invoices/preview',esc(i.number),'record-link',`data-invoice="${esc(i.id)}"`)}<span class="row-meta">${esc(customer(i.customerId).name)}</span></div></td><td data-label="Issued">${date(i.issued)}</td><td data-label="Due">${date(i.due)}</td><td data-label="Status">${badge(status(i))}</td><td data-label="Amount" class="number amount">${money(invoiceTotal(i))}</td><td class="row-detail">${href('/invoices/preview',icon('right',18),'icon-link',`data-invoice="${esc(i.id)}" aria-label="Preview ${esc(i.number)}"`)}</td></tr>`).join('')}</tbody></table></div>`:emptyState('No invoices in this view','Create an invoice or choose another status.',href('/invoices/new','New invoice','button','data-new-invoice'))}
      <div class="panel-footnote">${icon('info',16)} “Mark sent” records a local status only. Email delivery is not connected.</div></section>`,'Invoices');
  }
  function invoiceForm(){
    const existing=data.invoices.find(i=>i.id===data.editingInvoice);
    const i=existing||{number:'INV-'+(Math.max(1044,...data.invoices.map(i=>Number(i.number.replace(/\D/g,''))||0))+1),customerId:data.customers[0]?.id,issued:TODAY,due:'2026-11-02',lines:[{description:'',qty:1,price:0}],tax:0,note:'Thank you for supporting our shop.'};
    shell(`${href('/invoices',icon('left',16)+' Back to invoices','back-link')}${title(existing?'Edit invoice':'New invoice','A few details. A professional first impression.')}
      <form id="invoice-form" class="panel task-form invoice-editor" novalidate data-capability="persisted"><div class="form-section"><div class="section-heading"><h2>Invoice details</h2><span class="invoice-number">${esc(i.number)}</span></div><div class="form-grid">
      <div class="field"><label for="invoice-customer">Customer *</label><select name="invoice-customer" id="invoice-customer" required><option value="">Choose a customer</option>${data.customers.map(c=>`<option value="${esc(c.id)}" ${c.id===i.customerId?'selected':''}>${esc(c.name)}</option>`).join('')}</select><a href="/customers" class="field-link">Manage customers</a></div>
      ${field('invoice-issued','Issue date *','date',i.issued,'required')}${field('invoice-due','Due date *','date',i.due,'required')}</div></div>
      <div class="form-section"><h2>Line items</h2><div id="invoice-lines">${i.lines.map((line,index)=>lineFields(line,index)).join('')}</div>${button(icon('plus',18)+' Add line item','add-line','button secondary')}</div>
      <div class="form-section form-grid"><div>${textarea('invoice-note','Note to customer',i.note,'maxlength="1000"')}</div><div class="invoice-calculation">${field('invoice-tax','Tax rate (%)','number',i.tax,'min="0" max="100" step="0.01"')}<div class="calc-row"><span>Subtotal</span><strong id="invoice-subtotal"></strong></div><div class="calc-row"><span>Tax</span><strong id="invoice-tax-total"></strong></div><div class="calc-row total"><span>Total (USD)</span><strong id="invoice-total"></strong></div></div></div>
      ${message()}<div class="form-footer"><span class="storage-hint">Saves locally. No email is sent.</span><div>${href('/invoices','Cancel','button secondary')}<button class="button secondary" type="submit" name="intent" value="draft">Save draft</button><button class="button" type="submit" name="intent" value="preview">Save & preview ${icon('right',18)}</button></div></div></form>`,'Invoices');
    const form=document.getElementById('invoice-form');
    form.addEventListener('input',updateInvoiceTotal);
    form.addEventListener('submit',event=>{event.preventDefault();submit(form,()=>{
      const d=new FormData(form),lines=readLines(),issued=d.get('invoice-issued'),due=d.get('invoice-due');
      if(due<issued)return formError(form,'Due date must be on or after the issue date.');
      if(lines.some(l=>!l.description.trim()))return formError(form,'Add a description for each line item.');
      if(!lines.length)return formError(form,'Add at least one line item.');
      if(!data.customers.some(c=>c.id===d.get('invoice-customer')))return formError(form,'Choose a saved customer.');
      const next=structuredClone(data),id=existing?.id||'invoice-'+crypto.randomUUID().slice(0,8);
      const record={id,number:i.number,customerId:d.get('invoice-customer'),issued,due,lines,tax:Number(d.get('invoice-tax')),note:d.get('invoice-note').trim(),status:existing?.status||'draft',demo:true};
      if(existing)next.invoices=next.invoices.map(x=>x.id===id?record:x);else next.invoices.unshift(record);
      next.selectedInvoice=id;next.editingInvoice=null;
      if(persist(next,form))location.assign(event.submitter?.value==='draft'?'/invoices':'/invoices/preview');
    });});updateInvoiceTotal();
  }
  function lineFields(l,index){
    return `<div class="line-item" data-line="${index}">${field('line-description-'+index,'Description *','text',l.description,'required maxlength="200" data-line-field="description" placeholder="Item or service"')}${field('line-qty-'+index,'Quantity *','number',l.qty,'required min="1" max="100000" step="1" data-line-field="qty"')}${field('line-price-'+index,'Unit price (USD) *','number',l.price?l.price/100:'','required min="0.01" max="9999999" step="0.01" data-line-field="price" inputmode="decimal" placeholder="0.00"')}${button('Remove','remove-line','button plain line-remove','aria-label="Remove line item '+(index+1)+'"')}</div>`;
  }
  function readLines(){return [...document.querySelectorAll('[data-line]')].map(el=>({description:el.querySelector('[data-line-field=description]').value.trim(),qty:Number(el.querySelector('[data-line-field=qty]').value),price:Math.round(Number(el.querySelector('[data-line-field=price]').value)*100)}));}
  function updateInvoiceTotal(){
    const total=readLines().reduce((s,l)=>s+l.qty*l.price,0),tax=total*(Number(document.getElementById('invoice-tax').value)||0)/100;
    document.getElementById('invoice-subtotal').textContent=money(total);document.getElementById('invoice-tax-total').textContent=money(tax);document.getElementById('invoice-total').textContent=money(total+tax);
  }
  function invoicePreview(){
    const i=data.invoices.find(i=>i.id===data.selectedInvoice)||data.invoices[0];
    if(!i)return shell(title('Invoice preview','See your invoice before marking it sent.')+emptyState('No invoice to preview','Create an invoice first.',href('/invoices/new','Create invoice','button','data-new-invoice')),'Invoices');
    const c=customer(i.customerId),subtotal=i.lines.reduce((s,l)=>s+l.qty*l.price,0);
    shell(`${href('/invoices',icon('left',16)+' Back to invoices','back-link')}${title('Invoice preview','Check the details before updating its status.',button('Edit invoice','edit-invoice','button secondary',`data-id="${esc(i.id)}"`)+(i.status==='draft'?button('Mark sent '+icon('check',18),'mark-sent','button',`data-id="${esc(i.id)}"`):badge(status(i))))}
      <div class="preview-notice">${icon('info',18)} No email will be sent. “Mark sent” saves a status on this device.</div>
      <article class="invoice-paper" id="invoice-paper"><div class="paper-top"><div><span class="paper-business">${esc(data.business.name)}</span><p class="address">${esc(data.business.address)}</p><p>${esc(data.business.email)}</p></div><div><h2>INVOICE</h2><strong>${esc(i.number)}</strong></div></div>
      <div class="paper-parties"><div><span class="paper-label">BILL TO</span><strong>${esc(c.name)}</strong><p class="address">${esc(c.address)}</p><p>${esc(c.email)}</p></div><dl><div><dt>Issued</dt><dd>${date(i.issued)}</dd></div><div><dt>Due date</dt><dd>${date(i.due)}</dd></div><div><dt>Currency</dt><dd>USD</dd></div></dl></div>
      <table class="paper-items"><thead><tr><th>Description</th><th>Qty</th><th>Unit price</th><th class="number">Amount</th></tr></thead><tbody>${i.lines.map(l=>`<tr><td>${esc(l.description)}</td><td>${l.qty}</td><td>${money(l.price)}</td><td class="number">${money(l.qty*l.price)}</td></tr>`).join('')}</tbody></table>
      <div class="paper-bottom"><p>${esc(i.note)}</p><div><div class="calc-row"><span>Subtotal</span><span>${money(subtotal)}</span></div><div class="calc-row"><span>Tax (${i.tax}%)</span><span>${money(invoiceTotal(i)-subtotal)}</span></div><div class="calc-row total"><strong>Total due</strong><strong>${money(invoiceTotal(i))}</strong></div></div></div>
      <p class="paper-demo">Demo invoice · Not a request for payment</p></article>`,'Invoices');
  }
  function invoiceSent(){
    const i=data.invoices.find(i=>i.id===data.selectedInvoice);
    shell(`${title('Invoice marked sent','Your invoice status has been updated locally.')}<section class="panel confirmation"><span class="success-icon">${icon('check',30)}</span><h2>${i?esc(i.number)+' marked sent':'Invoice workspace ready'}</h2><p>${i?esc(customer(i.customerId).name)+' · '+money(invoiceTotal(i)):''}</p><p class="muted">No email was sent. Email delivery is deferred in this demo.</p><div class="actions">${href('/invoices','Back to invoices','button')}${href('/invoices/preview','View invoice','button secondary')}${href('/dashboard','Back to overview','text-link')}</div></section>`,'Invoices');
  }
  function customers(){
    shell(`${title('Customers','The people and businesses you work with.',button(icon('plus')+' Add customer','add-customer','button'))}
      <section class="panel"><div class="filter-bar"><div class="search-field"><label class="sr-only" for="customer-search">Search customers</label>${icon('search')}<input type="search" id="customer-search" placeholder="Search customers"></div><span class="muted">${data.customers.length} customers</span></div><div id="customer-results" data-entity="customers"></div></section>`,'Customers');
    const draw=()=>{
      const q=document.getElementById('customer-search').value.toLowerCase();
      const list=data.customers.filter(c=>(c.name+' '+c.email).toLowerCase().includes(q));
      document.getElementById('customer-results').innerHTML=list.length?`<div class="customer-list">${list.map(c=>`<div class="customer-row"><span class="customer-avatar">${esc(c.name[0])}</span><div><strong>${esc(c.name)}</strong><span>${esc(c.email)}</span></div><span class="customer-invoices">${data.invoices.filter(i=>i.customerId===c.id).length} invoices</span>${button('Edit','edit-customer','button plain',`data-id="${esc(c.id)}"`)}</div>`).join('')}</div>`:emptyState('No customers found','Add a customer or try a different search.',button('Add customer','add-customer','button'));
      bindActions(document.getElementById('customer-results'));
    };
    document.getElementById('customer-search').addEventListener('input',draw);draw();
  }
  function customerDialog(id){
    const c=data.customers.find(c=>c.id===id)||{name:'',email:'',address:''};
    openDialog(`<form id="customer-form" novalidate data-capability="persisted"><h2 id="dialog-title">${id?'Edit customer':'Add customer'}</h2><p>Customer details are saved only in this browser.</p><div class="form-grid">${field('customer-name','Business or customer name *','text',c.name,'required maxlength="100" autocomplete="organization"')}${field('customer-email','Email *','email',c.email,'required maxlength="200" autocomplete="email"')}${textarea('customer-address','Address',c.address,'maxlength="500"')}</div>${message()}<div class="dialog-actions">${button('Cancel','close-dialog','button secondary')}<button type="submit" class="button">Save customer</button></div></form>`);
    const form=document.getElementById('customer-form');
    form.addEventListener('submit',e=>{e.preventDefault();submit(form,()=>{
      const d=new FormData(form);if(!d.get('customer-name').trim())return formError(form,'Enter a customer name, not only spaces.');
      const next=structuredClone(data),record={id:id||'customer-'+crypto.randomUUID().slice(0,8),name:d.get('customer-name').trim(),email:d.get('customer-email').trim(),address:d.get('customer-address').trim(),demo:true};
      if(id)next.customers=next.customers.map(x=>x.id===id?record:x);else next.customers.push(record);
      if(persist(next,form)){document.getElementById('dialog').close();customers();notify('Customer saved on this device.');}
    });});
  }
  function settings(){
    shell(`${title('Settings','Make this workspace feel like your business.')}<nav class="settings-links" aria-label="Settings sections">${href('#profile','Profile')}${href('#business','Business')}${href('#notifications','Notifications')}${href('#bank','Bank connection')}${href('#workspace','Workspace')}</nav>
      <div class="settings-stack"><section class="panel settings-panel" id="profile"><div><h2>Profile</h2><p>Your name and contact details.</p></div><form id="profile-form" novalidate data-capability="persisted"><div class="form-grid">${field('profile-name','Name *','text',data.profile.name,'required maxlength="100" autocomplete="name"')}${field('profile-email','Email *','email',data.profile.email,'required maxlength="200" autocomplete="email"')}</div>${message()}<button class="button secondary" type="submit">Save profile</button></form></section>
      <section class="panel settings-panel" id="business"><div><h2>Business</h2><p>Used on your invoices.</p></div><form id="business-form" novalidate data-capability="persisted"><div class="form-grid">${field('business-name','Business name *','text',data.business.name,'required maxlength="100" autocomplete="organization"')}${field('business-email','Business email *','email',data.business.email,'required maxlength="200" autocomplete="email"')}${textarea('business-address','Business address',data.business.address,'maxlength="500" autocomplete="street-address"')}<p class="field-help full">This workspace uses USD. Multi-currency accounting is not included.</p></div>${message()}<button class="button secondary" type="submit">Save business</button></form></section>
      <section class="panel settings-panel" id="notifications"><div><h2>Notifications</h2><p>Preferences for a future email connection.</p></div><form id="notifications-form" novalidate data-capability="persisted"><label class="check-row"><input name="invoice" type="checkbox" ${data.notifications.invoice?'checked':''}><span><strong>Invoice reminders</strong><span>Remind me when an invoice is overdue.</span></span></label><label class="check-row"><input name="weekly" type="checkbox" ${data.notifications.weekly?'checked':''}><span><strong>Weekly summary</strong><span>A weekly look at sales and expenses.</span></span></label><p class="field-help">Preferences save locally. No notifications are delivered; email integration is deferred.</p>${message()}<button class="button secondary" type="submit">Save preferences</button></form></section>
      <section class="panel settings-panel" id="bank"><div><h2>Bank connection</h2><p>Bring transactions into your ledger.</p></div><div class="integration-box">${icon('bank',28)}<div><strong>Not connected ${badge('Deferred','neutral')}</strong><p>Bank sync requires a secure server and bank provider. It is not available in this demo. No bank credentials are collected.</p><button type="button" class="button secondary" disabled>Connect bank · unavailable</button></div></div></section>
      <section class="panel settings-panel" id="workspace"><div><h2>Workspace data</h2><p>Only in this browser. Not a backup.</p></div><div class="data-controls"><p>Export a copy before clearing your workspace. Fictional sample records can be restored at any time.</p><div class="actions">${button(icon('download')+' Export workspace','export-workspace','button secondary')}${button('Start empty workspace','empty-workspace','button secondary')}${button('Restore demo records','restore','button secondary')}</div><nav class="state-links" aria-label="Workspace help">${href('/empty','New-account guide')}${href('/error','Storage recovery')}${href('/offline','Offline guide')}${href('/sign-in','Sign-in interface')}</nav><p class="field-help">Authentication is deferred. This local workspace has no access control. Don’t enter sensitive or real financial information.</p></div></section></div>`,'Settings');
    for(const kind of ['profile','business','notifications']){
      const form=document.getElementById(kind+'-form');form.addEventListener('submit',event=>{event.preventDefault();submit(form,()=>{
        const d=new FormData(form),next=structuredClone(data);
        if(kind==='profile'){
          if(!d.get('profile-name').trim())return formError(form,'Enter a name, not only spaces.');
          next.profile={name:d.get('profile-name').trim(),email:d.get('profile-email').trim()};
        }
        if(kind==='business'){
          if(!d.get('business-name').trim())return formError(form,'Enter a business name, not only spaces.');
          next.business={...data.business,name:d.get('business-name').trim(),email:d.get('business-email').trim(),address:d.get('business-address').trim()};
        }
        if(kind==='notifications')next.notifications={invoice:d.has('invoice'),weekly:d.has('weekly')};
        if(persist(next,form)){
          const el=form.querySelector('.form-message');el.className='form-message success-message';el.hidden=false;el.textContent=kind==='notifications'?'Preferences saved locally. Email delivery is not connected.':'Changes saved on this device.';
        }
      });});
    }
  }
  function signIn(){
    app.innerHTML=`<div class="signin-page"><header><a class="wordmark" href="/dashboard">ledgerly<span class="brand-dot">.</span></a>${href('/dashboard','Explore the demo '+icon('right',16),'text-link')}</header>
      <main id="main" tabindex="-1"><div class="signin-intro"><span class="store-tag">${icon('leaf',18)} A LITTLE CLARITY, EVERY DAY</span><h1>Back to your books.</h1><p>Sales, expenses and invoices.<br>A clear place to keep them together.</p><div class="signin-sample"><span>THE JUNIPER SUPPLY WORKSPACE</span><div><span>Today’s sales</span><strong>${money(data.transactions.filter(t=>t.date===TODAY&&t.type==='income').reduce((s,t)=>s+t.amount,0))}</strong></div><p>Illustrative sample records · October 19, 2026</p></div></div>
      <form id="signin-form" class="panel signin-form" novalidate data-capability="persisted"><span class="eyebrow">LOCAL DEMO</span><h2>Open your workspace</h2><p>No account or password needed.</p>${field('display-name','Your display name *','text',data.profile.name,'required maxlength="100" autocomplete="name"')}<div class="deferred-notice">${icon('info',20)}<p><strong>Authentication is deferred.</strong> This interface opens a local demo, not a secure account. Do not enter real credentials.</p></div>${message()}<button class="button" type="submit">Continue to demo ${icon('right',18)}</button><p class="field-help">Records and preferences are saved in localStorage on this device. No data is sent to a server.</p></form></main>
      <footer>${href('/offline','Offline guide')}${href('/settings#workspace','Local data settings')}<span>Ledgerly · Fictional demo</span></footer></div>`;
    const form=document.getElementById('signin-form');form.addEventListener('submit',event=>{event.preventDefault();submit(form,()=>{
      const name=new FormData(form).get('display-name').trim();if(!name)return formError(form,'Enter a display name, not only spaces.');
      const next=structuredClone(data);next.profile.name=name;
      if(persist(next,form))location.assign('/dashboard');
    });});
  }
  function stateRoute(kind){
    const states={
      empty:['A fresh set of books','Your next chapter starts with the first entry.','No records, no clutter. Start an empty workspace, then record your first expense or add a customer.','leaf'],
      error:['Your data needs a moment','We couldn’t open this workspace.','Browser storage may be unavailable, full, or contain an unreadable record. Retry first. Restoring demo records replaces the local ledger; export a copy if you can.','info'],
      offline:['Offline, still in business','Your local ledger keeps working.','Sales, expenses and invoices stay on this device. Local saves work without a network. Bank sync and email delivery are deferred, online or offline.','wifi'],
      notfound:['Page not found','That page isn’t in your ledger.','The address may have changed. Head back to your overview to pick up where you left off.','search']
    };
    const [heading,desc,copy,img]=states[kind];
    const actions=kind==='empty'?button('Start empty workspace','empty-workspace','button')+href('/expenses/new','Add expense','button secondary'):kind==='error'?button('Retry loading data','retry','button')+button('Export stored copy','export-raw','button secondary')+button('Restore demo records','restore','button secondary'):href('/dashboard','Back to overview','button')+href('/transactions','View transactions','button secondary');
    shell(`${title(heading,desc)}<section class="panel state-panel"><span class="state-icon">${icon(img,36)}</span><h2>${kind==='empty'?'A clean start':kind==='error'?'Let’s get your books back':kind==='offline'?'Saved here. Ready when you are.':'Let’s get you back.'}</h2><p>${copy}</p><div class="actions">${actions}</div>${kind==='offline'?'<p class="field-help">Keep a workspace export as a backup. Browser data can be cleared by your device.</p>':''}</section>`);
  }
  function openDialog(html){
    const dialog=document.getElementById('dialog');dialog.innerHTML=html;dialog.showModal();bindActions(dialog);
  }
  function confirmation(heading,copy,label,callback){
    openDialog(`<h2 id="dialog-title">${heading}</h2><p>${copy}</p><div class="dialog-actions">${button('Cancel','close-dialog','button secondary')}<button type="button" class="button danger" id="confirm-action">${label}</button></div>`);
    document.getElementById('confirm-action').addEventListener('click',()=>{if(callback()!==false)document.getElementById('dialog')?.close();});
  }
  function download(name,text,type='application/json'){
    const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('Download created. Keep this copy somewhere safe.');
  }
  function bindActions(root){
    root.querySelectorAll('[data-action]').forEach(el=>el.addEventListener('click',()=>{
      const action=el.dataset.action,id=el.dataset.id;
      if(action==='sort-date'||action==='sort-amount'){const key=action.slice(5);sortDir=sortKey===key?-sortDir:-1;sortKey=key;drawResults();}
      if(action==='previous'){page--;drawResults();}
      if(action==='next'){page++;drawResults();}
      if(action==='clear'){filters={search:'',category:'all',from:'',to:''};page=1;transactions();}
      if(action==='invoice-filter'){const next=structuredClone(data);next.invoiceFilter=el.dataset.value;if(persist(next))invoices();}
      if(action==='add-line'){const container=document.getElementById('invoice-lines');const index=Date.now();container.insertAdjacentHTML('beforeend',lineFields({description:'',qty:1,price:0},index));bindActions(container.lastElementChild);container.lastElementChild.querySelector('input').focus();updateInvoiceTotal();}
      if(action==='remove-line'){
        const row=el.closest('[data-line]');
        if(document.querySelectorAll('[data-line]').length===1){notify('Keep at least one line item. Add another before removing this one.');return;}
        row.remove();updateInvoiceTotal();
      }
      if(action==='edit-invoice'){const next=structuredClone(data);next.editingInvoice=id;if(persist(next))location.assign('/invoices/new');}
      if(action==='mark-sent'){
        const next=structuredClone(data);next.invoices=next.invoices.map(i=>i.id===id?{...i,status:'sent'}:i);next.selectedInvoice=id;
        if(persist(next))location.assign('/invoices/sent');
      }
      if(action==='delete-transaction')confirmation('Delete this transaction?','This removes the record from this device and updates your overview. It cannot be undone.','Delete transaction',()=>{
        const next=structuredClone(data);next.transactions=next.transactions.filter(t=>t.id!==id);if(persist(next)){location.assign('/transactions');return true;}return false;
      });
      if(action==='add-customer')customerDialog();
      if(action==='edit-customer')customerDialog(id);
      if(action==='close-dialog')document.getElementById('dialog').close();
      if(action==='empty-workspace')confirmation('Start an empty workspace?','Your transactions, invoices and customers will be removed from this device. Export a backup first. Profile and business settings are kept.','Start empty workspace',()=>{
        const next={...structuredClone(data),transactions:[],invoices:[],customers:[],selectedInvoice:null,selectedTransaction:null,lastExpense:null,editingInvoice:null,invoiceFilter:'all'};
        if(persist(next)){location.assign('/dashboard');return true;}return false;
      });
      if(action==='restore')confirmation('Restore demo records?','This replaces your local workspace, including changes you made, with the fictional Juniper Supply sample.','Restore demo records',()=>{
        if(persist(clone())){location.assign('/dashboard');return true;}return false;
      });
      if(action==='retry'){if(read())location.assign('/dashboard');else notify('Storage is still unavailable or unreadable. Export a copy before restoring demo records.',true);}
      if(action==='export-workspace')download('ledgerly-workspace.json',JSON.stringify(data,null,2));
      if(action==='export-raw'){try{download('ledgerly-stored-copy.txt',localStorage.getItem(KEY)||'No saved workspace data.','text/plain');}catch{notify('This browser does not allow access to storage. Try reopening in a regular browser window.',true);}}
      if(action==='export'){
        const cell=v=>'"'+String(v).replace(/"/g,'""').replace(/^[=+@-]/,"'$&")+'"';
        const rows=[['Date','Description','Category','Type','Amount USD','Payment method'],...data.transactions.map(t=>[t.date,t.name,t.category,t.type,(t.amount/100).toFixed(2),t.method])];
        download('ledgerly-transactions.csv',rows.map(r=>r.map(cell).join(',')).join('\n'),'text/csv;charset=utf-8');
      }
    }));
  }
  function bindGlobal(){
    bindActions(app);
    app.querySelectorAll('[data-transaction]').forEach(a=>a.addEventListener('click',e=>{if(!select('selectedTransaction',a.dataset.transaction))e.preventDefault();}));
    app.querySelectorAll('[data-invoice]').forEach(a=>a.addEventListener('click',e=>{if(!select('selectedInvoice',a.dataset.invoice))e.preventDefault();}));
    app.querySelectorAll('[data-new-invoice]').forEach(a=>a.addEventListener('click',e=>{const next=structuredClone(data);next.editingInvoice=null;if(!persist(next))e.preventDefault();}));
  }
  function render(){
    const route=location.pathname.replace(/\/$/,'')||'/';
    if(readError&&route!=='/error'&&route!=='/sign-in')return stateRoute('error');
    if(route==='/'||route==='/dashboard')return dashboard();
    if(route==='/sign-in')return signIn();
    if(route==='/transactions')return transactions();
    if(route==='/transactions/detail')return transactionDetail();
    if(route==='/expenses/new')return expenseForm();
    if(route==='/expenses/saved')return expenseSaved();
    if(route==='/invoices')return invoices();
    if(route==='/invoices/new')return invoiceForm();
    if(route==='/invoices/preview')return invoicePreview();
    if(route==='/invoices/sent')return invoiceSent();
    if(route==='/customers')return customers();
    if(route==='/settings')return settings();
    if(route==='/empty')return stateRoute('empty');
    if(route==='/error')return stateRoute('error');
    if(route==='/offline')return stateRoute('offline');
    return stateRoute('notfound');
  }
  addEventListener('storage',event=>{if(event.key===KEY){const form=document.querySelector('form');if(form){notify('This workspace changed in another tab. Reload before saving to avoid replacing newer changes.',true);}else{read();render();}}});
  addEventListener('offline',()=>{const el=document.getElementById('offline-banner');if(el)el.hidden=false;});
  addEventListener('online',()=>{const el=document.getElementById('offline-banner');if(el)el.hidden=true;});
  render();
})();
