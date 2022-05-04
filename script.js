var player
var pipe
var cursors
var scoreText
var score = 0
var gameOver = false

const config = {
  type: Phaser.AUTO,
  width: 288,
  height: 512,
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: -20 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
}
var game
// 资源预加载
function preload() {
  this.load.image('sky', 'https://cdn.jsdelivr.net/gh/chenxch/pic-image@master/20220504/background.1k1qnv5xax8g.png')
  this.load.image('pipetop', 'https://cdn.jsdelivr.net/gh/chenxch/pic-image@master/20220504/pipetop.6kjyyhp31wg0.png')
  this.load.image('pipebottom', 'https://cdn.jsdelivr.net/gh/chenxch/pic-image@master/20220504/pipebottom.5krrldf5jog0.png')
  this.load.spritesheet('bird', 'https://cdn.jsdelivr.net/gh/chenxch/pic-image@master/20220504/birds.22sbfio9ib4w.png', { frameWidth: 30, frameHeight: 30 })
}

function create() {
  // 设置背景居中
  this.add.image(144, 256, 'sky')
  // 创建管道组对象
  pipe = this.physics.add.group()
  // 管道数组
  let pipeArr = []
  if (!pipeArr.length) pipeArr = generationPipe()

  pipeArr.forEach(item => {
    pipe.create(item.top.x, item.top.y, 'pipetop')
    pipe.create(item.bottom.x, item.bottom.y, 'pipebottom')
  })

  // 设置角色
  player = this.physics.add.sprite(80, 250, 'bird')

  player.setBounce(0.2)
  player.setCollideWorldBounds(true)

  // 创建动画
  this.anims.create({
    key: 'fly',
    frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 2 }),
    frameRate: 10,
    repeat: -1
  })

  this.anims.create({
    key: 'stop',
    frames: [{ key: 'bird', frame: 4 }],
    frameRate: 20
  })

  //  键盘事件
  cursors = this.input.keyboard.createCursorKeys()
  pointer = this.input.activePointer

  //  成绩文本
  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' })

  //  添加碰撞检测
  this.physics.add.collider(player, pipe, hitPipe, undefined, this)

  // 使用requestAnimationFrame构建定时器
  let ts = +new Date()
  const scoreLoop = () => {
    if (gameOver) return
    const nts = +new Date()
    if (nts - ts > 1000) {
      ts = nts
      score += 1
      scoreText.setText(`score: ${score}`)
    }
    window.requestAnimationFrame(scoreLoop)
  }
  
  // document.querySelector('#start').style.display = 'none'
  // 开始计时
  scoreLoop()
}

function update() {
  if (gameOver) return
  if (cursors.space.isDown || this.input.activePointer.isDown) {
    player.setVelocityY(-300)

    player.anims.play('fly', true)
  } else {
    player.setVelocityX(0)
    player.setVelocityY(50)
  }
}

function hitPipe(player, pipe) {
  this.physics.pause()
  player.anims.play('stop')
  gameOver = true
  document.querySelector('#restart').style.display = 'flex'
}

function generationPipe() {
  const result = []
  for (let i = 0; i < 222; i++) {
    // 间隔系数
    const step = i * 5
    // 上下管道间隔
    const space = 200 - (step > 140 ? 140 : step)
    // 上管道
    const topOffset = Phaser.Math.Between(0 - step - 100, 0)
    // 下管道
    const bottomOffset = 512 + topOffset + space
    result.push({
      top: {
        x: 250 + i * 150,
        y: topOffset
      },
      bottom: {
        x: 250 + i * 150,
        y: bottomOffset
      }
    })
  }
  return result
}

function resume() {
  game.destroy(true)
  gameOver = false
  score=0
  game = new Phaser.Game(config)
  document.querySelector('#restart').style.display = 'none'
}

function start() {
  if (!game && Phaser) {
    
    game = new Phaser.Game(config)
    document.querySelector('#start').style.display = 'none'
    setTimeout(()=>{
      document.querySelector('body').scrollTo(0,999999)
    },200)
    // setInterval(()=>{
    //   loading()
    // }, 200)
  } else {
  }
}

function loading() {
  document.querySelector('#progress').value+=20
  if(document.querySelector('#progress').value===100){
    clearInterval(loading)
    document.querySelector('#start').style.display = 'none'
  }
}
