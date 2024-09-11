let looping = false;
let grimoire = false;
let tabsLoaded = false;
let gr;
let mode = 0;
let keysActive = true;
let socket, cnvs, ctx, canvasDOM;
let traversing = false;
let fileName = "./frames/sketch";
let JSONs = [];
let maxFrames = 20;
let gl, shaderProgram;
let vertices = [];
let colors = [];
let indices = [];
let amountOfLines = 0;
let drawCount = 0;
let dotsVBuf;
let termVBuf, dotsCBuf;
const openSimplex = openSimplexNoise(10);
let fmouse = [0, 0];
let pmouse = [0, 0];
let smouse = [0, 0];
let resolutionScalar = 0.5;
let resolutionBG;
let ansiChars = "";
let noPainting = true;
let batchExport = false;

let vertex_buffer, indices2_buffer, Index_Buffer, color_buffer, width_buffer, uv_buffer, dots_buffer;
let vertex_bufferA, vertex_bufferB;

let g, w;
let p = 20;
let traversed = 0;
let size = 10;
let texture, texture2, framebuf, framebuf2;
// ------------------------------------------------------------
// Grimoire Animate
// ------------------------------------------------------------

var stop = false;
var fps, fpsInterval, startTime, now, then, elapsed;
var animationStart;
var framesRendered = 0;
var framesOfASecond = 0;
var secondStart, secondFrames;
var fps = 24;
var envirLooping = false;

startAnimating = function() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    animationStart = Date.now();
    secondStart = Date.now();
    startTime = then;
    framesRendered = 0;
    envirLooping = true;
    animate();
}

function queryFrameRate() {
    let timeElapsed = Date.now() - animationStart;
    let seconds = timeElapsed / 1000;
    logJavaScriptConsole(framesRendered / seconds);
    // logJavaScriptConsole(timeElapsed);
}

// the animation loop calculates time elapsed since the last loop
// and only draws if your specified fps interval is achieved

function animate() {

    // request another frame
    if (envirLooping) {

        requestAnimationFrame(animate);


        // calc elapsed time since last loop

        now = Date.now();
        elapsed = now - then;

        // if enough time has elapsed, draw the next frame

        if (elapsed > fpsInterval) {

            // Get ready for next frame by setting then=now, but also adjust for your
            // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
            then = now - (elapsed % fpsInterval);
            // Put your drawing code here
            draw();
            framesRendered++;
            framesOfASecond++;
            if (framesOfASecond == fps) {
                secondFrames = fps / ((Date.now() - secondStart) * 0.001);
                // logJavaScriptConsole(secondFrames);
                framesOfASecond = 0;
                secondStart = Date.now();
            }
        }
    }
}


function setup() {
    socket = io.connect('http://localhost:8080');
    // socket.on('receiveOSC', function(data) {
    //     // console.log(data.args[0].value);
    //     size = data.args[0].value;
    // });
    pixelDensity(1);
    noCanvas();
    cnvs = document.getElementById('my_Canvas');

    gl = cnvs.getContext('webgl', { preserveDrawingBuffer: true });
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(false);
    // gl.colorMask(true, true, true, true);
    // gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    // Set the view port
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    dotsVBuf = gl.createBuffer();
    dotsCBuf = gl.createBuffer();
    termVBuf = gl.createBuffer();
    
    vertex_buffer = gl.createBuffer();
    indices2_buffer = gl.createBuffer();
    Index_Buffer = gl.createBuffer();
    color_buffer = gl.createBuffer();
    width_buffer = gl.createBuffer();
    uv_buffer = gl.createBuffer();
    dots_buffer = gl.createBuffer();
    vertex_bufferA = gl.createBuffer();
    vertex_bufferB = gl.createBuffer();
    shadersReadyToInitiate = true;
    initializeShaders();
    currentProgram = getProgram("smooth-line");
    gl.useProgram(currentProgram);

    shadersReadyToInitiate = true;
    initializeShaders();
    // texture = createTexture();
    // framebuf = createFrameBuffer(texture);
    // texture2 = createTexture();
    // framebuf2 = createFrameBuffer(texture2);
    // setTimeout(function() {
    //     scdConsoleArea.setAttribute("style", "display:block;");
    //     scdArea.style.display = "none";
    //     scdConsoleArea.setAttribute("style", "display:none;");
    //     jsCmArea.style.height = "685px";
    //     jsArea.style.display = "block";
    //     displayMode = "js";
    //     javaScriptEditor.cm.refresh();
    // }, 1);
    setTimeout( function() {
        keysControl.addEventListener("mouseenter", function(event) {
            document.body.style.cursor = "none";
            document.body.style.backgroundColor = "#000000";
            appControl.setAttribute("style", "display:none;");
            let tabs = document.querySelector("#file-tabs");
            tabs.setAttribute("style", "display:none;");
            cinemaMode = true;
            scdArea.style.display = "none";
            scdConsoleArea.style.display = "none";
            jsArea.style.display = "none";
            jsConsoleArea.style.display = "none";
        }, false);
        keysControl.addEventListener("mouseleave", function(event) {
            if (!grimoire) {
                document.body.style.cursor = "default";
                document.body.style.backgroundColor = "#1C1C1C";
                appControl.setAttribute("style", "display:block;");
                let tabs = document.querySelector("#file-tabs");
                tabs.setAttribute("style", "display:block;");
                // let slider = document.querySelector("#timeline-slider");
                // slider.setAttribute("style", "display:block;");
                // slider.style.display = "block";
                // canvasDOM.style.bottom = null;
                if (displayMode === "both") {
                    scdArea.style.display = "block";
                    scdConsoleArea.style.display = "block";
                    jsArea.style.display = "block";
                    jsConsoleArea.style.display = "block";
                } else if (displayMode == "scd") {
                    scdArea.style.display = "block";
                    scdConsoleArea.style.display = "block";
                } else if (displayMode == "js") {
                    jsArea.style.display = "block";
                    jsConsoleArea.style.display = "block";
                }
                cinemaMode = false;
                clearSelection();
            }   
        }, false);
    }, 1);

    // textFont('Inconsolata');
    frameRate(30);
    // background(255);
    // fill(0);
    // stroke(0);
    // noStroke();
    g = new Graph();
    if (!looping) {
        noLoop();
    }
    let padding = 100;
    for (let i = 0; i < 200; i++) {
        let d = p + 40;
        // let p = d + 30;
        // let x = random(d, width - d);
        // let y = random(d, height - d);
        let x = map(Math.random(), 0, 1, -0.9, 0.9);
        let y = map(Math.random(), 0, 1, -0.9, 0.9);
        x *= (16/9);
        let v = new Vertex(x, y, g.vertices);
    }
    // preparePrim();
    // do {
    //     makePrim();
    // } while (unreached.length > 0);
    // for (let i = 0; i < 100; i++) {
    //     makePrim();
    // }
    // for (let i = 0; i < pairs.length; i++) {
    //     g.createEdge(pairs[i][0], pairs[i][1]);
    // }
    for (let i = 0; i < 200; i++) {
        let r1 = floor(random(g.vertices.length));
        let v1 = g.vertices[r1].pos;
        // let r2;
        let candidates = [];
        let choice;
        for (let j = 0; j < 50; j++) {
            let r2 = floor(random(g.vertices.length));
            if (r2 !== r1) {
                candidates.push(r2);
            }
        }
        let d = Infinity;
        for (let j = 0; j < candidates.length; j++) {
            let v2 = g.vertices[candidates[j]].pos;
            let dd = dist(v1.x, v1.y, v2.x, v2.y);
            if (dd < d) {
                choice = candidates[j];
                d = dd;
            }
        }
                        
                
        // let 
        g.createEdge(g.vertices[r1], g.vertices[choice]);
    }
    // for (let i = 0; i < 100; i++) {
    //     let d = Infinity;
    //     for (let j = 0; j < 10; j++) {
            
    //     }
    //     let r1 = floor(random(g.vertices.length));
    //     let r2 = floor(random(g.vertices.length));
    //     g.createEdge(g.vertices[r1], g.vertices[r2]);
    // }
    // for (let i = 0; i < 100; i++) {
    //     let x = (cos(i) * i * frameCount) + width / 2;
    //     let y = (sin(i) * i * frameCount) + height / 2;
    //     let v = new Vertex(x, y, g.vertices);
    // }
    // for (let i = 0; i < 99; i++) {
    //     let r1 = i;
    //     let r2 = i + 1;
    //     g.createEdge(g.vertices[r1], g.vertices[r2]);
    // }
    for (let i = 0; i < 4; i++) {
        let ran = floor(random(g.vertices.length));
        g.vertices[ran].addFunction(1);
        ran = floor(random(g.vertices.length));
        g.vertices[ran].addFunction(1);
        ran = floor(random(g.vertices.length));
        g.vertices[ran].addFunction(2);
        ran = floor(random(g.vertices.length));
        g.vertices[ran].addFunction(4);
    }
    for (let i = 0; i < 3; i++) {
        let vertexOrigin;
        do {
            vertexOrigin = random(g.vertices);
        } while (vertexOrigin.edges.length < 1);
        w = new Walker(vertexOrigin);
    }

    // wave = new p5.Oscillator();
    // wave.setType("sine");
    // wave.start();
    // wave.amp(0.4);
    // wave.freq(440);
    ansiChars = swatchesArr;
    swatchesArr = "";
}

ox = 0; oy = 0;
// cameraSpeed = 0;
// desiredSpeed = 0;
// cameraPos = new p5.Vector(0, 0);
// cameraVel = new p5.Vector(0, 0);
// cameraAcc = new p5.Vector(0, 0);
// walkerPos = new p5.Vector(0, 0);
draw = function() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    reset3DLines();
    vertices = [];
    // background(255);
    // stroke(0);
    // noFill();
    // rect((width - height) * 0.5, p, p + height - (p * 2) * 0.5, height - (p * 2));
    // for (let i = 0; i < 100; i++) {
    //     let osc = 10 + frameCount * 0.0001;
    //     let x = (cos(i * osc) * i * 3.5) + width / 2;
    //     let y = (sin(i * osc) * i * 3.5) + height / 2;
    //     g.vertices[i].pos.x = x;
    //     g.vertices[i].pos.y = y;
    //     // let v = new Vertex(x, y, g.vertices);
    // }
    g.move();
    g.show();
    if (traversing) {
        for (let i = 0; i < walkers.length; i++) {
            // if (traversed > 4) {
                walkers[i].show();
            // }
            if (envirLooping) {
                if (!walkers[i].walking && !walkers[i].sleeping) {
                    walkers[i].startWalking();
                }
                if (walkers[i].walking) {
                    walkers[i].walk();
                }
            }
        }
        if (traversed < 10) {
            traversed++;
        }
    }
    let d, x, y;
    if (!walkers[0].walking) {
        x = walkers[0].v.pos.x;
        y = walkers[0].v.pos.y;
    } else {
        d = map(walkers[0].walked, 0, walkers[0].distanceToWalk, 0, 1);
        x = lerp(walkers[0].v.pos.x, walkers[0].goalV.pos.x, d);
        y = lerp(walkers[0].v.pos.y, walkers[0].goalV.pos.y, d);
    }
    // desiredSpeed = dist(ox, oy, x, y);
    // cameraSpeed = (cameraSpeed + desiredSpeed) * 0.035;
    // cameraSpeed = lerp(cameraSpeed, desiredSpeed, 0.001);
    
    // cameraSpeed = cameraSpeed * 0.97 + desiredSpeed * 0.001;
    // console.log(desiredSpeed);
    // ox = lerp(ox, x, cameraSpeed);
    // oy = lerp(oy, y, cameraSpeed);
    ox = lerp(ox, x, 0.01);
    oy = lerp(oy, y, 0.01);
    // walkerPos.x = x; walkerPos.y = y;
    // cameraAcc = p5.Vector.sub(walkerPos, cameraPos);
    // cameraAcc.mult(0.005);
    // cameraVel.add(cameraAcc);
    // cameraPos.add(cameraVel);
    // cameraVel.mult(0.75);
    // ox = cameraPos.x;
    // oy = cameraPos.y;
    let zoom = 2;
    for (let i = 0; i < verticesA.length; i += 3) {
        verticesA[i] = (verticesA[i] - ox) * zoom;
        verticesA[i+1] = (verticesA[i+1] - oy) * zoom;
        verticesB[i] = (verticesB[i] - ox) * zoom;
        verticesB[i+1] = (verticesB[i+1] - oy) * zoom;;
    }
    for (let i = 0; i < vertices.length; i += 4) {
        vertices[i] = (vertices[i] - ox) * zoom;
        vertices[i+1] = (vertices[i+1] - oy) * zoom;
    }
    currentProgram = getProgram("smooth-line-3D");
    gl.useProgram(currentProgram);
    draw3DLines();
    currentProgram = getProgram("smooth-dots-3D");
    gl.useProgram(currentProgram);
    draw3DDots(currentProgram);
    currentProgram = getProgram("rounded-square");
    time = gl.getUniformLocation(currentProgram, "time"); 
    disturb = gl.getUniformLocation(currentProgram, "disturb"); 
    gl.useProgram(currentProgram);
    drawTerminal(currentProgram);
    drawCount++;
    if (exporting && frameCount < maxFrames) {
        // frameExport();
    }
}

// function keyPressed() {
//     if (keysActive) {
//         if (keyCode === 32) {
//             if (looping) {
//                 noLoop();
//                 looping = false;
//             } else {
//                 loop();
//                 looping = true;
//             }
//         }
//         if (key == 'p' || key == 'P') {
//             frameExport();
//         }
//         if (key == 'r' || key == 'R') {
//             window.location.reload();
//         }
//         if (key == 'm' || key == 'M') {
//             redraw();
//         }
//         if (key == 'l' || key == 'L') {
//             traversing = true;
//         }
//     }
// }

resetLines = function() {
    indices = [];
    indices2 = [];
    vertices = [];
    colors = [];
    widths = [];
    uvs = [];
    lineAmount = 0;
};

reset3DLines = function() {
    indices = [];
    indices2 = [];
    verticesA = [];
    verticesB = [];
    colors = [];
    widths = [];
    uvs = [];
    lineAmount = 0;
};

add3DLine = function(x0, y0, z0, x1, y1, z1, w, r, g, b, a) {
    let ii = [0, 1, 2, 0, 2, 3];
    let iii = [0, 1, 2, 3];
    for (let k = 0; k < ii.length; k++) {
        indices.push(ii[k] + (lineAmount*4));
    }        
    for (let k = 0; k < iii.length; k++) {
        indices2.push(iii[k]);
    }
    let vv = [
        x0, y0, z0,
        x0, y0, z0,
        x0, y0, z0,
        x0, y0, z0
    ];
    for (let k = 0; k < vv.length; k++) {
        verticesA.push(vv[k]);
    }
    let vvv = [
        x1, y1, z1,
        x1, y1, z1,
        x1, y1, z1,
        x1, y1, z1
    ];
    for (let k = 0; k < vvv.length; k++) {
        verticesB.push(vvv[k]);
    }
    let cc = [
        r, g, b, a, 
        r, g, b, a, 
        r, g, b, a, 
        r, g, b, a
    ];
    for (let k = 0; k < cc.length; k++) {
        colors.push(cc[k]);
    }
    widths.push(w, w, w, w);
    let uv = [
        0, 0, 
        1, 0, 
        1, 1, 
        0, 1
    ];
    for (let k = 0; k < uv.length; k++) {
        uvs.push(uv[k]);
    }
    lineAmount++;
};

draw3DLines = function() {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_bufferA);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesA), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_bufferB);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesB), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, indices2_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices2), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, width_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(widths), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW); 
    // setShaders();
    /* ======== Associating shaders to buffer objects =======*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_bufferA);
    // Bind index buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    // Get the attribute location
    var coordA = gl.getAttribLocation(currentProgram, "coordinatesA");
    // point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coordA, 3, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coordA);
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_bufferB);
    // Bind index buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    // Get the attribute location
    var coordB = gl.getAttribLocation(currentProgram, "coordinatesB");
    // point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coordB, 3, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coordB);
    // bind the indices2 buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, indices2_buffer);
    // get the attribute location
    var indices2AttribLocation = gl.getAttribLocation(currentProgram, "index");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(indices2AttribLocation, 1, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(indices2AttribLocation);
    // bind the color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    // get the attribute location
    var color = gl.getAttribLocation(currentProgram, "color");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(color);
    // bind the width buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, width_buffer);
    // get the attribute location
    var widthAttribLocation = gl.getAttribLocation(currentProgram, "width");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(widthAttribLocation, 1, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(widthAttribLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
    var uvAttribLocation = gl.getAttribLocation(currentProgram, "uv");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(uvAttribLocation, 2, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(uvAttribLocation);
    resolutionUniformLocation = gl.getUniformLocation(currentProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);    
    timeUniformLocation = gl.getUniformLocation(currentProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
    // gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
};

addLine = function(x0, y0, x1, y1, w, r, g, b, a) {
    let ii = [0, 1, 2, 0, 2, 3];
    let iii = [0, 1, 2, 3];
    for (let k = 0; k < ii.length; k++) {
        indices.push(ii[k] + (lineAmount*4));
    }        
    for (let k = 0; k < iii.length; k++) {
        indices2.push(iii[k]);
    }
    let vv = [
        x0, y0, x1, y1,
        x0, y0, x1, y1,
        x0, y0, x1, y1,
        x0, y0, x1, y1
    ];
    for (let k = 0; k < vv.length; k++) {
        vertices.push(vv[k]);
    }
    let cc = [
        r, g, b, a, 
        r, g, b, a, 
        r, g, b, a, 
        r, g, b, a
    ];
    for (let k = 0; k < cc.length; k++) {
        colors.push(cc[k]);
    }
    widths.push(w, w, w, w);
    let uv = [
        0, 0, 
        1, 0, 
        1, 1, 
        0, 1
    ];
    for (let k = 0; k < uv.length; k++) {
        uvs.push(uv[k]);
    }
    lineAmount++;
};


drawLines = function() {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, indices2_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices2), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, width_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(widths), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW); 
    // setShaders();
    /* ======== Associating shaders to buffer objects =======*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Bind index buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    // Get the attribute location
    var coord = gl.getAttribLocation(currentProgram, "coordinates");
    // point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    // bind the indices2 buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, indices2_buffer);
    // get the attribute location
    var indices2AttribLocation = gl.getAttribLocation(currentProgram, "index");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(indices2AttribLocation, 1, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(indices2AttribLocation);
    // bind the color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    // get the attribute location
    var color = gl.getAttribLocation(currentProgram, "color");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(color);
    // bind the width buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, width_buffer);
    // get the attribute location
    var widthAttribLocation = gl.getAttribLocation(currentProgram, "width");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(widthAttribLocation, 1, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(widthAttribLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
    var uvAttribLocation = gl.getAttribLocation(currentProgram, "uv");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(uvAttribLocation, 2, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(uvAttribLocation);
    resolutionUniformLocation = gl.getUniformLocation(currentProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);    
    timeUniformLocation = gl.getUniformLocation(currentProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
    // gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
};


drawAlligatorQuiet = function(selectedProgram) {
    vertices = [];
    num=0;
    for (let i = 0; i < 500; i++) {
        let x = Math.cos(i-drawCount) * i * 9e-4 * sc;
        let y = Math.sin(i-drawCount) * i * 9e-4 * sc;
        vertices.push(x, y);
        num++;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, dots_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    let timeUniformLocation = gl.getUniformLocation(selectedProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
    let resolutionUniformLocation = gl.getUniformLocation(selectedProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
    gl.drawArrays(gl.POINTS, 0, num);
};

draw3DDots = function(selectedProgram) {
    gl.bindBuffer(gl.ARRAY_BUFFER, dots_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    let timeUniformLocation = gl.getUniformLocation(selectedProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
    let resolutionUniformLocation = gl.getUniformLocation(selectedProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
    gl.drawArrays(gl.POINTS, 0, vertices.length / 4);
};

setTabs = function() {
};

tl = function(d = 0) {
    setTimeout(function() {
                if (envirLooping) {
                // noLoop();
                envirLooping = false;
                traversing = false;
            } else {
                envirLooping = true;
                traversing = true;
                startAnimating();
            }
    }, d * 1e3);
};

gr = function() {
    grimoire = !grimoire;
}

keyDown = function(e) {
    if (keysActive) {
        if (ge.recording) {
            ge.recordingSession.push([drawCount, {
                name: "keyDown",
                key: e.key,
                keyCode: e.keyCode,
                altKey: e.altKey,
                metaKey: e.metaKey,
                shiftKey: e.shiftKey
            }]);
        }
        // console.log(event.keyCode);
        if (e.keyCode == 27 && ge.activeTab !== null) {
            if (noPainting) {
                mode = (mode + 1) % 2;
            } else {
                mode = (mode + 1) % 3;
            }
        }
        if (mode == 0) {
                if (vtActive) {
                    vt.update(e);
                    // ljs(event.keyCode);
                }
            updateDrawing(e);
        } else if (mode == 1) {
            ge.update(e);
        } else if (mode == 2) {
            paintingKeys(e);
        }
    }
}


function preparePrim() {
    // field3D = [];
    // let n = 400;
    // for (var i = 0; i < n; i++) {
    //     // let p = randomPointInSphere();
    //     let p = randomPointOnSphere();
    //     field3D.push(p);
    // }
    reached = [];
    unreached = [];
    for (let i = 0; i < g.vertices.length; i++){
        unreached.push(g.vertices[i]);
    }
    reached.push(unreached[Math.floor(Math.random()*unreached.length)]);
    unreached.splice(0, 1);
    pairs = [];
    // vertices = [].concat.apply([], field3D);
    // num = n;
}

function makePrim() {
    // if (unreached.length > 0) {
        let record = Infinity;
        var rIndex;
        var uIndex;
        let found = false;
        for (var i = 0; i < reached.length; i++) {
          for (var j = 0; j < unreached.length; j++) {
            var v1 = reached[i].pos;
            var v2 = unreached[j].pos;
            var d = dist(v1.x, v1.y, v2.x, v2.y);
              if (d < record) {
              record = d;
              rIndex = i;
              uIndex = j;
              found = true;
            }
          }
        }
        if (found) {
            pairs.push([reached[rIndex], unreached[uIndex]]);
            reached.push(unreached[uIndex]);
            unreached.splice(uIndex, 1);
        }
    // }
}

getAnsiChars = function() {
    if (swatchesArr.length == 0) {
        swatchesArr = ansiChars;
    } else {
        swatchesArr = "";
    }
};


document.onkeydown = keyDown; 
