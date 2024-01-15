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
    constructor({position,imgSrc, scale = 1,maxFrames = 1,offset}) {
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
        this.position.x,
        this.position.y,
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
    constructor({position, velocity, color = 'blue', offset, offsetL,imgSrc, scale = 1,maxFrames = 1,sprites}) {
        super({
            position,
            imgSrc,
            scale,
            maxFrames
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
            offset,
            offsetL,
            width: 100,
            height: 50,
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.frameCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.sprites = sprites
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
        // if(this.isAttackingLeft) {
        //     this.attackBox.position.x = this.position.x + this.attackBox.offsetL.x
        //     this.attackBox.position.y = this.position.y + this.attackBox.offsetL.y
        //} else 
        // if (this.isAttacking) {
        this.animateFrames()
        this.attackBox.position.x = this.position.x - this.attackBox.offset.x
        this.attackBox.position.y = this.position.y - this.attackBox.offset.y
        // }
        // c.fillRect(this.attackBox.position.x,this.attackBox.position.y,this.attackBox.width,this.attackBox.height)
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.position.y + this.height + this.velocity.y >= canvas.height - 120) {
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity
        }
    }
    attack() {
        this.switchSprite('attack')
        this.isAttacking = true
        setTimeout(()=> {
            this.isAttacking = false
        },100)
    }
    switchSprite(sprite) {
        if(this.image == this.sprites.attack.image && this.frameCurrent < this.sprites.attack.maxFrames - 1) {
            return
        }
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
        x: 20,
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
    scale: 1.2,
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
        }
    }
    // offsetL: {
    //     x: -50,
    //     y: 0
    // },
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
        x: 50,
        y: 0
    },
    imgSrc: './Img/vioidle.png',
    maxFrames: 8,
    scale: 1,
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
        }
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
        player2.health -= 20
        document.querySelector('#player2Health').style.width = player2.health + '%'
    } 
    //attack for player2
    if(collision({
        rectangle1: player2,
        rectangle2: player
    }) && player2.isAttacking) {
        player2.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
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