(() => {
 'use strict';
 const init = () => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const editing = document.body.classList.contains('elementor-editor-active');
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('bani-nav');
  const close = () => {if(!toggle || !nav) return;toggle.setAttribute('aria-expanded','false');nav.classList.remove('open');};
  if(toggle && nav){
   toggle.addEventListener('click',()=>{const open = toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
   nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
   document.addEventListener('keydown',e=>{if(e.key==='Escape' && toggle.getAttribute('aria-expanded')==='true'){close();toggle.focus();}});
  }
  if(!reduced && !editing && 'IntersectionObserver' in window){
   document.body.classList.add('motion-ready');
   const observer = new IntersectionObserver(items=>items.forEach(item=>{if(item.isIntersecting){item.target.classList.add('visible');observer.unobserve(item.target);}}),{threshold:.08});
   document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  }
  const progress = document.createElement('div');progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
  const hero = document.querySelector('.hero');
  const statement = document.querySelector('.statement');
  const orbit = document.querySelector('.cta-orbits');
  const cta = document.querySelector('.cta');
  const links = nav ? [...nav.querySelectorAll('a')].map(a=>({a,section:document.querySelector(a.getAttribute('href'))})):[];
  let queued = false;
  const update = () => {
   header?.classList.toggle('is-scrolled',scrollY>80);
   const max=document.documentElement.scrollHeight-innerHeight;
   document.documentElement.style.setProperty('--progress',max>0?Math.min(1,scrollY/max):0);
   if(!reduced && !editing){
    if(hero && scrollY < hero.offsetHeight) hero.style.setProperty('--hero-y',Math.min(35,scrollY*.05)+'px');
    if(statement){const top=statement.getBoundingClientRect().top;const amount=Math.max(0,Math.min(1,(innerHeight*.9-top)/(innerHeight*.5)));statement.style.setProperty('--reveal-fill',amount*100+'%');}
    if(orbit && cta){const top=cta.getBoundingClientRect().top;if(top<innerHeight&&top>-cta.offsetHeight)orbit.style.transform=`rotate(${-25+(innerHeight-top)*.015}deg)`;}
   }
   let current=null;links.forEach(link=>{if(link.section && link.section.getBoundingClientRect().top<innerHeight*.4) current=link.a;});
   links.forEach(link=>{link.a.classList.toggle('active',link.a===current);if(link.a===current)link.a.setAttribute('aria-current','location');else link.a.removeAttribute('aria-current');});
   queued=false;
  };
  addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update);}},{passive:true});addEventListener('resize',update);update();
  const stages=[
   ['تبريد المياه','تبدأ الدورة بتبريد المياه في وحدة التشيلر المركزية.'],
   ['ضخ وتوزيع','تضخ الشبكة المياه المبردة إلى وحدات التوزيع داخل المبنى.'],
   ['راحة في المساحة','تمرّر وحدات التكييف الهواء فوق أنابيب المياه الباردة لتبريد المساحة.'],
   ['عودة وإعادة تبريد','تعود المياه بعد امتصاص الحرارة إلى التشيلر، لتبدأ دورة التبريد من جديد.']
  ];
  const visual=document.querySelector('.tech-visual');const description=document.querySelector('.tech-description p');const badge=document.querySelector('.system-stage');
  document.querySelectorAll('.system-controls button').forEach(button=>button.addEventListener('click',()=>{
   const n=Number(button.dataset.stage);if(!stages[n])return;
   document.querySelectorAll('.system-controls button').forEach(b=>{const selected=b===button;b.classList.toggle('is-active',selected);b.setAttribute('aria-pressed',String(selected));});
   if(visual)visual.dataset.stage=String(n);
   if(description)description.textContent=stages[n][1];
   if(badge){badge.replaceChildren();const count=document.createElement('span');count.textContent=String(n+1).padStart(2,'0');badge.append(count,document.createTextNode(stages[n][0]));}
  }));
  const services=['أنظمة التكييف المتكاملة','الدكت والتهوية','أنظمة التشيلر','الصيانة والدعم الفني'];
  document.querySelectorAll('.scene-cta a').forEach((a,n)=>a.addEventListener('click',()=>{const select=document.getElementById('enquiry-service');if(select&&services[n])select.value=services[n];}));
  const form=document.getElementById('bani-enquiry');
  if(form)form.addEventListener('submit',e=>{
   e.preventDefault();if(!form.reportValidity())return;
   const data=new FormData(form);const name=String(data.get('name')||'').trim(),message=String(data.get('message')||'').trim();if(!name||!message)return;
   const text=`مرحبًا شركة بني،\nالاسم: ${name}\nالخدمة: ${data.get('service')}\nتفاصيل المشروع: ${message}`;
   const url='https://wa.me/966557919901?text='+encodeURIComponent(text);
   window.open(url,'_blank','noopener,noreferrer');
   const status=document.getElementById('enquiry-status');status.textContent='رسالتك جاهزة للمراجعة داخل واتساب. ';
   const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='افتح المحادثة';status.append(link);
  });
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
(() => {
 const start=()=>{
  const links=[...document.querySelectorAll('.project-image a')];if(!links.length)return;
  const dialog=document.createElement('dialog');dialog.className='bani-lightbox';dialog.setAttribute('aria-label','معرض أعمال بني');
  dialog.innerHTML='<button type="button" class="lightbox-close" aria-label="إغلاق معرض الصور">×</button><div class="lightbox-frame"><img alt=""><div class="lightbox-caption"><span></span><p></p></div></div><button type="button" class="lightbox-prev" aria-label="الصورة السابقة">→</button><button type="button" class="lightbox-next" aria-label="الصورة التالية">←</button>';
  document.body.append(dialog);let current=0,trigger=null;
  const image=dialog.querySelector('img'),caption=dialog.querySelector('p'),counter=dialog.querySelector('.lightbox-caption span');
  const show=n=>{current=(n+links.length)%links.length;const source=links[current].querySelector('img');image.src=links[current].href;image.alt=source?.alt||'من أعمال بني';caption.textContent=links[current].closest('.project')?.querySelector('h3')?.textContent||image.alt;counter.textContent=String(current+1).padStart(2,'0')+' / '+String(links.length).padStart(2,'0');};
  links.forEach((link,n)=>link.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();trigger=link;show(n);dialog.showModal();document.body.style.overflow='hidden';dialog.querySelector('.lightbox-close').focus();}));
  const close=()=>dialog.close();dialog.querySelector('.lightbox-close').addEventListener('click',close);
  dialog.querySelector('.lightbox-prev').addEventListener('click',()=>show(current-1));dialog.querySelector('.lightbox-next').addEventListener('click',()=>show(current+1));
  dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
  dialog.addEventListener('close',()=>{document.body.style.overflow='';trigger?.focus();});
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();show(current+1);}if(e.key==='ArrowRight'){e.preventDefault();show(current-1);}});
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
