/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-validate-install",
factory: function (require) {
"use strict";var plugin=(()=>{var s=Object.defineProperty;var g=Object.getOwnPropertyDescriptor;var x=Object.getOwnPropertyNames;var C=Object.prototype.hasOwnProperty;var n=(o=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(o,{get:(e,t)=>(typeof require<"u"?require:e)[t]}):o)(function(o){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+o+'" is not supported')});var b=(o,e)=>{for(var t in e)s(o,t,{get:e[t],enumerable:!0})},I=(o,e,t,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of x(e))!C.call(o,r)&&r!==t&&s(o,r,{get:()=>e[r],enumerable:!(a=g(e,r))||a.enumerable});return o};var h=o=>I(s({},"__esModule",{value:!0}),o);var P={};b(P,{default:()=>w});var d=n("@yarnpkg/core");var f=n("@yarnpkg/core"),c={validateInstall:{description:"Hook that will always run to validate installs",type:f.SettingsType.STRING,default:""}};var u=n("clipanion"),p=n("@yarnpkg/core");var m=n("@yarnpkg/shell"),l=async(o,e)=>{var r;let t=o.get("validateInstall"),a=!!((r=o.projectCwd)!=null&&r.endsWith(`dlx-${process.pid}`));return t&&!a?(e&&console.log("Running `validateInstall` hook..."),(0,m.execute)(t,[],{cwd:o.projectCwd||void 0})):0};var i=class extends u.Command{async execute(){let e=await p.Configuration.find(this.context.cwd,this.context.plugins);return l(e,!1)}};i.paths=[["validate-install"]];var k={configuration:c,commands:[i],hooks:{validateProjectAfterInstall:async(o,e)=>{if((e==null?void 0:e.mode)===d.InstallMode.UpdateLockfile)return;if(await l(o.configuration,!0))throw new Error("The `validateInstall` hook failed, see output above.")}}},w=k;return h(P);})();
return plugin;
}
};
