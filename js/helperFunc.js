// ########  #######  ########  ##     ##    ###    ########
// ##       ##     ## ##     ## ###   ###   ## ##      ##
// ##       ##     ## ##     ## #### ####  ##   ##     ##
// ######   ##     ## ########  ## ### ## ##     ##    ##
// ##       ##     ## ##   ##   ##     ## #########    ##
// ##       ##     ## ##    ##  ##     ## ##     ##    ##
// ##        #######  ##     ## ##     ## ##     ##    ##

function CAPITALIZE(s) {
    if (typeof s !== 'string'){
        return '';
    } else {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
}

function LIST_TO_FORMATTED_STRING(data_list, divider) {
    divider = (divider === undefined) ? '\t' : divider;
    var string = '';
    for (var i = 0; i < data_list.length - 1; i++) {
        string += data_list[i] + divider;
    }
    string += data_list[data_list.length - 1] + '\n';
    return string;
}

function FORMAT_DATE(date_obj, time_zone, divider, padded) {
    date_obj = (date_obj === undefined) ? new Date() : date_obj;
    time_zone = (time_zone === undefined) ? 'UTC' : time_zone;
    divider = (divider === undefined) ? '.' : divider;
    padded = (padded === undefined) ? true : padded;
    const NOW_YEAR = (time_zone == 'UTC') ? date_obj.getUTCFullYear() : date_obj.getFullYear();
    var now_month = (time_zone == 'UTC') ? date_obj.getUTCMonth()+1 : date_obj.getMonth()+1;
    var now_date = (time_zone == 'UTC') ? date_obj.getUTCDate() : date_obj.getDate();
    if (padded) {
        now_month = ('0' + now_month).slice(-2);
        now_date = ('0' + now_date).slice(-2);
    }
    const NOW_FULL_DATE = NOW_YEAR + divider + now_month + divider + now_date;
    return NOW_FULL_DATE;
}

function FORMAT_TIME(date_obj, time_zone, divider, padded) {
    date_obj = (date_obj === undefined) ? new Date() : date_obj;
    time_zone = (time_zone === undefined) ? 'UTC' : time_zone;
    divider = (divider === undefined) ? ':' : divider;
    padded = (padded === undefined) ? true : padded;
    var now_hours = (time_zone == 'UTC') ? date_obj.getUTCHours() : date_obj.getHours();
    var now_minutes = (time_zone == 'UTC') ? date_obj.getUTCMinutes() : date_obj.getMinutes();
    var now_seconds = (time_zone == 'UTC') ? date_obj.getUTCSeconds() : date_obj.getSeconds();
    if (padded) {
        now_hours = ('0' + now_hours).slice(-2);
        now_minutes = ('0' + now_minutes).slice(-2);
        now_seconds = ('0' + now_seconds).slice(-2);
    }
    const NOW_FULL_TIME = now_hours + divider + now_minutes + divider + now_seconds;
    return NOW_FULL_TIME;
}

//    ###    ########  ########     ###    ##    ##
//   ## ##   ##     ## ##     ##   ## ##    ##  ##
//  ##   ##  ##     ## ##     ##  ##   ##    ####
// ##     ## ########  ########  ##     ##    ##
// ######### ##   ##   ##   ##   #########    ##
// ##     ## ##    ##  ##    ##  ##     ##    ##
// ##     ## ##     ## ##     ## ##     ##    ##

function GENERATE_TRIAL_LIST(images, background_images){
    let res = [];
    for(let bg of background_images){
        for(let img of images){
            let obj = {
                'backgroundImage': bg,
                'stimuli': img[0],
                'direction': img[1]
            };
            res.push(obj);
        }
    }
    return res;
}

function GENERATE_IMG_LIST(images, background_images){
    let res = [];
    for(let img of images){
        res.push(img[0]);
    }
    for(let bg of background_images){
        res.push(bg);
    }
    return res;
}

function SHUFFLE_ARRAY(input_array) {
    var j, temp;
    var arr = Array.from(input_array);
    for (var i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

function RAND_CHOICE(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function CONCAT_DUPLICATED_ARRAY(arr, repeat_n) {
    var new_arr = [];
    for (var i = 0; i < repeat_n; i++) {
        new_arr = new_arr.concat(arr.slice());
    }
    return new_arr;
}

// ########  ########  #######  ######## ##     ##  ######  ########
// ##     ## ##       ##     ## ##       ##     ## ##    ##    ##
// ##     ## ##       ##     ## ##       ##     ## ##          ##
// ########  ######   ##     ## ######   ##     ##  ######     ##
// ##   ##   ##       ##  ## ## ##       ##     ##       ##    ##
// ##    ##  ##       ##    ##  ##       ##     ## ##    ##    ##
// ##     ## ########  ##### ## ########  #######   ######     ##

function GET_PARAMETERS(var_name, default_value) {
    const REGEX_STRING = "[\?&]" + var_name + "=([^&#]*)";
    const REGEX = new RegExp(REGEX_STRING);
    const URL = location.href;
    const RESULTS = REGEX.exec(URL);
    if (RESULTS == null) {
        return default_value;
    } else {
        return RESULTS[1];
    }
}

function POST_DATA(page, data, success_func, error_callback) {
    data = (data === undefined) ? null : data;
    success_func = (success_func === undefined) ? function() { return; } : success_func;
    error_callback = (error_callback === undefined) ? function() { return; } : error_callback;
    $.ajax({
        type: "POST",
        url: page,
        data: data,
        success: success_func,
        error: error_callback
    });
}


// ##        #######     ###    ########  #### ##    ##  ######
// ##       ##     ##   ## ##   ##     ##  ##  ###   ## ##    ##
// ##       ##     ##  ##   ##  ##     ##  ##  ####  ## ##
// ##       ##     ## ##     ## ##     ##  ##  ## ## ## ##   ####
// ##       ##     ## ######### ##     ##  ##  ##  #### ##    ##
// ##       ##     ## ##     ## ##     ##  ##  ##   ### ##    ##
// ########  #######  ##     ## ########  #### ##    ##  ######

function LOAD_IMG(index, stim_path, img_list, after_func) {
    after_func = (after_func === undefined) ? function() { return; } : after_func;
    if (index >= img_list.length) {
        return;
    }
    const IMAGE = new Image();
    if (index < img_list.length - 1) {
        IMAGE.onload = function() {
            LOAD_IMG(index + 1, stim_path, img_list, after_func);
        };
    } else {
        IMAGE.onload = after_func;
    }
    IMAGE.src = stim_path + img_list[index];
}

//  ######   #######  ##    ## ######## ######## ##    ## ########
// ##    ## ##     ## ###   ##    ##    ##       ###   ##    ##
// ##       ##     ## ####  ##    ##    ##       ####  ##    ##
// ##       ##     ## ## ## ##    ##    ######   ## ## ##    ##
// ##       ##     ## ##  ####    ##    ##       ##  ####    ##
// ##    ## ##     ## ##   ###    ##    ##       ##   ###    ##
//  ######   #######  ##    ##    ##    ######## ##    ##    ##

function LIST_FROM_ATTRIBUTE_NAMES(obj, string_list) {
    var list = []
    for (let i in string_list) {
        list.push(obj[string_list[i]]);
    }
    return list;
}

function CHECK_IF_RESPONDED(open_ended_list, choice_list) {
    var all_responded = true;
    for (var i in open_ended_list) {
        all_responded = all_responded && (open_ended_list[i].replace(/(?:\r\n|\r|\n|\s)/g, '') != '');
    }
    for (var j in choice_list) {
        all_responded = all_responded && (typeof choice_list[j] !== 'undefined');
    }
    return all_responded;
}


function CHECK_FULLY_IN_VIEW(el) {
    el = el.get(0);
    const RECT = el.getBoundingClientRect();
    const TOP = RECT.top;
    const BOTTOM = RECT.bottom;
    const LEFT = RECT.left;
    const RIGHT = RECT.right;

    const W = $(window).width();
    const H = $(window).height();
    const IS_VISIBLE = (TOP >= 0) && (BOTTOM <= H) && (LEFT >= 0) && (RIGHT <= W);
    return IS_VISIBLE;
}

function MAXIMIZE_WINDOW() {
    let el = document.documentElement;
    if (el.requestFullscreen) {
        el.requestFullscreen();
    } else if (el.mozRequestFullScreen) {
        /* Firefox */
        el.mozRequestFullScreen();
    } else if (el.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        el.webkitRequestFullscreen();
    } else {
        /* IE/Edge */
        el.msRequestFullscreen();
    }
}

function EXIT_MAXIMIZE_WINDOW() {
    let el = document;
    if (el.exitFullscreen) {
        el.exitFullscreen();
    } else if (el.mozCancelFullScreen) {
        /* Firefox */
        el.mozCancelFullScreen();
    } else if (el.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        el.webkitExitFullscreen();
    } else {
        /* IE/Edge */
        el.msExitFullscreen();
    }
}
