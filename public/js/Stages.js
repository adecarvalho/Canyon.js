//************************** */
class PlayStage extends Stage {
    constructor(gsm) {
        super(gsm)
        this.score = new ScoreManager()

        this.paysage = new Paysage(0, 0)

        this.plane = new Plane(CANVAS_WIDTH / 2 - 100, CANVAS_HEIGHT / 2)

        this.rocktab = []

        this.rocktab.push(new Rock("TOP"))

        this.rocktab.push(new Rock("BOTTOM"))

        this.pillars = new Pillars(this.plane, this.score)
    }


    update(dt) {
        this.paysage.update(dt)

        if (this.plane.state === "IDLE" && keyIsPressed) {
            this.pillars.newWave()
        }

        for (let i = 0; i < this.rocktab.length; i++) {
            this.rocktab[i].update(dt)
        }

        this.plane.update(dt)

        this.pillars.update(dt)

        this.collisions()

        this.isGameOver()
    }

    isGameOver() {
        if (this.score.isGameOver()) {

            let options={
                name:this.score.getName(),
                points:this.score.getPoints()
            }

            this.gsm.changeStage(gStages.get("gameover"),options)

        }
    }

    collisions() {
        //rock ship
        for (const item of this.rocktab) {
            if (this.plane.state === "LIVE" && this.plane.collides(item)) {
                this.plane.touched()
                this.score.decrementsLives()

                this.pillars.newWave()
                return
            }
        }

        //ship pillar
        this.pillars.isCollidePlane()
    }

    render() {
        this.paysage.render()

        this.pillars.render()

        for (const item of this.rocktab) {
            item.render()
        }

        this.plane.render()

        this.score.render()
    }

    onEnter(datas) {

        if (datas != undefined) {
            this.score.setName(datas.name)
        }

        gSounds["game"].setLoop(true)
        gSounds["game"].setVolume(0.2)
        gSounds["game"].play()

        this.plane.reset()
        this.pillars.newWave()
        this.score.reset()
    }

    onExit() {
        gSounds["game"].setLoop(false)
        gSounds["game"].stop()
    }
}
/**************************** */
class IntroStage extends Stage {
    constructor(gsm) {
        super(gsm)
        this.paysage = new Paysage(0, 0)

        this.tab = [65, 65, 65]
        this.indice = 0
        this.timer = 0
        this.toggle = true

        this.label = new Label()
        this.label.setSize(50)
        this.label.setColor(color(55, 55, 50, 200))

        this.name = "aaa"
    }

    update(dt) {

        this.timer += dt
        if (this.timer > 0.4) {
            this.timer = 0
            this.toggle = !this.toggle
        }

        if (gInput.isKeyPressed(ENTER)) {

            this.name = "" + char(this.tab[0]) + char(this.tab[1]) + char(this.tab[2])

            let options = {
                name: this.name
            }

            this.gsm.changeStage(gStages.get("play"), options)
        }

        if (gInput.isKeyPressed(LEFT_ARROW) && this.indice > 0) {
            this.indice = this.indice - 1
        }

        if (gInput.isKeyPressed(RIGHT_ARROW) && this.indice < 2) {
            this.indice = this.indice + 1
        }

        if (gInput.isKeyPressed(UP_ARROW)) {
            this.tab[this.indice] = this.tab[this.indice] + 1
            if (this.tab[this.indice] > 90) {
                this.tab[this.indice] = 65
            }
        }

        if (gInput.isKeyPressed(DOWN_ARROW)) {
            this.tab[this.indice] = this.tab[this.indice] - 1
            if (this.tab[this.indice] < 65) {
                this.tab[this.indice] = 90
            }
        }
    }

    render() {
        this.paysage.render()

        this.label.setText("Canyon js")
        this.label.render(CANVAS_WIDTH / 3, CANVAS_HEIGHT / 4)

        this.afficheName()

        this.label.setText('Press Enter to Start')
        this.label.render(50, 150 + CANVAS_HEIGHT / 2)
    }

    onEnter() {
        gSounds["intro"].setLoop(true)
        gSounds['intro'].setVolume(0.2)
        gSounds["intro"].play()
    }

    onExit() {
        gSounds["intro"].setLoop(false)
        gSounds["intro"].stop()
    }

    afficheName() {
        let xp = CANVAS_WIDTH / 2 - 100
        let yp = CANVAS_HEIGHT / 2

        //**************** */
        if (this.indice == 0) {
            if (this.toggle) {
                text(char(this.tab[0]), xp, yp)
            }
            text(char(this.tab[1]), xp + 50, yp)
            text(char(this.tab[2]), xp + 100, yp)
        }
        //******************** */
        else if (this.indice == 1) {
            if (this.toggle) {
                text(char(this.tab[1]), xp + 50, yp)
            }
            text(char(this.tab[0]), xp, yp)
            text(char(this.tab[2]), xp + 100, yp)
        }
        //********************* */
        else if (this.indice == 2) {
            if (this.toggle) {
                text(char(this.tab[2]), xp + 100, yp)
            }
            text(char(this.tab[0]), xp, yp)
            text(char(this.tab[1]), xp + 50, yp)
        }
    }
}
/******************************* */
class GameOverStage extends Stage {
    constructor(gsm) {
        super(gsm)
        this.paysage = new Paysage(0, 0)
        this.label = new Label()
        this.label.setSize(50)
        this.label.setColor(color(55, 55, 55, 200))
        this.score = new ScoreManager()
    }

    update(dt) {
        if (gInput.isKeyPressed(ENTER)) {

            this.gsm.changeStage(gStages.get("intro"))
        }
    }

    render() {
        this.paysage.render()

        if (this.score != undefined) {
            this.label.setText("Game Over " + this.score.getName())
            this.label.render(CANVAS_WIDTH / 4, CANVAS_HEIGHT / 4)

            this.label.setText("Score= " + this.score.getPoints() + " pts")
            this.label.render(CANVAS_WIDTH / 4, CANVAS_HEIGHT / 2)

            this.label.setText('Press Enter to Start')
            this.label.render(CANVAS_WIDTH / 4, 100 + CANVAS_HEIGHT / 2)
        }

    }

    onEnter(datas) {
        if (datas != undefined) {
            this.score.setName(datas.name)
            this.score.setPoints(datas.points)
        }
    }

    onExit() {}
}
//**