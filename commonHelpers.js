import{a as u,S as d,i as p}from"./assets/vendor-89feecc5.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const n of t.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function o(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(e){if(e.ep)return;e.ep=!0;const t=o(e);fetch(e.href,t)}})();u.create({baseUrl:"https://pixabay.com/api/?",params:{apiKey:"41838849-75d2e43a80bdb544c2e4afc3a",lenguage:"en"}});const m=document.querySelector(".form"),i=document.querySelector(".gallery");document.querySelector('button[data-action="load-more"]');const f=document.querySelector(".loader"),l={key:API_KEY,q:"",image_type:"photo",orientation:"horizontal",safesearch:!0},y=new d(".gallery a",{captionsData:"alt",captionDelay:250,close:!0,enableKeyboard:!0,docClose:!0}),c=a=>{f.style.display=a?"block":"none"};m.addEventListener("submit",async a=>{if(a.preventDefault(),c(!0),l.q=encodeURIComponent(a.target.elements.search.value.trim()),l.q===""){console.error("Please enter a valid search query.");return}const r=new URLSearchParams(l);await g(r),a.currentTarget.reset()});const g=async a=>{c(!0);try{const r=await u.get(BASE_URL+`${a}`),{hits:o}=r.data;i.innerHTML="",o.length===0?p.error({position:"topRight",messageColor:"#FFFFFF",backgroundColor:"#EF4040",titleSize:"8px",closeOnEscape:!0,message:"Sorry, there are no images matching your search query. Please try again!"}):(i.innerHTML=o.reduce((s,e)=>s+`
                  <li class="gallery-item">
                      <a href=${e.largeImageURL}> 
                          <img class="gallery-img" src=${e.webformatURL} alt=${e.tags}/>
                      </a>
                      <div class="gallery-text-box">
                          <p>Likes: <span class="text-value">${e.likes}</span></p>
                          <p>Views: <span class="text-value">${e.views}</span></p>
                          <p>Comments: <span class="text-value">${e.comments}</span></p>
                          <p>Downloads: <span class="text-value">${e.downloads}</span></p>
                      </div>
                  </li>
              `,""),y.refresh())}catch(r){console.error(r.message)}finally{c(!1)}};
//# sourceMappingURL=commonHelpers.js.map
