/* ************************************ */
/* Define helper functions */

/* ************************************ */
var getInstructFeedback = function () {
    return `<div class = centerbox><p class = center-block-text>${feedback_instruct_text}</p></div>`
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = true
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
const SPACE = 32
const NEUTRAL_STIM = "XXXX"
const RED_KEY = "I".charCodeAt(0)
const BLUE_KEY = "O".charCodeAt(0)
const YELLOW_KEY = "P".charCodeAt(0)
const choices = [BLUE_KEY, RED_KEY, YELLOW_KEY]
const N_MISTAKES_IN_A_ROW_FOR_REMINDER = 3

// High contrast, color-blind safe colors
const RED = "#f64747"
const BLUE = "#00bfff"
const YELLOW = "#F1F227"

// task specific variables
var congruent_stim = [{
    stimulus: `<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:${RED}">RED</div></div>`,
    data: {
        trial_id: 'stim',
        condition: 'congruent',
        stim_color: 'red',
        stim_word: 'red',
        correct_response: RED_KEY
    },
    key_answer: RED_KEY
}, {
    stimulus: `<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:${BLUE}">BLUE</div></div>`,
    data: {
        trial_id: 'stim',
        condition: 'congruent',
        stim_color: 'blue',
        stim_word: 'blue',
        correct_response: BLUE_KEY
    },
    key_answer: BLUE_KEY
}, {
    stimulus: `<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:${YELLOW}">YELLOW</div></div>`,
    data: {
        trial_id: 'stim',
        condition: 'congruent',
        stim_color: 'yellow',
        stim_word: 'yellow',
        correct_response: YELLOW_KEY
    },
    key_answer: YELLOW_KEY
}];

var neutral_stim = [{
    stimulus: `<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:${RED}">${NEUTRAL_STIM}</div></div>`,
    data: {
        trial_id: 'stim',
        condition: 'neutral',
        stim_color: 'red',
        stim_word: `${NEUTRAL_STIM}`,
        correct_response: RED_KEY
    },
    key_answer: RED_KEY
}, {
    stimulus: `<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:${BLUE}">${NEUTRAL_STIM}</div></div>`,
    data: {
        trial_id: 'stim',
        condition: 'neutral',
        stim_color: 'blue',
        stim_word: `${NEUTRAL_STIM}`,
        correct_response: BLUE_KEY
    },
    key_answer: BLUE_KEY
}, {
    stimulus: `<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:${YELLOW}">${NEUTRAL_STIM}</div></div>`,
    data: {
        trial_id: 'stim',
        condition: 'neutral',
        stim_color: 'yellow',
        stim_word: `${NEUTRAL_STIM}`,
        correct_response: YELLOW_KEY
    },
    key_answer: YELLOW_KEY
}];

var incongruent_stim = [{
    stimulus: `<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:${RED}">BLUE</div></div>`,
    data: {
        trial_id: 'stim',
        condition: 'incongruent',
        stim_color: 'red',
        stim_word: 'blue',
        correct_response: RED_KEY
    },
    key_answer: RED_KEY
}, {
    stimulus: `<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:${RED}">YELLOW</div></div>`,
    data: {
        trial_id: 'stim',
        condition: 'incongruent',
        stim_color: 'red',
        stim_word: 'yellow',
        correct_response: RED_KEY
    },
    key_answer: RED_KEY
}, {
    stimulus: `<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:${BLUE}">RED</div></div>`,
    data: {
        trial_id: 'stim',
        condition: 'incongruent',
        stim_color: 'blue',
        stim_word: 'red',
        correct_response: BLUE_KEY
    },
    key_answer: BLUE_KEY
}, {
    stimulus: `<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:${BLUE}">YELLOW</div></div>`,
    data: {
        trial_id: 'stim',
        condition: 'incongruent',
        stim_color: 'blue',
        stim_word: 'yellow',
        correct_response: BLUE_KEY
    },
    key_answer: BLUE_KEY
}, {
    stimulus: `<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:${YELLOW}">RED</div></div>`,
    data: {
        trial_id: 'stim',
        condition: 'incongruent',
        stim_color: 'yellow',
        stim_word: 'red',
        correct_response: YELLOW_KEY
    },
    key_answer: YELLOW_KEY
}, {
    stimulus: `<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:${YELLOW}">BLUE</div></div>`,
    data: {
        trial_id: 'stim',
        condition: 'incongruent',
        stim_color: 'yellow',
        stim_word: 'blue',
        correct_response: YELLOW_KEY
    },
    key_answer: YELLOW_KEY
}];
// set practice stims
var practice_stims_unpacked = [].concat(congruent_stim, congruent_stim, neutral_stim, neutral_stim, incongruent_stim)
var practice_stims = jsPsych.randomization.repeat(practice_stims_unpacked, 1, true)

// set test stims with high neutral proportion: ~70% neutral stims, ~15% congruent, ~15% incongruent
var neutral_stims_repeated_for_test = jsPsych.randomization.repeat(neutral_stim, 10)
var test_stims_unpacked = [].concat(congruent_stim, congruent_stim, incongruent_stim, neutral_stims_repeated_for_test)
var test_stims = jsPsych.randomization.repeat(test_stims_unpacked, 1, true)

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
    type: 'attention-check',
    data: {
        trial_id: "attention_check"
    },
    timing_response: 7500,
    response_ends_trial: true,
    timing_post_trial: 1000
}

var attention_node = {
    timeline: [attention_check_block],
    conditional_function: function () {
        return run_attention_checks
    }
}

/* define static blocks */
var response_keys =
    `<ul class="list-text">
    <li><span class = "large" style = "color:${RED};font-weight:bold">WORD</span>: "${String.fromCharCode(RED_KEY)}" key</li>
    <li><span class = "large" style = "color:${BLUE};font-weight:bold">WORD</span>: "${String.fromCharCode(BLUE_KEY)}" key</li>
    <li><span class = "large" style = "color:${YELLOW};font-weight:bold">WORD</span>: "${String.fromCharCode(YELLOW_KEY)}" key</li></ul>`


var feedback_instruct_text =
    `<div class = centerbox><p class = block-text>
    You will now complete a color matching task. Focus will be important here, so before we begin please
    make sure you're ready for <u><strong>five minutes</strong></u> of uninterrupted game time!
    </p><p class = block-text>Press <strong>space</strong> to continue.</p></div>`
var feedback_instruct_block = {
    type: 'poldrack-text',
    data: {
        trial_id: "instruction"
    },
    cont_key: [SPACE],
    text: getInstructFeedback,
    timing_post_trial: 0,
    timing_response: 180000
};

/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
    type: 'poldrack-text',
    data: {
        trial_id: "instruction1"
    },
    text: `<div class = centerbox style="height:80vh"><p class = block-text>In this task you will see color names
        (RED, BLUE, YELLOW) or the string '${NEUTRAL_STIM}' appear one at a time. The font of the words also will be colored.
        For example, you may see: 
        <span class = "large" style = "color:${RED};font-weight:bold">RED</span>,
        <span class = "large" style = "color:${BLUE};font-weight:bold">BLUE</span>,
        <span class = "large" style = "color:${YELLOW};font-weight:bold">${NEUTRAL_STIM}</span> or
        <span class = "large" style = "color:${RED};font-weight:bold">BLUE</span>.</p>
        <p class = block-text>Your task is to press the key corresponding to the <strong><u>font color</u></strong>,
        as <u><strong>quickly and accurately</strong></u> as possible.
        The response keys are as follows:</p>
        ${response_keys}
        <p class="center-content"><img src="keyboard.svg" alt="Keyboard diagram"></p>
        <p class = block-text>Press <strong>space</strong> to continue.</p></div>`,
    cont_key: [SPACE],
    timing_post_trial: 1000
};
var instructions_block2 = {
    type: 'poldrack-text',
    data: {
        trial_id: "instruction2"
    },
    text: `<div class = centerbox style="height:80vh"><p class = block-text>
         Place your fingers on the keyboard to comfortably access the response keys. Please use only one hand.</p>
         <p class="center-content"><img src="keyboard.svg" alt="Keyboard diagram"></p>
         <p class = block-text>Press <strong>space</strong> to continue.</p></div>`,
    cont_key: [SPACE],
    timing_post_trial: 1000
};

var instructions_reminder_block = {
    type: 'poldrack-text',
    data: {
        trial_id: "instruction_reminder"
    },
    text: `<div class = centerbox style="height:80vh"><p class = block-text>
         You've made three mistakes in a row. Remember, your job is to respond to the <u><strong>font color</strong></u> as
         <u><strong>quickly and accurately</strong></u> as you can, using these keys:</p>
         <p class="center-content"><img src="response_keys.svg" alt="" width="270" height="90"></p>
         <p class = block-text>Press <strong>space</strong> to continue.</p></div>`,
    cont_key: [SPACE],
    timing_post_trial: 1000,
    conditional_function: function () {
        last_trials = jsPsych.data.getTrialsOfType('poldrack-categorize').slice(-N_MISTAKES_IN_A_ROW_FOR_REMINDER);
        for (i = 0; i < N_MISTAKES_IN_A_ROW_FOR_REMINDER; i++) {
            if (last_trials[i].correct) return false
        }
        return true
    }
};


var instruction_node = {
    timeline: [feedback_instruct_block, instructions_block, instructions_block2],
    /* This function defines stopping criteria */
    loop_function: function (data) {
        sumInstructTime = data[data.length - 2].rt + data[data.length - 1].rt
        // the above line changed from considering every poldrack-instruct trial to only the last two trials, regardless
        // of their type. hence it's not generic anymore. if the amount (or index) of the instruction screens changes,
        // this has to change accordingly.
        if (sumInstructTime <= instructTimeThresh * 1000) {
            feedback_instruct_text =
                `Don’t read through instructions too quickly. Please take your time and make sure you understand the 
                instructions. Press <strong>space</strong> to continue.`
            return true
        } else if (sumInstructTime > instructTimeThresh * 1000) {
            feedback_instruct_text = 'Done with instructions. Press <strong>space</strong> to continue.'
            return false
        }
    }
}

var end_block = {
    type: 'poldrack-text',
    data: {
        trial_id: "end",
        exp_id: 'stroop'
    },
    timing_response: 180000,
    text: `<div class = centerbox><p class = center-block-text>Thanks for completing the task.</p>
            <p class = center-block-text>Press <strong>space</strong> to continue.</p></div>`,
    cont_key: [SPACE],
    timing_post_trial: 0
};

var start_practice_block = {
    type: 'poldrack-text',
    data: {
        trial_id: "practice_intro"
    },
    timing_response: 180000,
    text: `<div class = centerbox><p class = block-text>Let's start with a few practice trials. Remember, press the key 
            corresponding to the <strong><u>font color</u></strong> of the word. </p>
            <p class = block-text>For the practice session, the matching between color and response key will appear below the word.</p>
            <p class = block-text></p>
            <p class = block-text>Press <strong>space</strong> to begin the practice.</p></div>`,
    cont_key: [SPACE],
    timing_post_trial: 1000
};

var start_test_block = {
    type: 'poldrack-text',
    data: {
        trial_id: "test_intro"
    },
    timing_response: 180000,
    text: `<div class = centerbox><p class = center-block-text>Great job! Now that you've had a bit of practice, you 
            can start the task. From now on, the reminder of the response keys will not appear below the word.</p>
            <p class = center-block-text>Remember to respond as <u><strong>quickly and accurately</strong></u> as you can.</p>
            <p class = center-block-text>Please remain focused on the task, attention checks will appear throughout.</p>
            <p class = center-block-text>Press <strong>space</strong> to begin.</p></div>`,
    cont_key: [SPACE],
    timing_post_trial: 1000,
    on_finish: function () {
        exp_stage = 'test'
    }
};

var fixation_block = {
    type: 'poldrack-single-stim',
    stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
    is_html: true,
    choices: 'none',
    data: {
        trial_id: "fixation"
    },
    timing_post_trial: 500,
    timing_stim: 500,
    timing_response: 500,
    on_finish: function () {
        jsPsych.data.addDataToLastTrial({'exp_stage': exp_stage})
    },
}

/* create experiment definition array */
stroop_experiment = []
stroop_experiment.push(instruction_node)
stroop_experiment.push(start_practice_block)
/* define practice trials */
var exp_stage = "practice"
for (i = 0; i < practice_stims.stimulus.length; i++) {
    stroop_experiment.push(fixation_block)
    var practice_block = {
        type: 'poldrack-categorize',
        practice_trial: i,
        stimulus: practice_stims.stimulus[i] + `<div class=response_keys_box><img src="response_keys.svg" alt=""></div>`,
        data: practice_stims.data[i],
        key_answer: practice_stims.key_answer[i],
        is_html: true,
        correct_text: '<div class = fb_box><div class = center-text><font size = 20>CORRECT</font></div></div>',
        incorrect_text: '<div class = fb_box><div class = center-text><font size = 20>WRONG</font></div></div>',
        timeout_message: '<div class = fb_box><div class = center-text><font size = 20>GO FASTER!</font></div></div>',
        choices: choices,
        timing_response: 1500,
        timing_stim: -1,
        timing_feedback_duration: 500,
        show_stim_with_feedback: true,
        response_ends_trial: true,
        timing_post_trial: 250,
        on_finish: function () {
            jsPsych.data.addDataToLastTrial({
                trial_id: 'stim',
                exp_stage: 'practice'
            })
        }
    }
    stroop_experiment.push(practice_block)
}

stroop_experiment.push(start_test_block)
/* define test trials */
var n_blocks = 8 // so that each condition has ~50 trials
n_blocks = 1 // for testing. TODO: delete this line when done testing
for (block = 1; block <= n_blocks; block++) {
    test_stims = jsPsych.randomization.repeat(test_stims_unpacked, 1, true)
    for (i = 0; i < test_stims.stimulus.length; i++) {
        stroop_experiment.push(fixation_block)
        var test_block = {
            type: 'poldrack-categorize',
            stimulus: test_stims.stimulus[i],
            data: test_stims.data[i],
            key_answer: test_stims.key_answer[i],
            is_html: true,
            correct_text: "",
            incorrect_text: '<div class = fb_box><div class = center-text><font size = 20>WRONG</font></div></div>',
            timeout_message: '<div class = fb_box><div class = center-text><font size = 20>GO FASTER!</font></div></div>',
            choices: choices,
            timing_response: 1500,
            timing_stim: -1,
            timing_feedback_duration: 500,
            show_stim_with_feedback: true,
            response_ends_trial: true,
            timing_post_trial: 250,
            on_finish: function () {
                jsPsych.data.addDataToLastTrial({
                    trial_id: 'stim',
                    exp_stage: 'test',
                    block_num: block
                })
            }
        }
        stroop_experiment.push(test_block)
        if (i >= N_MISTAKES_IN_A_ROW_FOR_REMINDER) stroop_experiment.push(instructions_reminder_block)
    }
    stroop_experiment.push(attention_node)
}
stroop_experiment.push(end_block)