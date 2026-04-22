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

const particulas = [];

let vidas = 3;

let gameOver = false;

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

if (nave.x < 0) nave.x = canvas.width;
if (nave.x > canvas.width) nave.x = 0;
if (nave.y < 0) nave.y = canvas.height;
if (nave.y > canvas.height) nave.y = 0;

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

for (let i= balas.length -1; i >= 0; i--){
  for(let j= asteroides.length -1; j >= 0; j--){
    const distancia = Math.hypot(balas[i].x - asteroides[j].x, balas[i].y - asteroides[j].y);
    if (distancia < asteroides[j].radio){
      const ax = asteroides[j].x;
      const ay = asteroides[j].y;
      const ar = asteroides[j].radio;

      balas.splice(i, 1);
      asteroides.splice(j, 1);
      if (ar > 20){
        crearAsteroides(ax, ay, ar/2);
        crearAsteroides(ax, ay, ar/2);
      }
      break;
    }
  }
}

for (let j= asteroides.length -1; j >= 0;j--){
  const distancia = Math.hypot(nave.x - asteroides[j].x, nave.y - asteroides[j].y);
  if (distancia < asteroides[j].radio + nave.size && nave.alive){
    nave.alive = false;
    vidas--;
    explosionNave();
    if (vidas <= 0){
      gameOver = true;
    }else{
    setTimeout(() => {
      nave.x = canvas.width/2;
      nave.y = canvas.height/2;
      nave.vx = 0;
      nave.vy = 0;
      nave.alive = true;
    }, 2000);
    }
    break;
  }
}

for(let i = particulas.length -1; i >= 0; i--){
  particulas[i].x += particulas[i].vx;
  particulas[i].y += particulas[i].vy;
  particulas[i].life -= 0.02;
  if (particulas[i].life <= 0) {particulas.splice(i, 1); continue;}
  c.beginPath();
  c.moveTo(particulas[i].x, particulas[i].y);
    c.lineTo(
        particulas[i].x + particulas[i].vx * particulas[i].largo,
        particulas[i].y + particulas[i].vy * particulas[i].largo
    );
    c.strokeStyle = `rgba(255, 255, 255, ${particulas[i].life})`;
    c.lineWidth = 1.5;
    c.stroke();
}

for(const a of asteroides){
  a.x += a.vx;
  a.y += a.vy;
  if (a.x < 0) a.x = canvas.width;
    if (a.x > canvas.width) a.x = 0;
    if (a.y < 0) a.y = canvas.height;
    if (a.y > canvas.height) a.y = 0;
  dibujarAsteroides(a);
}

if (gameOver){
  c.fillStyle = 'white';
  c.font = '50px vector battle';
  c.textAlign = 'center';
  c.fillText('GAME OVER', canvas.width/2, canvas.height/2);
  return;
}

c.fillStyle = 'white';
c.font = '30px vector battle';
c.textAlign = 'left';
c.fillText ('VIDAS:' + vidas, 20, 30);

if (nave.alive){
  dibujarNave(nave.x, nave.y, nave.angle, keys['ArrowUp']);
}
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
  const vertices = [];
  const puntos = 10;
  for (let i = 0; i < puntos; i++){
    const angulo = (i/puntos) * Math.PI * 2;
    const jitter = 0.6 + Math.random() * 0.4;
    vertices.push({
      x: Math.cos(angulo) * radio * jitter,
      y: Math.sin(angulo) * radio * jitter,
    });
  }
  asteroides.push({
    x: x,
    y: y,
    radio: radio,
    vx: (Math.random() -0.5) * 2,
    vy: (Math.random() -0.5) * 2, 
    vertices 
  });
}

crearAsteroides(100,100,40);
crearAsteroides(300,200,20);
crearAsteroides(100,300,30);
crearAsteroides(400,200,55);
crearAsteroides(600,400,60);

function dibujarAsteroides(a){
  c.beginPath();
  c.moveTo(a.x + a.vertices[0].x, a.y + a.vertices[0].y);
  for (let i = 1; i < a.vertices.length; i++){
    c.lineTo(a.x + a.vertices[i].x, a.y + a.vertices[i].y);
  }
  c.closePath();
  c.strokeStyle = 'White';
  c.stroke();
}

function explosionNave(){
  for(let i = 0; i < 6; i++){
    const angulo = Math.random()* Math.PI * 2;
    const velocidad = 1 + Math.random()* 3;
    particulas.push({
      x:nave.x,
      y:nave.y,
      vx: Math.cos(angulo) * velocidad,
      vy: Math.sin(angulo) * velocidad,
      life: 1,
      largo: 5 + Math.random() * 10,
    });
  }
}

