import { factory } from "typescript"
import ConnectionManager from "./ConnectionsManager"
import eventBus from './EventBus'
import PedigreeManager from "./PedigreeManager"
import EventBus from './EventBus'

export default class RenderEngine {
    shapes = []
    diagram: HTMLCanvasElement
    diagramWrapper: HTMLElement
    connectionManager: ConnectionManager
    pedigreeManager: PedigreeManager
    scaleFactor = 1

    constructor(id) {
        this.diagramWrapper = document.getElementById(id) as HTMLElement;
        this.diagram = document.createElement('canvas')
        this.initDiagramEditor()
        this.initEvents()
        setTimeout(()=>this.draw())
    }

    private initDiagramEditor() {
        this.diagram.width = window.innerWidth
        this.diagram.height = window.innerHeight
        this.diagramWrapper.style.border = "3px solid black"
        this.diagramWrapper.style.overflow = "hidden"
        this.diagramWrapper.appendChild(this.diagram)
        this.connectionManager = new ConnectionManager(this.diagram)
        this.pedigreeManager = new PedigreeManager(this.diagram)
    }
    private initEvents() {
        eventBus.on("redraw", () => this.draw())
        window.addEventListener("resize", () => {
            this.resizeDiagramWidth()
        })
        this.diagram.addEventListener("wheel", (event)=>{
            this.scaleFactor += event.deltaY*0.001
            EventBus.emit('scale', this.scaleFactor)
            this.scale(event.deltaY*0.001, event.clientX, event.clientY)
            event.preventDefault()
        });
    }
    private resizeDiagramWidth() {
        this.diagram.width = window.innerWidth
        this.diagram.height = window.innerHeight
        this.draw()
    }
    private draw() {
        const ctx = this.diagram.getContext("2d")
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        this.connectionManager.drawConnections()
        this.pedigreeManager.drawPedigrees()
    }
    public create(sex, type, x = 0, y = 0) {
        const pedigree = this.pedigreeManager.createPedigree(sex, type, x, y)
        return pedigree
    }
    public connect(pedigreeA, pedigreeB, lineType) {
        if (lineType === "marriage") {
            pedigreeA.marriagePartner = pedigreeB
            pedigreeB.marriagePartner = pedigreeA
        }
        this.connectionManager.createConnection(
            pedigreeA,
            pedigreeB,
            lineType
        )
    }
    public scale(scale, cursorX, cursorY) {
        const ctx = this.diagram.getContext("2d")
        ctx.translate(cursorX, cursorY)
        ctx.scale((scale+1), (scale+1))
        ctx.translate(-cursorX, -cursorY)
        setTimeout(()=>this.draw())
    }
    public deletePedigree(id) {
        this.pedigreeManager.deletePedigree(id)
        this.connectionManager.removeConnection(id)
        setTimeout(() => {
            this.draw()
        })
    }
}
