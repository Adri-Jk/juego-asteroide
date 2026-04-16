const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
c.fillStyle = 'black';
c.fillRect(0,0, canvas.width, canvas.height);

const keys = {};
  document.addEventListener('keydown', e=>keys[e.code]=true);
  document.addEventListener('keyup', e => keys[e.code]=false);

const balas = [];
let ultimoDisparo = 0;

const asteroides = [];

const nave = {
    x: canvas.width/2,
    y: canvas.height/2,
    vx:0, vy:0,
    size: 20,
    alive:true,
    invencivilidad:0,
    angle: 0,
}
function dibujarNave(x,y,angle,thrusting){
  c.save();
  c.translate(x,y);
  c.rotate(angle);
  c.beginPath();

  c.moveTo(20,0);
  c.lineTo(-10,-10);
  c.lineTo(-10,10);
  c.closePath();
  c.strokeStyle='white';
  c.stroke();

  if(thrusting){
    c.beginPath();
    c.moveTo(-10,0);
    c.lineTo(-20,-4);
    c.lineTo(-20, 4);
    c.closePath();
    c.strokeStyle='orange';
    c.stroke();
  }
  c.restore();

}
function loop (x,y){
c.fillStyle = 'black';
c.fillRect(0,0, canvas.width, canvas.height);
if (keys['ArrowLeft'])nave.angle -= 0.05;
if (keys['ArrowRight'])nave.angle += 0.05;
if (keys['ArrowUp']){
  nave.vx += Math.cos(nave.angle) * 0.12;
  nave.vy += Math.sin(nave.angle) * 0.12;
}
if (keys['Space'] && Date.now() - ultimoDisparo > 250) {
    Disparar();
    ultimoDisparo = Date.now();
}

nave.x += nave.vx;
nave.y += nave.vy;

nave.vx *= 0.99;
nave.vy *= 0.99;

for (let i = balas.length -1; i >= 0; i --){
  balas[i].x += balas[i].vx;
  balas[i].y += balas[i].vy;
  balas[i].life -= 0.02;
  if (balas[i].life <=0) {balas.splice(i,1); continue;}
  c.beginPath();
  c.arc(balas[i].x, balas[i].y, 3, 0, Math.PI *2);
  c.fillStyle = 'white';
  c.fill();
}

for(const a of asteroides){
  a.x += a.vx;
  a.y += a.vy;
  dibujarAsteroides(a);
}

dibujarNave(nave.x, nave.y, nave.angle, keys['ArrowUp']);
requestAnimationFrame(loop);
}
loop();

function Disparar(){
  balas.push({
    x: nave.x + Math.cos(nave.angle) * nave.size,
    y: nave.y + Math.sin(nave.angle) * nave.size,
    vx: Math.cos(nave.angle) * 9 + nave.vx,
    vy: Math.sin(nave.angle) * 9 + nave.vy,
    life:1,
  });
}

function crearAsteroides (x,y,radio){
  asteroides.push({
    x: x,
    y: y,
    radio: radio,
    vx: (Math.random() -0.5) * 2,
    vy: (Math.random() -0.5) * 2,
  })
}

crearAsteroides(100,100,40);
crearAsteroides(300,200,20);
crearAsteroides(100,300,30);
crearAsteroides(400,200,55);
crearAsteroides(600,400,60);

function dibujarAsteroides(a){
  c.beginPath();
  c.arc(a.x, a.y, a.radio, 0, Math.PI * 2);
  c.strokeStyle = 'White';
  c.stroke();
}

console.log(c);
console.log(canvas);



                
