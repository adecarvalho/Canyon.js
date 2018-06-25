//******************************* */
class Paysage {
    constructor(xp, yp) {
        this.x = xp
        this.y = yp
        this.dx = -2
        this.image = gTextures["paysage"]
    }

    update(dt) {
        this.x += this.dx

        if (this.x <= -CANVAS_WIDTH) {
            this.x = 0
        }
    }

    render() {
        image(this.image, this.x, this.y)
    }
}
//*************************** */
class Plane extends Entity {
    constructor(xp, yp) {
        super(xp, yp, undefined, 90, 75)

        this.dx = 0
        this.dy = 0
        this.gravity = 10

        this.xinit = xp
        this.yinit = yp

        this.state = "IDLE"

        this.inflate(5, 5)

        this.label = new Label("Press space bar")
        this.label.setSize(40)
        this.label.setColor(color(55, 55, 55, 255))

        this.flyanimation = new Animation(gTextures["flying"], 90, 75, 1 / 30, true)
        this.flyanimation.play()

        this.explosion = new Animation(gTextures["explosion"], 102, 102, 1 / 30, false)

        this.echap = new ParticlesGenerator(xp, yp, 10, 100, 3.3, 3.0)
        this.echap.start()
    }

    reset() {
        this.x = this.xinit
        this.y = this.yinit
        this.state = "IDLE"
    }

    touched() {
        if (this.state === "LIVE") {
            this.state = "TOUCHED"
            this.explosion.play()
            gSounds["boom"].stop()
            gSounds["boom"].play()
        }
    }

    update(dt) {
        super.update(dt)

        if (this.state === "LIVE") {
            this.dy = this.dy + this.gravity * dt
            this.y += this.dy

        }

        //input
        if (gInput.isKeyPressed(32)) { //space bar
            if (this.state === "IDLE") {
                this.state = "LIVE"
            }

            this.dy = -3
        }

        //limites
        if (this.getBottom() > CANVAS_HEIGHT) {
            this.setBottom(CANVAS_HEIGHT)
        }

        if (this.getTop() < 0) {
            this.setTop(0)
        }
        //echap
        this.echap.move(this.x, this.y + 20)
        this.echap.update(dt)

        this.flyanimation.update(dt)

        this.explosion.update(dt)

        if (this.state === "TOUCHED" && this.explosion.isPlaying() == false) {
            this.state = "IDLE"
            this.x = this.xinit
            this.y = this.yinit
            this.dx = 0
            this.dy = 0
        }
    }

    render() {
        if (this.state === "LIVE" || this.state === "IDLE") {
            this.echap.render()
            this.flyanimation.render(this.x, this.y)
        }

        if (this.state === "TOUCHED") {
            this.explosion.render(this.x, this.y)
        }

        if (this.state === "IDLE") {
            this.label.render(this.x, CANVAS_HEIGHT / 2)
        }
        // super.renderDebug()
    }
}
//************************ */
class Rock extends Entity {
    constructor(type) {

        switch (type) {
            case "TOP":
                super(0, 0, gTextures["rock_up"])
                break;

            case "BOTTOM":
                super(0, CANVAS_HEIGHT - 71, gTextures["rock_down"])
                break

            default:
                break
        }
        this.type = type
        this.speed = SPEED_MIN
        this.dx = -this.speed

        this.inflate(0, 5)
    }

    update(dt) {
        super.update(dt)

        //limites
        if (this.getRight() < CANVAS_WIDTH) {
            this.x = 0
        }
    }

    render() {
        super.render()
        // super.renderDebug()
    }
}
//******************************* */
class Pillar extends Entity {

    constructor(xp, type) {
        switch (type) {
            case "UP":
                super(xp, 0, gTextures["pillar_up"])
                break

            case "DOWN":
                super(xp, CANVAS_HEIGHT - 239, gTextures["pillar_down"])
                break

            default:
                break
        }
        this.type = type

        this.inflate(30, 20)

        this.touchLeft = false
    }

    isTouchLeft() {
        return this.touchLeft
    }

    reset() {
        this.touchLeft = false
        this.dx = 0
        this.setLeft(CANVAS_WIDTH)
    }

    move(speed) {
        this.dx = -speed
    }

    update(dt) {
        super.update(dt)

        if (this.getRight() <= 0) {
            this.touchLeft = true
        }
    }

    render(dt) {
        super.render(dt)
        // super.renderDebug()
    }
}
//*********************** */
class Pillars {
    constructor(plane, score = undefined) {

        if (score != undefined) {
            this.score = score
        }

        this.plane = plane

        this.pillar_up = new Pillar(0, "UP")

        this.pillar_down = new Pillar(CANVAS_WIDTH / 2, "DOWN")

        this.speed = SPEED_MIN

        this.newWave()
    }

    newWave() {
        this.reset()
        this.action()
    }

    action() {
        let val = random(1)

        if (val < 0.5) {
            this.pillar_down.move(this.speed)
        } else {
            this.pillar_up.move(this.speed)
        }
    }

    reset() {
        this.pillar_down.reset()
        this.pillar_up.reset()
    }

    update(dt) {
        this.pillar_up.update(dt)
        this.pillar_down.update(dt)

        if (this.pillar_down.isTouchLeft() || this.pillar_up.isTouchLeft()) {
            this.reset()
            this.action()
            if (this.plane.state === "LIVE") {
                this.score.incrementsPoints(1)
            }
        }
    }

    isCollidePlane() {
        if (this.plane.state != "LIVE") {
            return
        }

        if (this.pillar_down.collides(this.plane) || this.pillar_up.collides(this.plane)) {
            this.reset()
            this.action()
            this.plane.touched()
            this.score.decrementsLives()
            return true
        } else {
            return false
        }
    }

    render() {
        this.pillar_up.render()
        this.pillar_down.render()
    }
}
//fin actors