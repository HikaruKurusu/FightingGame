const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

/*things to do:
background image
game over
*/
c.fillRect(0, 0, canvas.width, canvas.height)
const gravity = .9


class Background {
    constructor({position,imgSrc, scale = 1,maxFrames = 1,offset = {x: 0,y: 0}}) {
        this.position = position
        this.height = 150
        this.width = 50
        this.image = new Image()
        this.image.src = imgSrc
        this.scale = scale
        this.maxFrames = maxFrames
        this.frameCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 2
        this.offset = offset

    }
    draw() {
        c.drawImage(
        this.image,
        this.frameCurrent * (this.image.width/this.maxFrames),
        0,
        this.image.width / this.maxFrames,
        this.image.height,
        this.position.x - this.offset.x,
        this.position.y - this.offset.y,
        (this.image.width/this.maxFrames) * this.scale,
        this.image.height * this.scale)
    }
    animateFrames() {
        this.framesElapsed++
        if(this.framesElapsed % this.framesHold === 0) {
            if(this.frameCurrent < this.maxFrames - 1) {
                this.frameCurrent++
            } else {
                this.frameCurrent = 0
            }
        }
    }
    update() {
        this.draw()
        this.animateFrames()

    }
}

class Sprite extends Background {
    constructor({position, velocity, color = 'blue', offsetL,offset = {x: 0,y:0},imgSrc, scale = 1,maxFrames = 1,sprites,attackBox = {offset: {}, width: undefined,height: undefined}}) {
        super({
            position,
            imgSrc,
            scale,
            maxFrames,
            offset
            
        })
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            offsetL,
            width: attackBox.width,
            height: attackBox.height,
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.frameCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 3
        this.sprites = sprites
        this.dead = false
        for(const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imgSrc
        }


        // this.isAttackingLeft
    }
    // draw() {
    //     c.fillStyle = this.color
    //     c.fillRect(this.position.x,this.position.y,this.width,this.height)

    //     if(this.isAttacking == true) {
    //         c.fillStyle = 'white'
    //         c.fillRect(this.attackBox.position.x,this.attackBox.position.y,this.attackBox.width,this.attackBox.height)
    //     } //else if(this.isAttackingleft == true) {
    //     //     c.fillStyle = 'white'
    //     //     c.fillRect(this.attackBox.position.x,this.attackBox.position.y,this.attackBox.width,this.attackBox.height)
    //     // }
        
    // }
    update() {
        this.draw()
        //uncomment out for hit box
        // c.fillStyle = 'green'
        // c.fillRect(this.position.x,this.position.y,this.width,this.height)

        // if(this.isAttackingLeft) {
        //     this.attackBox.position.x = this.position.x + this.attackBox.offsetL.x
        //     this.attackBox.position.y = this.position.y + this.attackBox.offsetL.y
        //} else 
        // if (this.isAttacking) {
        this.animateFrames()
        this.attackBox.position.x = this.position.x - this.attackBox.offset.x
        this.attackBox.position.y = this.position.y - this.attackBox.offset.y
        // }
        // //uncomment out for attackbox
        // c.fillStyle = 'red'
        // c.fillRect(this.attackBox.position.x,this.attackBox.position.y,this.attackBox.width,this.attackBox.height)
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.position.y + this.height + this.velocity.y >= canvas.height - 87) {
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity
        }

        //right bound
        if(this.position.x + this.width + this.velocity.x >= canvas.width + 100) {
            this.position.x = -80   
        } 

        //left bound
        if(this.position.x + this.width + this.velocity.x <= -100){
            this.position.x = canvas.width 
        }

        //ceiling bounds
        if(this.position.y + this.height + this.velocity.y < 0){
            this.velocity.y = 0
            this.position.y = 0
        }
    }

    attack() {
        this.switchSprite('attack')
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        },100)
    }

    takehit(){
        this.health -= 10
        
        if(this.health <= 0){
            this.switchSprite('death')
            this.dead = true
        }else{
            this.switchSprite('takehit')
        }
            

    }
    
    switchSprite(sprite) {
        if(this.image == this.sprites.death.image){
            return

        }
            
        if(this.image == this.sprites.attack.image && this.frameCurrent < this.sprites.attack.maxFrames - 1) 
            return
        
        if(this.image == this.sprites.takehit.image && this.frameCurrent < this.sprites.takehit.maxFrames - 1)
            return
        
        switch(sprite) {
            case 'idle':
                if(this.image != this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.maxFrames = this.sprites.idle.maxFrames
                    this.frameCurrent = 0
                }
                break;
            case 'run':
                if(this.image != this.sprites.run.image){
                    this.image = this.sprites.run.image
                    this.maxFrames = this.sprites.run.maxFrames
                    this.frameCurrent = 0
                }
                break;
            case 'jump':
                if(this.image != this.sprites.jump.image){
                    this.image = this.sprites.jump.image
                    this.maxFrames = this.sprites.jump.maxFrames
                    this.frameCurrent = 0
                } 
                break;
            case 'fall':
                if(this.image != this.sprites.fall.image){
                    this.image = this.sprites.fall.image
                    this.maxFrames = this.sprites.fall.maxFrames
                    this.frameCurrent = 0
                } 
                break;
            case 'attack':
                if(this.image != this.sprites.attack.image){
                    this.image = this.sprites.attack.image
                    this.maxFrames = this.sprites.attack.maxFrames
                    this.frameCurrent = 0
                } 
                break;
            case 'takehit':
                if(this.image != this.sprites.takehit.image){
                    this.image = this.sprites.takehit.image
                    this.maxFrames = this.sprites.takehit.maxFrames
                    this.frameCurrent = 0
                } 
                break;
            case 'death':
                if(this.image != this.sprites.death.image){
                    this.image = this.sprites.death.image
                    this.maxFrames = this.sprites.death.maxFrames
                    this.frameCurrent = 0
                } 
                break;
        }
    }
    // attackLeft() {
    //     // this.switchSprite('attack1')
    //     this.isAttackingLeft = true
    //     setTimeout(()=> {
    //         this.isAttackingLeft = false
    //     },100)
    // }
}
const background = new Background({
    position: {
        x: 0,
        y: 0
    },
    imgSrc: './Img/back.png',
    scale: .63
})

// const light = new Background({
//     position: {
//         x: 0,//this moves the lamp
//         y: 0
//     },
//     imgSrc: './img/light.png', 
//     scale: 1.5, // this increases the lamp size
//     maxFrames: 6
// })///////////////////////////
const player = new Sprite({
    position: {
        x: 75,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 10,
    },
    offset: {
        x: 0,
        y: 0,
    },
    imgSrc: './Img/idle.png',
    maxFrames: 6,
    scale: 1,
    offset: {
        x: 60,
        y: 0
    },
    sprites: {
        idle: {
            imgSrc: './Img/idle.png',
            maxFrames: 6,
        },
        run: {
            imgSrc: './Img/run.png',
            maxFrames: 8,
        },
        jump: {
            imgSrc: './Img/jump.png',
            maxFrames: 2,
        },
        fall: {
            imgSrc: './Img/fall.png',
            maxFrames: 2, 
        },
        attack: {
            imgSrc: './Img/attack.png',
            maxFrames: 6, 
        },
        takehit: {
            imgSrc: './Img/take hit.png',
            maxFrames: 4,
        },
        death: {
            imgSrc: './Img/take hit.png',
            maxFrames: 4
        }
    },
    // offsetL: {
    //     x: -50,
    //     y: 0
    // },
    attackBox: {
        offset: {
            x: -50,
            y: -70
        },
        width: 90,
        height: 50

    }
        

}) 
const player2 = new Sprite({
    position: {
        x: 850,
        y: 200,
    },
    velocity: {
        x: 0,
        y: 10,
    },
    offset: {
        x: 0,
        y: 0
    },
    imgSrc: './Img/vioidle.png',
    maxFrames: 8,
    scale: 0.9,
    offset: {
        x: 60,
        y: 0
    },
    sprites: {
        idle: {
            imgSrc: './Img/vioidle.png',
            maxFrames: 8,
        },
        run: {
            imgSrc: './Img/viorun.png',
            maxFrames: 8,
        },
        jump: {
            imgSrc: './Img/viojump.png',
            maxFrames: 2,
        },
        fall: {
            imgSrc: './Img/viofall.png',
            maxFrames: 2, 
        },
        attack: {
            imgSrc: './Img/vioattack.png',
            maxFrames: 5, 
        },
        takehit: {
            imgSrc: './img/viotakehit.png',
            maxFrames: 4,
        },
        death: {
            imgSrc: './img/viotakehit.png',
            maxFrames: 4
        }
    },
    attackBox: {
        offset: {
            x: 50,
            y: -50
        },
        width: 100,
        height: 50

    }
    // offsetL: {
    //     x: -50,
    //     y: 0
    // },
    // color: 'white'
}) 
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}
let lastKey
function collision({
    rectangle1,
    rectangle2
}) {
    if(rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width 
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && rectangle1.attackBox.position.y < rectangle2.position.y + rectangle2.height) {
            return true;
    }
    return false;
}
function animation() {
    window.requestAnimationFrame(animation)
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width,canvas.height)
    background.update()
    // light.update()/////////////////////
    player.update()
    player2.update()
    player.velocity.x = 0
    player2.velocity.x = 0


    //Player 1
    // player.maxFrames = player.sprites.idle.maxFrames
    if(keys.a.pressed == true){ //&& player.lastKey == 'a') {
        player.velocity.x = -10
        player.switchSprite('run')
        // player.maxFrames = player.sprites.run.maxFrames
    } else if(keys.d.pressed == true){ //&& player.lastKey == 'd') {
        player.velocity.x = 10
        player.switchSprite('run')
        // player.maxFrames = player.sprites.run.maxFrames
    } else {
        player.switchSprite('idle')
    }
    if(player.velocity.y < 0) {
        player.switchSprite('jump')
        // player.maxFrames = player.sprites.jump.maxFrames
    } else if(player.velocity.y > 0) {
        player.switchSprite('fall')
    }   

    //Player2
    if(keys.ArrowLeft.pressed == true){ //&& player2.lastKey == 'ArrowLeft') {
        player2.velocity.x = -10
        player2.switchSprite('run')
    } else if(keys.ArrowRight.pressed == true){ //&& player2.lastKey == 'ArrowRight') {
        player2.velocity.x = 10
        player2.switchSprite('run')
    } else {
        player2.switchSprite('idle')
    }
    if(player2.velocity.y < 0) {
        player2.switchSprite('jump')
    } else if(player2.velocity.y > 0) {
        player2.switchSprite('fall')
    }


    //attack
    if(collision({
        rectangle1: player,
        rectangle2: player2
    }) && player.isAttacking) {
        player.isAttacking = false
        player2.takehit()
    
        if(player2.health === 90){
            document.querySelector('#hp10').style.color = 'grey'
        } else if(player2.health === 80){
            document.querySelector('#hp9').style.color = 'grey'
        } else if(player2.health === 70){
            document.querySelector('#hp8').style.color = 'grey'
        } else if(player2.health === 60){
            document.querySelector('#hp7').style.color = 'grey'
        } else if(player2.health === 50){
            document.querySelector('#hp6').style.color = 'grey'
        } else if(player2.health === 40){
            document.querySelector('#hp5').style.color = 'grey'
        } else if(player2.health === 30){
            document.querySelector('#hp4').style.color = 'grey'
        } else if(player2.health === 20){
            document.querySelector('#hp3').style.color = 'grey'
        } else if(player2.health === 10){
            document.querySelector('#hp2').style.color = 'grey'
        } else if(player2.health === 0){
            document.querySelector('#hp1').style.color = 'grey'
        }
    } 
    //player miss
    // if (player.isAttacking && player.frameCurrent === 3){
    //     player.isAttacking = false
    // }
    //attack for player2
    if(collision({
        rectangle1: player2,
        rectangle2: player
    }) && player2.isAttacking) {
        player2.isAttacking = false
        player.takehit()
        if(player.health === 90){
            document.querySelector('#hp1p').style.color = 'grey'
        } else if(player.health === 80){
            document.querySelector('#hp2p').style.color = 'grey'
        } else if(player.health === 70){
            document.querySelector('#hp3p').style.color = 'grey'
        } else if(player.health === 60){
            document.querySelector('#hp4p').style.color = 'grey'
        } else if(player.health === 50){
            document.querySelector('#hp5p').style.color = 'grey'
        } else if(player.health === 40){
            document.querySelector('#hp6p').style.color = 'grey'
        } else if(player.health === 30){
            document.querySelector('#hp7p').style.color = 'grey'
        } else if(player.health === 20){
            document.querySelector('#hp8p').style.color = 'grey'
        } else if(player.health === 10){
            document.querySelector('#hp9p').style.color = 'grey'
        } else if(player.health === 0){
            document.querySelector('#hp10p').style.color = 'grey'
        }

    }

    // if(collision({
    //     rectangle1: player,
    //     rectangle2: player2
    // }) && player.isAttackingL) {
    //     player.isAttackingL = false
    // } 
    // //attack for player2
    // if(collision({
    //     rectangle1: player2,
    //     rectangle2: player
    // }) && player2.isAttackingL) {
    //     player2.isAttackingL = false
    // }


    function determineWinner(){
        if (player2.health <= 0){
            document.querySelector('#gameState').innerHTML = 'Player 1 Wins'
            document.querySelector('#gameState').style.display = 'flex'

        } else if(player.health <= 0){
            document.querySelector('#gameState').innerHTML = 'Player 2 Wins'
            document.querySelector('#gameState').style.display = 'flex'
            
        }
    }
    determineWinner()
}


animation()
window.addEventListener('keydown', (event) => {
    if(!player.dead){
        switch (event.key) {
            case 'd':
                // player.velocity.x = 1
                keys.d.pressed = true
                player.lastkey = 'd'
                break
            case 'a':
                // player.velocity.x = -1
                keys.a.pressed = true
                player.lastkey = 'a'
                break
            case 'w':
                player.velocity.y -= 20
                break
            case 'c':
                player.attack()
                break
        }
    }
    if(!player2.dead){
        switch (event.key){
            // case 'x':
            //     player.attackLeft()
            //     break
            case 'ArrowRight':
                // player2.velocity.x = 1
                keys.ArrowRight.pressed = true
                player2.lastkey = 'ArrowRight'
                break
            case 'ArrowLeft':
                // player2.velocity.x = -1
                keys.ArrowLeft.pressed = true
                player2.lastkey = 'ArrowLeft'
                break
            case 'ArrowUp':
                player2.velocity.y -= 20
                break
            case '.':
                // player2.isAttacking = true;
                player2.attack()
                break
        // case '/':
        //     // player2.isAttacking = true;
        //     player2.attackLeft()
        //     break
    }
    }
})
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            // player.velocity.x = 0
            keys.d.pressed = false
            break
        case 'a':
            // player.velocity.x = 0
            keys.a.pressed = false
            break
        ///player 2 movements
        case 'ArrowRight':
            // player2.velocity.x = 0
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            // player2.velocity.x = 0
            keys.ArrowLeft.pressed = false
            break
    }

})