window.addEventListener('beforeunload', (e) => {
    window.scrollTo(0,0);
  });

var W;
var H;
var N = 41*8+1;

var body_height = document.getElementById("body").style.height;

var a = 2*Math.PI/4;
var phase = 10;
var scale = 1;

var fill_alpha = .5;

var contact = false;
var hold = false;

const enable_interaction = true;
var scrolling = false;
var scroll_y = 0;

var t = 0;
const t_purerate = .005;

const fps = 50;
var fpsInterval, startTime, now, then, elapsed;


var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


var dwitter_mode = true;

if (dwitter_mode) {
    function S(x){return Math.sin(x)}
    function C(x){return Math.cos(x)}
    function T(x){return Math.tan(x)}
    function R(r,g,b,a){return `rgba(${r},${g},${b},${a})`}
    var c = canvas;
    var x = ctx;
}


function DwitterCode(W, H, scale, N,t, phase) {
        
    x.beginPath();
    for(i=0;i<N;i++){k=scale*(W/2+20*C(t*i/phase))*.98**i;x.lineTo(W/2+k*S(i*a+Math.PI/4),H/2+k*C(i*a+Math.PI/4))}
    x.closePath();
    
    x.fill('evenodd');

    x.lineWidth=5;
    x.strokeStyle=R(100,100,255,.5);
    
    x.stroke();

}


startAnimating(fps);


function draw() {

    
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;

    scale = W/200;

    x.fillStyle = 'rgba(255,255,255,1)';
    x.fillRect(0, 0, W, H);

    x.fillStyle = `rgba(0,50,100,${fill_alpha})`;

    phase = 10 - 6*scroll_y;

    DwitterCode(W, H, scale, N,-t, phase);

    DwitterCode(W, H, scale/1.5, N/1,-1*t, phase);
 
 
    
    t += t_purerate;
        
    

    if (hold) {
        fill_alpha -= .01;
        fill_alpha = Math.max(0.1, fill_alpha);
    }
    
    if(!hold && fill_alpha >= 0.1) {
        fill_alpha += .01;
        fill_alpha = Math.min(0.7, fill_alpha);
    }
    
}


function startAnimating(fps) {
    
    fpsInterval = 1000/fps;
    then = window.performance.now();
    startTime = then;
    
    animate();
 }
 
 function animate(newtime) {
    
     requestAnimationFrame(animate);
 
     now = newtime;
     elapsed = now - then;
 
     if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
     
        draw();
     }

     if(enable_interaction) {

        window.addEventListener('scroll', function(e) {
            scroll_pos = window.scrollY;
            
            if (!scrolling) {
                window.requestAnimationFrame(function() {
                scroll_interaction(scroll_pos);
                scrolling = false;
                });
            
                scrolling = true;
            }
            });

        canvas.addEventListener('mousedown', e => {
            hold = true;
        });
        
        canvas.addEventListener('mouseup', e => {
            hold = false;
        });
    
        canvas.addEventListener('touchstart', function(e) {
            hold = true;
        }, false);
        
        canvas.addEventListener('touchend', function(e) {
            hold = false;
        }, false);  
    }
  
 }
 

function scroll_interaction(scroll_pos) {
    y_scroll = scroll_pos/(10000 - H);
    scroll_y = y_scroll;
}