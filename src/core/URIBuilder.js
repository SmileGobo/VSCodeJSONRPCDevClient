const path = require('path');
const ASS  = require('assert');

/**
 * @brief генератор адресов URI
 */
module.exports = class {
    _base_path = '';
    _schema    = '';
    set basePath(val){
        ASS.ok(path.isAbsolute(val), 'absolute base path required');
        this._base_path = val;
    }

    joinBasePath(...path_vals){
        this.basePath = path.join(...path_vals);
    }
    /**
     * http
     * file
     * vscode-resource
     */
    set schema(val){
        if (val.trim().length === 0){
            this._schema = '';
            return;
        }
        this._schema = `${val}:`;
    }

    make(tail){
        let rslt = path.join(this._base_path, ...tail.split('/'));
        return `${this._schema}${path.normalize(rslt)}`;
    }

}