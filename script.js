const toggle=document.querySelector(".menu-toggle"),links=document.querySelector(".nav-links");if(toggle){toggle.addEventListener("click",()=>{const open=links.classList.toggle("open");toggle.setAttribute("aria-expanded",open)});links.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{links.classList.remove("open");toggle.setAttribute("aria-expanded","false")}))}document.getElementById("year").textContent=new Date().getFullYear();

// Presentation mode: manual navigation by default; autoplay is opt-in demo only.
(()=>{
 const root=document.getElementById("presentation");
 const launch=document.getElementById("presentLaunch");
 if(!root||!launch)return;
 const slideHost=document.getElementById("presentationSlide");
 const toc=document.getElementById("presentationToc");
 const counter=document.getElementById("presentationLabel");
 const prev=document.getElementById("presentPrev");
 const next=document.getElementById("presentNext");
 const exit=document.getElementById("presentExit");
 const demo=document.getElementById("demoToggle");
 const sourceSlides=[...document.querySelectorAll("main > section")];
 const labels=["Trang mở đầu","Giới thiệu","Thành viên","Dự án","Liên hệ"];
 let current=0,demoTimer=null;
 const stopDemo=()=>{
  if(demoTimer!==null){window.clearInterval(demoTimer);demoTimer=null;}
  demo.setAttribute("aria-pressed","false");
  demo.textContent="▷ Chạy demo";
 };
 const render=(index)=>{
  current=Math.max(0,Math.min(sourceSlides.length-1,index));
  const clone=sourceSlides[current].cloneNode(true);
  clone.querySelectorAll(".sahur-hero").forEach(el=>el.remove());
  clone.querySelectorAll("[id]").forEach(el=>el.removeAttribute("id"));
  slideHost.replaceChildren(clone);
  root.dataset.slide=String(current);
  counter.textContent=String(current+1).padStart(2,"0")+" / "+String(sourceSlides.length).padStart(2,"0");
  toc.querySelectorAll("button").forEach((button,i)=>{
   if(i===current)button.setAttribute("aria-current","step");
   else button.removeAttribute("aria-current");
  });
  prev.disabled=current===0;
  next.disabled=current===sourceSlides.length-1;
  prev.style.opacity=prev.disabled?".35":"1";
  next.style.opacity=next.disabled?".35":"1";
 };
 sourceSlides.forEach((section,index)=>{
  const button=document.createElement("button");
  button.type="button";
  button.innerHTML="<span>"+String(index+1).padStart(2,"0")+"</span>"+(labels[index]||section.querySelector("h1,h2")?.textContent.trim().replace(/\\s+/g," ")||"Section "+(index+1));
  button.addEventListener("click",()=>{stopDemo();render(index);});
  toc.append(button);
 });
 const open=()=>{
  stopDemo();render(current);
  root.classList.add("is-open");
  root.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
  exit.focus();
 };
 const close=()=>{
  stopDemo();
  root.classList.remove("is-open");
  root.setAttribute("aria-hidden","true");
  document.body.style.overflow="";
  launch.focus();
 };
 const move=delta=>{
  stopDemo();
  const target=current+delta;
  if(target<0||target>=sourceSlides.length)return;
  render(target);
 };
 launch.addEventListener("click",open);
 exit.addEventListener("click",close);
 prev.addEventListener("click",()=>move(-1));
 next.addEventListener("click",()=>move(1));
 demo.addEventListener("click",()=>{
  if(demoTimer!==null){stopDemo();return;}
  if(current>=sourceSlides.length-1)render(0);
  demo.setAttribute("aria-pressed","true");
  demo.textContent="Ⅱ Dừng demo";
  demoTimer=window.setInterval(()=>{
   if(current>=sourceSlides.length-1){stopDemo();return;}
   render(current+1);
  },4500);
 });
 document.addEventListener("keydown",event=>{
  if(!root.classList.contains("is-open"))return;
  if(event.key==="Escape"){event.preventDefault();close();return;}
  if(["ArrowRight","PageDown"," "].includes(event.key)){event.preventDefault();move(1);}
  else if(["ArrowLeft","PageUp"].includes(event.key)){event.preventDefault();move(-1);}
  else if(event.key==="Home"){stopDemo();render(0);}
  else if(event.key==="End"){stopDemo();render(sourceSlides.length-1);}
 });
 // No speaker notes or private details are collected or rendered.
})();
