// All records below are fictional demo data, not business statistics.
window.LedgerlySeed={
  version:1,demo:true,
  profile:{name:'Alex Morgan',email:'alex@example.com'},
  business:{name:'Juniper Supply',address:'18 Garden Lane\nPortland, OR 97205',email:'hello@example.com',currency:'USD'},
  notifications:{invoice:true,weekly:false},
  customers:[
    {id:'maple',name:'Maple Workshop',email:'accounts@maple.example.com',address:'42 Grove Street\nPortland, OR',demo:true},
    {id:'pine',name:'Pine & Paper',email:'hello@pine.example.com',address:'16 Willow Avenue\nPortland, OR',demo:true},
    {id:'marlow',name:'Marlow Studio',email:'studio@marlow.example.com',address:'8 Birch Road\nPortland, OR',demo:true},
    {id:'olive',name:'Olive Market',email:'team@olive.example.com',address:'25 Cedar Street\nPortland, OR',demo:true}
  ],
  transactions:[
    {id:'daily-sales',name:'Shop sales',date:'2026-10-19',category:'Sales',amount:68400,type:'income',method:'Cash register',note:'Daily sales total, morning shift.',demo:true},
    {id:'cedar-supply',name:'Cedar Wholesale',date:'2026-10-19',category:'Inventory',amount:18650,type:'expense',method:'Business card',note:'Restock: ceramic planters and glass vases.',demo:true},
    {id:'parcel-post',name:'Parcel Post',date:'2026-10-19',category:'Shipping',amount:2840,type:'expense',method:'Business card',note:'Three customer orders shipped.',demo:true},
    {id:'maple-payment',name:'Maple Workshop',date:'2026-10-18',category:'Sales',amount:126000,type:'income',method:'Bank transfer',note:'Wholesale order payment.',demo:true},
    {id:'grove-packaging',name:'Grove Packaging',date:'2026-10-18',category:'Supplies',amount:7240,type:'expense',method:'Business card',note:'Recycled boxes and tissue paper.',demo:true},
    {id:'saturday-sales',name:'Saturday shop sales',date:'2026-10-17',category:'Sales',amount:94800,type:'income',method:'Cash register',note:'Weekend market and shop sales.',demo:true},
    {id:'studio-rent',name:'Garden Lane Properties',date:'2026-10-16',category:'Rent',amount:145000,type:'expense',method:'Bank transfer',note:'October shop rent.',demo:true},
    {id:'friday-sales',name:'Friday shop sales',date:'2026-10-16',category:'Sales',amount:72900,type:'income',method:'Cash register',note:'Daily shop sales.',demo:true},
    {id:'internet-service',name:'Neighborhood Internet',date:'2026-10-15',category:'Utilities',amount:6500,type:'expense',method:'Bank transfer',note:'Monthly internet service.',demo:true},
    {id:'thursday-sales',name:'Thursday shop sales',date:'2026-10-15',category:'Sales',amount:59600,type:'income',method:'Cash register',note:'Daily shop sales.',demo:true},
    {id:'wednesday-sales',name:'Wednesday shop sales',date:'2026-10-14',category:'Sales',amount:64300,type:'income',method:'Cash register',note:'Daily shop sales.',demo:true},
    {id:'terrace-stock',name:'Terrace Ceramics',date:'2026-10-14',category:'Inventory',amount:32750,type:'expense',method:'Business card',note:'Handmade mugs, wholesale order.',demo:true},
    {id:'tuesday-sales',name:'Tuesday shop sales',date:'2026-10-13',category:'Sales',amount:48700,type:'income',method:'Cash register',note:'Daily shop sales.',demo:true},
    {id:'monday-sales',name:'Monday shop sales',date:'2026-10-12',category:'Sales',amount:52600,type:'income',method:'Cash register',note:'Daily shop sales.',demo:true},
    {id:'leaf-print',name:'Leaf Print Co.',date:'2026-10-11',category:'Marketing',amount:8450,type:'expense',method:'Business card',note:'Autumn collection postcards.',demo:true},
    {id:'weekend-sales',name:'Sunday shop sales',date:'2026-10-11',category:'Sales',amount:81400,type:'income',method:'Cash register',note:'Daily shop sales.',demo:true},
    {id:'october-stock',name:'Willow Textiles',date:'2026-10-09',category:'Inventory',amount:51800,type:'expense',method:'Bank transfer',note:'Linen towels and cotton throws.',demo:true},
    {id:'early-sales',name:'October opening sales',date:'2026-10-08',category:'Sales',amount:76800,type:'income',method:'Cash register',note:'Daily shop sales.',demo:true}
  ],
  invoices:[
    {id:'inv-1042',number:'INV-1042',customerId:'pine',issued:'2026-10-12',due:'2026-10-18',status:'sent',lines:[{description:'Stoneware planters',qty:12,price:2800},{description:'Linen tea towels',qty:8,price:1800}],tax:0,note:'Thank you for supporting our shop.',demo:true},
    {id:'inv-1043',number:'INV-1043',customerId:'marlow',issued:'2026-10-15',due:'2026-10-29',status:'sent',lines:[{description:'Studio ceramics collection',qty:1,price:82500}],tax:0,note:'Payment within 14 days, please.',demo:true},
    {id:'inv-1044',number:'INV-1044',customerId:'olive',issued:'2026-10-18',due:'2026-11-01',status:'draft',lines:[{description:'Cotton market totes',qty:20,price:1400}],tax:0,note:'Thank you for shopping with us.',demo:true},
    {id:'inv-1041',number:'INV-1041',customerId:'maple',issued:'2026-10-04',due:'2026-10-18',status:'paid',lines:[{description:'Autumn wholesale collection',qty:1,price:126000}],tax:0,note:'Paid by bank transfer.',demo:true}
  ]
};
