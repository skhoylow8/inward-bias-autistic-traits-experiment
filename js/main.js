// ######## ##     ## ########  ########
// ##        ##   ##  ##     ##    ##
// ##         ## ##   ##     ##    ##
// ######      ###    ########     ##
// ##         ## ##   ##           ##
// ##        ##   ##  ##           ##
// ######## ##     ## ##           ##

// data saving
const FORMAL = true;
const EXPERIMENT_NAME = "inward_bias";
const SUBJ_NUM_SCRIPT = "php/subjNum.php";
const SAVING_SCRIPT = "php/save.php";
const VISIT_FILE = "visit_" + EXPERIMENT_NAME + ".txt";
const SUBJ_NUM_FILE = "subjNum_" + EXPERIMENT_NAME + ".txt";
const ATTRITION_FILE = "attrition_" + EXPERIMENT_NAME + ".txt";
const TRIAL_FILE = "trial_" + EXPERIMENT_NAME + ".txt";
const SUBJ_FILE = "subj_" + EXPERIMENT_NAME + ".txt";
const SAVING_DIR = FORMAL ? "data/formal":"data/testing";
const ID_GET_VARIABLE_NAME = "sonacode";

// stimuli
const STIM_PATH = "media/";
const TRIAL_PRACTICE_LIST = [{"backgroundImage": "prac_background.png", "stimuli": "prac.png"}];
const PRACTICE_TRIAL_N = TRIAL_PRACTICE_LIST.length;
const IMAGES = [
    ["averted_gaze/CC_L2_small.png", "left"],
    ["averted_gaze/CC_R2_small.png", "right"],
    ["averted_gaze/YC_L2_small.png", "left"],
    ["averted_gaze/YC_R2_small.png", "right"],
    ["chair/Chair_L_small.png", "left"],
    ["chair/Chair_R_small.png", "right"],
    ["chair/Chair_Black_L.png", "left"],
    ["chair/Chair_Black_R.png", "right"],
];
const BACKGROUND_IMAGES = [
    "background/grassfield_adjusted.png",
    "background/sea_adjusted.png"
];
const TRIAL_LIST = GENERATE_TRIAL_LIST(IMAGES, BACKGROUND_IMAGES)
const TRIAL_IMG_LIST = SHUFFLE_ARRAY(TRIAL_LIST);
const TRIAL_N = TRIAL_IMG_LIST.length;
const INSTR_TRIAL_N = PRACTICE_TRIAL_N + TRIAL_N;
const INTERTRIAL_INTERVAL = 0.5;
const INSTR_IMG_LIST = ["maximize_window.png", "prac.png", "prac_background.png"];
const ALL_IMG_LIST = GENERATE_IMG_LIST(IMAGES, BACKGROUND_IMAGES).concat(INSTR_IMG_LIST);

// criteria
const VIEWPORT_MIN_W = 800;
const VIEWPORT_MIN_H = 600;
const INSTR_READING_TIME_MIN = 0.3;

// stimuli
let image_original_pos_x = 0;
const FRAME_WIDTH = 670;
const FRAME_HEIGHT = 300;

// object variables
var instr, subj, trial;

$(document).ready(()=>{
    subj = new subjObject(subj_options);
    subj.id = subj.getID(ID_GET_VARIABLE_NAME);
    subj.saveVisit();
    if (subj.phone) {
        HALT_EXPERIMENT("It seems that you are using a touchscreen device or a phone. Please use a laptop or desktop instead.<br /><br />If you believe you have received this message in error, please contact the experimenter at yichiachen@ucla.edu<br /><br />Otherwise, please switch to a laptop or a desktop computer for this experiment.");
    } else if (subj.valid_id){
        LOAD_IMG(0, STIM_PATH, ALL_IMG_LIST, function() {});
        instr = new instrObject(instr_options);
        trial_options["subj"] = subj;
        trial = new trialObject(trial_options);
        instr.start();
    }
});

//  ######  ##     ## ########        ## ########  ######  ########
// ##    ## ##     ## ##     ##       ## ##       ##    ##    ##
// ##       ##     ## ##     ##       ## ##       ##          ##
//  ######  ##     ## ########        ## ######   ##          ##
//       ## ##     ## ##     ## ##    ## ##       ##          ##
// ##    ## ##     ## ##     ## ##    ## ##       ##    ##    ##
//  ######   #######  ########   ######  ########  ######     ##

const SUBJ_TITLES = [
    "num",
    "date",
    "startTime",
    "id",
    "userAgent",
    "endTime",
    "duration",
    "quizAttemptN",
    "instrReadingTimes",
    "quickReadingPageN",
    "hiddenCount",
    "hiddenDurations",
    "seen",
    "letter",
    "aqResponses",
    "aqRt",
    "serious",
    "maximized",
    "problems",
    "gender",
    "age",
    "inView",
    "viewportW",
    "viewportH"
];

function UPDATE_TRIAL_OBJECT_SUBJ_NUM() {
    if (typeof trial !== "undefined"){
        trial.num = subj.num;
    }
}

function HANDLE_VISIBILITY_CHANGE() {
    if (document.hidden) {
        subj.hiddenCount += 1;
        subj.hiddenStartTime = Date.now();
    } else  {
        subj.hiddenDurations.push((Date.now() - subj.hiddenStartTime)/1000);
    }
}

function SUBMIT_DEBRIEFING_Q() {
    const CHOICE_ATTRIBUTE_NAMES = ["serious", "maximized", "gender"];
    const OPEN_ENDED_ATTRIBUTE_NAMES = ["problems", "age"];
    for (let q of CHOICE_ATTRIBUTE_NAMES) {
        subj[q] = $("input[name="+q+"]:checked").val();
        if(!CHECK_IF_RESPONDED([], [subj[q]])){
            $("#"+q+"-warning").css("visibility", "visible");
        }else{
            $("#"+q+"-warning").css("visibility", "hidden");
        }
    }
    for (let q of OPEN_ENDED_ATTRIBUTE_NAMES) {
        subj[q] = $("#"+q).val();
        if(!CHECK_IF_RESPONDED([subj[q]], [])){
            $("#"+q+"-warning").css("visibility", "visible");
        }else{
            $("#"+q+"-warning").css("visibility", "hidden");
        }
    }

    const OPEN_ENDED_LIST = [subj.problems, subj.age];
    const CHOICE_LIST = [subj.serious, subj.gender, subj.maximized];
    const ALL_RESPONDED = CHECK_IF_RESPONDED(OPEN_ENDED_LIST, CHOICE_LIST);
    if (ALL_RESPONDED) {
        for (var i = 0; i < OPEN_ENDED_LIST.length; i++) {
            subj[OPEN_ENDED_ATTRIBUTE_NAMES[i]] = subj[OPEN_ENDED_ATTRIBUTE_NAMES[i]].replace(/(?:\r\n|\r|\n)/g, '<br />');
        }
        subj.quizAttemptN = instr.quizAttemptN['onlyQ'];
        subj.instrReadingTimes = JSON.stringify(instr.readingTimes);
        subj.quickReadingPageN = Object.values(instr.readingTimes).filter(d => d < INSTR_READING_TIME_MIN).length;
        subj.aqResponses = JSON.stringify(subj.aqResponses);
        subj.aqRt = JSON.stringify(subj.aqRt);
        subj.submitQ();
        $('#questions-box').hide();
        ALLOW_SELECTION();
        EXIT_MAXIMIZE_WINDOW();
        $('#debriefing-box').show();
        $('body').scrollTop(0);
    }
}

function ALLOW_SELECTION() {
    $("body").css({
        "-webkit-user-select":"text",
        "-moz-user-select":"text",
        "-ms-user-select":"text",
        "user-select":"text"
    });
}

function END_SONA() {
    window.location.href = "https://ucla.sona-systems.com/webstudy_credit.aspx?experiment_id=2007&credit_token=91376aea067444d6b06a3c0a5e12593f&survey_code="+subj.id;
}

function AJAX_FAILED() {
    HALT_EXPERIMENT("Oops! An error has occurred. Please email the experimenter yichiachen@g.ucla.edu with the message “AJAX_ERR” to receive credit. Sorry!");
}

function HALT_EXPERIMENT(explanation) {
    $(".page-box").hide();
    $("#instr-text").html(explanation);
    $("#next-button").hide();
    $("#instr-box").show();
}

var subj_options = {
    titles: SUBJ_TITLES,
    viewportMinW: VIEWPORT_MIN_W,
    viewportMinH: VIEWPORT_MIN_H,
    subjNumCallback: UPDATE_TRIAL_OBJECT_SUBJ_NUM,
    subjNumScript: SUBJ_NUM_SCRIPT,
    savingScript: SAVING_SCRIPT,
    subjNumFile: SUBJ_NUM_FILE,
    visitFile: VISIT_FILE,
    attritionFile: ATTRITION_FILE,
    subjFile: SUBJ_FILE,
    savingDir: SAVING_DIR,
    handleVisibilityChange: HANDLE_VISIBILITY_CHANGE
};

// #### ##    ##  ######  ######## ########
//  ##  ###   ## ##    ##    ##    ##     ##
//  ##  ####  ## ##          ##    ##     ##
//  ##  ## ## ##  ######     ##    ########
//  ##  ##  ####       ##    ##    ##   ##
//  ##  ##   ### ##    ##    ##    ##    ##
// #### ##    ##  ######     ##    ##     ##

const MAIN_INSTRUCTIONS_ARR = [
    [false, false, "Thank you for participating!<br /><br />This study will take about 20 minutes. Please read the instructions carefully, and avoid using the refresh or back buttons."],
    [false, false, "In this experiment, I am interested in what “looks good” to you. In particular, how the framing of an image influences your aesthetic experience."],
    [false, false, "There are three parts to this experiment. I am going to walk you through the first part, and will explain the rest when we get to them."],
    [SHOW_MAXIMIZE_WINDOW, false, "For this study to work, the webpage will automatically switch to the full-screen view on the next page. Please stay in the full screen mode until the study automatically switches out from it."],
    [SHOW_TRIAL_IMG, MAXIMIZE_WINDOW, "In the first part, you will view an image in a frame (as in the example below). As you can see below, there will be a figure (an object or a person) in the image."],
    [HIDE_TRIAL_IMG, false, "Your job is to make the image look as good as possible to you by adjusting the horizontal position of the figure in it."],
    [false, false, "That means, you will drag the figure left or right to move it within the image and drop it wherever you think makes the image look visually pleasing."],
    [false, false, "You will first practice this " + PRACTICE_TRIAL_N +" time, and do this seriously " + TRIAL_N + " times after."],
    [false, false, "Sounds good? The next page is a quick instruction quiz. (It's very simple!)"],
    [false, SHOW_INSTR_QUESTION, ""],
    [SHOW_CONSENT, false, "Great! We are going to start now. Make sure to stay focused (e.g., don't switch to other windows or tabs!)! Press SPACE when you are ready. "],
    [false, false, "You have completed the first part! In the second part, you will watch a video and answer some questions about it after."],
    [PREPARE_FOR_VIDEO, false, "Please be as focused as possible, since the video is <span class='emphasize-color'>very short</span>, and it will only be displayed <span class='emphasize-color'>once</span>!<br /><br />Hit space to start!"]
];

function SHOW_INSTR_IMG(file_name) {
    $("#instr-img").attr("src", STIM_PATH + file_name);
    $("#instr-img").css("display", "block");
}

function SHOW_TRIAL_IMG() {
    $("#instr-img").hide()
    $("#instr-test-frame").show()
}

function HIDE_INSTR_IMG() {
    $("#instr-img").css("display", "none");
}

function HIDE_TRIAL_IMG() {
    $("#instr-test-frame").css("display", "none");
}

function SHOW_MAXIMIZE_WINDOW() {
    SHOW_INSTR_IMG("maximize_window.png");
}

function SHOW_INSTR_QUESTION() {
    $("#instr-box").hide();
    $("#quiz-box").show();
}

function SUBMIT_INSTR_Q() {
    const CHOICE = $('input[name="quiz"]:checked').val();
    if (typeof CHOICE === "undefined") {
        $("#quiz-warning").text("Please answer the question. Thank you!");
    } else if (CHOICE != "horizontally") {
        instr.quizAttemptN["onlyQ"] += 1;
        instr.saveReadingTime();
        $("#instr-text").text("You have given an incorrect answer. Please read the instructions again carefully.");
        $("#instr-box").show();
        $("#quiz-box").hide();
        $('input[name="quiz"]:checked').prop("checked", false);
        instr.index = -1;
    } else {
        instr.next();
        $("#quiz-box").hide();
    }
}

function SHOW_CONSENT() {
    $("#next-button").hide();
    $("#consent-box").show();
    $(document).keyup(function(e) {
        if (e.key == " ") {
            $(document).off("keyup");
            instr.saveReadingTime();
            $("#instr-box").hide();
            $("#consent-box").hide()
            subj.saveAttrition();
            SHOW_TRIAL();
        }
    });
}

function PREPARE_FOR_VIDEO() {
    $("#next-button").hide();
    $(document).keyup(function(e) {
        if (e.key == " ") {
            $(document).off("keyup");
            instr.saveReadingTime();
            $("#instr-box").hide();
            SHOW_VIDEO();
        }
    });
}

var instr_options = {
    textBox: $("#instr-box"),
    textElement: $("#instr-text"),
    arr: MAIN_INSTRUCTIONS_ARR,
    quizConditions: ["onlyQ"]
};


// ########    ###     ######  ##    ##
//    ##      ## ##   ##    ## ##   ##
//    ##     ##   ##  ##       ##  ##
//    ##    ##     ##  ######  #####
//    ##    #########       ## ##  ##
//    ##    ##     ## ##    ## ##   ##
//    ##    ##     ##  ######  ##    ##

const TRIAL_TITLES = [
    "num",
    "date",
    "subjStartTime",
    "trialNum",
    "facingDir",
    "stimName",
    "background",
    "inView",
    "imagAdj",
    "rt"
];

function SHOW_TRIAL() {
    $("#task-box").show();
    subj.detectVisibilityStart();
    trial.run();
}

function TRIAL_UPDATE(formal_trial, last, this_trial, next_trial, path) {
    $("#trial-progress").text(trial.progress);
    $("#exp-button").prop("disabled",true);

    trial.stimName = this_trial.stimuli;
    trial.background = this_trial.backgroundImage;
    trial.facingDir = this_trial.direction;
    trial.imagAdj = 0

    $("#test-frame").css("background-image", "url(" + path + this_trial.backgroundImage + ")");
    $("#test-img").attr("src", path + this_trial.stimuli);
    $("#test-img").on("load", function() {
        $("#test-img").css("left", (FRAME_WIDTH/2)-(this.naturalWidth/2));
        image_original_pos_x = (FRAME_WIDTH/2)-(this.naturalWidth/2)
    });
    $("#test-img").click(ADJUST_IMAGE);

    if(!last){
        $("#buffer-frame").css("background-image", "url("+ path + next_trial.backgroundImage+")");
        $("#bufferImg").attr("src", path + next_trial.stimuli);
    }

    // Make image draggable
    $("#test-img").draggable({
        containment: "parent",
        axis: "x",
    });
}

const ADJUST_IMAGE = () =>{
    let imagePosX = $("#test-img").position().left;
    trial.imagAdj = imagePosX - image_original_pos_x;
    $("#exp-button").prop("disabled",false);
}

function TRIAL() {
    $("#test-frame").css("visibility", "visible");
    trial.inView = CHECK_FULLY_IN_VIEW($("#test-img"));
}

function END_TRIAL() {
    $("#test-frame").css("visibility", "hidden");
    trial.end();
}

function END_EXPT() {
    $("#task-box").hide();
    trial.save();
    instr.next();
    $("#next-button").show();
}

var trial_options = {
    titles: TRIAL_TITLES,
    pracTrialN: PRACTICE_TRIAL_N,
    trialN: TRIAL_N,
    savingScript: SAVING_SCRIPT,
    dataFile: TRIAL_FILE,
    stimPath: STIM_PATH,
    savingDir: SAVING_DIR,
    trialList: TRIAL_IMG_LIST,
    pracList: TRIAL_PRACTICE_LIST,
    intertrialInterval: INTERTRIAL_INTERVAL,
    updateFunc: TRIAL_UPDATE,
    trialFunc: TRIAL,
    endExptFunc: END_EXPT,
    progressInfo: true
};

// ##     ## #### ########  ########  #######
// ##     ##  ##  ##     ## ##       ##     ##
// ##     ##  ##  ##     ## ##       ##     ##
// ##     ##  ##  ##     ## ######   ##     ##
//  ##   ##   ##  ##     ## ##       ##     ##
//   ## ##    ##  ##     ## ##       ##     ##
//    ###    #### ########  ########  #######

function SHOW_VIDEO() {
    $("#play-button").prop("disabled",true);
    $('#video-box').show();
    let checker = window.setInterval(function(){
        if ($('#this-video')[0].readyState > 3) {
            clearInterval(checker);
            $('#play-button').text("PLAY");
            $("#play-button").prop("disabled",false);
            subj.trialStartTime = Date.now();
        }
    }, 100);
}

function PLAY_VIDEO() {
    $("#this-video")[0].onended = function(){
        $("#video-box").hide();
        $("#video-response-box").show();
        $("#seen-question").show();
        subj.videoQuestion = "seen";
    };
    $("#play-button").hide();
    $("#video-container").show();
    $("#this-video")[0].play();
}

function SUBMIT_VIDEO_QUESTION() {
    subj.seen = $("input[name=seen]:checked").val();
    subj.letter = $("#letter").val().replace(/(?:\r\n|\r|\n|\s)/g, '');
    if (typeof subj[subj.videoQuestion] == "undefined" || subj[subj.videoQuestion] == ""){
        $("#video-response-warning").css("visibility", "visible");
    } else {
        $("#video-response-warning").css("visibility", "hidden");
        if (subj.videoQuestion == 'seen') {
            $('#seen-question').hide();
            $('#letter-question').show();
            subj.videoQuestion = 'letter';
        } else {
            $("#video-response-box").hide();
            START_AQ_INSTRUCTION();
        }
    }
}


//    ###     #######
//   ## ##   ##     ##
//  ##   ##  ##     ##
// ##     ## ##     ##
// ######### ##  ## ##
// ##     ## ##    ##
// ##     ##  ##### ##

function START_AQ_INSTRUCTION() {
    $("#aq-box").show();
    $(document).keyup(function(e) {
        if (e.key == " ") {
            $(document).off("keyup");
            START_AQ();
        }
    });
}

function START_AQ() {
    $("#aq-instr-text").hide();
    subj.aqResponses = {};
    subj.aqRt = {};
    subj.aqNowQ = 1;
    $("#aqQ").text(AQ_QUESTION_DICT[1]);
    $("#aq-container").show();
    subj.aqStartTime = Date.now();
}

function AQ_RESPONSE(event) {
    const RESP = event.target.value;
    const currentTime = Date.now();
    subj.aqResponses[subj.aqNowQ] = RESP;
    subj.aqRt[subj.aqNowQ] = (currentTime - subj.aqStartTime) / 1000;
    if (subj.aqNowQ == AQ_LENGTH){
        $("#aq-box").hide();
        $("#questions-box").show();
        subj.detectVisibilityEnd();
    } else {
        $("#aqQ").css('visibility','hidden');
        const NEXT_AQ = () =>{
            subj.aqNowQ += 1;
            $("#aqQ").text(AQ_QUESTION_DICT[subj.aqNowQ]);
            $("#aq-progress").text( Math.round(100 * (subj.aqNowQ-1) / AQ_LENGTH) );
            $("#aqQ").css('visibility','visible');
            subj.aqStartTime = Date.now();
        }

        setTimeout(NEXT_AQ, 200);
    }
}

// AQ variables
const AQ_QUESTION_DICT = {
    1: "I prefer to do things with others rather than on my own.",
    2: "I prefer to do things the same way over and over again.",
    3: "If I try to imagine something, I find it very easy to create a picture in my mind.",
    4: "I frequently get so strongly absorbed in one thing that I lose sight of other things.",
    5: "I often notice small sounds when others do not.",
    6: "I usually notice car number plates or similar strings of information.",
    7: "Other people frequently tell me that what I've said is impolite, even though I think it is polite.",
    8: "When I'm reading a story, I can easily imagine what the characters might look like.",
    9: "I am fascinated by dates (calendar dates).",
    10: "In a social group, I can easily keep track of several different people's conversations.",
    11: "I find social situations easy.",
    12: "I tend to notice details that others do not.",
    13: "I would rather go to a library than to a party.",
    14: "I find making up stories easy.",
    15: "I find myself drawn more strongly to people than to things.",
    16: "I tend to have very strong interests, which I get upset about if I can't pursue.",
    17: "I enjoy social chitchat.",
    18: "When I talk, it isn't always easy for others to get a word in.",
    19: "I am fascinated by numbers.",
    20: "When I'm reading a story, I find it difficult to work out the characters' intentions.",
    21: "I don't particularly enjoy reading fiction.",
    22: "I find it hard to make new friends.",
    23: "I notice patterns in things all the time.",
    24: "I would rather go to the theater than to a museum.",
    25: "It does not upset me if my daily routine is disturbed.",
    26: "I frequently find that I don't know how to keep a conversation going.",
    27: "I find it easy to “read between the lines” when someone is talking to me.",
    28: "I usually concentrate more on the whole picture, rather than on the small details.",
    29: "I am not very good at remembering phone numbers.",
    30: "I don't usually notice small changes in a situation or a person's appearance.",
    31: "I know how to tell if someone listening to me is getting bored.",
    32: "I find it easy to do more than one thing at once.",
    33: "When I talk on the phone, I'm not sure when it's my turn to speak.",
    34: "I enjoy doing things spontaneously.",
    35: "I am often the last to understand the point of a joke.",
    36: "I find it easy to work out what someone is thinking or feeling just by looking at their face.",
    37: "If there is an interruption, I can switch back to what I was doing very quickly.",
    38: "I am good at social chitchat.",
    39: "People often tell me that I keep going on and on about the same thing.",
    40: "When I was young, I used to enjoy playing games involving pretending with other children.",
    41: "I like to collect information about categories of things (e.g., types of cars, birds, trains, plants, etc.).",
    42: "I find it difficult to imagine what it would be like to be someone else.",
    43: "I like to plan any activities I participate in carefully.",
    44: "I enjoy social occasions.",
    45: "I find it difficult to work out people's intentions.",
    46: "New situations make me anxious.",
    47: "I enjoy meeting new people.",
    48: "I am a good diplomat.",
    49: "I am not very good at remembering people's dates of birth.",
    50: "I find it very easy to play games with children that involve pretending."
};
const AQ_LENGTH = Object.keys(AQ_QUESTION_DICT).length;