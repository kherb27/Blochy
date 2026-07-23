QMSTATEVECTOR = [gen_state(true)];
BLOCHSPHERE =  gen_bloch_sphere();
STATEARROW = gen_vector_plot(state2vector(QMSTATEVECTOR[QMSTATEVECTOR.length-1]));
PHOSPHOR = []
PHOSPHOR_ENABLED = true

// --- Operation sequence tracking -------------------------------------------
// Every operation (rotation, gate, pulse) gets a unique sequence number and a
// unique color. The trajectory of each operation is drawn on the Bloch sphere
// in that color, labelled with its number, and listed in the history panel.
OP_HISTORY = [];   // array of {num, label, color}
OP_COUNT = 0;

// Distinct color palette; cycles if there are more operations than colors
OP_COLORS = ['#e6194B', '#4363d8', '#3cb44b', '#f58231', '#911eb4',
             '#42d4f4', '#f032e6', '#9A6324', '#808000', '#469990',
             '#800000', '#000075', '#ffe119', '#a9a9a9'];

function op_color(n) {
    seq = document.getElementById('seq_coloring');
    if (seq !== null && seq.checked === false) {
        // sequence coloring disabled -> use the single history trace color
        return document.getElementById('phosphor_color').value;
    }
    return OP_COLORS[(n-1) % OP_COLORS.length];
}

function register_op(label) {
    OP_COUNT += 1;
    var entry = {num: OP_COUNT, label: label, color: op_color(OP_COUNT)};
    OP_HISTORY.push(entry);
    update_history_panel();
    return entry;
}

function update_history_panel() {
    el = document.getElementById('op_history');
    if (el === null) {
        return;
    }
    if (OP_HISTORY.length === 0) {
        el.innerHTML = '<span class="grey-text">No operations applied yet. Use the controls below &mdash; each operation is numbered and color-coded on the sphere.</span>';
        return;
    }
    var html = '';
    for (var i = 0; i < OP_HISTORY.length; i++) {
        var e = OP_HISTORY[i];
        html += '<div class="op-chip" style="border-color:' + e.color + ';">' +
                '<span class="op-num" style="background:' + e.color + ';">' + e.num + '</span>' +
                '<span class="op-label">' + e.label + '</span></div>';
    }
    el.innerHTML = html;
}

function fmt_deg(angle_rad) {
    return Math.round(angle_rad/math.PI*180*100)/100 + '&#176;';
}

// ---------------------------------------------------------------------------

function rotate_state(axis,angle,label) {
    if (label === undefined) {
        if (typeof(axis) === 'string') {
            label = 'R<sub>' + axis + '</sub>(' + fmt_deg(angle) + ')';
        }
        else {
            label = 'R(' + fmt_deg(angle) + ')';
        }
    }
    var entry = register_op(label);
    QMSTATEVECTOR.push(rot(axis,angle,QMSTATEVECTOR[QMSTATEVECTOR.length-1]));
    rot_phosphor(axis,angle,QMSTATEVECTOR[QMSTATEVECTOR.length-2],Math.max(6,Math.round(math.abs(angle)/(0.5*math.PI)*10)),entry);
    update_state_plot();
}


function pulse_apply(axis){
    time = document.getElementById('pulselength').value;
    var entry = register_op('Pulse along ' + axis + ' (t = ' + time + ')');
    QMSTATEVECTOR.push(pulse(axis,time,QMSTATEVECTOR[QMSTATEVECTOR.length-1]));
    pulse_phosphor(axis,time,QMSTATEVECTOR[QMSTATEVECTOR.length-2],Math.max(6,Math.round(time/0.01)),entry);
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
    rotate_state(rot_op,math.PI,'H gate');
}


function custom_rotate_state(){
    opX = math.matrix([[0,math.complex(0.5,0)],[math.complex(0.5,0),0]]);
    opY =  math.matrix([[0,math.complex(0,-0.5)],[math.complex(0,0.5),0]]);
    opZ = math.matrix([[math.complex(0.5,0),0],[0,math.complex(-0.5,0)]]);

    rot_op = math.multiply(math.cos(document.getElementById('custom_axis_polar').value/180*math.PI),opZ);
    rot_op = math.add(rot_op,math.multiply(math.sin(document.getElementById('custom_axis_polar').value/180*math.PI)*math.cos(document.getElementById('custom_axis_azimuth').value/180*math.PI),opX));
    rot_op = math.add(rot_op,math.multiply(math.sin(document.getElementById('custom_axis_polar').value/180*math.PI)*math.sin(document.getElementById('custom_axis_azimuth').value/180*math.PI),opY));

    var label = 'R(&#952;=' + document.getElementById('custom_axis_polar').value +
                '&#176;, &#966;=' + document.getElementById('custom_axis_azimuth').value +
                '&#176;; ' + document.getElementById('custom_axis_rot_angle').value + '&#176;)';
    rotate_state(rot_op,document.getElementById('custom_axis_rot_angle').value/180*math.PI,label);
}


function undo() {
    if (QMSTATEVECTOR.length> 1){
    QMSTATEVECTOR.pop();
    PHOSPHOR.pop();
    OP_HISTORY.pop();
    OP_COUNT = Math.max(0, OP_COUNT-1);
    update_history_panel();
    update_state_plot();
}

}

function restart() {
    QMSTATEVECTOR = [gen_state(true)];
    BLOCHSPHERE =  gen_bloch_sphere();
    STATEARROW = gen_vector_plot(state2vector(QMSTATEVECTOR[QMSTATEVECTOR.length-1]));
    PHOSPHOR = [];
    PHOSPHOR_ENABLED = true;
    OP_HISTORY = [];
    OP_COUNT = 0;
    update_history_panel();
    init_plotting(BLOCHSPHERE.concat(STATEARROW).concat(PHOSPHOR));
}

init_plotting(BLOCHSPHERE.concat(STATEARROW).concat(PHOSPHOR));
rabi_plot();
update_history_panel();
