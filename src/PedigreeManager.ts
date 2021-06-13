import { Pedigree, MalePedigree, FemalePedigree } from "./Pedigree"
import { MouseEventsHandler } from "./DragHandler"

export default class PedigreeManager {
    pedigreeDiagram: HTMLCanvasElement
    dragHandler: MouseEventsHandler
    ctx: HTMLCanvasElement
    pedigrees: Array<Pedigree> = []
    newx = 0

    constructor(diagram) {
        this.pedigreeDiagram = diagram
        this.dragHandler = new MouseEventsHandler(this.pedigreeDiagram)
        this.ctx = diagram.getContext("2d");
    }

    createPedigree(sex, type) {
        let pedigree;
        switch (sex) {
            case "male": pedigree = new MalePedigree(this.pedigreeDiagram); break;
            case "female": pedigree = new FemalePedigree(this.pedigreeDiagram); break;
        }
        pedigree.x = this.newx
        this.newx = this.newx + 120
        this.pedigrees.push(pedigree)
        this.dragHandler.appendPedigrees(pedigree)
        return pedigree
    }
    deletePedigree(id) {
        for (let index = 0; index < this.pedigrees.length; index++) {
            const element = this.pedigrees[index];
            if(id === element.id) {
                this.pedigrees.splice(index, 1)
            }
        }
        this.dragHandler.deletePedigree(id)
    }
    drawPedigrees() {
        this.pedigrees.forEach(pedigree => {
            pedigree.draw()
        })
    }
    scalePedigrees(scale) {
        const ctx = this.pedigreeDiagram.getContext('2d')
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        this.pedigrees.forEach(pedigree => {
            pedigree.size *= scale
            pedigree.border *= scale
            pedigree.x *= scale
            pedigree.y *= scale
            pedigree.draw()
        })
    }
}