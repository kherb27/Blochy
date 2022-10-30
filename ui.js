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

function custom_rotate_state(){
    opX = math.matrix([[0,math.complex(0.5,0)],[math.complex(0.5,0),0]]);
    opY =  math.matrix([[0,math.complex(0,-0.5)],[math.complex(0,0.5),0]]);
    opZ = math.matrix([[math.complex(0.5,0),0],[0,math.complex(-0.5,0)]]);

    rot_op = math.multiply(math.cos(document.getElementById('custom_axis_polar').value/180*math.PI),opZ);
    rot_op = math.add(rot_op,math.multiply(math.sin(document.getElementById('custom_axis_polar').value/180*math.PI)*math.cos(document.getElementById('custom_axis_azimuth').value/180*math.PI),opX));
    rot_op = math.add(rot_op,math.multiply(math.sin(document.getElementById('custom_axis_polar').value/180*math.PI)*math.sin(document.getElementById('custom_axis_azimuth').value/180*math.PI),opY));
    
    rotate_state(rot_op,document.getElementById('custom_axis_rot_angle').value/180*math.PI);
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