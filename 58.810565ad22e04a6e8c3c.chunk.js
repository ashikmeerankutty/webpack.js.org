(window.webpackJsonp=window.webpackJsonp||[]).push([[58],{346:function(n,s,a){"use strict";a.r(s),s.default='<p>Plugins expose the full potential of the webpack engine to third-party developers. Using staged build callbacks, developers can introduce their own behaviors into the webpack build process. Building plugins is a bit more advanced than building loaders, because you\'ll need to understand some of the webpack low-level internals to hook into them. Be prepared to read some source code!</p>\n<h2 id="creating-a-plugin">Creating a Plugin<a href="#creating-a-plugin" aria-hidden="true"><span class="icon icon-link"></span></a></h2>\n<p>A plugin for webpack consists of</p>\n<ul>\n<li>A named JavaScript function.</li>\n<li>Defines <code>apply</code> method in its prototype.</li>\n<li>Specifies an <a href="/api/compiler-hooks/">event hook</a> to tap into.</li>\n<li>Manipulates webpack internal instance specific data.</li>\n<li>Invokes webpack provided callback after functionality is complete.</li>\n</ul>\n<pre><code class="hljs language-javascript"><span class="token comment">// A JavaScript class.</span>\n<span class="token keyword">class</span> <span class="token class-name">MyExampleWebpackPlugin</span> <span class="token punctuation">{</span>\n  <span class="token comment">// Define `apply` as its prototype method which is supplied with compiler as its argument</span>\n  <span class="token function">apply</span><span class="token punctuation">(</span>compiler<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// Specify the event hook to attach to</span>\n    compiler<span class="token punctuation">.</span>hooks<span class="token punctuation">.</span>emit<span class="token punctuation">.</span><span class="token function">tapAsync</span><span class="token punctuation">(</span>\n      <span class="token string">\'MyExampleWebpackPlugin\'</span><span class="token punctuation">,</span>\n      <span class="token punctuation">(</span>compilation<span class="token punctuation">,</span> callback<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">\'This is an example plugin!\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">\'Here’s the `compilation` object which represents a single build of assets:\'</span><span class="token punctuation">,</span> compilation<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n        <span class="token comment">// Manipulate the build using the plugin API provided by webpack</span>\n        compilation<span class="token punctuation">.</span><span class="token function">addModule</span><span class="token punctuation">(</span><span class="token comment">/* ... */</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n        <span class="token function">callback</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span></code></pre>\n<h2 id="basic-plugin-architecture">Basic plugin architecture<a href="#basic-plugin-architecture" aria-hidden="true"><span class="icon icon-link"></span></a></h2>\n<p>Plugins are instantiated objects with an <code>apply</code> method on their prototype. This <code>apply</code> method is called once by the webpack compiler while installing the plugin. The <code>apply</code> method is given a reference to the underlying webpack compiler, which grants access to compiler callbacks. A simple plugin is structured as follows:</p>\n<pre><code class="hljs language-javascript"><span class="token keyword">class</span> <span class="token class-name">HelloWorldPlugin</span> <span class="token punctuation">{</span>\n  <span class="token function">apply</span><span class="token punctuation">(</span>compiler<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    compiler<span class="token punctuation">.</span>hooks<span class="token punctuation">.</span>done<span class="token punctuation">.</span><span class="token function">tap</span><span class="token punctuation">(</span><span class="token string">\'Hello World Plugin\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>\n      stats <span class="token comment">/* stats is passed as argument when done hook is tapped.  */</span>\n    <span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">\'Hello World!\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\nmodule<span class="token punctuation">.</span>exports <span class="token operator">=</span> HelloWorldPlugin<span class="token punctuation">;</span></code></pre>\n<p>Then to use the plugin, include an instance in your webpack config <code>plugins</code> array:</p>\n<pre><code class="hljs language-javascript"><span class="token comment">// webpack.config.js</span>\n<span class="token keyword">var</span> HelloWorldPlugin <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'hello-world\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\nmodule<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ... config settings here ...</span>\n  plugins<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token keyword">new</span> <span class="token class-name">HelloWorldPlugin</span><span class="token punctuation">(</span><span class="token punctuation">{</span> options<span class="token punctuation">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">]</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>\n<h2 id="compiler-and-compilation">Compiler and Compilation<a href="#compiler-and-compilation" aria-hidden="true"><span class="icon icon-link"></span></a></h2>\n<p>Among the two most important resources while developing plugins are the <a href="/api/node/#compiler-instance"><code>compiler</code></a> and <a href="/api/compilation-hooks/"><code>compilation</code></a> objects. Understanding their roles is an important first step in extending the webpack engine.</p>\n<pre><code class="hljs language-javascript"><span class="token keyword">class</span> <span class="token class-name">HelloCompilationPlugin</span> <span class="token punctuation">{</span>\n  <span class="token function">apply</span><span class="token punctuation">(</span>compiler<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// Tap into compilation hook which gives compilation as argument to the callback function</span>\n    compiler<span class="token punctuation">.</span>hooks<span class="token punctuation">.</span>compilation<span class="token punctuation">.</span><span class="token function">tap</span><span class="token punctuation">(</span><span class="token string">\'HelloCompilationPlugin\'</span><span class="token punctuation">,</span> compilation <span class="token operator">=></span> <span class="token punctuation">{</span>\n      <span class="token comment">// Now we can tap into various hooks available through compilation</span>\n      compilation<span class="token punctuation">.</span>hooks<span class="token punctuation">.</span>optimize<span class="token punctuation">.</span><span class="token function">tap</span><span class="token punctuation">(</span><span class="token string">\'HelloCompilationPlugin\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">\'Assets are being optimized.\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\nmodule<span class="token punctuation">.</span>exports <span class="token operator">=</span> HelloCompilationPlugin<span class="token punctuation">;</span></code></pre>\n<p>The list of hooks available on the <code>compiler</code>, <code>compilation</code>, and other important objects, see the <a href="/api/plugins/">plugins API</a> docs.</p>\n<h2 id="async-event-hooks">Async event hooks<a href="#async-event-hooks" aria-hidden="true"><span class="icon icon-link"></span></a></h2>\n<p>Some plugin hooks are asynchronous. To tap into them, we can use <code>tap</code> method which will behave in synchronous manner or use one of <code>tapAsync</code> method or <code>tapPromise</code> method which are asynchronous methods.</p>\n<h3 id="tapasync">tapAsync<a href="#tapasync" aria-hidden="true"><span class="icon icon-link"></span></a></h3>\n<p>When we use <code>tapAsync</code> method to tap into plugins, we need to call the callback function which is supplied as the last argument to our function.</p>\n<pre><code class="hljs language-javascript"><span class="token keyword">class</span> <span class="token class-name">HelloAsyncPlugin</span> <span class="token punctuation">{</span>\n  <span class="token function">apply</span><span class="token punctuation">(</span>compiler<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    compiler<span class="token punctuation">.</span>hooks<span class="token punctuation">.</span>emit<span class="token punctuation">.</span><span class="token function">tapAsync</span><span class="token punctuation">(</span><span class="token string">\'HelloAsyncPlugin\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>compilation<span class="token punctuation">,</span> callback<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n      <span class="token comment">// Do something async...</span>\n      <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">\'Done with async work...\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token function">callback</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\nmodule<span class="token punctuation">.</span>exports <span class="token operator">=</span> HelloAsyncPlugin<span class="token punctuation">;</span></code></pre>\n<h4 id="tappromise">tapPromise<a href="#tappromise" aria-hidden="true"><span class="icon icon-link"></span></a></h4>\n<p>When we use <code>tapPromise</code> method to tap into plugins, we need to return a promise which resolves when our asynchronous task is completed.</p>\n<pre><code class="hljs language-javascript"><span class="token keyword">class</span> <span class="token class-name">HelloAsyncPlugin</span> <span class="token punctuation">{</span>\n  <span class="token function">apply</span><span class="token punctuation">(</span>compiler<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    compiler<span class="token punctuation">.</span>hooks<span class="token punctuation">.</span>emit<span class="token punctuation">.</span><span class="token function">tapPromise</span><span class="token punctuation">(</span><span class="token string">\'HelloAsyncPlugin\'</span><span class="token punctuation">,</span> compilation <span class="token operator">=></span> <span class="token punctuation">{</span>\n      <span class="token comment">// return a Promise that resolves when we are done...</span>\n      <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token punctuation">(</span>resolve<span class="token punctuation">,</span> reject<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n        <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">\'Done with async work...\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n          <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\nmodule<span class="token punctuation">.</span>exports <span class="token operator">=</span> HelloAsyncPlugin<span class="token punctuation">;</span></code></pre>\n<h2 id="example">Example<a href="#example" aria-hidden="true"><span class="icon icon-link"></span></a></h2>\n<p>Once we can latch onto the webpack compiler and each individual compilations, the possibilities become endless for what we can do with the engine itself. We can reformat existing files, create derivative files, or fabricate entirely new assets.</p>\n<p>Let\'s write a simple example plugin that generates a new build file called <code>filelist.md</code>; the contents of which will list all of the asset files in our build. This plugin might look something like this:</p>\n<pre><code class="hljs language-javascript"><span class="token keyword">class</span> <span class="token class-name">FileListPlugin</span> <span class="token punctuation">{</span>\n  <span class="token function">apply</span><span class="token punctuation">(</span>compiler<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// emit is asynchronous hook, tapping into it using tapAsync, you can use tapPromise/tap(synchronous) as well</span>\n    compiler<span class="token punctuation">.</span>hooks<span class="token punctuation">.</span>emit<span class="token punctuation">.</span><span class="token function">tapAsync</span><span class="token punctuation">(</span><span class="token string">\'FileListPlugin\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>compilation<span class="token punctuation">,</span> callback<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n      <span class="token comment">// Create a header string for the generated file:</span>\n      <span class="token keyword">var</span> filelist <span class="token operator">=</span> <span class="token string">\'In this build:\\n\\n\'</span><span class="token punctuation">;</span>\n\n      <span class="token comment">// Loop through all compiled assets,</span>\n      <span class="token comment">// adding a new line item for each filename.</span>\n      <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> filename <span class="token keyword">in</span> compilation<span class="token punctuation">.</span>assets<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        filelist <span class="token operator">+=</span> <span class="token string">\'- \'</span> <span class="token operator">+</span> filename <span class="token operator">+</span> <span class="token string">\'\\n\'</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n\n      <span class="token comment">// Insert this list into the webpack build as a new file asset:</span>\n      compilation<span class="token punctuation">.</span>assets<span class="token punctuation">[</span><span class="token string">\'filelist.md\'</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n        source<span class="token punctuation">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token keyword">return</span> filelist<span class="token punctuation">;</span>\n        <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        size<span class="token punctuation">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token keyword">return</span> filelist<span class="token punctuation">.</span>length<span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n      <span class="token function">callback</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\nmodule<span class="token punctuation">.</span>exports <span class="token operator">=</span> FileListPlugin<span class="token punctuation">;</span></code></pre>\n<h2 id="different-plugin-shapes">Different Plugin Shapes<a href="#different-plugin-shapes" aria-hidden="true"><span class="icon icon-link"></span></a></h2>\n<p>A plugin can be classified into types based on the event hooks it taps into. Every event hook is pre-defined as synchronous or asynchronous or waterfall or parallel hook and hook is called internally using call/callAsync method. The list of hooks that are supported or can be tapped into are generally specified in <code>this.hooks</code> property.</p>\n<p>For example:</p>\n<pre><code class="hljs language-javascript"><span class="token keyword">this</span><span class="token punctuation">.</span>hooks <span class="token operator">=</span> <span class="token punctuation">{</span>\n  shouldEmit<span class="token punctuation">:</span> <span class="token keyword">new</span> <span class="token class-name">SyncBailHook</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">\'compilation\'</span><span class="token punctuation">]</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>\n<p>It represents that the only hook supported is <code>shouldEmit</code> which is a hook of <code>SyncBailHook</code> type and the only parameter which will be passed to any plugin that taps into <code>shouldEmit</code> hook is <code>compilation</code>.</p>\n<p>Various types of hooks supported are :</p>\n<h3 id="synchronous-hooks">Synchronous Hooks<a href="#synchronous-hooks" aria-hidden="true"><span class="icon icon-link"></span></a></h3>\n<ul>\n<li>\n<p><strong>SyncHook</strong></p>\n<ul>\n<li>Defined as <code>new SyncHook([params])</code></li>\n<li>Tapped into using <code>tap</code> method.</li>\n<li>Called using <code>call(...params)</code> method.</li>\n</ul>\n</li>\n<li>\n<p><strong>Bail Hooks</strong></p>\n<ul>\n<li>Defined using <code>SyncBailHook[params]</code></li>\n<li>Tapped into using <code>tap</code> method.</li>\n<li>Called using <code>call(...params)</code> method.</li>\n</ul>\n<p>In these type of hooks, each of the plugin callbacks will be invoked one after the other with the specific <code>args</code>. If any value is returned except undefined by any plugin, then that value is returned by hook and no further plugin callback is invoked. Many useful events like <code>optimizeChunks</code>, <code>optimizeChunkModules</code> are SyncBailHooks.</p>\n</li>\n<li>\n<p><strong>Waterfall Hooks</strong></p>\n<ul>\n<li>Defined using <code>SyncWaterfallHook[params]</code></li>\n<li>Tapped into using <code>tap</code> method.</li>\n<li>Called using <code>call( ... params)</code> method</li>\n</ul>\n<p>Here each of the plugins are called one after the other with the arguments from the return value of the previous plugin. The plugin must take the order of its execution into account.\nIt must accept arguments from the previous plugin that was executed. The value for the first plugin is <code>init</code>. Hence at least 1 param must be supplied for waterfall hooks. This pattern is used in the Tapable instances which are related to the webpack templates like <code>ModuleTemplate</code>, <code>ChunkTemplate</code> etc.</p>\n</li>\n</ul>\n<h3 id="asynchronous-hooks">Asynchronous Hooks<a href="#asynchronous-hooks" aria-hidden="true"><span class="icon icon-link"></span></a></h3>\n<ul>\n<li>\n<p><strong>Async Series Hook</strong></p>\n<ul>\n<li>Defined using <code>AsyncSeriesHook[params]</code></li>\n<li>Tapped into using <code>tap</code>/<code>tapAsync</code>/<code>tapPromise</code> method.</li>\n<li>Called using <code>callAsync( ... params)</code> method</li>\n</ul>\n<p>The plugin handler functions are called with all arguments and a callback function with the signature <code>(err?: Error) -> void</code>. The handler functions are called in order of registration. <code>callback</code> is called after all the handlers are called.\nThis is also a commonly used pattern for events like <code>emit</code>, <code>run</code>.</p>\n</li>\n<li>\n<p><strong>Async waterfall</strong> The plugins will be applied asynchronously in the waterfall manner.</p>\n<ul>\n<li>Defined using <code>AsyncWaterfallHook[params]</code></li>\n<li>Tapped into using <code>tap</code>/<code>tapAsync</code>/<code>tapPromise</code> method.</li>\n<li>Called using <code>callAsync( ... params)</code> method</li>\n</ul>\n<p>The plugin handler functions are called with the current value and a callback function with the signature <code>(err: Error, nextValue: any) -> void.</code> When called <code>nextValue</code> is the current value for the next handler. The current value for the first handler is <code>init</code>. After all handlers are applied, callback is called with the last value. If any handler passes a value for <code>err</code>, the callback is called with this error and no more handlers are called.\nThis plugin pattern is expected for events like <code>before-resolve</code> and <code>after-resolve</code>.</p>\n</li>\n<li>\n<p><strong>Async Series Bail</strong></p>\n<ul>\n<li>Defined using <code>AsyncSeriesBailHook[params]</code></li>\n<li>Tapped into using <code>tap</code>/<code>tapAsync</code>/<code>tapPromise</code> method.</li>\n<li>Called using <code>callAsync( ... params)</code> method</li>\n</ul>\n</li>\n<li>\n<p><strong>Async Parallel</strong></p>\n<ul>\n<li>Defined using <code>AsyncParallelHook[params]</code></li>\n<li>Tapped into using <code>tap</code>/<code>tapAsync</code>/<code>tapPromise</code> method.</li>\n<li>Called using <code>callAsync( ... params)</code> method</li>\n</ul>\n</li>\n<li>\n<p><strong>Async Series Bail</strong></p>\n<ul>\n<li>Defined using <code>AsyncSeriesBailHook[params]</code></li>\n<li>Tapped into using <code>tap</code>/<code>tapAsync</code>/<code>tapPromise</code> method.</li>\n<li>Called using <code>callAsync( ... params)</code> method</li>\n</ul>\n</li>\n</ul>\n'}}]);