// 联系我按钮：复制页面上显示的微信号
// 不用系统 alert（手机浏览器里经常弹不出来），改成页面里的提示条
function copyWechat() {
  const num = document.getElementById("wechat").textContent.trim();
  const done = () => showToast("微信号已复制：" + num);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(num).then(done).catch(() => { fallbackCopy(num); done(); });
  } else { fallbackCopy(num); done(); }
}
function fallbackCopy(text) {
  try {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    document.execCommand("copy"); ta.remove();
  } catch (e) {}
}
let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById("copy-toast");
  if (!t) { alert(msg); return; }
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

// ===== 提示音：滑动到新卡片 / 点开卡片时响一声（无静音按钮） =====
// 浏览器规定：声音要等用户先点一下页面才能播放，
// 所以第一次点之前滑动是静音的，点过一次之后滑动和点开都会响
let sfxCtx = null, lastBlipT = 0;
function sfxUnlock() {
  if (!sfxCtx) { try { sfxCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; } }
  if (sfxCtx.state === "suspended") sfxCtx.resume();
}
["pointerdown", "touchstart", "keydown"].forEach(ev => document.addEventListener(ev, sfxUnlock));
function blip(f1, f2, dur) {
  if (!sfxCtx || sfxCtx.state !== "running") return;
  const d = dur || 0.09, t = sfxCtx.currentTime;
  const o = sfxCtx.createOscillator(), g = sfxCtx.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(f1, t);
  o.frequency.exponentialRampToValueAtTime(f2, t + d);
  g.gain.setValueAtTime(0.05, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + d);
  o.connect(g); g.connect(sfxCtx.destination);
  o.start(t); o.stop(t + d + 0.02);
}
function blipThrottled(f1, f2) {
  const now = performance.now();
  if (now - lastBlipT < 150) return;
  lastBlipT = now;
  blip(f1, f2);
}

// ===== 项目详情弹窗 =====
const projects = [
  { ico:"📱", title:"微信小程序开发",
    intro:"从需求梳理、界面设计到开发上线，提供微信小程序的一站式定制服务。",
    list:["商城、预约、工具类等各类小程序","微信登录、支付、订阅消息对接","后台管理系统与数据统计","上线审核协助与后期维护"],
    scene:"线下门店线上化、预约报名、会员积分、内部工具等。" },
  { ico:"💻", title:"软件开发",
    intro:"根据实际业务定制桌面软件与管理系统，注重运行稳定和数据安全。",
    list:["Windows 桌面软件与各类小工具","进销存、订单、客户等管理系统","数据导入导出、报表与自动化处理","源码交付与使用培训"],
    scene:"企业内部管理、重复性工作自动化、专用行业工具。" },
  { ico:"🧑‍💻", title:"AI部署",
    intro:"基于 微信部署AI介入，本地部署大模型，直播换脸方案，适配常见直播平台与环境。",
    list:["微信本地部署AI介入","直播换脸与多平台兼容","设备环境搭建与效果调试","AI使用教学与问题答疑"],
    scene:"影视特效创作、短视频内容制作、虚拟形象直播、技术研究与学习。",
    note:"仅限使用本人或已获得明确授权的肖像，严禁用于冒充他人、诈骗或其他违法用途。" },
  { ico:"📍", title:"Android + iPhone 定位",
    intro:"面向安卓与苹果设备的定位与轨迹管理方案，支持实时查看位置与历史轨迹。",
    list:["Android、iPhone 双平台支持","实时位置与历史轨迹记录","家人关怀与企业设备管理","安装配置与使用指导"],
    scene:"家人互相报平安、老人儿童安全、企业外勤与设备管理。",
    note:"必须取得被定位人的知情与同意，不得用于未经许可的跟踪或监控。" },
  { ico:"🌐", title:"网页搭建",
    intro:"制作响应式网站，电脑和手机都能良好显示，风格可按品牌定制。",
    list:["企业官网与产品展示站","个人主页与作品集","手机端自适应与加载优化","域名、部署上线协助"],
    scene:"企业形象展示、个人品牌、活动宣传页面。" },
  { ico:"🧊", title:"苹果软件多开",
    intro:"在一台苹果设备上同时运行同一应用的多个账号，并提供集中管理方案。",
    list:["多账号并行运行与切换","账号数据相互独立","环境配置与稳定性调优","安装指导与售后答疑"],
    scene:"需要同时管理多个工作号或测试号的个人与团队。",
    note:"请遵守相关平台的服务条款，因违规使用产生的后果由使用者自行承担。" },
  { ico:"🐉", title:"Kali Linux",
    intro:"围绕 Kali Linux 开展网络安全教学，从环境搭建到实战入狱，循序渐进。",
    list:["Kali 环境安装与常用工具","渗透测试流程与漏洞挖掘思路","安全攻防靶场实战","从入门到进阶的学习路线"],
    scene:"想系统入门网络安全、准备做安全测试或参加 CTF 的学习者。",
    note:"所有教学与练习仅限在自己搭建的靶场或获得授权的环境中进行，严禁攻击未授权目标。" },
  { ico:"⚙️", title:"更多定制开发",
    intro:"以上没有涵盖的需求，也可以单独沟通，评估可行性后量身开发。",
    list:["脚本、自动化与数据处理","App、网站、小程序组合方案","现有项目的修改与功能扩展","按需求提供合适的技术方案"],
    scene:"有明确想法但不知道怎么实现的个人和团队。" }
];

const modal = document.getElementById("modal");
const $ = id => document.getElementById(id);
function openModal(i) {
  const p = projects[i];
  $("m-ico").textContent = p.ico;
  $("m-title").textContent = p.title;
  $("m-intro").textContent = p.intro;
  $("m-list").innerHTML = p.list.map(t => "<li>" + t + "</li>").join("");
  $("m-scene").textContent = p.scene;
  $("m-note").textContent = p.note ? "⚠ " + p.note : "";
  $("m-note").style.display = p.note ? "block" : "none";
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  document.querySelectorAll(".modal.open").forEach(m => { m.classList.remove("open"); m.setAttribute("aria-hidden", "true"); });
  document.body.style.overflow = "";
}
document.querySelectorAll(".card[data-i]").forEach(c => {
  c.addEventListener("click", e => {
    blip(660, 990);
    const r = c.getBoundingClientRect(), d = document.createElement("span");
    d.className = "ripple"; d.style.left = (e.clientX - r.left || r.width / 2) + "px"; d.style.top = (e.clientY - r.top || r.height / 2) + "px";
    c.appendChild(d); c.classList.add("flash");
    setTimeout(() => { d.remove(); c.classList.remove("flash"); }, 760);
    setTimeout(() => openModal(+c.dataset.i), 220);
  });
  c.addEventListener("keydown", e => { if (e.key === "Enter") { blip(660, 990); openModal(+c.dataset.i); } });
});
document.querySelectorAll(".modal").forEach(m => m.addEventListener("click", e => { if (e.target === m) closeModal(); }));
document.querySelectorAll(".modal-x").forEach(b => b.addEventListener("click", closeModal));
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

// ===== 工具详情 =====
const tools = [
  { use:"微软出品的免费代码编辑器，轻量、启动快，几乎能写所有语言。", list:["插件丰富：代码格式化、智能提示、主题等一键安装","内置终端和调试器，写完直接运行","自带 Git 支持，可查看改动和提交","我用它写网页、Node.js 和日常脚本"] },
  { use:"JetBrains 出品的 Python 专用开发环境。", list:["智能补全和代码检查，能提前发现错误","方便地管理虚拟环境和第三方库","强大的调试器与单元测试支持","支持 Django、Flask 等 Web 框架"] },
  { use:"谷歌官方的 Android 应用开发工具。", list:["自带模拟器，不接手机也能测试","可视化布局编辑器，方便设计界面","集成 Gradle 构建和性能分析","主要使用 Kotlin 与 Java 开发"] },
  { use:"苹果官方的 iOS / macOS 应用开发工具，需在 Mac 上使用。", list:["使用 Swift 和 SwiftUI 开发 iPhone 应用","iPhone 模拟器与真机调试","打包签名并提交 App Store 上架","界面预览和性能检测工具齐全"] },
  { use:"语法简洁、上手快的通用编程语言。", list:["适合写自动化脚本和数据处理","可开发 Web 后端接口","是 AI 和机器学习领域的主流语言","许多安全测试工具也用它编写"] },
  { use:"让 JavaScript 运行在服务器端的运行环境。", list:["用来写后端接口和服务","通过 npm 使用大量现成的开源库","前端项目的构建和打包也依赖它","小程序云开发、工具链常会用到"] },
  { use:"分布式版本控制工具，记录代码的每一次修改。", list:["随时回退到任意历史版本","分支功能方便同时开发多个功能","多人协作时合并彼此的修改","搭配 GitHub 备份代码"] },
  { use:"全球最大的代码托管与协作平台。", list:["存放项目代码，自带历史记录","通过 Issues 和 Pull Request 协作","GitHub Pages 可免费托管网站，本站就部署在这里","也是学习开源项目的好地方"] },
  { use:"把应用和运行环境打包成容器的工具。", list:["环境一致，避免“在我电脑上能跑”的问题","一条命令即可启动数据库、服务等组件","方便快速搭建和销毁测试环境","常用于部署项目和搭建安全靶场"] },
  { use:"常用的关系型数据库，用 SQL 语句存取数据。", list:["存放用户、订单等结构化数据","支持复杂查询、索引和事务","小程序后台和管理系统常用","需要定期备份并设置访问权限"] },
  { use:"腾讯官方的微信小程序开发工具。", list:["编写代码并实时预览效果","真机调试，直接在手机上测试","支持云开发（云函数、云数据库）","一键上传代码，提交审核和发布"] },
  { use:"用来测试和调试 API 接口的工具。", list:["发送各类请求并查看返回结果","把常用接口保存成集合，方便复用","支持环境变量和自动化测试","联调小程序和后端接口时很好用"] },
  { use:"预装数百种安全工具的 Linux 发行版，面向安全测试与学习。", list:["内置扫描、抓包、密码审计等常用工具","常装在虚拟机或专用设备上使用","是学习网络安全的从入门到入狱必备系统","我的 Kali Linux 教学也基于它"], note:"请只在自己的设备、靶场或已获书面授权的环境中使用，严禁攻击未授权目标。" },
  { use:"Web 应用安全测试平台，通过代理拦截和修改网页请求。", list:["拦截并查看浏览器与服务器之间的数据","手动修改请求，测试网站是否存在漏洞","内置扫描和重放功能","常用于 Web 安全学习和授权测试"], note:"仅限测试自己的网站或已获授权的目标。" },
  { use:"开源的网络扫描工具。", list:["发现网络中在线的设备","探测开放的端口和运行的服务","识别服务版本，辅助排查安全风险","用于网络资产自查和安全学习"], note:"只扫描自己的网络或已获授权的目标。" },
  { use:"最常用的网络抓包与协议分析工具。", list:["捕获网络中的数据包并逐层解析","过滤并追踪某次连接的完整过程","排查网络卡顿、连接失败等问题","用来学习 TCP、HTTP 等协议原理"], note:"请只抓取自己网络中的流量，注意保护他人隐私。" }
];
const tmodal = $("tmodal");
function openTool(el) {
  const t = tools[+el.dataset.t];
  $("t-ico").innerHTML = el.querySelector("b").outerHTML;
  $("t-title").textContent = el.textContent.trim();
  $("t-use").textContent = t.use;
  $("t-list").innerHTML = t.list.map(x => "<li>" + x + "</li>").join("");
  $("t-note").textContent = t.note ? "⚠ " + t.note : "";
  $("t-note").style.display = t.note ? "block" : "none";
  tmodal.classList.add("open"); tmodal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
document.querySelectorAll(".tool").forEach(el => {
  el.addEventListener("click", () => openTool(el));
  el.addEventListener("keydown", e => { if (e.key === "Enter") openTool(el); });
});

// ===== 背景音乐 =====
// 浏览器禁止网页一打开就自动出声，所以：先尝试自动播放，
// 被拦截就在用户第一次点击/触摸页面时开始播放。
const bgm = $("bgm"), btn = $("music-btn");
let playing = false, userPaused = false, synth = null;

function setUI(on) { playing = on; btn.classList.toggle("on", on); btn.classList.toggle("off", !on); }

function startSynth() {           // 没有 audio/bg.mp3 时的备用：合成轻柔氛围音
  if (synth) { synth.ctx.resume(); return; }
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const master = ctx.createGain(); master.gain.value = 0.07; master.connect(ctx.destination);
  [110, 164.8, 220, 261.6, 329.6].forEach((f, k) => {
    const o = ctx.createOscillator(), g = ctx.createGain(), l = ctx.createOscillator(), lg = ctx.createGain();
    o.type = "sine"; o.frequency.value = f; g.gain.value = 0.5;
    l.frequency.value = 0.07 + k * 0.03; lg.gain.value = 0.35; l.connect(lg); lg.connect(g.gain);
    o.connect(g); g.connect(master); o.start(); l.start();
  });
  synth = { ctx, master };
}

function play() {
  bgm.volume = 0.4;
  return bgm.play().then(() => setUI(true)).catch(err => {
    if (err && err.name === "NotAllowedError") throw err;   // 被拦截，等用户操作
    startSynth(); setUI(true);
  });
}
function pause() { bgm.pause(); if (synth) synth.ctx.suspend(); setUI(false); }

bgm.addEventListener("error", () => { if (!userPaused) { startSynth(); setUI(true); } });

btn.addEventListener("click", e => {
  e.stopPropagation();
  if (playing) { userPaused = true; pause(); }
  else { userPaused = false; synth ? (synth.ctx.resume(), setUI(true)) : play().catch(() => {}); }
});

setUI(false);
play().catch(() => {
  const kick = () => {
    if (synth && !userPaused) synth.ctx.resume();
    else if (!userPaused && !playing) play().catch(() => {});
    ["pointerdown", "touchend", "keydown"].forEach(t => document.removeEventListener(t, kick));
  };
  ["pointerdown", "touchend", "keydown"].forEach(t => document.addEventListener(t, kick));
});

// ===== 触摸/点击粒子火花轨迹 =====
(function () {
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cv = document.createElement("canvas");
  cv.style.cssText = "position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:3000";
  document.body.appendChild(cv);
  const ctx = cv.getContext("2d"), dpr = window.devicePixelRatio || 1;
  let W = 0, H = 0, ps = [], running = false, lastTouch = 0;
  const COLORS = ["#ffffff", "#00d4ff", "#2e7bff"];
  const pick = () => { const r = Math.random(); return r < 0.3 ? COLORS[0] : r < 0.65 ? COLORS[1] : COLORS[2]; };
  function resize() {
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize(); addEventListener("resize", resize);

  function add(x, y, n, burst) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, v = burst ? 1 + Math.random() * 3 : Math.random() * 1.6;
      ps.push({ x, y, vx: burst ? Math.cos(a) * v : (Math.random() - 0.5) * 1.6, vy: burst ? Math.sin(a) * v : (Math.random() - 0.5) * 1.6 + 0.3,
        t: performance.now(), l: burst ? 700 + Math.random() * 400 : 600 + Math.random() * 400, s: (burst ? 1.5 : 1.2) + Math.random() * 2.3, c: pick() });
    }
    if (ps.length > 320) ps.splice(0, ps.length - 320);
    if (!running) { running = true; requestAnimationFrame(frame); }
  }
  function frame() {
    const t = performance.now();
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    ps = ps.filter(p => t - p.t < p.l);
    ps.forEach(p => {
      const k = 1 - (t - p.t) / p.l;
      p.x += p.vx; p.y += p.vy; p.vx *= 0.97; p.vy *= 0.97;
      ctx.globalAlpha = k; ctx.shadowColor = p.c; ctx.shadowBlur = 14; ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.283); ctx.fill();
    });
    ctx.globalAlpha = 1; ctx.shadowBlur = 0; ctx.globalCompositeOperation = "source-over";
    if (ps.length) requestAnimationFrame(frame); else { running = false; ctx.clearRect(0, 0, W, H); }
  }
  const opt = { passive: true };
  // 触屏：touchmove 在页面滚动时也会触发，所以滑动轨迹不会中断
  document.addEventListener("touchstart", e => { lastTouch = Date.now(); const p = e.touches[0]; add(p.clientX, p.clientY, 26, true); }, opt);
  document.addEventListener("touchmove", e => { lastTouch = Date.now(); const p = e.touches[0]; add(p.clientX, p.clientY, 3, false); }, opt);
  // 鼠标（忽略触摸后系统补发的鼠标事件）
  document.addEventListener("mousedown", e => { if (Date.now() - lastTouch > 800) add(e.clientX, e.clientY, 26, true); }, opt);
  document.addEventListener("mousemove", e => { if (Date.now() - lastTouch > 800) add(e.clientX, e.clientY, 3, false); }, opt);
})();


// ===== 点赞功能（每人每天可点一次）=====
// 👉 想改点赞数，只改下面这个数字，保存上传即可
const LIKE_BASE = 3089;
// 👉 全网统计（Supabase）：把下面两项填好即可；留空则只在本机计数
const SUPABASE_URL = "https://lxlxpxdzfnothnshfqht.supabase.co";   // 例如 https://xxxx.supabase.co
const SUPABASE_KEY = "sb_publishable_GQca5ruj4r-uOuP5ciPwGA_5uI0yLrk";   // 填 anon / publishable 公开密钥，绝对不要填 service_role / secret 密钥
(function () {
  const KEY = "sy_like_v2";
  const btn = document.getElementById("like-btn"), num = document.getElementById("like-num"), tip = document.getElementById("like-tip");
  if (!btn) return;
  // 点赞就比心：点一下赞，演讲人物比个心（每次点都比心，哪怕今天已经点过）
  const presenterImg = document.getElementById("presenter-img");
  const heartPre = new Image();
  heartPre.src = "img/presenter-heart.GIF?v=37";
  let hearting = false;
  function showHeart() {
    if (!presenterImg || hearting) return;
    hearting = true;
    presenterImg.src = "img/presenter-heart.GIF?v=37";
    setTimeout(() => {
      presenterImg.src = "img/presenter.GIF?v=37";
      hearting = false;
    }, 1500);
  }
  const today = () => { const d = new Date(), p = n => String(n).padStart(2, "0"); return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()); };
  let data = { date: "", total: 0 };          // date：最近一次点赞的日期；total：这个浏览器累计点了几次
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) data = JSON.parse(raw);
    else if (localStorage.getItem("sy_liked_v1") === "1") data = { date: "", total: 1 };   // 兼容旧版本
  } catch (e) {}
  let serverTotal = null;
  const useServer = !!(SUPABASE_URL && SUPABASE_KEY);
  function rpc(name) {
    const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 6000);
    const headers = { "Content-Type": "application/json", apikey: SUPABASE_KEY };
    if (SUPABASE_KEY.startsWith("eyJ")) headers.Authorization = "Bearer " + SUPABASE_KEY;
    return fetch(SUPABASE_URL.replace(/\/$/, "") + "/rest/v1/rpc/" + name, { method: "POST", headers, body: "{}", signal: ctl.signal })
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(v => Number(v))
      .finally(() => clearTimeout(timer));
  }
  const heart = '<svg viewBox="0 0 24 24" width="SZ" height="SZ"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
  const likedToday = () => data.date === today();
  const show = () => {
    const on = likedToday();
    num.textContent = (LIKE_BASE + (serverTotal !== null ? serverTotal : data.total)).toLocaleString();
    btn.classList.toggle("liked", on);
    tip.classList.toggle("on", on);
    tip.textContent = on ? "今天已点赞，谢谢支持！" : "点个赞支持一下吧！";
  };
  function effects() {
    const r = btn.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const add = (el, ms) => { document.body.appendChild(el); setTimeout(() => el.remove(), ms); };
    const ring = document.createElement("div"); ring.className = "fx-ring"; ring.style.left = cx + "px"; ring.style.top = cy + "px"; add(ring, 900);
    const plus = document.createElement("div"); plus.className = "fx-plus"; plus.textContent = "+1"; plus.style.left = cx + "px"; plus.style.top = cy + "px"; add(plus, 1300);
    for (let i = 0; i < 12; i++) {
      const h = document.createElement("div"), sz = 12 + Math.random() * 14;
      h.className = "fx-heart"; h.innerHTML = heart.replace(/SZ/g, sz | 0);
      h.style.left = cx + "px"; h.style.top = cy + "px";
      h.style.setProperty("--dx", (Math.random() - 0.5) * 150 + "px");
      h.style.setProperty("--dy", 50 + Math.random() * 110 + "px");
      h.style.setProperty("--r", (Math.random() - 0.5) * 60 + "deg");
      h.style.animationDelay = Math.random() * 0.2 + "s";
      add(h, 1500);
    }
  }
  btn.addEventListener("click", () => {
    showHeart();
    if (likedToday()) {                // 今天点过了：只提示，不再加 1
      btn.classList.remove("shake"); void btn.offsetWidth; btn.classList.add("shake");
      tip.textContent = "今天已经点过赞啦，明天再来哦！"; return;
    }
    data = { date: today(), total: data.total + 1 };
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
    if (serverTotal !== null) serverTotal += 1;          // 先立刻显示 +1
    show();
    btn.classList.remove("pop"); void btn.offsetWidth; btn.classList.add("pop");
    effects();
    if (useServer) rpc("increment_likes").then(v => { serverTotal = v; show(); }).catch(() => {});
  });
  show();
  if (useServer) rpc("get_likes").then(v => { serverTotal = v; show(); }).catch(() => {});
})();


// ===== 虚拟留言（可以随便改）=====
// 格式："昵称：内容"（中文冒号）。第 1 条固定最先飘出，其余顺序、数量随意增删。
// 这些只是写在代码里的装饰留言，和访客真实留的混在一起轮流飘。
const FAKE_MESSAGES = [
  "孙思宇：必须占楼，你们快跟上",
  "小李：卧槽我这手速 牛逼牛逼！",
  "你王哥哥：有点酷 ♥",
  "alex：这个背景音乐有点舒服了哦",
  "陈：科技感拉满",
  "路人：路过打卡",
  "夜猫子：深夜刷到，被音乐治愈",
  "你猜：qq空间嘛，",
  "杰：从入门到入狱哈哈",
  "星辰：这个火花特效是怎么做的？",
  "Luna：夯爆了",
  "老张：赞",
  "你猜嘛：点赞+1，",
  "monkey：👍🏻👍🏻👍🏻",
  "我是嫩d：哈哈哈",
  "晚风：晚安，今天也要加油",
  "小鱼：弹幕飘上来太好玩了",
  "Tom：Nice site!",
  "阿凯：细节满分",
  "青柠：打卡留名～",
  "Neo：Kali 笑死了从入门到入狱",
  "子墨：下次再来",
  "小野：这音乐适合写代码",
  "Echo：每天来点个赞",
  "阿远：挺快的",
  "麦芽糖：哇，爱心特效好可爱",
  "Ryan：Clean design, love it",
  "小北：页面很紧凑，不浪费空间",
  "南风：手机上看也没问题",
  "白开水：路过，留个脚印",
  "Sam：玩了半天特效",
  "木子：思宇加油！",
  "大白：看着很专业",
  "Cindy：喜欢这个蓝色调",
  "阿宏：小程序那块我想了解下",
  "飞鱼：留言区好有意思",
  "Jason：点赞已完成 ✓",
  "初夏：好安静的音乐",
  "老K：科技风我可以",
  "小柒：来了来了",
  "Zoe：Love the particle effects",
  "阿辉：滑动的时候有光点，惊喜",
  "墨墨：打卡第一天",
  "云朵：配上这音乐，困了",
  "Leo：网站做得很用心",
  "阿泽：今天也是元气满满的一天",
  "小优：路过，顺手点赞",
  "Max：这个主页比我的强多了哈哈",
  "小七：弹幕往上飘，设计巧妙",
  "夏天：感觉整个人都平静了",
  "Bob：Keep it up!",
  "阿宁：头像和主题很搭",
  "小满：蹲一个更新",
  "pixel：细节处理得好",
  "Eric：Great job",
  "一一：留言留言～",
  "山雀：来看看大佬的主页",
  "小周：点了赞，希望越来越好",
  "Anna：So cool!",
  "阿鹏：深夜写代码听这个正合适",
  "小豆：我也想做个这样的网站",
  "Henry：Smooth animations",
  "柚子：爱心飘起来的时候好治愈",
  "老陈：加油，期待更多项目",
  "Olivia：Beautiful colors",
  "阿锋：留个言，混个脸熟",
  "小鹿：好看好听！",
  "Alan：今天第一次来，很惊喜",
  "绵绵：背景音乐叫什么呀",
  "Jack：Respect!",
  "小川：页面一点都不卡",
  "糖糖：刷到就是缘分，打卡",
  "阿力：技术栈挺全的",
  "Ivy：Nice vibes",
  "夜航：愿代码无 bug",
  "小雨：路过，留下一句加油",
  "Chris：Awesome page",
  "阿凯凯：点赞点赞点赞",
  "梨子：这个蓝色发光好有科技感",
  "Will：Bookmarked!",
  "小鱼干：来晚了，沙发被占了",
  "Daniel：Love the music",
  "清风：留言墙很有创意",
  "阿旭：每天打卡 +1",
  "Lily：Can't stop clicking the sparks",
  "小桔：好治愈的主页",
  "老李：支持一下",
  "Andy：Smart layout",
  "若水：安静地路过，留下祝福",
  "阿豪：一看就是用心做的",
  "Kate：So smooth on my phone",
  "小宇：祝主页越来越好",
  "Peter：Cheers!",
  "星河：这个星空蓝我爱了",
  "小马：占个楼，下次再来",
  "Emma：Super cute hearts",
  "阿杰杰：好玩，再点一次赞",
  "云端：夜深了，晚安",
  "Joe：Thanks for sharing",
  "小宇宙：祝你一切顺利！"
];

// ===== 头像左侧：向上飘的留言 =====
(function () {
  const strip = document.getElementById("gb-strip");
  if (!strip) return;
  const $g = id => document.getElementById(id);
  const gm = $g("gbmodal"), nameEl = $g("gb-name"), textEl = $g("gb-text"), cntEl = $g("gb-cnt"), sendBtn = $g("gb-send"), msgEl = $g("gb-msg");
  const useServer = !!(SUPABASE_URL && SUPABASE_KEY);
  const PALETTE = [["#7ee6ff", "#00d4ff"], ["#ff9cc0", "#ff4d8d"], ["#ffe08a", "#ffd246"], ["#8ff0c0", "#46e696"], ["#c9a8ff", "#a259ff"]];
  const SPEED = 34, GAP = 8, COOLDOWN = 30000, KEY = "sy_gb_last";
  let uid = 0, real = [], queue = [], qi = 0, nextAt = 0, visible = true, priority = [];
  const active = new Set();

  const parse = s => { const i = s.indexOf("："); return i > 0 ? { name: s.slice(0, i), content: s.slice(i + 1) } : { name: "访客", content: s }; };
  const virtual = FAKE_MESSAGES.map(s => Object.assign(parse(s), { id: ++uid }));
  function rebuild() {                      // 第 1 条置顶，其余：每 1 条真实留言配 3 条虚拟留言轮流
    const q = [virtual[0]], rest = virtual.slice(1);
    let ri = 0, vi = 0;
    while (ri < real.length || vi < rest.length) {
      if (ri < real.length) q.push(real[ri++]);
      for (let k = 0; k < 3 && vi < rest.length; k++) q.push(rest[vi++]);
    }
    queue = q; if (qi >= queue.length) qi = 0;
  }
  rebuild();

  function rpc(name, args) {
    const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 8000);
    const headers = { "Content-Type": "application/json", apikey: SUPABASE_KEY };
    if (SUPABASE_KEY.startsWith("eyJ")) headers.Authorization = "Bearer " + SUPABASE_KEY;
    return fetch(SUPABASE_URL.replace(/\/$/, "") + "/rest/v1/rpc/" + name, { method: "POST", headers, body: JSON.stringify(args || {}), signal: ctl.signal })
      .then(r => r.json().catch(() => null).then(j => { if (!r.ok) throw new Error((j && j.message) || r.status); return j; }))
      .finally(() => clearTimeout(timer));
  }
  const clean = s => s.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  const say = (t, ok) => { msgEl.textContent = t; msgEl.className = "gb-msg" + (ok ? " ok" : ""); };

  function spawn(m, mine) {
    const now = performance.now();
    if (now < nextAt) return false;
    const col = PALETTE[m.id % PALETTE.length], el = document.createElement("span");
    el.className = "gb-m" + (mine ? " mine" : "");
    el.textContent = m.name + "：" + m.content;                 // textContent：留言里的代码不会被执行
    el.style.color = col[0]; el.style.borderColor = col[1];
    el.style.boxShadow = "0 0 " + (mine ? 16 : 8) + "px " + col[1] + "88";
    strip.appendChild(el);
    const w = el.offsetWidth, h = el.offsetHeight, dist = strip.clientHeight + h;
    el.style.left = Math.round(Math.random() * Math.max(0, (strip.clientWidth - w - 6) * 0.85)) + "px";   // 横向随机，飘过整个区域
    el.style.setProperty("--dist", dist + "px");
    el.style.animationDuration = dist / SPEED + "s";
    nextAt = now + (h + GAP) / SPEED * 1000;                    // 前一条上移够远，下一条才出来，避免重叠
    active.add(m.id);
    el.addEventListener("animationend", () => { el.remove(); active.delete(m.id); });
    return true;
  }
  setInterval(() => {
    if (!visible || document.hidden) return;
    if (priority.length) { if (spawn(priority[0], true)) priority.shift(); return; }
    for (let k = 0; k < queue.length; k++) {
      const m = queue[(qi + k) % queue.length];
      if (active.has(m.id)) continue;
      if (spawn(m, false)) qi = (qi + k + 1) % queue.length;
      return;
    }
  }, 300);
  if ("IntersectionObserver" in window) new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(strip);

  // 写留言弹窗
  $g("gb-open").addEventListener("click", () => {
    gm.classList.add("open"); gm.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden";
    say("发送后你的留言会飘上屏幕 · 每 30 秒可发一条");
    setTimeout(() => textEl.focus(), 250);
  });
  document.querySelector(".gb-cancel").addEventListener("click", closeModal);
  textEl.addEventListener("input", () => { cntEl.textContent = textEl.value.length; });
  textEl.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } });
  sendBtn.addEventListener("click", send);

  async function send() {
    if (!useServer) return say("留言功能暂未开启");
    const content = clean(textEl.value).slice(0, 40), name = clean(nameEl.value).slice(0, 12) || "匿名访客";
    if (!content) return say("先写点什么吧～");
    let last = 0; try { last = +localStorage.getItem(KEY) || 0; } catch (e) {}
    const wait = COOLDOWN - (Date.now() - last);
    if (wait > 0) return say("发太快啦，请 " + Math.ceil(wait / 1000) + " 秒后再试");
    sendBtn.disabled = true;
    try {
      await rpc("post_message", { p_name: name, p_content: content });
      try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {}
      const m = { id: ++uid, name, content };
      real.unshift(m); rebuild();
      priority.push(m);                                           // 自己的留言优先飘出
      textEl.value = ""; cntEl.textContent = "0";
      closeModal();
    } catch (e) {
      say(String(e.message) === "busy" ? "留言太多啦，稍后再来～" : "发送失败，请稍后再试");
    }
    sendBtn.disabled = false;
  }

  if (useServer) rpc("get_messages", { p_limit: 80 }).then(rows => {
    real = (rows || []).map(r => ({ id: ++uid, name: r.name, content: r.content }));
    rebuild();
    if (qi <= 2) qi = 1;                                          // 刚进页面时，让真实留言尽快飘出来
  }).catch(() => {});
})();


// 提示音：没有铃铛按钮了；卡片转到正面 / 点开时响一声（浏览器要先点一下页面才能出声）。

// ===== 螺旋圆柱：卡片围着彩色线，滚动时依次转到正面 =====
// 原理：每张卡片固定一个基础角度，滚动进度决定圆柱整体旋转角度；
// 卡片上下位置由“展开角度”决定（绕几圈都不会重叠），
// 角度越靠近正面越居中，转到背面的卡片渐隐（配合 backface-visibility 不会看到反面文字）。
// 项目 8 张 + 标题方块 + 工具 16 张在同一条链上，
// 更多定制开发下面直接就是“我会用到的工具”，再往下是工具方块。
// 每张卡片一种颜色；一块画布跟在卡片后面画彩色连线 + 彩色粒子。
// 整条链绕 6 圈（HELIX_TURNS），像弹簧一样一圈一圈往上爬；圈数多、每步转角大，连线左右振荡成弹簧形，卡片贴在弹簧线上走。
const HELIX_COLORS = ["#00d4ff", "#ff4d8d", "#a259ff", "#46e696", "#ffd246", "#ff6c37", "#2e7bff", "#ff5c5c"];
// 一圈一圈往上爬：整条链绕 2 圈（原来 1 圈），相邻两卡角度差翻倍，
// 左右摆动更大，像龙盘在柱子上一圈一圈往上爬
const HELIX_TURNS = 6;
function initHelix(wrapId, helixId, cardSel, perCardVh) {
  const wrap = document.getElementById(wrapId);
  const helix = document.getElementById(helixId);
  if (!wrap || !helix) return null;
  const cards = Array.from(helix.querySelectorAll(cardSel));
  const N = cards.length;
  if (!N) return null;
  const step = (HELIX_TURNS * 360) / N;
  wrap.style.height = (N * (perCardVh || 70)) + "vh";
  // 每张卡片一种颜色
  cards.forEach((c, i) => c.style.setProperty("--ac", HELIX_COLORS[i % HELIX_COLORS.length]));
  let R = 320, V = 1000, spacing = 250, maxH = 250, frontIdx = -1, firstRun = true;
  function measure() {
    const w = window.innerWidth;
    R = w < 600 ? 85 : Math.min(w * 0.22, 240);
    // 同一条链里的卡片等高、间距一致：先恢复自然高度，
    // 量出最高的卡片，再把所有卡片拉成等高，
    // 间距 = 卡片高 + 20px 空隙，分开一点，不重合也不离太远
    cards.forEach(c => { c.style.height = ""; c.style.marginTop = ""; });
    maxH = 0;
    cards.forEach(c => { maxH = Math.max(maxH, c.offsetHeight); });
    if (maxH > 50) {
      cards.forEach(c => { c.style.height = maxH + "px"; c.style.marginTop = (-maxH / 2) + "px"; });
      spacing = maxH + 12;
    } else {
      spacing = w < 600 ? 220 : 250;
    }
    // 卡片上下位置由“展开角度”决定（不是取模后的角度），
    // 这样绕 2 圈时两圈的卡片不会重叠；相邻两卡垂直间距仍 = spacing
    V = (N * spacing) / (2 * HELIX_TURNS);
  }

  function update() {
    const rect = wrap.getBoundingClientRect();
    const total = Math.max(1, rect.height - window.innerHeight);
    const p = Math.min(1, Math.max(0, -rect.top / total));
    const rot = p * (N - 1) * step;
    // 直接紧凑：整条链往两边收——开头第一张、结尾最后一张各留 120px 呼吸感，
    // 正面卡片不顶到屏边、不会被导航挡住，中间回到正中，不加重复卡
    const yOff = (((window.innerHeight - maxH) / 2) - 120) * (2 * p - 1);
    let best = -1, bestF = -2;
    cards.forEach((c, i) => {
      const u = i * step - rot;                        // 展开角度（不取模）：决定上下位置
      let a = u % 360;                                 // 绕回一圈内的角度：决定朝向和明暗
      if (a > 180) a -= 360;
      if (a < -180) a += 360;
      const f = Math.cos(a * Math.PI / 180);          // 1 = 正面，-1 = 背面
      const y = (u / 180) * V + yOff;
      const s = 0.82 + 0.18 * Math.max(0, f);
      // 全部清楚显示在弹簧线上：不要模糊滤镜（模糊会让其他卡片看不见、只剩一张），
      // 透明度下限 0.75（背面也看得清），正面最亮 1.0 + 发光，全部卡片都贴在线上
      const o = Math.max(0.75, Math.min(1, 0.875 + 0.125 * f));
      // 卡片不再侧转消失：位置直接走弹簧（横向 x = R*sin(a)，纵向 y），
      // 只留 25% 的小倾斜（最大 45°，正面可读、不侧成一条线），全部卡片都看得见
      const x = R * Math.sin(a * Math.PI / 180);
      c.style.transform = "translateX(" + x.toFixed(1) + "px) translateY(" + y.toFixed(1) + "px) rotateY(" + (a * 0.25).toFixed(1) + "deg) scale(" + s.toFixed(3) + ")";
      c.style.opacity = o.toFixed(2);
      c.style.filter = "";
      if (f > bestF) { bestF = f; best = i; }
    });
    if (best !== frontIdx) {
      if (frontIdx >= 0) cards[frontIdx].classList.remove("front");
      frontIdx = best;
      cards[frontIdx].classList.add("front");
      // 转到正面：响一声提示音（不要冲击波了）
      if (!firstRun) blipThrottled(880, 1320);
    }
    firstRun = false;
  }
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => { measure(); update(); });
  measure();
  update();
  return null;
}
// 项目 8 张 + 标题方块 + 工具 16 张，一共 25 张在同一条链上
// 每张卡 32vh 滚动（原来 55vh）：整条链 800vh，换一张卡约滚 29vh，紧凑不空
initHelix("helix-all-wrap", "helix-all", ".card", 20);

// 导航“我的工具”：滚到标题方块转到正面的位置（整条链的 1/3 处）
function scrollToTools() {
  const wrap = document.getElementById("helix-all-wrap");
  if (!wrap) return;
  const r = wrap.getBoundingClientRect();
  const total = Math.max(1, r.height - window.innerHeight);
  window.scrollTo({ top: window.scrollY + r.top + total / 3, behavior: "smooth" });
}
const navTools = document.getElementById("nav-tools");
if (navTools) navTools.addEventListener("click", e => { e.preventDefault(); scrollToTools(); });

// ===== 工具卡片点击（螺旋版）：点开工具介绍弹窗 =====
function openToolCard(el) {
  const t = tools[+el.dataset.t];
  const b = el.querySelector("b");
  $("t-ico").innerHTML = b ? b.outerHTML : "";
  $("t-title").textContent = el.querySelector("h3").textContent;
  $("t-use").textContent = t.use;
  $("t-list").innerHTML = t.list.map(x => "<li>" + x + "</li>").join("");
  $("t-note").textContent = t.note ? "⚠ " + t.note : "";
  $("t-note").style.display = t.note ? "block" : "none";
  tmodal.classList.add("open");
  tmodal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
document.querySelectorAll(".tool-card").forEach(el => {
  if (el.classList.contains("title-card")) return;   // 标题方块点不开弹窗
  el.addEventListener("click", e => {
    blip(660, 990);
    const r = el.getBoundingClientRect(), d = document.createElement("span");
    d.className = "ripple";
    d.style.left = (e.clientX - r.left || r.width / 2) + "px";
    d.style.top = (e.clientY - r.top || r.height / 2) + "px";
    el.appendChild(d);
    el.classList.add("flash");
    setTimeout(() => { d.remove(); el.classList.remove("flash"); }, 760);
    setTimeout(() => openToolCard(el), 220);
  });
  el.addEventListener("keydown", e => { if (e.key === "Enter") { blip(660, 990); openToolCard(el); } });
});

// ===== Active Theory 风格特效：惯性平滑滚动 + 自定义光标 + 入场动画 + 横向滚动条 =====
document.documentElement.classList.add("js");

// --- 惯性平滑滚动（仅桌面鼠标滚轮；触屏保持原生手感） ---
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (matchMedia("(hover: none), (pointer: coarse)").matches) return;
  let target = window.scrollY, current = window.scrollY, raf = null;
  function tick() {
    const diff = target - current;
    if (Math.abs(diff) < 0.5) { current = target; raf = null; }
    else { current += diff * 0.12; raf = requestAnimationFrame(tick); }
    window.scrollTo({ top: current, behavior: "instant" });
  }
  // 键盘 / 锚点等原生滚动时，把目标同步到实际位置
  window.addEventListener("scroll", () => { if (raf === null) { target = current = window.scrollY; } }, { passive: true });
  window.addEventListener("wheel", e => {
    if (e.ctrlKey || e.metaKey) return;                    // 允许 Ctrl+滚轮缩放页面
    if (document.querySelector(".modal.open")) return;     // 弹窗打开时不抢滚动
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    target = Math.max(0, Math.min(max, target + e.deltaY));
    if (raf === null) { current = window.scrollY; raf = requestAnimationFrame(tick); }
    e.preventDefault();
  }, { passive: false });
})();

// --- 自定义光标：小圆点跟手，圆环延迟跟随，悬停可点元素时放大 ---
(function () {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const dot = document.getElementById("cursor-dot"), ring = document.getElementById("cursor-ring");
  if (!dot || !ring) return;
  document.documentElement.classList.add("has-cursor");
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  document.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
    dot.style.opacity = 1; ring.style.opacity = 1;
  }, { passive: true });
  document.addEventListener("mouseout", e => {
    if (!e.relatedTarget) { dot.style.opacity = 0; ring.style.opacity = 0; }
  });
  (function loop() {
    rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
    ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
    requestAnimationFrame(loop);
  })();
  document.addEventListener("mouseover", e => {
    ring.classList.toggle("hot", !!e.target.closest("a, button, .card, .tool, input, textarea"));
  });
})();

// --- 入场动画：滚到哪，标题和内容浮现到哪 ---
(function () {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach(el => el.classList.add("in")); return; }
  const io = new IntersectionObserver(es => {
    es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

// --- 首屏视差 + 横向滚动条：往下滚，首屏内容上浮淡出，横条的字往左走 ---
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const hero = document.querySelector(".hero"), track = document.getElementById("marquee-track");
  let ticking = false, half = 0;
  function measure() { half = track ? track.scrollWidth / 2 : 0; }
  measure();
  window.addEventListener("resize", measure);
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (hero && y < hero.offsetHeight + 200) {
        hero.style.transform = "translateY(" + (y * 0.28).toFixed(1) + "px)";
        hero.style.opacity = Math.max(0, 1 - y / 520).toFixed(2);
      }
      if (track && half > 0) track.style.transform = "translateX(" + (-(y * 0.35 % half)).toFixed(1) + "px)";
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

// --- 全屏闪烁星空：固定画布，星星明暗呼吸，减弱动效时只画一次静态星空 ---
(function () {
  const cv = document.getElementById("starfield");
  if (!cv) return;
  const ctx = cv.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const COLORS = ["#ffffff", "#cfe4ff", "#ffd7e8", "#d9c8ff", "#ffe9a8", "#9fd8ff"];
  let W = 0, H = 0, stars = [];
  function build() {
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.max(1, W * dpr); cv.height = Math.max(1, H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round((W * H) / 4000);
    stars = [];
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        r: 0.4 + Math.random() * 1.8,
        a: 0.25 + Math.random() * 0.55,
        sp: 0.4 + Math.random() * 1.4, ph: Math.random() * 6.283,
        c: COLORS[(Math.random() * COLORS.length) | 0]
      });
    }
  }
  build();
  window.addEventListener("resize", build);
  function draw(now) {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      const tw = 0.5 + 0.5 * Math.sin(now / 1000 * s.sp + s.ph);
      ctx.globalAlpha = s.a * (0.35 + 0.65 * tw);
      ctx.fillStyle = s.c;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
      if (s.r > 1.9) {
        ctx.globalAlpha *= 0.6;
        ctx.fillRect(s.x - s.r * 3, s.y - 0.5, s.r * 6, 1);
        ctx.fillRect(s.x - 0.5, s.y - s.r * 3, 1, s.r * 6);
      }
    }
    ctx.globalAlpha = 1;
  }
  if (reduce) { draw(0); return; }
  (function loop(now) { draw(now); requestAnimationFrame(loop); })(0);
})();

// ---------- 五彩流星雨：细单线，从亮到消失（右上→左下） ----------
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cv = document.createElement("canvas");
  cv.id = "meteor-shower";
  document.body.appendChild(cv);
  const ctx = cv.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const COLORS = ["#4dd8ff", "#ff5da2", "#ffd166", "#b388ff", "#7cfc9a", "#6a8dff"];
  let W = 0, H = 0;
  function size() {
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.max(1, W * dpr); cv.height = Math.max(1, H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  window.addEventListener("resize", size);
  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a.toFixed(3) + ")";
  }
  const meteors = [];
  let nextSpawn = 0;
  function spawn() {
    const fromTop = Math.random() < 0.6;
    const x = fromTop ? W * 0.1 + Math.random() * W * 0.9 : W + 20;
    const y = fromTop ? -20 : Math.random() * H * 0.4;
    const sp = 7 + Math.random() * 4;
    meteors.push({
      x: x, y: y, vx: -sp, vy: sp * (0.55 + Math.random() * 0.2),
      len: 80 + Math.random() * 50,
      col: COLORS[(Math.random() * COLORS.length) | 0],
      age: 0, life: 70 + Math.random() * 40
    });
  }
  function frame(now) {
    ctx.clearRect(0, 0, W, H);
    if (now >= nextSpawn && meteors.length < 7) {
      spawn();
      nextSpawn = now + 400 + Math.random() * 500;
    }
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.age++;
      m.x += m.vx; m.y += m.vy;
      if (m.age >= m.life || m.x < -160 || m.y > H + 40) { meteors.splice(i, 1); continue; }
      const lifeF = 1 - m.age / m.life;
      const vl = Math.hypot(m.vx, m.vy);
      const tx = m.x - (m.vx / vl) * m.len;
      const ty = m.y - (m.vy / vl) * m.len;
      const g = ctx.createLinearGradient(m.x, m.y, tx, ty);
      g.addColorStop(0, hexA(m.col, 0.95 * lifeF));
      g.addColorStop(1, hexA(m.col, 0));
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tx, ty);
      ctx.stroke();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

// ===== 演讲人物：点一下鼓掌，鼓完回到原来姿势 =====
(function () {
  const box = document.getElementById("presenter");
  const img = document.getElementById("presenter-img");
  if (!box || !img) return;
  // 预加载鼓掌动图，点的时候不卡
  const clapPre = new Image();
  clapPre.src = "img/presenter-clap.GIF?v=37";
  let clapping = false;
  box.addEventListener("click", () => {
    if (clapping) return;
    clapping = true;
    img.src = "img/presenter-clap.GIF?v=37";
    setTimeout(() => {
      img.src = "img/presenter.GIF?v=37";
      clapping = false;
    }, 1000);
  });
})();