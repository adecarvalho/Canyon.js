const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 480
const SPEED_MIN=300

const gInput = new InputManager()
const gStages = new Map()
const gsm = new StageManager()
let gTextures = {}
let gSounds = {}

let fps = 0
let timer = 0

let p = undefined

//
function preload() {
	gTextures["paysage"] = loadImage("assets/images/paysage.png")
	gTextures["flying"] = loadImage("assets/images/flying.png")
	gTextures["rock_up"] = loadImage("assets/images/rock_up.png")
	gTextures["rock_down"] = loadImage("assets/images/rock_down.png")

	gTextures["pillar_down"] = loadImage("assets/images/pillar_bas.png")
	gTextures["pillar_up"] = loadImage("assets/images/pillar_haut.png")

	gTextures["explosion"]=loadImage("assets/images/explosion.png")

	gSounds["boom"]=loadSound("assets/sounds/boom.ogg")
	gSounds["game"] = loadSound("assets/musics/plane.ogg")
	gSounds["intro"] = loadSound("assets/musics/underground.ogg")
	
}

//
function setup() {
	pixelDensity(1)
	createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
	background(50)

	gStages.set("introduction", new IntroStage(gsm))
	gStages.set("play", new PlayStage(gsm))
	gStages.set("gameover",new OverStage(gsm))

	gsm.pushStage(gStages.get("introduction"))

	p = createP('Fps=');
}

let ancien = 0
let now = 0
let dt = 0

//
function draw() {
	background(10)
	now = millis()
	dt = (now - ancien) / 1000
	//
	timer += dt
	fps++
	if (timer > 1) {
		//console.log('fps= '+fps)
		p.html("Fps=" + fps)
		fps = 0
		timer = 0
	}
	gsm.update(dt)

	//ras inputManager
	gInput.update()

	gsm.render()

	ancien = now
}
//
function keyPressed() {
	gInput.setKeyboardPressed(keyCode)
}
//
function keyReleased() {
	gInput.setKeyboardReleased(keyCode)
}
//
function mousePressed() {
	gInput.setMouseClicked(mouseX, mouseY)
}

function mouseReleased() {
	gInput.setMouseReleased(mouseX, mouseY)
}
//