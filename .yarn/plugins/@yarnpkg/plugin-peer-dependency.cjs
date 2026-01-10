/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-peer-dependency",
factory: function (require) {
var plugin=(()=>{var t=Object.defineProperty;var p=Object.getOwnPropertyDescriptor;var d=Object.getOwnPropertyNames;var f=Object.prototype.hasOwnProperty;var u=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(o,s)=>(typeof require<"u"?require:o)[s]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+e+'" is not supported')});var l=(e,o)=>{for(var s in o)t(e,s,{get:o[s],enumerable:!0})},j=(e,o,s,n)=>{if(o&&typeof o=="object"||typeof o=="function")for(let r of d(o))!f.call(e,r)&&r!==s&&t(e,r,{get:()=>o[r],enumerable:!(n=p(o,r))||n.enumerable});return e};var m=e=>j(t({},"__esModule",{value:!0}),e);var y={};l(y,{default:()=>x});var a=u("@yarnpkg/fslib"),c,x={commands:[],hooks:{validateProject:e=>{let o=e.configuration.projectCwd;if(o&&!!!o.endsWith(`dlx-${process.pid}`))try{let n=JSON.parse(a.xfs.readFileSync(o+"/package.json","utf8"));n?.peerResolutions&&typeof n.peerResolutions=="object"&&(c=n.peerResolutions)}catch{}},reduceDependency:(e,o,s)=>(c&&s.peerDependencies.forEach(n=>{let r=`${s.scope?"@"+s.scope+"/":""}${s.name}/${n.scope?"@"+n.scope+"/":""}${n.name}`,i=c[r];i&&(n.range=i)}),e)}};return m(y);})();
return plugin;
}
};
