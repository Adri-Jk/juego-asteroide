const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
c.fillStyle = 'black';
c.fillRect(0,0, canvas.width, canvas.height);
const nave = {
    x: canvas.width/2,
    y: canvas.height/2,
    vx:0, vy:0,
    size: 20,
    alive:true,
    invencivilidad:0,
}
function dibujarNave(x,y,angulo,thrusting){
  c.save();
  c.translate(x,y);
  c.rotate(angulo);
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
    c.lineTo(-20,-4);
    c.closePath();
    c.strokeStyle='orange';
    c.stroke();
  }
  c.restore();

  const keys = {};
  document.addEventListener('keydowm', e=>keys[e.code]=true);
  document.addEventListener('keyup', e => keys[e.code]=false);
}
function loop (x,y){
c.fillStyle = 'black';
c.fillRect(0,0, canvas.width, canvas.height);
if (keys['ArroyLeft'])nave.angle -=45;
if (keys['ArroyRight'])nave.angle +=45;
}
dibujarNave(nave.x, nave.y, 0,false);
 console.log(c);
console.log(canvas); 
