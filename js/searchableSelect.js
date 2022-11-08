class _searchableSelect {
    constructor(inputId, dataUrl) {
        this.dataUrl = dataUrl;
        this.inputId = inputId;
        this.SelectedData = [];
        this.placeHolder = "";
        this.createMySelectBox();
    }

    selectedList = [];

    setPlaceHolder = (text) => {
        this.placeHolder = text;
        return this;
    }
    createMySelectBox = () => {
        var html = `<div class="searchableSelect"><div onclick="searchableSelectApi.run('${this.inputId}', 'toggleSelect',this)"  class="selectContainer"><div class="row" style="display: flex; align-items: center; "><div class="col-sm-10" style="padding:0px;"><div class="placeHolder" id="placeHolder${this.inputId}"></div><ul class="selectedItems" id="selectedItems${this.inputId}">`;
        html += `</ul></div><div></div></div></div><div class="selectDropdown"><div class="selectSearchBarContainer has-search"><span id="selectSearchBarBtn" class="iconSearchsm form-control-feedback" style="margin: 7px !important; "></span>
        <input type="text" id="${this.inputId}SearchBar"  class="selectSearchBar form-control " style="padding-left: 30px;" placeholder="Buradan Arama Yapabilirsiniz..."></div><ul class="selectItems" id="selectItems${this.inputId}"></ul></div></div>`;
        document.getElementById(`${this.inputId}`).parentElement.innerHTML += html;
        //resize panel with input
        $(window).resize(function () {
            let box = document.querySelector(`.selectContainer`);
            $(".selectDropdown").css("width", box.offsetWidth)
        });
        this.selectSearchBar();
        this.PlaceHolder();
    }
    toggleSelect = (e) => {
        let box = document.querySelector(".selectContainer");
        $(".selectDropdown").css("width", box.offsetWidth)
        var clickedSelectSearch = e.querySelector(".selectSearch")
        $(clickedSelectSearch).toggleClass("selectSearchActive")
        var selectDropdown = e.closest('.searchableSelect').querySelector(".selectDropdown")
        $(selectDropdown).toggle();
    }

    selectSearchBar = () => {
        let _this = this;
        $(`#${this.inputId}SearchBar`).keydown(function (event) {
            if (event.which == 13) {
                _this.getListFromUrl();
            }
        });
    }
    setSelectedData = (data) => {
        this.SelectedData = data;
        this.selectedData();
        return this;
    }
    selectedData = () => {
        let responseMap = this.responseCallbackFunction(this.SelectedData);
        for (var i = 0; i < responseMap?.length; i++) {
            $(`#selectedItems${this.inputId}`).append(`<li data-id="${responseMap[i].id}">${responseMap[i].text}</li>`);
            this.selectedList.push(responseMap[i].id)
        }

        $(`#${this.inputId}`).val(this.selectedList);
        this.PlaceHolder();
    }

    PlaceHolder = () => {
        this.selectedList.length == 0 ? document.querySelector(`#placeHolder${this.inputId}`).innerHTML = this.placeHolder == "" ? "Seçmek İçin Tıklayınız" : this.placeHolder : document.querySelector(`#placeHolder${this.inputId}`).innerHTML = "";
    }

    responseCallbackFunction = function (response) {
        return response;
    }

    setCallbackReponseFunction(func) {
        if (typeof func !== "function") {
            return false;
        }
        this.responseCallbackFunction = func;
    }


    getListFromUrl = () => {
        $.getJSON(`${this.dataUrl}`, (function (result) {
            $(`#selectItems${this.inputId}`).html("")
            let responseMap = this.responseCallbackFunction(result);
            for (var i = 0; i < responseMap.length; i++) {

                if ($(`#selectedItems${this.inputId} [data-selected-id="${responseMap[i].id}"]`).attr("data-selected-id") == responseMap[i].id) {
                    $(`#selectItems${this.inputId}`).append(`<li class="selectedLi" onclick="searchableSelectApi.run('${this.inputId}', 'removeItemFromList',this)" data-id="${responseMap[i].id}">${responseMap[i].text}</li>`)
                }
                else {
                    $(`#selectItems${this.inputId}`).append(`<li data-id="${responseMap[i].id}" onclick="searchableSelectApi.run('${this.inputId}', 'addItemFromList',this)">${responseMap[i].text}</li>`)
                }
            }
        }).bind(this));
    }

    addItemFromList = (e) => {
        if ($(e).parent().hasClass("selectItems")) {
            if ($(e).hasClass("selectedLi")) {
                this.selectedList.removeByValue($(e).attr('data-id'))
                $(`[data-selected-id="${$(e).attr('data-id')}"]`).remove()
            }
            else {
                this.selectedList.push($(e).attr('data-id'))
                $(`#selectedItems${this.inputId}`).append(`<li data-selected-id="${$(e).attr('data-id')}"><span aria-hidden="true" style="margin-right: 5px;"  onclick="searchableSelectApi.run('${this.inputId}', 'removeItemFromList',this)">×</span>${e.innerText}</li>`)
            }
            $(e).toggleClass("selectedLi")
            $(`#${this.inputId}`).val(this.selectedList);
        }
        this.PlaceHolder();
    }
    removeItemFromList = (e) => {
        if ($(e).parent().parent().hasClass("selectedItems")) {
            $(e).parent().remove();
            this.selectedList.removeByValue($(e).parent().attr('data-selected-id'))
            $(`[data-id="${$(e).parent().attr('data-selected-id')}"`).toggleClass("selectedLi")
        }
        this.PlaceHolder();
        $(`#${this.inputId}`).val(this.selectedList);
    }
}


class searchableSelect {
    _usedInstances = {
    }
    Create(inputId, dataUrl) {
        if (!(this._usedInstances[inputId] instanceof _searchableSelect)) {
            this._usedInstances[inputId] = new _searchableSelect(inputId, dataUrl);
        }
        return this._usedInstances[inputId];
    }

    getInstance(inputId) {
        if ((this._usedInstances[inputId] instanceof _searchableSelect)) {
            return this._usedInstances[inputId];
        }
        return undefined;
    }

    removeInstance(inputId) {
        if ((this._usedInstances[inputId] instanceof _searchableSelect)) {
            delete this._usedInstances[inputId];
        }
    }

    run(inputId, funcName, params) {
        if ((this._usedInstances[inputId] instanceof _searchableSelect)) {
            if (typeof this._usedInstances[inputId][funcName] === "function") {
                return this._usedInstances[inputId][funcName](params);
            }
        }
    }
}

const searchableSelectApi = new searchableSelect();







Array.prototype.removeByValue = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === val) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
}