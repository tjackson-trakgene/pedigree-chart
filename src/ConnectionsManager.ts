import { BasePedigree } from "./Pedigree"
import { SiblingLine, MarriageLine } from "./Lines"
import Camera from './Camera'

interface Connection {
    pedigreeA: BasePedigree
    pedigreeB: BasePedigree
    type: string,
}

export default class ConnectionsManager {
    pedigreeDiagram: HTMLCanvasElement 
    ctx: CanvasRenderingContext2D
    linesToRender: Array<Connection> = []
    lineWidth = 2
    scalingFactor = 1

    constructor(diagram) {
        this.pedigreeDiagram = diagram
        this.ctx = diagram.getContext("2d");
    }

    createConnection(pedigreeA, pedigreeB, lineType) {
        this.linesToRender.push({
            pedigreeA: pedigreeA,
            pedigreeB: pedigreeB,
            type: lineType
        })
    }

    removeConnection(id) {
        for (let index = 0; index < this.linesToRender.length; index++) {
            const element = this.linesToRender[index];
            if((id == element.pedigreeA.id) || (id == element.pedigreeB.id)) {
                this.linesToRender.splice(index, 1)
            }
        }
        for (let index = 0; index < this.linesToRender.length; index++) {
            const element = this.linesToRender[index];
            if((id == element.pedigreeA.id) || (id == element.pedigreeB.id)) {
                this.linesToRender.splice(index, 1)
            }
        }
    }

    drawConnections() {
        this.linesToRender.forEach(connection => {
            if (connection.type == "marriage") {
                this.drawMarriageLines(connection)
            }
            if (connection.type == "sibling") {
                this.drawSiblingLines(connection)
            }
        })
    }

    drawMarriageLines(connection: Connection) {
        const points = {
            x1: connection.pedigreeA.calculateMiddle().x+Camera.OffsetX,
            y1: connection.pedigreeA.calculateMiddle().y+Camera.OffsetY,
            x2: connection.pedigreeB.calculateMiddle().x+Camera.OffsetX,
            y2: connection.pedigreeB.calculateMiddle().y+Camera.OffsetY,
        }
        MarriageLine.init(this.ctx, points, this.lineWidth, this.scalingFactor)
    }

    drawSiblingLines(connection: Connection) {
        const nodeA = connection.pedigreeA
        const nodeB = connection.pedigreeB

        const x1 = nodeA.x + nodeA.size / 2
        const y1 = nodeA.y + nodeA.size / 2

        // Distance beetwen pedigreeA and B
        let shift = (nodeA.x - (nodeB.x + nodeB.size)) / 2
        let x2
        x2 = (nodeB.x + nodeB.size) + shift
        if(nodeA.marriagePartner) {
            shift = (nodeA.x - (nodeA.marriagePartner.x + nodeA.marriagePartner.size))/2
            x2 =  (nodeA.marriagePartner.x + nodeA.marriagePartner.size) + shift
        } 
        // if(nodeB.marriagePartner) {
        //     shift = (nodeB.x - (nodeB.marriagePartner.x + nodeB.marriagePartner.size))/2
        //     x2 = (nodeB.marriagePartner.x + nodeB.marriagePartner.size) + shift
        // } 
        const y2 = nodeA.y + nodeA.size / 2

        const y3 = nodeB.y + nodeB.size / 2
        const x3 = nodeB.x + nodeB.size / 2

        const points = {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            x3: x3,
            y3: y3,
        }
        SiblingLine.init(this.ctx, points, this.lineWidth, this.scalingFactor)
    }
}