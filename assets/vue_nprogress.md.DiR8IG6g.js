import{_ as i,c as a,o as n,ae as p}from"./chunks/framework.CLNW5JS9.js";const g=JSON.parse('{"title":"页面加载进度条","description":"","frontmatter":{},"headers":[],"relativePath":"vue/nprogress.md","filePath":"vue/nprogress.md"}'),l={name:"vue/nprogress.md"};function e(h,s,t,k,r,E){return n(),a("div",null,s[0]||(s[0]=[p(`<h1 id="页面加载进度条" tabindex="-1">页面加载进度条 <a class="header-anchor" href="#页面加载进度条" aria-label="Permalink to &quot;页面加载进度条&quot;">​</a></h1><p>在一些项目中，经常见到切换页面的时候。页面顶部出现一个进度条，使得页面过渡较为平滑。常见的实现方式是使用nprogress插件</p><h2 id="如何使用该插件" tabindex="-1">如何使用该插件？ <a class="header-anchor" href="#如何使用该插件" aria-label="Permalink to &quot;如何使用该插件？&quot;">​</a></h2><p>1、首先需要安装nprogress插件</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>npm i -s nprogress</span></span></code></pre></div><p>2、安装好后需要在main.js里面进行配置</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> NProgress </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;nprogress&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;nprogress/nprogress.css&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">NProgress.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">configure</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({     </span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     easing: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;ease&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,  </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 动画方式    </span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     speed: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">500</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,  </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 递增进度条的速度    </span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     showSpinner: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">false</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 是否显示加载ico    </span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     trickleSpeed: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">200</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 自动递增间隔    </span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     minimum: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.3</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // 初始化时的最小百分比</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> })</span></span></code></pre></div><p>3、紧接着只需要在路由相关文件(常见：router.js)中使用</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//当路由进入前</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> router.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">beforeEach</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">((</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">to</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">from</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> , </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">next</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     // 每次切换页面时，调用进度条</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    NProgress.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">start</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 这个一定要加，没有next()页面不会跳转的</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     next</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> });</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//当路由进入后：关闭进度条</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">router.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">afterEach</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {  </span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 在即将进入新的页面组件前，关闭掉进度条</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    NProgress.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">done</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span></code></pre></div>`,9)]))}const c=i(l,[["render",e]]);export{g as __pageData,c as default};
