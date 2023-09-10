'use strict'
class HeatmapPlugin {
    _data = {};
    _options = {
        legend: true,
        timescale: true,
        range: {
            from: '#year#-01-01T00:00:00',
            till: '#year#-12-30T00:00:00',
            grade: 1,
            interval: 'day', //month, year, hours, minutes
            rows: 7,
        },
        units: 5
    };
    _theme = {
        width: '10',
        height: '10',
        font: {
            size: '10',
            family: 'Arial',
            color: 'white'
        }
    };
    _container = null;

    /**
     * sets data, options and theme, and maybe renders the heatmap
     * @param containerId
     * @param data
     * @param options
     * @param theme
     * @param instantRender render it instant or wait for render()
     */
    constructor(containerId, data = {}, options = {}, theme = {}, instantRender = false){
        this.transferObject(options,this._options,'range');
        // check which school term
        const start_spring = new Date().getFullYear()+'-03-01T00:00:00';
        const end_spring   = new Date().getFullYear()+'-07-20T00:00:00';
        const start_autumn = new Date().getFullYear()+'-09-01T00:00:00';
        const end_autumn   = new Date().getFullYear()+1+'-01-20T00:00:00';
        if (new Date() >= new Date(start_spring) && new Date() <= new Date(end_spring)){
            this._options.range.from = start_spring;
            this._options.range.till = end_spring;
        } else if (new Date() >= new Date(start_autumn) && new Date() <= new Date(end_autumn)){
            this._options.range.from = start_autumn;
            this._options.range.till = end_autumn;
        } else {
            this._options.range.from = new Date().getFullYear()+'-01-01T00:00:00';;
            this._options.range.till = new Date().getFullYear()+'-12-30T00:00:00';;
        }

        var tmp_from = new Date(this._options.range.from);
        while (true){
            if (tmp_from.getDay() == '1'){
                break;
            } else {
                tmp_from.setDate(tmp_from.getDate()-1);
            }
        }

        // generate data
        var data_current = new Date(this._options.range.from);
        var data_end     = new Date(this._options.range.till);
        var idx;
        while(data_current <= data_end){
            idx = data_current.getDate()+'.'+(data_current.getMonth()+1)+'.'+data_current.getFullYear()+
                'T'+data_current.getHours()+':'+data_current.getMinutes()+':'+data_current.getSeconds();
            if(data_current <= new Date()){
                data[idx] = 4;
            }
            data_current.setDate(data_current.getDate()+1);
        }
        this._data = data;

        this._options.range.from = tmp_from.toISOString();

        this.transferObject(theme,this._theme,'font');

        this._container = window.document.getElementById(containerId);
        if('undefined' === typeof(this._container))
            throw 'heatmap container '+containerId+' not found.';

        if(instantRender)
            this.render();
    }

    /**
     * transfer parameter object to class object
     * @param src object
     * @param dest object
     * @param sub string
     */
    transferObject(src,dest, sub){
        if(src !== {}) {
            for (const [key, value] of Object.entries(src)) {
                if (key === 'colors')
                    for (const [rangeKey, rangeValue] of Object.entries(value)) {
                        dest[sub][rangeKey] = rangeValue;
                    }
                else
                    dest[key] = value;
            }
        }
    }

    /**
     * renders the heatmap with given data
     */
    render(){
        //TODO: hourly produces: Uncaught InternalError: allocation size overflow
        let unit;
        let html = '';
        let current = new Date(this._options.range.from);
        let target = new Date(this._options.range.till);
        let data = this._data;
        while (current <= target) {
            unit = current.getDate() + '.' + (current.getMonth() + 1) + '.' + current.getFullYear() +
                'T' + current.getHours() + ':' + current.getMinutes() + ':' + current.getSeconds();
            html += '<div style="'+
                    'height: '+this._theme.height+'px; '+
                    'width: '+this._theme.width+'px; '+
                    '" class="entry color-';
            if('undefined' !== typeof(data[unit]))
                html += data[unit]+'" title="'+
                    current.toLocaleString()+' - '+
                    data[unit]+
                    '"';
            else
                html += '0"';
            html += '></div>';
            //TODO: one day is missing!
            switch (this._options.range.interval) {
                case 'day':
                    current.setDate(current.getDate() + this._options.range.grade);
                    break;
                case 'month':
                    current.setDate(current.getMonth() + this._options.range.grade);
                    break;
                case 'hours':
                    current.setDate(current.getHours() + this._options.range.grade);
                    break;
                case 'minutes':
                    current.setDate(current.getMinutes() + this._options.range.grade);
                    break;
                case 'seconds':
                    current.setDate(current.getSeconds() + this._options.range.grade);
                    break;
                default:
                    current.setDate(current.getFullYear() + this._options.range.grade);
                    break;
            }
        }
        this._container.style.height = (this._theme.height*this._options.range.rows+(2*this._options.range.rows))+'px';
        this._container.innerHTML = html;
        if(this._options.legend)
            this.addLegend()
    }
    addLegend(){
        let legend = document.createElement('div');
        legend.style.color = this._theme.font.color;
        legend.style.fontSize = this._theme.font.size+'px';
        legend.style.fontFamily = this._theme.font.family;
        this._container.parentNode.insertBefore(legend, this._container.nextSibling);

        //TODO: add time scale captions
    }
}
