QMSTATEVECTOR = [gen_state(true)];
BLOCHSPHERE =  gen_bloch_sphere();
STATEARROW = gen_vector_plot(state2vector(QMSTATEVECTOR[QMSTATEVECTOR.length-1]));
PHOSPHOR = []
PHOSPHOR_ENABLED = true

init_plotting(BLOCHSPHERE.concat(STATEARROW).concat(PHOSPHOR));
// BLOCHSPHERE.concat(STATEARROW).concat(PHOSPHOR)
rabi_plot();


function rotate_state(axis,angle) {
    QMSTATEVECTOR.push(rot(axis,angle,QMSTATEVECTOR[QMSTATEVECTOR.length-1]));
    rot_phosphor(axis,angle,QMSTATEVECTOR[QMSTATEVECTOR.length-2],divider=Math.max(6,Math.round(angle/(0.5*math.PI)*10)));
    update_state_plot();
}


function pulse_apply(axis){
    time = document.getElementById('pulselength').value;
    QMSTATEVECTOR.push(pulse(axis,time,QMSTATEVECTOR[QMSTATEVECTOR.length-1]));
    pulse_phosphor(axis,time,QMSTATEVECTOR[QMSTATEVECTOR.length-2],divider=Math.max(6,Math.round(time/0.01)));
    update_state_plot();
  }
  

function export_png() {
    var currentdate = new Date(); 
    var datetime =  currentdate.getFullYear() + "-" + (currentdate.getMonth()+1)  + "-" + currentdate.getDate() + "_" + currentdate.getHours() + '- ' + currentdate.getMinutes() + '-' + currentdate.getSeconds();
    Plotly.downloadImage('myDiv', {format: 'png', width: document.getElementById('export_size').value, height: document.getElementById('export_size').value, filename: datetime});
}

function hadamard(){
    opX = math.matrix([[0,math.complex(0.5,0)],[math.complex(0.5,0),0]]);
    opZ = math.matrix([[math.complex(0.5,0),0],[0,math.complex(-0.5,0)]]);

    
    rot_op = math.add(math.multiply(opX,1/math.sqrt(2)),math.multiply(opZ,1/math.sqrt(2)));
    rotate_state(rot_op,math.PI);
}

function custom_rotate_state(){
    opX = math.matrix([[0,math.complex(0.5,0)],[math.complex(0.5,0),0]]);
    opY =  math.matrix([[0,math.complex(0,-0.5)],[math.complex(0,0.5),0]]);
    opZ = math.matrix([[math.complex(0.5,0),0],[0,math.complex(-0.5,0)]]);

    rot_op = math.multiply(math.cos(document.getElementById('custom_axis_polar').value/180*math.PI),opZ);
    rot_op = math.add(rot_op,math.multiply(math.sin(document.getElementById('custom_axis_polar').value/180*math.PI)*math.cos(document.getElementById('custom_axis_azimuth').value/180*math.PI),opX));
    rot_op = math.add(rot_op,math.multiply(math.sin(document.getElementById('custom_axis_polar').value/180*math.PI)*math.sin(document.getElementById('custom_axis_azimuth').value/180*math.PI),opY));
    
    rotate_state(rot_op,document.getElementById('custom_axis_rot_angle').value/180*math.PI);
}

function apply_custom_matrix() {
    let op = math.matrix([[parse_complex_field('custom_m00'), parse_complex_field('custom_m01')], [parse_complex_field('custom_m10'), parse_complex_field('custom_m11')]]);
    
    QMSTATEVECTOR.push(apply_custom_op(op, QMSTATEVECTOR[QMSTATEVECTOR.length-1]));
    update_state_plot();
}

function on_update_complex(event) {
    let parsed = parse_complex(event.target.value);
    event.target.value = parsed.format(4);
}

function parse_complex_field(field_id) {
    return parse_complex(document.getElementById(field_id).value);
}

function parse_complex(string) {
    string = string.trim();
    if (string.startsWith('e^')) {
        // parse e^complex
        string = string.slice(2);
        if (string.startsWith('(')) {
            string = string.slice(1);
        }
        if (string.endsWith(')')) {
            string = string.slice(0, -1);
        }
        let c = parse_complex(string);
        return math.Complex.fromPolar(Math.exp(c.re), c.im);
    } else {
        // Remove the first sign and store its value
        let beginSign = '+';
        if (string.startsWith('-')) {
            beginSign = '-';
            string = string.slice(1).trim();
        } else if (string.startsWith('+')) {
            string = string.slice(1).trim();
        }

        // split by + or - sign to seperate real and imaginary number
        let split = string.split(/[\+\-]/);
        if (split.length == 1) {
            // we only have a real or imaginary part
            let trimmed_value = split[0].trim();
            if (trimmed_value.endsWith('i')) {
                // only imaginary
                if (trimmed_value.length == 1) {
                    // catch i (without any number)
                    return math.complex(0, parseFloat(beginSign + '1'));
                }
                let parsed = parseFloat(beginSign + trimmed_value.slice(0, -1));
                if (isNaN(parsed)) {
                    return math.complex(0, 0);
                }
                return math.complex(0, parsed);
            } else {
                // only real
                let parsed = parseFloat(beginSign + trimmed_value);
                if (isNaN(parsed)) {
                    return math.complex(0, 0);
                }
                return math.complex(parsed, 0);
            }

        } else if (split.length == 2) {

            let trimmed1 = split[0].trim();
            let trimmed2 = split[1].trim();
            let re, im;

            // reappend signedness
            trimmed1 = beginSign + trimmed1;

            if (string.includes('-')) {
                trimmed2 = '-' + trimmed2;
            }

            // find which part is real and which imaginary
            if (trimmed2.endsWith('i') && !trimmed1.endsWith('i')) {
                re = trimmed1;
                im = trimmed2;
            } else if (!trimmed2.endsWith('i') && trimmed1.endsWith('i')) {
                re = trimmed2;
                im = trimmed1;
            } else {
                return math.complex(0, 0);
            }

            let re_parsed = parseFloat(re);
            let im_parsed;

            // catch +i or -i
            if (im.length == 1 || (im.length == 2 && im[0] == '+')) {
                im_parsed = 1;
            } else if (im.length == 2 && im[0] == '-') {
                im_parsed = -1;
            } else {
                im_parsed = parseFloat(im.slice(0, -1));
            }

            if (isNaN(re_parsed)) {
                re_parsed = 0.0;
            }
            if (isNaN(im_parsed)) {
                im_parsed = 0.0;
            }

            return math.complex(re_parsed, im_parsed);
        } else {
            return math.complex(0, 0);
        }
    }
}

function undo() {
    if (QMSTATEVECTOR.length> 1){
        QMSTATEVECTOR.pop();
        PHOSPHOR.pop();
        update_state_plot();
    }

}

function restart() {
    QMSTATEVECTOR = [gen_state(true)];
    BLOCHSPHERE =  gen_bloch_sphere();
    STATEARROW = gen_vector_plot(state2vector(QMSTATEVECTOR[QMSTATEVECTOR.length-1]));
    PHOSPHOR = [];
    PHOSPHOR_ENABLED = true;
    init_plotting(BLOCHSPHERE.concat(STATEARROW).concat(PHOSPHOR));
}