const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const defaults={day:1,time:12,energy:10,money:600,debt:0,confidence:0,fitness:0,discipline:0,nutrition:0,groom:0,recovery:0,acting:0,hindi:0,dance:0,karate:0,credits:0,network:0,visibility:0,reel:0,route:null,counts:{gym:0,nutrition:0,groom:0,recovery:0},daily:{},fatigue:0};
let old={};try{old=JSON.parse(localStorage.getItem('pabh-save')||'null')||{}}catch(e){}
let state={...defaults,...old,counts:{...defaults.counts,...(old.counts||{})},daily:old.daily||{}};
if(typeof state.dance==='object') state.dance=0;
const goals={gym:3,nutrition:5,groom:2,recovery:3};
const labels={gym:'Gym',nutrition:'Nutrition',groom:'Style',recovery:'Recovery'};
const icons={gym:'🏋️',nutrition:'🥗',groom:'✂️',recovery:'🌙'};
const activities={
 gym:{title:'GYM',heading:'SHOW UP.',story:'Today is not about proving you are an athlete. It is about becoming someone who follows through.',image:'assets/gym.webp',choices:[
  {name:'Foundation Strength',meta:'2h · −2 Energy',desc:'Steady full-body work. Build momentum without wrecking tomorrow.',time:2,energy:2,money:0,confidence:10,fitness:5,discipline:3,result:'You leave feeling more capable than when you walked in.'},
  {name:'Cardio + Mobility',meta:'1h · −1 Energy',desc:'Lower pressure, easier recovery, still forward.',time:1,energy:1,money:0,confidence:6,fitness:3,discipline:2,result:'A smaller win still changes the story.'},
  {name:'Push Hard',meta:'3h · −4 Energy',desc:'Big physical gain, bigger recovery cost.',time:3,energy:4,money:0,confidence:8,fitness:8,discipline:2,fatigue:2,result:'You pushed hard. Tomorrow will cost more energy.'}
 ]},
 nutrition:{title:'NUTRITION',heading:'FUEL THE VERSION YOU WANT.',story:'The choice is ordinary. The repetition is what makes it powerful.',image:'assets/home-approved.png',choices:[
  {name:'Stick to the Plan',meta:'−$12',desc:'Protein-focused, filling, aligned with the goal.',time:0,energy:0,money:12,confidence:8,nutrition:5,discipline:2,result:'You chose the long-term version of yourself.'},
  {name:'Cook at Home',meta:'1h · −$7',desc:'Cheaper and controlled, but costs time.',time:1,energy:0,money:7,confidence:6,nutrition:4,discipline:3,result:'Not glamorous. Very sustainable.'},
  {name:'Healthy Convenience',meta:'−$20',desc:'Spend more to remove friction today.',time:0,energy:0,money:20,confidence:7,nutrition:4,discipline:1,result:'You made the good choice easier instead of relying on willpower.'}
 ]},
 groom:{title:'STYLE & GROOMING',heading:'LOOK LIKE YOU TAKE YOURSELF SERIOUSLY.',story:'You do not have to wait for a future body to start presenting yourself well.',image:'assets/home-approved.png',choices:[
  {name:'Simple Reset',meta:'1h · −$15',desc:'Hair, skin, facial hair, clothes properly sorted.',time:1,energy:0,money:15,confidence:6,groom:5,result:'Small details change the way you carry yourself.'},
  {name:'One Good Outfit',meta:'2h · −$80',desc:'Buy something that fits the version of you who exists now.',time:2,energy:1,money:80,confidence:10,groom:9,result:'You stop postponing confidence.'},
  {name:'No-Spend Style Session',meta:'1h',desc:'Use what you own. Build and photograph two strong outfits.',time:1,energy:0,money:0,confidence:5,groom:4,discipline:2,result:'You improved presentation without touching your runway.'}
 ]},
 recovery:{title:'RECOVERY',heading:'DON’T BURN OUT THE STORY.',story:'Consistency dies when every day is treated like a test of toughness.',image:'assets/home-approved.png',choices:[
  {name:'Early Night',meta:'End day',desc:'Protect sleep and give tomorrow a clean start.',time:0,energy:0,money:0,confidence:5,recovery:6,discipline:2,endDay:true,result:'You chose tomorrow on purpose.'},
  {name:'Easy Walk',meta:'1h · −1 Energy',desc:'Movement and headspace without another hard session.',time:1,energy:1,money:0,confidence:5,recovery:4,fitness:2,result:'You moved without turning movement into punishment.'},
  {name:'Quiet Reset',meta:'1h',desc:'Stretch, shower, tidy, prepare tomorrow.',time:1,energy:0,money:0,confidence:4,recovery:5,discipline:2,result:'Your environment gives tomorrow a runway.'}
 ]}
};
const routes=[
 {id:'craft',icon:'🎭',title:'Train the Actor',sub:'CRAFT ROUTE',desc:'Classes, workshops, scene study and unpaid/student work. Build credibility through skill and footage.',tags:['Acting +','Reel +','Credits +','Costs money']},
 {id:'action',icon:'🥋',title:'Build an Action Edge',sub:'SPECIALIST ROUTE',desc:'Fitness, martial arts and screen combat. Become useful for action, stunt-adjacent and physical roles.',tags:['Karate +','Fitness +','Distinctive niche','Training cost']},
 {id:'creator',icon:'📱',title:'Create Your Own Proof',sub:'CREATOR ROUTE',desc:'Make reels, scenes and short-form content locally. Build screen presence without waiting to be chosen.',tags:['Visibility +','Reel +','Creative control','Unpredictable reach']},
 {id:'industry',icon:'🎬',title:'Get on Sets',sub:'INDUSTRY ROUTE',desc:'Background work, indie crews and small roles. Learn the set, meet people and turn proximity into opportunity.',tags:['Network +','Set experience','Some income','Slow reel growth']}
];
const systems=[
 {name:'Confidence & foundations',at:1},
 {name:'Career routes & positioning',at:2},
 {name:'Auditions & representation',at:3},
 {name:'India strategy & financial runway',at:4},
 {name:'Brand deals & commercial identity',at:5},
 {name:'Public image, rumours & PR',at:6}
];
let currentActivity='gym';
const dkey=k=>`${state.day}:${k}`;
function save(){localStorage.setItem('pabh-save',JSON.stringify(state))}
function doneToday(k){return !!state.daily[dkey(k)]}
function foundationsDone(){return Object.keys(goals).filter(k=>(state.counts[k]||0)>=goals[k]).length}
function stage1Complete(){return state.confidence>=100&&foundationsDone()===4}
function careerLevel(){if(!stage1Complete())return 1;if(!state.route)return 2;if(state.credits<2&&state.acting<25&&state.visibility<20)return 2;if(state.credits<5&&state.network<30)return 3;if(state.visibility<45&&state.credits<8)return 4;if(state.visibility<70)return 5;return 6}
function go(id){$$('.view').forEach(v=>v.classList.toggle('active',v.id===id));window.scrollTo(0,0);render()}
function toast(t){let e=$('#toast');e.textContent=t;e.classList.add('show');clearTimeout(window.tt);window.tt=setTimeout(()=>e.classList.remove('show'),1700)}
function modal(title,text,kicker='RESULT'){$('#modalKicker').textContent=kicker;$('#modalTitle').textContent=title;$('#modalText').textContent=text;$('#modal').classList.add('show')}
function nextFoundation(){for(const k of ['gym','nutrition','groom','recovery'])if((state.counts[k]||0)<goals[k]&&!doneToday(k))return k;for(const k of ['gym','nutrition','groom','recovery'])if(!doneToday(k))return k;return null}
function recommendation(){
 if(stage1Complete()&&!state.route)return {icon:'◈',title:'Find Your Edge',text:'You have built enough momentum to decide how you want to get noticed.',label:'CHOOSE YOUR ROUTE →',go:'edge'};
 if(stage1Complete())return {icon:'🎭',title:'Keep building your '+routeName(),text:'New opportunities will begin to reflect the advantage you chose.',label:'VIEW JOURNEY →',go:'journey'};
 let k=nextFoundation();
 if(k)return {icon:icons[k],title:k==='gym'?'Go to the Gym':labels[k],text:{gym:'Start with action. Build physical momentum and self-trust.',nutrition:'Make the next meal support the person you are becoming.',groom:'Invest in how you carry yourself now — not later.',recovery:'Protect the routine so tomorrow still works.'}[k],activity:k};
 return {icon:'🌙',title:'Close the day',text:'You have made every useful move available today.',end:true};
}
function routeName(){let r=routes.find(x=>x.id===state.route);return r?r.title:'career'}
function openActivity(k){if(doneToday(k)){toast('You already made this move today');return}currentActivity=k;let a=activities[k];$('#activityTitle').textContent=a.title;$('#eventHeading').textContent=a.heading;$('#eventStory').textContent=a.story;$('#activityImage').src=a.image;$('#activityImage').alt=a.title;renderChoices();go('activity')}
function renderChoices(){let a=activities[currentActivity];$('#choiceList').innerHTML=a.choices.map((c,i)=>`<button class="choiceCard" data-choice="${i}"><div><small>${String(i+1).padStart(2,'0')}</small><b>${c.name}</b><em>${c.meta}</em></div><p>${c.desc}</p><span>Confidence +${c.confidence} →</span></button>`).join('');$$('[data-choice]').forEach(b=>b.onclick=()=>makeChoice(+b.dataset.choice))}
function makeChoice(i){let k=currentActivity,c=activities[k].choices[i];if(doneToday(k))return toast('Already done today');if(state.time<c.time)return toast('Not enough time left today');if(state.energy<c.energy)return toast('Not enough energy');if(state.money<c.money)return toast('Not enough money');state.time-=c.time;state.energy-=c.energy;state.money-=c.money;['confidence','fitness','discipline','nutrition','groom','recovery'].forEach(x=>state[x]=Math.max(0,Math.min(x==='confidence'?999:100,state[x]+(c[x]||0))));state.fatigue=Math.max(state.fatigue,c.fatigue||0);state.counts[k]=(state.counts[k]||0)+1;state.daily[dkey(k)]=true;let unlocked=stage1Complete();save();render();modal(unlocked?'FIND YOUR EDGE UNLOCKED':c.name.toUpperCase(),`${c.result}\n\nConfidence +${c.confidence}.${unlocked?'\n\nYou now have enough foundation to decide how you want to enter the acting world.':''}`,unlocked?'WORLD EXPANDED':'TODAY')}
function endDay(){state.day++;state.time=12;state.energy=Math.max(6,10-state.fatigue);state.fatigue=0;save();render();modal('DAY '+state.day,'The day resets. Your choices stay with you.','NEW DAY')}
function chooseRoute(id){state.route=id;let r=routes.find(x=>x.id===id);save();render();modal(r.title.toUpperCase(),`Your first positioning route is now ${r.title}.\n\nThis does not lock you out of the others. It changes which opportunities are most likely to find you first.`,`NEW DIRECTION`)}
function renderHome(){
 $('#homeConfidence').textContent=Math.min(100,state.confidence);$('#homeConfidenceBar').style.width=Math.min(100,state.confidence)+'%';
 let r=recommendation();$('#homeNextIcon').textContent=r.icon;$('#homeNextTitle').textContent=r.title;$('#homeNextText').textContent=r.text;$('#homeNextAction').onclick=()=>r.activity?openActivity(r.activity):r.go?go(r.go):r.end?endDay():null;
 let keys=['nutrition','groom','recovery','gym'].filter(k=>k!==r.activity);$('#quickMoves').innerHTML=keys.map(k=>`<button class="quickMove" data-quick="${k}" ${doneToday(k)?'disabled':''}>${icons[k]} ${labels[k]}</button>`).join('');$$('[data-quick]').forEach(b=>b.onclick=()=>openActivity(b.dataset.quick));
}
function renderJourney(){let lvl=careerLevel();let stageTitle=lvl===1?'BUILD YOURSELF':lvl===2?'FIND YOUR EDGE':lvl===3?'GET EXPERIENCE':lvl===4?'CHOOSE YOUR MARKET':lvl===5?'BECOME RECOGNISABLE':'MANAGE THE SPOTLIGHT';let texts={1:'Build enough confidence, routine and physical momentum to start choosing how you want to enter the industry.',2:'Decide what makes you useful, memorable or credible before asking anyone to cast you.',3:'Turn your edge into footage, credits, contacts and representation.',4:'Balance Australia, India, money, training and network. Bigger moves now have real costs.',5:'Commercial work, better auditions and visibility create new opportunities — and new trade-offs.',6:'Now that people know you, reputation, brands, rumours and PR finally matter.'};$('#journeyStageTitle').textContent=stageTitle;$('#journeyStageText').textContent=texts[lvl];let objective=lvl===1?`<small>CURRENT OBJECTIVE</small><b>Earn 100 Confidence and build all four foundations.</b><p>${foundationsDone()}/4 foundations complete · ${Math.min(100,state.confidence)}/100 Confidence</p>`:lvl===2?`<small>CURRENT OBJECTIVE</small><b>${state.route?'Keep developing '+routeName()+'.':'Choose your first competitive edge.'}</b><p>${state.route?'Your choice changes which opportunities appear first.':'Your first major career branch is ready.'}</p>`:`<small>CURRENT OBJECTIVE</small><b>Build real career leverage.</b><p>Credits ${state.credits} · Network ${state.network} · Visibility ${state.visibility}</p>`;$('#currentObjective').innerHTML=objective;if(lvl===2&&!state.route)$('#currentObjective').onclick=()=>go('edge');
 let path=[
  {n:1,t:'Build Yourself',d:'Confidence · fitness · presentation · routine'},
  {n:2,t:'Find Your Edge',d:'Craft · action · creator · industry routes'},
  {n:3,t:'Get Experience',d:'Footage · small roles · contacts · first representation'},
  {n:4,t:'Choose Your Market',d:'Sydney · hybrid India visits · remote submissions · relocation'},
  {n:5,t:'Become Recognisable',d:'Paid campaigns · stronger auditions · public identity'},
  {n:6,t:'The Spotlight Changes Everything',d:'Brand conflicts · rumours · interviews · PR'}
 ];$('#stagePath').innerHTML=path.map(x=>{let status=x.n<lvl?'complete':x.n===lvl?'active':'locked';let mystery=x.n>lvl+1;return `<article class="pathStage ${status} ${mystery?'mystery':''}"><div class="node">${status==='complete'?'✓':x.n}</div><div class="pathCopy"><small>${status==='active'?'CURRENT CHAPTER':status==='complete'?'OPENED':'LOCKED'}</small><b>${mystery?'???':x.t}</b><p>${mystery?'Keep playing to reveal what changes when your career grows.':x.d}</p></div></article>`}).join('')}
function renderYou(){let lvl=careerLevel();let identities=['','THE BEGINNING','CHOOSING YOUR EDGE','EMERGING ACTOR','CROSS-MARKET CONTENDER','RECOGNISABLE FACE','PUBLIC FIGURE'];$('#youIdentity').textContent=identities[lvl];$('#youIdentityText').textContent=lvl===1?'Nobody knows you yet. That is freedom: you still get to decide what kind of actor you become.':state.route?`Your current edge is ${routeName()}. It is a direction, not a prison.`:'Your career identity is beginning to take shape.';$('#youConfidence').textContent=state.confidence;$('#youConfidenceBar').style.width=Math.min(100,state.confidence)+'%';let stats=[['Fitness',state.fitness],['Discipline',state.discipline],['Nutrition',state.nutrition],['Style',state.groom],['Recovery',state.recovery]];if(lvl>=2)stats.push(['Acting',state.acting],['Network',state.network]);if(lvl>=3)stats.push(['Credits',state.credits],['Visibility',state.visibility]);$('#stats').innerHTML=stats.map(([n,v])=>`<div class="statTile"><span>${n}</span><b>${v}</b><div class="bar"><i style="width:${Math.min(100,v)}%"></i></div></div>`).join('');$('#systemsList').innerHTML=systems.map(s=>`<div class="systemRow ${lvl>=s.at?'unlocked':''}"><span>${lvl>=s.at?'✓':'🔒'} ${lvl>=s.at?s.name:'Hidden system'}</span><b>${lvl>=s.at?'ACTIVE':'NOT YET'}</b></div>`).join('')}
function renderRoutes(){$('#routeList').innerHTML=routes.map(r=>`<button class="routeCard ${state.route===r.id?'selected':''}" data-route="${r.id}"><div class="routeTop"><span class="routeIcon">${r.icon}</span><div><b>${r.title}</b><small>${r.sub}</small></div></div><p>${r.desc}</p><div class="routeTags">${r.tags.map(t=>`<span>${t}</span>`).join('')}</div></button>`).join('');$$('[data-route]').forEach(b=>b.onclick=()=>chooseRoute(b.dataset.route))}
function render(){ $$('[data-day]').forEach(x=>x.textContent=state.day);$$('[data-time]').forEach(x=>x.textContent=state.time);$$('[data-energy]').forEach(x=>x.textContent=state.energy);$$('[data-money]').forEach(x=>x.textContent='$'+state.money);renderHome();renderJourney();renderYou();renderRoutes() }
$('#begin').onclick=()=>{$('#splash').classList.remove('active');$('#game').classList.add('active');go('home')};$$('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));$('#endDayHome').onclick=endDay;$('#modalClose').onclick=()=>{$('#modal').classList.remove('show');go('home')};document.addEventListener('dblclick',e=>e.preventDefault(),{passive:false});document.addEventListener('gesturestart',e=>e.preventDefault(),{passive:false});render();
