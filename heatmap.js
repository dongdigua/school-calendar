options = {
    range: {},
    length: 10,
    bg:'#39d353'
};

function calculate_date() {
    const start_spring = new Date().getFullYear()+'-03-01T00:00:00';
    const end_spring   = new Date().getFullYear()+'-07-20T00:00:00';
    const start_autumn = new Date().getFullYear()+'-09-01T00:00:00';
    const end_autumn   = new Date().getFullYear()+1+'-01-20T00:00:00';
    if (new Date() >= new Date(start_spring) && new Date() <= new Date(end_spring)){
        options.range.from = start_spring;
        options.range.till = end_spring;
    } else if (new Date() >= new Date(start_autumn) && new Date() <= new Date(end_autumn)){
        options.range.from = start_autumn;
        options.range.till = end_autumn;
    } else {
        options.range.from = new Date().getFullYear()+'-01-01T00:00:00';;
        options.range.till = new Date().getFullYear()+'-12-30T00:00:00';;
    }
}

function generate_data() {
    var tmp_from = new Date(options.range.from);
    while (true){
        if (tmp_from.getDay() == '1'){
            break;
        } else {
            tmp_from.setDate(tmp_from.getDate()-1);
        }
    }

    var data_current = new Date(options.range.from);
    var data_end     = new Date(options.range.till);
    var idx;
    var data = {};
    while(data_current <= data_end){
        idx = data_current.getDate()+'.'+(data_current.getMonth()+1)+'.'+data_current.getFullYear()+
            'T'+data_current.getHours()+':'+data_current.getMinutes()+':'+data_current.getSeconds();
        if(data_current <= new Date()){
            data[idx] = 4;
        }
        data_current.setDate(data_current.getDate()+1);
    }

    options.range.from = tmp_from;
    return data;
}

function render(containerId, data, options) {
    let html = '';
    let current = new Date(options.range.from);
    let target = new Date(options.range.till);
    while (current <= target) {
        unit = current.getDate() + '.' + (current.getMonth() + 1) + '.' + current.getFullYear() +
            'T' + current.getHours() + ':' + current.getMinutes() + ':' + current.getSeconds();
        html += '<div class="entry" style="'+
            'height: 10px;width:10px;'+
            'background-color:';
        if('undefined' !== typeof(data[unit]))
            html += options.bg+'" title="'+
            current.toLocaleString()+' - '+
            data[unit]+
            '"';
        else
            html += '#ebedf0"';
        html += '></div>';

        current.setDate(current.getDate()+1);
    }
    container = window.document.getElementById(containerId);
    container.style.height = (options.length+2)*7+'px';
    container.innerHTML = html;
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

function make_calendar(id) {
    var color = GetQueryString('color')
    if (color != null) { options.bg = '#'+color; }
    calculate_date();
    var data = generate_data();
    render(id, data, options);
    console.log('By dongdigua: https://github.com/dongdigua/school-calendar\nYou can change color with "?color=" parameter')
}
