// 联系我按钮：复制页面上显示的微信号
function copyWechat() {
  const num = document.getElementById("wechat").textContent.trim();
  if (navigator.clipboard) navigator.clipboard.writeText(num);
  alert("微信号已复制：" + num);
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
  { ico:"🧑‍💻", title:"AI换脸",
    intro:"基于 AI 的图片、视频与直播换脸方案，可适配常见直播平台与设备环境。",
    list:["图片换脸与视频换脸","直播换脸与多平台兼容","设备环境搭建与效果调试","使用教学与问题答疑"],
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
    intro:"围绕 Kali Linux 开展网络安全教学，从环境搭建到实战演练，循序渐进。",
    list:["Kali 环境安装与常用工具","渗透测试流程与漏洞挖掘思路","安全攻防靶场实战","从入门到入狱的学习路线"],
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
document.querySelectorAll(".card").forEach(c => {
  c.addEventListener("click", e => {
    const r = c.getBoundingClientRect(), d = document.createElement("span");
    d.className = "ripple"; d.style.left = (e.clientX - r.left || r.width / 2) + "px"; d.style.top = (e.clientY - r.top || r.height / 2) + "px";
    c.appendChild(d); c.classList.add("flash");
    setTimeout(() => { d.remove(); c.classList.remove("flash"); }, 760);
    setTimeout(() => openModal(+c.dataset.i), 220);
  });
  c.addEventListener("keydown", e => { if (e.key === "Enter") openModal(+c.dataset.i); });
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
  { use:"预装数百种安全工具的 Linux 发行版，面向安全测试与学习。", list:["内置扫描、抓包、密码审计等常用工具","常装在虚拟机或专用设备上使用","是学习网络安全的入狱必备系统","我的 Kali Linux 教学也基于它"], note:"请只在自己的设备、靶场或已获书面授权的环境中使用，严禁攻击未授权目标。" },
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