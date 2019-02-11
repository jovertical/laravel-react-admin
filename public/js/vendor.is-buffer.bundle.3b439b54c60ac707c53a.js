(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{5682:function(n,o){function t(n){return!!n.constructor&&"function"==typeof n.constructor.isBuffer&&n.constructor.isBuffer(n)}
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
n.exports=function(n){return null!=n&&(t(n)||function(n){return"function"==typeof n.readFloatLE&&"function"==typeof n.slice&&t(n.slice(0,0))}(n)||!!n._isBuffer)}}}]);