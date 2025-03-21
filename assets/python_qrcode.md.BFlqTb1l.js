import{_ as a,c as i,o as t,ae as n}from"./chunks/framework.CLNW5JS9.js";const c=JSON.parse('{"title":"生成二维码","description":"","frontmatter":{},"headers":[],"relativePath":"python/qrcode.md","filePath":"python/qrcode.md"}'),e={name:"python/qrcode.md"};function p(l,s,h,o,r,d){return t(),i("div",null,s[0]||(s[0]=[n(`<h1 id="生成二维码" tabindex="-1">生成二维码 <a class="header-anchor" href="#生成二维码" aria-label="Permalink to &quot;生成二维码&quot;">​</a></h1><p>近期开始研究一下 <code>python</code>，以下是一个简单的二维码生成过程：</p><h2 id="步骤" tabindex="-1">步骤 <a class="header-anchor" href="#步骤" aria-label="Permalink to &quot;步骤&quot;">​</a></h2><div class="language-js-nolint vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js-nolint</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pip install pyqrcode</span></span></code></pre></div><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> pyqrcode</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 设置二维码信息</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">s </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://robert-jx.github.io/&quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 生成二维码</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">url </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> pyqrcode.create(s)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 保存二维码</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">url.svg(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;baidu.svg&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">scale</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p>这里使用的 <code>pyqrcode</code> 组件库快速的实现二维码功能。</p>`,6)]))}const g=a(e,[["render",p]]);export{c as __pageData,g as default};
