var X=Object.defineProperty;var Z=(n,e,r)=>e in n?X(n,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):n[e]=r;var s=(n,e,r)=>Z(n,typeof e!="symbol"?e+"":e,r);import{f as K,r as b,O as nn,P as I,n as en,g as rn,a as tn,k as on,q as C,Q as an}from"./index-Bxrtyfih.js";var cn=Symbol("iconContext"),D=function(){return K(cn,{prefixCls:b("anticon"),rootClassName:b(""),csp:b()})};function T(){return!!(typeof window<"u"&&window.document&&window.document.createElement)}function ln(n,e){return n&&n.contains?n.contains(e):!1}var x="data-vc-order",un="vc-icon-key",h=new Map;function R(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},e=n.mark;return e?e.startsWith("data-")?e:"data-".concat(e):un}function w(n){if(n.attachTo)return n.attachTo;var e=document.querySelector("head");return e||document.body}function sn(n){return n==="queue"?"prependQueue":n?"prepend":"append"}function U(n){return Array.from((h.get(n)||n).children).filter(function(e){return e.tagName==="STYLE"})}function L(n){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};if(!T())return null;var r=e.csp,o=e.prepend,t=document.createElement("style");t.setAttribute(x,sn(o)),r&&r.nonce&&(t.nonce=r.nonce),t.innerHTML=n;var a=w(e),i=a.firstChild;if(o){if(o==="queue"){var c=U(a).filter(function(l){return["prepend","prependQueue"].includes(l.getAttribute(x))});if(c.length)return a.insertBefore(t,c[c.length-1].nextSibling),t}a.insertBefore(t,i)}else a.appendChild(t);return t}function fn(n){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=w(e);return U(r).find(function(o){return o.getAttribute(R(e))===n})}function pn(n,e){var r=h.get(n);if(!r||!ln(document,r)){var o=L("",e),t=o.parentNode;h.set(n,t),n.removeChild(o)}}function dn(n,e){var r=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},o=w(r);pn(o,r);var t=fn(e,r);if(t)return r.csp&&r.csp.nonce&&t.nonce!==r.csp.nonce&&(t.nonce=r.csp.nonce),t.innerHTML!==n&&(t.innerHTML=n),t;var a=L(n,r);return a.setAttribute(R(r),e),a}function E(n){for(var e=1;e<arguments.length;e++){var r=arguments[e]!=null?Object(arguments[e]):{},o=Object.keys(r);typeof Object.getOwnPropertySymbols=="function"&&(o=o.concat(Object.getOwnPropertySymbols(r).filter(function(t){return Object.getOwnPropertyDescriptor(r,t).enumerable}))),o.forEach(function(t){mn(n,t,r[t])})}return n}function mn(n,e,r){return e in n?Object.defineProperty(n,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):n[e]=r,n}function N(n){return typeof n=="object"&&typeof n.name=="string"&&typeof n.theme=="string"&&(typeof n.icon=="object"||typeof n.icon=="function")}function O(n,e,r){return r?I(n.tag,E({key:e},r,n.attrs),(n.children||[]).map(function(o,t){return O(o,"".concat(e,"-").concat(n.tag,"-").concat(t))})):I(n.tag,E({key:e},n.attrs),(n.children||[]).map(function(o,t){return O(o,"".concat(e,"-").concat(n.tag,"-").concat(t))}))}function W(n){return nn(n)[0]}function H(n){return n?Array.isArray(n)?n:[n]:[]}var yn=`
.anticon {
  display: inline-block;
  color: inherit;
  font-style: normal;
  line-height: 0;
  text-align: center;
  text-transform: none;
  vertical-align: -0.125em;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.anticon > * {
  line-height: 1;
}

.anticon svg {
  display: inline-block;
}

.anticon::before {
  display: none;
}

.anticon .anticon-icon {
  display: block;
}

.anticon[tabindex] {
  cursor: pointer;
}

.anticon-spin::before,
.anticon-spin {
  display: inline-block;
  -webkit-animation: loadingCircle 1s infinite linear;
  animation: loadingCircle 1s infinite linear;
}

@-webkit-keyframes loadingCircle {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes loadingCircle {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
`;function M(n){return n&&n.getRootNode&&n.getRootNode()}function gn(n){return T()?M(n)instanceof ShadowRoot:!1}function vn(n){return gn(n)?M(n):null}var bn=function(){var e=D(),r=e.prefixCls,o=e.csp,t=rn(),a=yn;r&&(a=a.replace(/anticon/g,r.value)),en(function(){if(T()){var i=t.vnode.el,c=vn(i);dn(a,"@ant-design-vue-icons",{prepend:!0,csp:o.value,attachTo:c})}})},Cn=["icon","primaryColor","secondaryColor"];function hn(n,e){if(n==null)return{};var r=On(n,e),o,t;if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(n);for(t=0;t<a.length;t++)o=a[t],!(e.indexOf(o)>=0)&&Object.prototype.propertyIsEnumerable.call(n,o)&&(r[o]=n[o])}return r}function On(n,e){if(n==null)return{};var r={},o=Object.keys(n),t,a;for(a=0;a<o.length;a++)t=o[a],!(e.indexOf(t)>=0)&&(r[t]=n[t]);return r}function y(n){for(var e=1;e<arguments.length;e++){var r=arguments[e]!=null?Object(arguments[e]):{},o=Object.keys(r);typeof Object.getOwnPropertySymbols=="function"&&(o=o.concat(Object.getOwnPropertySymbols(r).filter(function(t){return Object.getOwnPropertyDescriptor(r,t).enumerable}))),o.forEach(function(t){Tn(n,t,r[t])})}return n}function Tn(n,e,r){return e in n?Object.defineProperty(n,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):n[e]=r,n}var d=tn({primaryColor:"#333",secondaryColor:"#E6E6E6",calculated:!1});function wn(n){var e=n.primaryColor,r=n.secondaryColor;d.primaryColor=e,d.secondaryColor=r||W(e),d.calculated=!!r}function Sn(){return y({},d)}var f=function(e,r){var o=y({},e,r.attrs),t=o.icon,a=o.primaryColor,i=o.secondaryColor,c=hn(o,Cn),l=d;if(a&&(l={primaryColor:a,secondaryColor:i||W(a)}),N(t),!N(t))return null;var u=t;return u&&typeof u.icon=="function"&&(u=y({},u,{icon:u.icon(l.primaryColor,l.secondaryColor)})),O(u.icon,"svg-".concat(u.name),y({},c,{"data-icon":u.name,width:"1em",height:"1em",fill:"currentColor","aria-hidden":"true"}))};f.props={icon:Object,primaryColor:String,secondaryColor:String,focusable:String};f.inheritAttrs=!1;f.displayName="IconBase";f.getTwoToneColors=Sn;f.setTwoToneColors=wn;function _n(n,e){return xn(n)||In(n,e)||An(n,e)||jn()}function jn(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function An(n,e){if(n){if(typeof n=="string")return P(n,e);var r=Object.prototype.toString.call(n).slice(8,-1);if(r==="Object"&&n.constructor&&(r=n.constructor.name),r==="Map"||r==="Set")return Array.from(n);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return P(n,e)}}function P(n,e){(e==null||e>n.length)&&(e=n.length);for(var r=0,o=new Array(e);r<e;r++)o[r]=n[r];return o}function In(n,e){var r=n==null?null:typeof Symbol<"u"&&n[Symbol.iterator]||n["@@iterator"];if(r!=null){var o=[],t=!0,a=!1,i,c;try{for(r=r.call(n);!(t=(i=r.next()).done)&&(o.push(i.value),!(e&&o.length===e));t=!0);}catch(l){a=!0,c=l}finally{try{!t&&r.return!=null&&r.return()}finally{if(a)throw c}}return o}}function xn(n){if(Array.isArray(n))return n}function z(n){var e=H(n),r=_n(e,2),o=r[0],t=r[1];return f.setTwoToneColors({primaryColor:o,secondaryColor:t})}function En(){var n=f.getTwoToneColors();return n.calculated?[n.primaryColor,n.secondaryColor]:n.primaryColor}var Nn=on({name:"InsertStyles",setup:function(){return bn(),function(){return null}}}),Pn=["class","icon","spin","rotate","tabindex","twoToneColor","onClick"];function kn(n,e){return Un(n)||Rn(n,e)||Dn(n,e)||$n()}function $n(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Dn(n,e){if(n){if(typeof n=="string")return k(n,e);var r=Object.prototype.toString.call(n).slice(8,-1);if(r==="Object"&&n.constructor&&(r=n.constructor.name),r==="Map"||r==="Set")return Array.from(n);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return k(n,e)}}function k(n,e){(e==null||e>n.length)&&(e=n.length);for(var r=0,o=new Array(e);r<e;r++)o[r]=n[r];return o}function Rn(n,e){var r=n==null?null:typeof Symbol<"u"&&n[Symbol.iterator]||n["@@iterator"];if(r!=null){var o=[],t=!0,a=!1,i,c;try{for(r=r.call(n);!(t=(i=r.next()).done)&&(o.push(i.value),!(e&&o.length===e));t=!0);}catch(l){a=!0,c=l}finally{try{!t&&r.return!=null&&r.return()}finally{if(a)throw c}}return o}}function Un(n){if(Array.isArray(n))return n}function $(n){for(var e=1;e<arguments.length;e++){var r=arguments[e]!=null?Object(arguments[e]):{},o=Object.keys(r);typeof Object.getOwnPropertySymbols=="function"&&(o=o.concat(Object.getOwnPropertySymbols(r).filter(function(t){return Object.getOwnPropertyDescriptor(r,t).enumerable}))),o.forEach(function(t){p(n,t,r[t])})}return n}function p(n,e,r){return e in n?Object.defineProperty(n,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):n[e]=r,n}function Ln(n,e){if(n==null)return{};var r=Wn(n,e),o,t;if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(n);for(t=0;t<a.length;t++)o=a[t],!(e.indexOf(o)>=0)&&Object.prototype.propertyIsEnumerable.call(n,o)&&(r[o]=n[o])}return r}function Wn(n,e){if(n==null)return{};var r={},o=Object.keys(n),t,a;for(a=0;a<o.length;a++)t=o[a],!(e.indexOf(t)>=0)&&(r[t]=n[t]);return r}z(an.primary);var m=function(e,r){var o,t=$({},e,r.attrs),a=t.class,i=t.icon,c=t.spin,l=t.rotate,u=t.tabindex,q=t.twoToneColor,S=t.onClick,V=Ln(t,Pn),_=D(),g=_.prefixCls,j=_.rootClassName,Q=(o={},p(o,j.value,!!j.value),p(o,g.value,!0),p(o,"".concat(g.value,"-").concat(i.name),!!i.name),p(o,"".concat(g.value,"-spin"),!!c||i.name==="loading"),o),v=u;v===void 0&&S&&(v=-1);var G=l?{msTransform:"rotate(".concat(l,"deg)"),transform:"rotate(".concat(l,"deg)")}:void 0,Y=H(q),A=kn(Y,2),F=A[0],J=A[1];return C("span",$({role:"img","aria-label":i.name},V,{onClick:S,class:[Q,a],tabindex:v}),[C(f,{icon:i,primaryColor:F,secondaryColor:J,style:G},null),C(Nn,null,null)])};m.props={spin:Boolean,rotate:Number,icon:Object,twoToneColor:[String,Array]};m.displayName="AntdIcon";m.inheritAttrs=!1;m.getTwoToneColor=En;m.setTwoToneColor=z;var B=(n=>(n[n.PAUSED=0]="PAUSED",n[n.SHUTDOWN=1]="SHUTDOWN",n[n.CRASHED=2]="CRASHED",n[n.NOSTATE=3]="NOSTATE",n[n.RUNNING=4]="RUNNING",n[n.SUSPENDED=5]="SUSPENDED",n))(B||{});const Hn={start:"0",shutdown:"1",reboot:"2",pause:"3"};function qn(n){return Hn[n]}class Mn{constructor(e){s(this,"name");s(this,"id");s(this,"powerState");s(this,"alias");s(this,"host");this.name=e.name,this.id=e.id,this.powerState=e.powerState,this.alias=e.alias,this.host=e.host}get powerStateCode(){return B[this.powerState].toString()}}class Vn extends Mn{constructor(r){super(r);s(this,"description");s(this,"source");s(this,"flavor");this.description=r.description,this.source={...r.source},this.flavor={...r.flavor}}}export{m as I,Vn as V,Mn as a,qn as g};
