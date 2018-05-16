//
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
        this.label.setColor(color(55,55,50,200))

        this.name = "aaa"
    }

    update(dt) {

        this.timer += dt
        if (this.timer > 0.4) {
            this.timer = 0
            this.toggle = !this.toggle
        }

        if (gInput.isKeyPressed(ENTER)) {
            gsm.changeStage(new PlayStage())
            this.name = "" + char(this.tab[0]) + char(this.tab[1]) + char(this.tab[2])

            let datas = {
                "name": this.name
            }

            gsm.changeStage(gStages.get("play"), datas)
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
//*******************************/
class OverStage extends Stage {
    constructor(gsm) {
        super(gsm)
        this.paysage = new Paysage(0,0)
        this.label = new Label()
        this.label.setSize(50)
        this.label.setColor(color(55,55,55,200))
        this.score = new ScoreManager()
    }

    update(dt) {
        if (gInput.isKeyPressed(ENTER)) {

            gsm.changeStage(gStages.get("introduction"))
        }
    }

    render() {
        this.paysage.render()

        this.label.setText("Game Over " + this.score.getName())
        this.label.render(CANVAS_WIDTH / 4, CANVAS_HEIGHT / 4)

        this.label.setText("Score= " + this.score.getPoints() + " pts")
        this.label.render(CANVAS_WIDTH / 4, CANVAS_HEIGHT / 2)

        this.label.setText('Press a Enter to Start')
        this.label.render(CANVAS_WIDTH / 4, 100 + CANVAS_HEIGHT / 2)
    }

    onEnter(datas) {
        this.score.setName(datas["name"])
        this.score.setPoints(datas["points"])
    }

    onExit() {
        //gSounds["play"].setLoop(false)
        //gSounds["play"].stop()
    }
}
//***************************** */
class PlayStage extends Stage {
    constructor(gsm) {
        super(gsm)
        this.score = new ScoreManager()

        this.paysage = new Paysage(0, 0)

        this.ship = new Ship(CANVAS_WIDTH / 2 - 100, CANVAS_HEIGHT / 2)

        this.rocktab = []

        this.rocktab.push(new Rock(0, "TOP"))

        this.rocktab.push(new Rock(0, "BOTTOM"))

        this.pillars = new Pillars(this.ship, this.score)
    }


    update(dt) {
        this.paysage.update(dt)

        if (this.ship.state === "IDLE" && keyIsPressed) {
            this.pillars.newWave()
        }

        for (let i = 0; i < this.rocktab.length; i++) {
            this.rocktab[i].update(dt)
        }

        this.ship.update(dt)

        this.pillars.update(dt)

        this.collisions()

        this.isGameOver()

        this.score.update(dt)
    }

    isGameOver()
    {
        if(this.score.isGameOver())
        {
            let datas = {
                "name": this.score.getName(),
                "points":this.score.getPoints()
            }
            gsm.changeStage(gStages.get("gameover"),datas)
        }
    }

    collisions() {
        //rock ship
        for (const item of this.rocktab) {
            if (this.ship.state === "LIVE" && this.ship.collides(item)) {
                this.ship.touched()
                this.score.decrementsLives()

                this.pillars.newWave()
                return
            }
        }

        //ship pillar
        this.pillars.isCollideShip()
    }

    render() {
        this.paysage.render()

        this.pillars.render()

        for (const item of this.rocktab) {
            item.render()
        }

        this.ship.render()

        this.score.render()
    }

    onEnter(datas) {
        gSounds["game"].setLoop(true)
        gSounds["game"].play()

        if (datas != undefined) {
            this.score.setName(datas.name)
            this.score.reset()
        }

        this.ship.reset()
        this.pillars.newWave()
    }

    onExit() {
        gSounds["game"].setLoop(false)
        gSounds["game"].stop()
    }
}
//fin stages