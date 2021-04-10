
let W;
let H;

let scale = 1;

let N = 41*8+1;
let a = 2*Math.PI/4;
let phase = 10;
let fill_alpha = .5;

const enable_interaction = true;
let contact = false;
let hold = false;
let scroll_height = 10000;
let y_scroll = 0;
let scroll_start = 0;


let t0 = 0;
let t = t0;
const t_rate = .005;

let fps = 60;
let dt, startTime, now, then, elapsed;

let c = document.getElementById('canvas');
let x = canvas.getContext('2d');

let dwitter_mode = true;
if (dwitter_mode) {
    function S(x){return Math.sin(x)}
    function C(x){return Math.cos(x)}
    function T(x){return Math.tan(x)}
    function R(r,g,b,a){return `rgba(${r},${g},${b},${a})`}
}

function DwitterDraw(W, H, scale, N, phase, t) {
    x.beginPath();
    for(i=0;i<N;i++){k=scale*(W/2+20*C(t*i/phase))*.98**i;x.lineTo(W/2+k*S(i*a+Math.PI/4),H/2+k*C(i*a+Math.PI/4))}
    x.closePath();
    x.fill('evenodd');
    x.lineWidth=5;
    x.strokeStyle=R(100,100,255,.5);
    x.stroke();
}

function draw() {
    scale = Math.max(W,H)/130;
    x.fillStyle = R(255,255,255,1);
    x.fillRect(0, 0, W, H);
    x.fillStyle = R(0,50,100,fill_alpha);
    phase = 10 - 6*y_scroll;
    DwitterDraw(W, H, scale, N, phase, -t,);
    DwitterDraw(W, H, scale/1.5, N/1, phase, -t);
    t += t_rate;
    if (hold) {
        fill_alpha -= .01;
        fill_alpha = Math.max(0.1, fill_alpha);
    }
    if(!hold && fill_alpha >= 0.1) {
        fill_alpha += .01;
        fill_alpha = Math.min(0.7, fill_alpha);
    }
}

function animate(fps) {
    dt = 1000/fps;
    then = window.performance.now();
    startTime = then;
    throttle();
}
 
function throttle(newtime) {
    requestAnimationFrame(throttle);
    now = newtime;
    elapsed = now - then;
    if (elapsed > dt) {
        then = now - (elapsed % dt);
        draw();      
    }
}

if(enable_interaction) {
    let scroll_div= document.getElementById("scroll_div");
    scroll_div.scrollTop = scroll_start;
    scroll_div.onscroll = function(e) {
        y_scroll = scroll_div.scrollTop/(scroll_height - H);
    }
    scroll_div.addEventListener('mousedown', e => {
        hold = true;
    });
    scroll_div.addEventListener('mouseup', e => {
        hold = false;
    });
    scroll_div.addEventListener('touchstart', function(e) {
        hold = true;
    }, false);
    scroll_div.addEventListener('touchend', function(e) {
        hold = false;
    }, false);  
}

function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}

window.onresize = function(e) {
    resize();
}

resize();

animate(fps);