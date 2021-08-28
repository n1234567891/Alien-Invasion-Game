

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');


canvas.width = 900;
canvas.height = 600;

const background = new Image();
background.src = 'background.png';


const cellSize =  100;
const cellGap = 3;
const gameGrid = [];
const defenders = [];
let numberOfResources = 300;
const enemies = [];
let enemiesInterval = 600;
const projectiles = [];
const resources = [];
const enemyPosition = [];
let gameOver = false;
let frame = 0;
let score = 0;
let chosenDefender = 0;



const mouse = {
    x : 5,
    y : 5,
    width : 0.1,
    height : 0.1,
    clicked : false,
}

canvas.addEventListener('mousedown', function() {
            mouse.clicked = true;
});

canvas.addEventListener('mouseup', function() {
            mouse.clicked = false;
});


let canvasPosition = canvas.getBoundingClientRect();


canvas.addEventListener('mousemove', function(e) {
                mouse.x = e.x - canvasPosition.left;
                mouse.y = e.y - canvasPosition.top;

});

canvas.addEventListener('mouseleave', function() {
                mouse.x = undefined;
                mouse.y = undefined;

});



const controlsBar = {
        width : canvas.width,
        height : cellSize,
}

class Cell {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.width = cellSize;
            this.height = cellSize;
        }

        draw() {

                if(mouse.x && mouse.y && collision(this, mouse)) {
                   ctx.strokeStyle = 'black';
                   ctx.strokeRect(this.x, this.y, this.width, this.height);
                }
                

        }
}

function createGrid() {

        for(let y = cellSize; y < canvas.height - controlsBar.height; y += cellSize) {
                    
                    for(let x = 0; x < canvas.width; x += cellSize) {
                            
                             gameGrid.push(new Cell(x, y));
                    }
        }

}

createGrid();

function handleGameGrid() {

        for(let i = 0; i < gameGrid.length; i++) {
                    
                    gameGrid[i].draw();
        }
}




const floatingMessages = [];

class floatingMessage {
        constructor(value, x, y, size, color) {
                this.value = value;
                this.x = x;
                this.y = y;
                this.size = size;
                this.color = color;
                this.lifespan = 0;
                this.opacity = 1;
        }

        update() {
                this.y -= 0.3;
                this.lifespan++;

                if(this.opacity >= 0.02) {
                        this.opacity -= 0.02;
                }
        }

        draw() {

                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.font = this.size + 'px Arial';
                ctx.fillText(this.value, this.x, this.y);
                ctx.globalAlpha = 1;
        }
}

function handlefloatingMessages() {

                for(let i = 0; i < floatingMessages.length; i++) {
                        
                            floatingMessages[i].update();
                            floatingMessages[i].draw();
                            
                            if(floatingMessages[i].lifespan >= 50) {
                                    
                                        floatingMessages.splice(i, 1);
                                        i--;
                            }
                }
}




const particlesArray = [];
const maxParticles = 1000;

class Particle {

                constructor(x, y) {

                        this.x = x + 45;
                        this.y = y + 45;
                        this.opacity = 1;
                        this.radius = Math.random() * 20 + 1;
                        this.directionX = Math.random() * 1 - 0.5;
                        if(this.directionX < 0) {
                                this.directionX -= 0.2;
                        } else {
                                this.directionX += 0.2;
                        }
                        this.directionY = Math.random() * 1 - 0.5;
                          if(this.directionY < 0) {
                                this.directionY -= 0.2;
                        } else {
                                this.directionY += 0.2;
                        }
                }

                draw() {
                        ctx.fillStyle = 'rgba(150, 150, 150,' + this.opacity + ')';
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.closePath();
                }
                
                update() {
                        this.x += this.directionX;
                        this.y += this.directionY;
                        if(this.opacity > 0.1) {
                                this.opacity -= 0.15;
                        }
                        if(this.radius > 0.15) {
                                this.radius -= 0.14;
                        }
                }



}


function handleParticles() {

            for(let i = 0; i < particlesArray.length; i++) {
                    particlesArray[i].update();
                    particlesArray[i].draw();
            }


            if(particlesArray.length > maxParticles) {
                    for(let i = 0; i < 100; i++) {
                            particlesArray.pop();
                    }
            }


}



class Projectile {
            constructor(x, y, type) {
                    this.x = x;
                    this.y = y;

                    if(type == 2) {
                            this.width = (10 * type);
                            this.height = 10;
                    } else {
                            this.width = 5;
                            this.height = 5;
                    }
                    
                    this.type = type;
                    this.power = (20 * type);
                    this.speed = (3 + (type * 2));

            }

            update() {
                    this.x += this.speed;
            }

            draw() {
                    ctx.fillStyle = 'black';

                    if(this.type == 1) {
                                ctx.beginPath();
                                ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
                                ctx.fill();
                    } else {
                                ctx.fillRect(this.x, this.y, this.width, this.height);
                    }
                   
            }

}

function handleProjectiles() {
        
        for(let i = 0; i < projectiles.length; i++) {
                
                    projectiles[i].update();
                    projectiles[i].draw();

                     if(projectiles[i].x > (canvas.width - 20)) {
                                projectiles.splice(i, 1);
                                i--;
                                continue;
                    }

                    for(let j = 0; j < enemies.length; j++) {
                                if(collision(projectiles[i], enemies[j])) {
                                            
                                            enemies[j].health -= projectiles[i].power;

                                            projectiles.splice(i, 1);
                                            i--;
                                            break;
                                }
                    }    

               
        }
}



const defender1 = new Image();
defender1.src = 'defender.png'


const defender2 = new Image();
defender2.src = 'super_defender.png';


const overall = {
        x : 0,
        y : 0,
        width : canvas.width,
        height : cellSize,
}

const card1 = {
        x : 10,
        y : 5,
        width : 55,
        height : 70

}

const card2 = {
        x : 100,
        y : 5,
        width : 55,
        height : 70,

}

const bottom_card1 = {
        x : 50,
        y : 510,
        width : 500,
        height : 80,
}

const bottom_card2 = {  

        x : 600,
        y : 510,
        width : 250,
        height : 35,
}

const bottom_card3 = {

        x : 600,
        y : 555,
        width : 250,
        height : 35,
}



function chooseDefenders() {

        let now1, now2;

        if(collision(mouse, overall) && mouse.clicked) {
                         if(collision(mouse, card1) && mouse.clicked) {

                            if(numberOfResources < 100) {
                                    floatingMessages.push(new floatingMessage('need more ' + (100 - numberOfResources) + ' resources', mouse.x, mouse.y, 20, 'orange'));
                                    
                            } else {
                                        chosenDefender = 1;
                            }

                            

                } else if(collision(mouse, card2) && mouse.clicked) {
                        
                            if(numberOfResources < 150) {
                                    floatingMessages.push(new floatingMessage('need more ' + (150 - numberOfResources) + ' resources', mouse.x, mouse.y, 20, 'orange'));
                                   
                            } else {
                                        chosenDefender = 2;
                            }
                } else {
                        chosenDefender = 0;
                }
        }


        if(chosenDefender == 1) {
                now1 = 'gold';
                now2 = 'black';

        } else if(chosenDefender == 2) {
                now1 = 'black';
                now2 = 'gold';
        } else {
                now1 = 'black';
                now2 = 'black';
        }

        ctx.lineWidth = 3;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = now1;
        

        ctx.fillRect(card1.x, card1.y, card1.width, card1.height);
        ctx.drawImage(defender1, 0, 0, 800, 800, card1.x, card1.y, card1.width, card1.height);
        ctx.strokeRect(card1.x, card1.y, card1.width, card1.height);
        

        ctx.strokeStyle = 'black';
        ctx.strokeRect(bottom_card1.x, bottom_card1.y, bottom_card1.width, bottom_card1.height);
        ctx.strokeRect(bottom_card2.x, bottom_card2.y, bottom_card2.width, bottom_card2.height);
        ctx.strokeRect(bottom_card3.x, bottom_card3.y, bottom_card3.width, bottom_card3.height);


        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText('Choose defenders at top and place them on field to', bottom_card1.x + 10, bottom_card1.y + 30);
        ctx.fillText('stop aliens, make sure aliens do not cross left side', bottom_card1.x + 10, bottom_card1.y + 60);
        ctx.font = '15px Arial';
        ctx.fillText('Reload the page to restart the game', bottom_card2.x + 10, bottom_card2.y + 25);
        ctx.fillText('Created by - Nilesh Kumar Sahu', bottom_card3.x + 10, bottom_card3.y + 25);


        ctx.font = '20px Arial';
        ctx.fillText(100, card1.x, card1.y + card1.height + 20);


        ctx.fillStyle = 'white';
        ctx.strokeStyle = now2;
        ctx.fillRect(card2.x, card2.y, card2.width, card2.height);
        ctx.drawImage(defender2, 0, 0, 48, 37, card2.x, card2.y, card2.width, card2.height);
        ctx.strokeRect(card2.x, card2.y, card2.width, card2.height);


        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(150, card2.x, card2.y + card2.height + 20);       

      
}




class Defenders {

        constructor(x, y, type) {

            this.x = x + cellGap;
            this.y = y + cellGap;
            this.width = cellSize - (2 * cellGap);
            this.height = cellSize - (2 * cellGap);
            this.shooting = false;
            this.health = 100;
            this.projectiles = [];
            this.timer = 0;
            this.type = type;
           

        }

        draw() {

                if(this.type == 1) {
                       
                        ctx.drawImage(defender1, 0, 0, 800, 800, this.x, this.y, this.width, this.height);
                
                } else {
                        
                         ctx.drawImage(defender2, 0, 0, 48, 37, this.x, this.y, this.width, this.height);
                }
                
                

                ctx.fillStyle = 'black';
                ctx.font = '30px Arial';
                ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30);

        }

        update() {

                    if(this.shooting) {

                                    this.timer++;

                                    if(this.timer % 100 == 0) {

                                                        if(this.type == 1) {

                                                            projectiles.push(new Projectile(this.x + 60, this.y + 45, this.type));
                                                        } else {

                                                            projectiles.push(new Projectile(this.x + 80, this.y + 46, this.type));
                                                        }
                                                    
                                    }  
                                
                      } else {
                                    this.timer = 0;

                      }
                
                    
            
                 }

}




function handleDefenders() {
        for(let i = 0; i < defenders.length; i++) {
                
                defenders[i].draw();
                defenders[i].update();
                defenders[i].shooting = false;
                
                for(let j = 0; j < enemies.length; j++) {
                        
                            if(defenders[i].y - cellGap == enemies[j].y && defenders[i].x < enemies[j].x) {
                                    defenders[i].shooting = true;
                            }
                }

                for(let j = 0; j < enemies.length; j++) {

                            if(collision1(defenders[i], enemies[j])) {
                                    
                                    defenders[i].health -= 0.2;
                                     
                                    if(defenders[i].health <= 0) {   

                                                defenders.splice(i, 1);   
                                                enemies[j].movement = enemies[j].speed;
                                                i--;
                                                break;
                                      } else {
                                                enemies[j].movement = 0;
                                      }
                                    
                            }

                            
                }
        }
}



const enemy1 = new Image();
enemy1.src = 'alien.png';

const enemy2 = new Image();
enemy2.src = 'super_alien.png';


class Enemy{
        
        constructor(verticalPosition, type) {
                
                        this.x = canvas.width;
                        this.y = verticalPosition;
                        this.width = cellSize;
                        this.height = cellSize;
                        this.type = type;
                        this.speed = 0.35 + ( type * type * 0.1);
                        this.movement = this.speed;
                        this.health = 100;
                        this.maxHealth = this.health;
                        this.frameX = 0;
                        this.frameY = 0;

                       
                        if(this.type == 1) {
                                this.spriteWidth = 98.17;
                                this.spriteHeight = 75;
                        } else {
                                this.spriteWidth = 833.75;
                                this.spriteHeight = 921;

                        }
                
            }

            update() {

                        this.x -= this.movement;

                        if(frame % 10 == 0) {
                                
                                if(this.type == 2) {
                                        
                                        if(this.frameX < 3) {
                                                
                                                this.frameX++

                                        } else {

                                                this.frameX = 0;
                                                this.frameY ^= 1;
                                        }
                                }

                         } else if(frame % 8 == 0) {

                                if(this.type == 1) {
                                        
                                        if(this.frameX < 5) {
                                                
                                                this.frameX++

                                        } else {

                                                this.frameX = 0;    
                                        }
                                }
                         }           
                
            }

            draw() {
                   
                    
                        if(this.type == 1) {
                                     
                                     ctx.drawImage(enemy1, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y + 25, this.width, this.height - 25);

                        } else if(this.type == 2) {
                                    
                                     ctx.drawImage(enemy2, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y + 25, this.width, this.height - 25);

                        }

                        ctx.fillStyle = 'black';
                        ctx.font = '30px Arial';
                        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30);
                       
                   
            }


}





function handleEnemies() {

            for(let i = 0; i < enemies.length; i++) {

                        enemies[i].update();
                        enemies[i].draw();

                        if(enemies[i].x < 0) {
                                gameOver = true;
                        }


                          if(enemies[i].health <= 0) {
                                        
                                        enemyPosition.splice(enemyPosition.indexOf(enemies[i].y), 1);
                                        floatingMessages.push(new floatingMessage(enemies[i].type * 20, enemies[i].x, enemies[i].y, 30, 'gold'));
                                        floatingMessages.push(new floatingMessage(enemies[i].type * 20, 620, 45, 30, 'gold'));
                                        score += enemies[i].type * 20;


                                        for(let j = 0; j < 100; j++) {
                                                particlesArray.unshift(new Particle(enemies[i].x, enemies[i].y));
                                        }

                                        enemies.splice(i, 1);

                                        i--;
                                        continue;
                            }

            }


            if(frame % enemiesInterval == 0) {

                    let verticalPosition = Math.floor(Math.random() * 4 + 1) * cellSize;

                    if(frame % (3 * enemiesInterval) == 0) {

                                 enemies.push(new Enemy(verticalPosition, 1));
                    } else {
                                     enemies.push(new Enemy(verticalPosition, 2));
                    }
                    
                   
                    enemyPosition.push(verticalPosition);

                    if(enemiesInterval > 120) {
                        enemiesInterval -= 50;
                    }
            }

}




const amounts = [30, 40, 50];

const resource_img = new Image();
resource_img.src = 'resource.png';

class Resource {

            constructor() {

                        this.x = Math.random() * (canvas.width - cellSize);
                        this.y = (Math.floor(Math.random() * 4) + 1) * cellSize + 25;
                        this.width = cellSize * 0.6;
                        this.height = cellSize * 0.6;
                        this.amount = amounts[Math.floor(Math.random() * amounts.length)];
                        this.frameX = 0;
                        this.frameY = 0;
                        this.spriteWidth = 232.25;
                        this.spriteHeight = 251;;
            }

            update() {

                           if(frame % 8 == 0) {
                                                    
                                       if(this.frameX < 3) {
                                            
                                            this.frameX++;

                                       } else {

                                            this.frameX = 0;
                                       }
                             }
             }

            draw() {

                    ctx.drawImage(resource_img, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);

                    ctx.fillStyle = 'black';
                    ctx.font = '30px Arial';
                    ctx.fillText(this.amount, this.x + 15, this.y + 25);
            }

}

function handleResources() {

            if(frame % 500 == 0) {

                    resources.push(new Resource());
            }

            for(let i = 0; i < resources.length; i++) {
                        
                        resources[i].update()
                        resources[i].draw();

                        if(mouse.x && mouse.y && collision(resources[i], mouse)) {

                                numberOfResources += resources[i].amount;

                                floatingMessages.push(new floatingMessage(resources[i].amount, resources[i].x, resources[i].y, 30,  'gold'));
                                floatingMessages.push(new floatingMessage(resources[i].amount, 290, 45, 30, 'gold'));

                                resources.splice(i, 1);
                                i--;
                            
                        }
            }
}




let curr_frame = 0;
function handleGameStatus() {
        
              ctx.fillStyle = 'black';
              ctx.font = '35px Arial';
              ctx.fillText('Score : ' + score, 500, 60);
              
             
              if(frame % 8 == 0) {

                            if(curr_frame < 3) {
                                    
                                    curr_frame++;

                            } else {

                                    curr_frame = 0;
                            }
              }

              ctx.drawImage(resource_img, curr_frame * 232.25, 0, 232.25, 241, 350, 0, 80, 80);
              ctx.fillText(numberOfResources, 290, 60);
              ctx.drawImage(resource_img, curr_frame * 232.25, 0, 232.25, 241, card1.x + 30, card1.y + card1.height - 5, 30, 30);
              ctx.drawImage(resource_img, curr_frame * 232.25, 0, 232.25, 241, card2.x + 30, card2.y + card2.height - 5, 30, 30);
     
              
}

canvas.addEventListener('click', function() {

                const gridPositionX = mouse.x - (mouse.x % cellSize);
                const gridPositionY = mouse.y - (mouse.y % cellSize);

                if((gridPositionY < cellSize) || (gridPositionY > (canvas.height - (2 * controlsBar.height)))) {
                             return;
                }
                for(let i = 0; i < defenders.length; i++) {
                        
                            if(((defenders[i].x - cellGap) == gridPositionX) && ((defenders[i].y  - cellGap) == gridPositionY)) {
                                    return;
                            }
                } 

                if(chosenDefender != 0) {


                            let defenderCost = 50 * (1 + chosenDefender);

                            if(numberOfResources >= defenderCost) {
                                        
                                        defenders.push(new Defenders(gridPositionX, gridPositionY, chosenDefender));
                                        chosenDefender = 0;
                                        numberOfResources -= defenderCost;
                            } else {
                                        floatingMessages.push(new floatingMessage('need more resources', mouse.x, mouse.y, 20, 'blue'));

                            }
                } else {

                                floatingMessages.push(new floatingMessage('choose any defender at top', mouse.x, mouse.y, 20, 'gold'));

                }
     
});

function collision(first, second) {

        if(!((first.x > second.x + second.width) || 
            (first.x + first.width < second.x) ||
             (first.y > second.y + second.height) || 
             (first.y + first.height < second.y))
           ) {
                return true;
        } else {
                return false;
        }
}

function collision1(first, second) {


         if(((first.y - cellGap) == second.y)) {
                           
                    if(first.type == 1 && second.type == 1 && first.x + 35 > second.x && second.x + 25 > first.x) {
                                return true;

                    } else if(first.type == 1 && second.type == 2 && first.x + 40 > second.x && second.x > first.x) {
                                return true;

                    } else if(first.type == 2 && second.type == 1 && first.x + 35 > second.x && second.x + 25 > first.x) {
                                return true;

                    } else if(first.type == 2 && second.type == 2 && first.x + 50 > second.x && second.x > first.x) {
                                return true;
                    }   

                    return false;
        } else {
                    return false;
        }

       
}

window.addEventListener('resize', function() {
   
        canvasPosition = canvas.getBoundingClientRect();
    }
        
);


const river1 = new Image();
river1.src = 'river.jpg';

//const lcm = 4158000;


function animate() {


            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(background, 0, 0, 492, 258, 0, 0, 900, 500);
            ctx.drawImage(river1,0, 0, 640, 360, 0, canvas.height - controlsBar.height, controlsBar.width, controlsBar.height);

            
            handleGameStatus();
            handleGameGrid();
            handleDefenders();
            chooseDefenders();
            handleProjectiles();
            handleEnemies();
            handleResources();
            handlefloatingMessages();
            handleParticles();


           
         /*   if(frame < lcm - 1) {
                    frame++;
            } else
                    frame = 0;
            }

        */
            frame++;
           
           if(!gameOver)  {

                        requestAnimationFrame(animate);

            } else {
                    
                        handleGameStatus();

                        ctx.fillStyle = 'gold';
                        ctx.font = '45px Arial';
                        ctx.fillText('GAME OVER', 250, 250);
                        ctx.fillText('YOUR SCORE: ' + score, 250, 300);
                        ctx.fillText('RELOAD THE PAGE', 250, 350);
                        ctx.fillText('TO RESTART THE GAME', 250, 400);
           }

}

animate();



