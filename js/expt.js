//  ######  ##     ## ########        ## ########  ######  ########
// ##    ## ##     ## ##     ##       ## ##       ##    ##    ##
// ##       ##     ## ##     ##       ## ##       ##          ##
//  ######  ##     ## ########        ## ######   ##          ##
//       ## ##     ## ##     ## ##    ## ##       ##          ##
// ##    ## ##     ## ##     ## ##    ## ##       ##    ##    ##
//  ######   #######  ########   ######  ########  ######     ##

class subjObject {
    constructor(options = {}) {
        Object.assign(this, {
            num: 'pre-post',
            subjNumScript: '',
            subjNumCallback: function(){},
            savingScript: '',
            subjNumFile: '',
            visitFile: 'visit.txt',
            attritionFile: 'attrition.txt',
            subjFile: 'subj.txt',
            savingDir: 'data/testing',
            condition: false,
            conditionList: [''],
            titles: [''],
            viewportMinW: 0,
            viewportMinH: 0,
            handleVisibilityChange: function(){},
        }, options);
        if (this.num == 'pre-post') {
            this.obtainSubjNum();
        }
        this.data = LIST_TO_FORMATTED_STRING(this.titles);
        this.dateObj = new Date();
        this.date = FORMAT_DATE(this.dateObj, 'UTC', '-', true);
        this.startTime = FORMAT_TIME(this.dateObj, 'UTC', ':', true);
        this.userAgent = window.navigator.userAgent;
        this.hiddenCount = 0;
        this.hiddenDurations = [];
    }

    obtainSubjNum() {
        let that = this;
        function SUBJ_NUM_UPDATE_SUCCEEDED(number) {
            that.num = number;
            that.subjNumCallback();
            if (that.condition == 'auto') {
                that.assignCondition();
            }
        }
        function SUBJ_NUM_UPDATE_FAILED() {
            that.num = -999;
            that.subjNumCallback();
        }
        // POST_DATA(this.subjNumScript, { 'directory_path': this.savingDir, 'file_name': this.subjNumFile }, SUBJ_NUM_UPDATE_SUCCEEDED, SUBJ_NUM_UPDATE_FAILED);
    }

    assignCondition() {
        let that = this;
        const CHECK_SUBJ_NUM = function(){
            if(that.num != 'pre-post'){
                clearInterval(interval_id);
                that.condition = that.conditionList[(that.num-1) % that.conditionList.length];
                that.conditionAssigned = true;
            }
        };
        let interval_id = setInterval(CHECK_SUBJ_NUM, 10);
    }

    saveVisit() {
        let data = 'subjNum\tstartDate\tstartTime\tid\tuserAgent\tinView\tviewportW\tviewportH\n';
        this.viewport = this.viewportSize;
        this.inView = this.viewport['inView'];
        this.viewportW = this.viewport['w'];
        this.viewportH = this.viewport['h'];
        let dataList = [this.num, this.date, this.startTime, this.id, this.userAgent, this.inView, this.viewportW, this.viewportH];
        data += LIST_TO_FORMATTED_STRING(dataList);
        let postData = {
            'directory_path': this.savingDir,
            'file_name': this.visitFile,
            'data': data
        };
        // $.ajax({
        //     type: 'POST',
        //     url: this.savingScript,
        //     data: postData,
        // });
    }

    getID(get_variable) {
        let id = GET_PARAMETERS(get_variable, null);
        let valid_id = (id !== null);
        if (valid_id) {
            id = id.replace(/\s+/g, '');
            valid_id = (id !== '');
        }
        if (valid_id) {
            this.valid_id = true;
            return id;
        } else {
            this.valid_id = false;
            return null;
        }
    }

    checkID(id) {
        let invalid_id = (id == null);
        if (!invalid_id) {
            id = id.replace(/\s+/g, '');
            invalid_id = (id == '');
        }
        if (invalid_id) {
            return null;
        } else {
            return id;
        }
    }

    get phone() {
        let md = new MobileDetect(this.userAgent);
        return md.mobile() ? true : false;
    }

    get viewportSize() {
        let w = $(window).width();
        let h = $(window).height();
        let inView = (w >= this.viewportMinW) && (h >= this.viewportMinH);
        return { 'h': h, 'w': w, 'inView': inView };
    }

    saveAttrition() {
        let data = 'subjNum\tstartDate\tstartTime\tid\tuserAgent\tinView\tviewportW\tviewportH\n';
        this.viewport = this.viewportSize;
        this.inView = this.viewport['inView'];
        this.viewportW = this.viewport['w'];
        this.viewportH = this.viewport['h'];
        let dataList = [this.num, this.date, this.startTime, this.id, this.userAgent, this.inView, this.viewportW, this.viewportH];
        data += LIST_TO_FORMATTED_STRING(dataList);
        let postData = {
            'directory_path': this.savingDir,
            'file_name': this.attritionFile,
            'data': data
        };
        // $.ajax({
        //     type: 'POST',
        //     url: this.savingScript,
        //     data: postData,
        // });
    }

    submitQ() {
        let endTimeObj = new Date();
        this.endTime = FORMAT_TIME(endTimeObj, 'UTC', ':', true);
        this.duration = (endTimeObj - this.dateObj) / 60000; // in minutes
        let dataList = LIST_FROM_ATTRIBUTE_NAMES(this, this.titles);
        this.data += LIST_TO_FORMATTED_STRING(dataList);
        let postData = {
            'directory_path': this.savingDir,
            'file_name': this.subjFile,
            'data': this.data
        };
        // $.ajax({
        //     type: 'POST',
        //     url: this.savingScript,
        //     data: postData,
        // });
    }

    detectVisibilityStart() {
        let that = this;
        document.addEventListener('visibilitychange', that.handleVisibilityChange);
    }

    detectVisibilityEnd() {
        let that = this;
        document.removeEventListener('visibilitychange', that.handleVisibilityChange);
    }
}

// ######## ########  ####    ###    ##
//    ##    ##     ##  ##    ## ##   ##
//    ##    ##     ##  ##   ##   ##  ##
//    ##    ########   ##  ##     ## ##
//    ##    ##   ##    ##  ######### ##
//    ##    ##    ##   ##  ##     ## ##
//    ##    ##     ## #### ##     ## ########

class trialObject {
    constructor(options = {}) {
        Object.assign(this, {
            subj: false,
            pracTrialN: 0,
            trialN: 0,
            titles: '',
            savingScript: '',
            dataFile: '',
            stimPath: 'media/',
            savingDir: 'data/testing',
            trialList: [],
            pracList: [],
            intertrialInterval: 0.5,
            updateFunc: false,
            trialFunc: false,
            endExptFunc: false,
            progressInfo: false
        }, options);
        this.num = this.subj.num;
        this.date = this.subj.date;
        this.subjStartTime = this.subj.startTime;
        this.blockNum = 0;
        this.trialNum = -this.pracTrialN;
        this.allData = LIST_TO_FORMATTED_STRING(this.titles);
        this.complete = false;
    }

    run() {
        let that = this;

        if (this.progressInfo) {
            this.progress = Math.round( 100 * (this.trialNum+this.pracTrialN) / (this.trialN+this.pracTrialN) );
        }
        this.trialNum++;
        const FORMAL = this.trialNum > 0;
        const LAST = FORMAL ? this.trialNum == this.trialN : this.trialNum == 0;
        this.thisTrial = FORMAL ? this.trialList.shift() : this.pracList.shift();

        function findNextTrial(last, formal) {
            if (last){
                return false
            } else {
                return formal ? that.trialList[that.trialList.length - 1] : that.pracList[that.pracList.length - 1];
            }
        }
        const NEXT_TRIAL = findNextTrial(LAST, FORMAL);

        this.updateFunc(FORMAL, LAST, this.thisTrial, NEXT_TRIAL, this.stimPath);

        const START_STIM = function() {
            that.trialFunc();
            that.startTime = Date.now();
        };

        setTimeout(START_STIM, this.intertrialInterval * 1000);
    }

    end(resp) {
        var currentTime = Date.now();
        this.rt = (currentTime - this.startTime) / 1000; // in second
        this.response = resp;
        if (this.trialNum > 0) {
            let dataList = LIST_FROM_ATTRIBUTE_NAMES(this, this.titles);
            this.allData += LIST_TO_FORMATTED_STRING(dataList);
        }
        if (this.trialNum < this.trialN) {
            this.run();
        } else {
            this.complete = true;
            this.endExptFunc();
        }
    }

    rest(box_element, text_element, callback, callback_parameters) {
        text_element.html('You are done with '+ this.progress + '% of the study!<br /><br />Take a short break now and hit space to continue whenever you are ready.')
        box_element.show();
        $(document).keyup(function(e) {
            if (e.which == 32) {
                $(document).off('keyup');
                box_element.hide();
                if (typeof callback_parameters == 'undefined') {
                    callback();
                }
                else {
                    callback(callback_parameters);
                }
            }
        });
    }

    save() {
        let postData = {
            'directory_path': this.savingDir,
            'file_name': this.dataFile,
            'data': this.allData // data to save
        };
        // $.ajax({
        //     type: 'POST',
        //     url: this.savingScript,
        //     data: postData,
        // });
    }
}



// #### ##    ##  ######  ######## ########
//  ##  ###   ## ##    ##    ##    ##     ##
//  ##  ####  ## ##          ##    ##     ##
//  ##  ## ## ##  ######     ##    ########
//  ##  ##  ####       ##    ##    ##   ##
//  ##  ##   ### ##    ##    ##    ##    ##
// #### ##    ##  ######     ##    ##     ##

class instrObject {
    constructor(options = {}) {
        Object.assign(this, {
            textBox: false,
            textElement: false,
            arr: [],
            quizConditions: []
        }, options);
        this.index = 0;
        this.quizAttemptN = {};
        for (let quizCond of this.quizConditions){
            this.quizAttemptN[quizCond] = 1;
        }
        this.readingTimes = {};
    }

    start() {
        this.advance();
    }

    advance() {
        this.textElement.html(this.arr[this.index][2]);
        const PRE_FUNCTION = this.arr[this.index][0];
        if (PRE_FUNCTION !== false) {
            PRE_FUNCTION();
        }
        this.textBox.show();
        const POST_FUNCTION = this.arr[this.index][1];
        if (POST_FUNCTION !== false) {
            POST_FUNCTION();
        }
        this.startTime = Date.now();
    }


    next() {
        this.textBox.hide();
        this.saveReadingTime();
        const START_NEXT = () => {
            this.index += 1;
            if (this.index < this.arr.length) {
                this.advance();
            }
        }

        setTimeout(START_NEXT, 200);
    }

    saveReadingTime() {
        let readingTime = (Date.now() - this.startTime)/1000;
        if (typeof(this.readingTimes[this.index])=='undefined'){
            this.readingTimes[this.index] = readingTime;
        }
        else{
            if (this.readingTimes[this.index] < readingTime){
                this.readingTimes[this.index] = readingTime;
            }
        }
    }
}