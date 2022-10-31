function state2vector(state) {
    // https://en.wikipedia.org/wiki/Bloch_sphere#u,_v,_w_representation
    r01 = math.multiply(state['_data'][0],math.conj(state['_data'][1]));
    r00 = math.multiply(state['_data'][0],math.conj(state['_data'][0]));
    r11 = math.multiply(state['_data'][1],math.conj(state['_data'][1]));
    u = -2*math.re(r01);
    v = 2*math.im(r01);
    w = math.re(r00-r11);
    return [u,v,w]
}

function rot(axis_op, angle, ...state) {
    //rot_op = (-1j*phi*op).expm()
    if (typeof(axis_op) === 'string') {
        if (axis_op === 'x') {
            op = math.matrix([[0,math.complex(0.5,0)],[math.complex(0.5,0),0]]);
        }
        else if (axis_op === 'y') {
            op =  math.matrix([[0,math.complex(0,-0.5)],[math.complex(0,0.5),0]]);
        }
        else if (axis_op === 'z') {
            op = math.matrix([[math.complex(0.5,0),0],[0,math.complex(-0.5,0)]]);
        }
        else {
            throw 'Unknown axis string';
        } 
    }
    /*
    else if (false) {
        
    }
     */
    else {
        op = axis_op;
    }
   
    //console.log(math.multiply(math.complex(0,-angle),op));
    rot_op = math.expm(math.multiply(math.complex(0,-angle),op));
    //console.log("Rotation operator");
    //console.log(rot_op);
    if (state.length === 0) {
        return rot_op
    }
    else {
    //console.log("new state is");
    //console.log(math.multiply(rot_op,state[0]));
    return math.multiply(rot_op,state[0])
    }

}

function gen_state(up_is_true) {
    if (up_is_true) {
        return math.matrix([1,0])
    }
    else {
        return math.matrix([0,1])
    }
}

function print_state(state){
    arrText = '(' + state['_data'][0] + ', ' + state['_data'][1] + ')';
    console.log(arrText);
}

function rot_phosphor(axis_op, angle, state, divider=10) {
    //console.log("Divider is");
    //console.log(divider);
    uarr = [];
    varr = [];
    warr = [];
    [u,v,w] = state2vector(state);
    uarr.push(u);
    varr.push(v);
    warr.push(w);
    
    for (var i = 1; i <= divider; i++) {
        staten = rot(axis_op,angle/divider*i,state);
        [u,v,w] = state2vector(staten);
        //console.log("We rotate by");
        //console.log(angle/divider*i);
        //console.log([u,v,w]);
        //console.log("old state");
        //console.log(state);
        //console.log("new state");
        //console.log(staten);
        uarr.push(u);
        varr.push(v);
        warr.push(w);
    }
    
    var hist = {
        x:uarr, y: varr, z: warr,
        type: 'scatter3d',
        showscale: false,
        hoverinfo: 'skip', 
        mode: 'lines',
        opacity: 1.0,
        line: {color: document.getElementById('phosphor_color').value, width:3},
    }
    PHOSPHOR.push(hist);
}

function rabi_plot(data=null) {
    time = document.getElementById('pulselength').value;
   if (data === null) {
    t_stop = Math.max(2,time);
    tax = linspace(0,t_stop,101);
    detune = 2*math.PI*document.getElementById('detuning').value;
    w1 = 2*math.PI*document.getElementById('amplitude').value;
    Omega = math.sqrt(detune*detune+w1*w1);
    arg_ax = math.dotMultiply(tax,Omega/2);
    y = math.map(arg_ax,math.sin);
    y = math.dotMultiply(y,w1/Omega);
    y = math.map(y,math.square);
    data = [{
      x: tax,
      y: y,
      hoverinfo: 'skip',
    }];
    
   }
    const config = {
        displayModeBar: false, // hide toolbar
        responsive:false // resize 
    };
  
    var layout = {
        hovermode: 'closest',
        autosize: false,
        width:'400',
        height:'200',
        automargin: true,
        showlegend: false,
        margin: {
          l: 50,
          r: 10,
          b: 50,
          t: 10
      }, 
        xaxis: {
          title: 'time',
          showgrid: false,    
          zeroline: true,
          fixedrange: true
      
        },    
        yaxis: {
          showgrid: false,    
          zeroline: true,
          fixedrange: true,
          range: [0,1.1]
      
        },    
  
        shapes: [
          {    
            type: 'line',    
            x0: time,    
            y0: -1,    
            x1: time,    
            y1: 1,    
            line: {    
              color: 'rgb(255, 10, 10)',    
              width: 3    
            }    
          }],       
    };
  
    Plotly.react('rabi_div', data, layout,config);
  }
    
  function pulse(axis, time, state) {
    opZ = math.matrix([[math.complex(0.5,0),0],[0,math.complex(-0.5,0)]]);
    detune = 2*math.PI*document.getElementById('detuning').value;
    w1 = 2*math.PI*document.getElementById('amplitude').value;
    phase = math.PI/180*document.getElementById('phase').value;
    H0 = math.multiply(opZ,detune);
    if (axis === "x") {
      //opX = math.matrix([[0,0.5*math.exp(math.complex(0,phase+math.PI/2))],[0.5*math.exp(math.complex(0,-phase-math.PI/2)),0]]); 
      //H1 = math.multiply(opX,w1);
      phase = phase + math.PI/2;
    }
    console.log(phase);
    opT = math.matrix([[0,math.multiply(0.5,math.exp(math.complex(0,phase)))],[math.multiply(0.5,math.exp(math.complex(0,-phase))),0]]);
    H1 = math.multiply(opT,w1);
    console.log(H1);
    rot_op = math.expm(math.multiply(math.complex(0,time),math.add(H0,H1)));
    return math.multiply(rot_op,state)
  }
  
  function pulse_phosphor(axis,time,state,divider=10) {
    
    uarr = [];
    varr = [];
    warr = [];
    [u,v,w] = state2vector(state);
    uarr.push(u);
    varr.push(v);
    warr.push(w);
    
    for (var i = 1; i <= divider; i++) {
        staten = pulse(axis,time/divider*i,state);
        [u,v,w] = state2vector(staten);
        uarr.push(u);
        varr.push(v);
        warr.push(w);
    }
    
    var hist = {
        x:uarr, y: varr, z: warr,
        type: 'scatter3d',
        showscale: false,
        hoverinfo: 'skip', 
        mode: 'lines',
        opacity: 1.0,
        line: {color: document.getElementById('phosphor_color').value, width:3},
    }
    PHOSPHOR.push(hist);
  }
  
  
  
  