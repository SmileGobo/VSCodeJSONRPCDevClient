const XML   = require('xmldom');
const XPATH = require('xpath');
const ASS   = require('assert');
/**
 * @class Поисковик по дереву DOM 
 * ищет по xpath запросам
 */
module.exports = class {
    constructor(ns = 'html') {
        this._root      =  null;
        this.namespace  = ns;
    }

    set root(val) {
        //ASS.ok(val instanceof XML.N, 'root neeed DOMDocument');
        this._root = val;
    }

    /**
     * @brief установка пространства имен 
     */
    set namespace (val){
        let rslvr = {};
        rslvr[val] = 'http://www.w3.org/1999/xhtml';
        this._select = XPATH.useNamespaces(rslvr);
    }

    /**
     * запросы xpath от корня жрет запросы вида //ns:tagname
     * @note namespace можно установить
     * @param {string} query 
     */
    execXPath(query) {
        return this._select(query, this._root);
    }

    



}