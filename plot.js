function init_plotting(data) {

    const config = {
        displayModeBar: false, // hide toolbar
        responsive:true // resize 
    };

    var layout = {
        hovermode: 'closest',
        scene: {
            xaxis: {
                showspikes: false,
                showgrid: false,
                zeroline: false,
                showline: false,
                visible: false,
                ticks: '',
                showticklabels: false,
                range: [-1.1,1.1]
            }, 
            yaxis: {
                showspikes: false,
                showgrid: false,
                zeroline: false,
                showline: false,
                visible: false,
                ticks: '',
                showticklabels: false,
                range: [-1.1,1.1]
            },
            zaxis: {
                showspikes: false,
                showgrid: false,
                zeroline: false,
                showline: false,
                visible: false,
                ticks: '',
                showticklabels: false,
                range: [-1.1,1.1]
            },
            camera: {
                center: {
                    x:0, y:0,z:0
                },
                eye: {
                    x:-0.9, y:1, z:0.6
                },
                projection: 'perspective'
            }
        },
        showlegend: false,
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0
        },
        annotations: [
            {
                showarrow: false,
                text: 'bloch.kherb.io',
                x:1.0,
                y:0.0,
                xref: 'paper',
                yref: 'paper', 
                xanchor: 'right',
                yanchor: 'bottom',
                opacity: 0.4
            }
        ]
        
    };

    Plotly.react('myDiv', data, layout,config);
}

function cylinder_axes(v,k=[2,0,0]) {
    // v needs to be normalized, k must not be parallel to v
    // t is height
    //k = [2,0,0];
    //vp = (k+p2)-((k+p2)*p2)*p2;
    //c = vp/norm(vp);
    //p = (1-t)*p2 + c*d*cos(phi) + u*d*sin(phi);
    qp = math.subtract(k,math.dotMultiply(Array(3).fill(math.dot(v,k)),v));
    //console.log(qp);
    q = math.dotMultiply(qp,Array(3).fill(1/math.norm(qp,2)));
    //console.log("-----------");
    //console.log(q);
    p = math.cross(v,q);
    p = math.dotMultiply(p,Array(3).fill(1/math.norm(p,2)));
    //console.log("+++++++++++")
    //console.log(p);
    return [q,p]

}

function gen_vector_plot(vector,normalize=true) {
    color = document.getElementById('spin_color').value;
    [u,v,w] = vector;
    if (normalize === true) {
        l = math.sqrt(u**2+v**2+w**2);
        u = u/l;
        v = v/l;
        w = w/l;
    }
    //console.log("NUR ZUR SICHERHEIT");
    //console.log(u);
    //console.log(v);
    //console.log(w);
    hovertext = '￨Ψ〉= ￨0〉+ 0.5 ￨1〉<extra></extra>';
    
    /*var upp = {
        name: 'stick',
        showscale: false,
        type: 'streamtube',
        hovertemplate: hovertext,
        sizeref: 0.5,
        u: [u*0.9],
        v: [v*0.9],
        w: [w*0.9],
        x: [0],
        y: [0],
        z: [0],
        starts: {
            x: 0,
            y: 0,
            z: 0
        }
        }
        */

        /*
        var upp = {
            name: 'stick',
            showscale: false,
            type: 'scatter3d',
            mode: 'lines',
            hovertemplate: hovertext,
            width: 5,
            x: [0,u*0.9],
            y: [0,v*0.9],
            z: [0,w*0.9],
            line: {color: '#000000', width:9},
            }
        */
        

        zax = [u,v,w];
        [q,p] = cylinder_axes(zax);
    
        xarr =Array(0);
        yarr = Array(0);
        zarr = Array(0);

        //console.log("q is");
        //console.log(q);
        //console.log("p is")
        //console.log(p);
        //console.log("zarr is");
        //console.log(zarr);
        
        //console.log("Jetzt kommt Schleife");
        for (var i = 0; i < 7; i++) {
            phi = 2*Math.PI*i/6;
            r = 0.025;
            l = 0.9
            //console.log(phi);
            //console.log(math.cos(phi));
            //console.log(q[0]*math.cos(phi)+p[0]*math.sin(phi));
            //console.log("############");
            xarr.push([(q[0]*math.cos(phi)+p[0]*math.sin(phi))*r,(q[0]*math.cos(phi)+p[0]*math.sin(phi))*r+zax[0]*l]);
            //xarr.push(q[0]*math.cos(phi)+p[0]*math.sin(phi)+zax[0]);

            yarr.push([(q[1]*math.cos(phi)+p[1]*math.sin(phi))*r,(q[1]*math.cos(phi)+p[1]*math.sin(phi))*r+zax[1]*l]);
            //yarr.push(q[1]*math.cos(phi)+p[1]*math.sin(phi)+zax[1]);

            zarr.push([(q[2]*math.cos(phi)+p[2]*math.sin(phi))*r,(q[2]*math.cos(phi)+p[2]*math.sin(phi))*r+zax[2]*l]);
            //zarr.push(q[2]*math.cos(phi)+p[2]*math.sin(phi)+zax[2]);
            
        }

        //console.log(xarr);
        //console.log(yarr);
        //console.log(zarr);
    

        //phiT = linspace(0,2*Math.PI,12);
        //zT = [0,0.8];
        //[uT,vT] = meshgrid(zT,phiT);
        //xT =  math.dotMultiply(math.map(vT,math.cos),0.025);
        //yT =  math.dotMultiply(math.map(vT,math.sin),0.025);  
        
        var upp = {
            name: 'tail',
            x:xarr, y: yarr, z: zarr,
            type: 'surface',
            colorscale: [['0.0', color], ['1.0',color]],
            showscale: false,
            opacity:1.0,
            //hoverinfo: 'skip',
            hovertemplate: hovertext,
            contours: {
                x : {
                    highlight: false
                },
                y : {
                    highlight: false
                },
                z : {
                    highlight: false
                }
            }
            };
        var head = {
            u: [0.3*(u)],
            v: [0.3*(v)],
            w: [0.3*(w)],
            sizemode: 'absolute',
            sizeref: .25,
            hovertemplate: hovertext,
            colorscale: [['0.0', color], ['1.0',color]],
            showscale: false,
            type: 'cone',
            anchor: 'tip',
            x: [u],
            y: [v],
            z: [w]
        }
    //console.log(upp);
    return [head,upp]
}

function gen_bloch_sphere() {

    theta = linspace(0,Math.PI,20);
    phi = linspace(0,2*Math.PI,40);
    [u,v] = meshgrid(theta,phi);
    su = math.map(u,math.sin);
    xs = math.dotMultiply(math.map(v,math.cos),su);
    ys = math.dotMultiply(math.map(v,math.sin),su);
    zs = math.map(u,math.cos);
    //console.log("Here is the sphere");
    //console.log(xs);
    //console.log(ys);
    //console.log(zs);


    var x = []
    var y = []
    var z = []
    var xb = []
    var yb = []
    var zb = []
    for (var i = 0; i < 12; i++) {
        //meridians 
        t = i*math.PI/6;
        xcurr = math.multiply(math.map(theta,math.sin),math.cos(t));
        ycurr = math.multiply(math.map(theta,math.sin),math.sin(t));
        zcurr = math.map(theta,math.cos);
        if ([0,3,6,9].includes(i)) {
            xb = xb.concat(xcurr);
            xb = xb.concat([null]);
            
            yb = yb.concat(ycurr);
            yb = yb.concat([null]);
            
            zb = zb.concat(zcurr);
            zb = zb.concat([null]);

        }
        else {
            x = x.concat(xcurr);
            x = x.concat([null]);
            
            y = y.concat(ycurr);
            y = y.concat([null]);
            
            z = z.concat(zcurr);
            z = z.concat([null]);
        }

    }
    for (var i = 1; i < 9; i++) {
        //parallels
        t = i*math.PI/6;
        xcurr = math.multiply(math.map(phi,math.cos),math.sin(t));
        ycurr = math.multiply(math.map(phi,math.sin),math.sin(t));
        zcurr = Array(phi.length).fill(math.cos(t));

        if ([3].includes(i)) {
            xb = xb.concat(xcurr);
            xb = xb.concat([null]);
            
            yb = yb.concat(ycurr);
            yb = yb.concat([null]);
            
            zb = zb.concat(zcurr);
            zb = zb.concat([null]);
        }
        else {
            x = x.concat(xcurr);
            x = x.concat([null]);
            
            y = y.concat(ycurr);
            y = y.concat([null]);
    
            z = z.concat(zcurr);
            z = z.concat([null]);
        }        
    }

    var sphere = {
        name: 'sphere',
        x:xs, y: ys, z: zs,
        type: 'surface',
        colorscale: [['0.0', '#AAAAAA' ], ['1.0', '#AAAAAA']],
        showscale: false,
        opacity:0.1,
        hoverinfo: 'skip',
        contours: {
            x : {
                highlight: false
            },
            y : {
                highlight: false
            },
            z : {
                highlight: false
            }
        }
    };

    
    var gridlines = {
        name: 'gridlines_bold',
        x:x, y: y, z: z,
        type: 'scatter3d',
        showscale: false,
        hoverinfo: 'skip', 
        mode: 'lines',
        opacity: 0.05,
        line: {color: '#000000', width:3},
    }
    

    var gridlines_bold = {
        name: 'gridlines_bold',
        x:xb, y: yb, z: zb,
        type: 'scatter3d',
        showscale: false,
        hoverinfo: 'skip', 
        mode: 'lines',
        opacity: 0.075,
        line: {color: '#000000', width:3},
    }
    

    var equator_plane = {
        name: 'equator_plane',
        x: xs, y:ys, z:math.multiply(zs,0),
        type: 'surface',
        colorscale: [['0.0', '#AAAAAA' ], ['1.0', '#AAAAAA']],
        showscale: false,
        opacity:0.075,
        hoverinfo: 'skip',

    }

    north_text = document.getElementById('north_text').value;
    south_text = document.getElementById('south_text').value;
    if (north_text != "") {
        north_text = "￨" + north_text + "〉"
    }
    if (south_text != "") {
        south_text = "￨" + south_text + "〉"
    }

    var axes = {
        name: 'axes',
        x: [-1,1,null,0,0,null,0,0], y:[0,0,null,-1,1,null,0,0], z:[0,0,null,0,0,null,-1,1],
        type: 'scatter3d',
        showscale: false,
        hoverinfo: 'skip', 
        mode: 'lines+text',
        opacity: 0.5,
        line: {color: '#000000', width:3},
        text: ["x","","","y","","","",north_text,""],
        textfont: {
            size:30,
            color: "#000000"
        },
        textposition: 'top center'
    }
    var lower_tag = {
        x: [0], y:[0], z:[-1],
        type: 'scatter3d',
        showscale: false,
        hoverinfo: 'skip', 
        mode: 'text',
        opacity: 0.5,
        line: {color: '#000000', width:3},
        text: [south_text],
        textfont: {
            size:30,
            color: "#000000"
        },
        textposition: 'bottom center'
    }

       


    return [sphere, gridlines, gridlines_bold,equator_plane,axes,lower_tag]
    //return [axes,lower_tag]
    
}


function update_state_plot(full_update=false) {
    point_vector = state2vector(QMSTATEVECTOR[QMSTATEVECTOR.length-1]);
    new_data = gen_vector_plot(point_vector);
    if (PHOSPHOR_ENABLED === true) {
        phosphor_length = document.getElementById('phosphor_length').value - 1;
        startidx = PHOSPHOR.length-1-phosphor_length;
        if (startidx < 0) {
            startidx = 0;
        }
        stopidx = PHOSPHOR.length;
        phosphor_data = PHOSPHOR.slice(startidx,stopidx);
        //console.log("Phosphor set to");
        //console.log(phosphor_data);
    }
    else {
        phosphor_data = []
    }
    /*Plotly.animate('myDiv', {
        group: 'state',
        data: Array(BLOCHSPHERE.length).fill(null).concat(new_data).concat(phosphor_data)
      }, {
        transition: {
          duration: 0,
        },
        frame: {
          duration: 0,
          redraw: true,
        }
      });
      */
    
      init_plotting(BLOCHSPHERE.concat(new_data).concat(phosphor_data));
     
}


