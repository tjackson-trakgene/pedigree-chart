"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lines_1 = require("./Lines");
const Camera_1 = require("./Camera");
/**
 * Drawing and managing connections between pedigrees
 *
 * draw methods are calculating all necessary points for connection to be hold.
 * After calculations, it is passed to to special Line class
 */
class ConnectionsManager {
    constructor(diagram) {
        this.linesToRender = [];
        this.twinLinesToRender = [];
        this.lineWidth = 2;
        this.pedigreeDiagram = diagram;
        this.ctx = diagram.getContext("2d");
    }
    createConnection(pedigreeA, pedigreeB, lineType) {
        this.linesToRender.push({
            pedigreeA: pedigreeA,
            pedigreeB: pedigreeB,
            type: lineType,
        });
    }
    createTwinsConnection(parent, twinA, twinB, type) {
        this.twinLinesToRender.push({
            parent: parent,
            twinA: twinA,
            twinB: twinB,
            type: type,
        });
    }
    removeConnection(id) {
        for (let index = 0; index < this.linesToRender.length; index++) {
            const element = this.linesToRender[index];
            if (id == element.pedigreeA.id || id == element.pedigreeB.id) {
                this.linesToRender.splice(index, 1);
            }
        }
        for (let index = 0; index < this.linesToRender.length; index++) {
            const element = this.linesToRender[index];
            if (id == element.pedigreeA.id || id == element.pedigreeB.id) {
                this.linesToRender.splice(index, 1);
            }
        }
    }
    drawConnections() {
        this.linesToRender.forEach((connection) => {
            if (connection.type == "partnership") {
                this.drawMarriageLines(connection);
            }
            if (connection.type == "sibling") {
                this.drawSiblingLines(connection);
            }
            if (connection.type == "separation") {
                this.drawSeparationLines(connection);
            }
            if (connection.type == "consanguineous") {
                this.drawConsanguineousLines(connection);
            }
        });
        this.twinLinesToRender.forEach((connection) => {
            if (connection.type == "non-identical") {
                this.drawTwinsLines(connection);
            }
            if (connection.type == "identical") {
                this.drawIdenticalTwinsLines(connection);
            }
        });
    }
    getConnections(id) {
        return this.linesToRender.filter((line) => {
            if (line.pedigreeA.id === id || line.pedigreeB.id === id) {
                return line;
            }
        });
    }
    getTwinsConnections(id) {
        return this.twinLinesToRender.filter((line) => {
            if (line.twinA.id === id || line.twinB.id === id || line.parent.id === id) {
                return line;
            }
        });
    }
    drawMarriageLines(connection) {
        const nodeA = connection.pedigreeA;
        const nodeB = connection.pedigreeB;
        const pointsToRender = {
            x1: nodeA.calculateMiddle().x + Camera_1.default.OffsetX,
            y1: nodeA.calculateMiddle().y + Camera_1.default.OffsetY,
            x2: nodeB.calculateMiddle().x + Camera_1.default.OffsetX,
            y2: nodeB.calculateMiddle().y + Camera_1.default.OffsetY,
        };
        Lines_1.MarriageLine.init(this.ctx, pointsToRender, this.lineWidth);
    }
    drawConsanguineousLines(connection) {
        const nodeA = connection.pedigreeA;
        const nodeB = connection.pedigreeB;
        const pointsToRender = {
            x1: nodeA.calculateMiddle().x + Camera_1.default.OffsetX,
            y1: nodeA.calculateMiddle().y + Camera_1.default.OffsetY,
            x2: nodeB.calculateMiddle().x + Camera_1.default.OffsetX,
            y2: nodeB.calculateMiddle().y + Camera_1.default.OffsetY,
        };
        Lines_1.ConsanguineousLine.init(this.ctx, pointsToRender, this.lineWidth);
    }
    drawSeparationLines(connection) {
        const nodeA = connection.pedigreeA;
        const nodeB = connection.pedigreeB;
        const pointsToRender = {
            x1: nodeA.calculateMiddle().x + Camera_1.default.OffsetX,
            y1: nodeA.calculateMiddle().y + Camera_1.default.OffsetY,
            x2: nodeB.calculateMiddle().x + Camera_1.default.OffsetX,
            y2: nodeB.calculateMiddle().y + Camera_1.default.OffsetY,
        };
        Lines_1.SeparationLine.init(this.ctx, pointsToRender, this.lineWidth);
    }
    drawSiblingLines(connection) {
        const nodeA = connection.pedigreeA;
        const nodeB = connection.pedigreeB;
        const x1 = nodeA.calculateMiddle().x;
        const y1 = nodeA.calculateMiddle().y;
        // Distance beetwen pedigreeA and pedigreeB
        let shift = (nodeA.x - (nodeB.x + nodeB.size)) / 2;
        let x2;
        x2 = nodeB.x + nodeB.size + shift;
        if (nodeA.marriagePartner) {
            shift =
                (nodeA.x - (nodeA.marriagePartner.x + nodeA.marriagePartner.size)) / 2;
            x2 = nodeA.marriagePartner.x + nodeA.marriagePartner.size + shift;
        }
        const y2 = y1;
        const y3 = nodeB.calculateMiddle().y;
        const x3 = nodeB.calculateMiddle().x;
        const pointsToRender = {
            x1: x1 + Camera_1.default.OffsetX,
            y1: y1 + Camera_1.default.OffsetY,
            x2: x2 + Camera_1.default.OffsetX,
            y2: y2 + Camera_1.default.OffsetY,
            x3: x3 + Camera_1.default.OffsetX,
            y3: y3 + Camera_1.default.OffsetY,
        };
        Lines_1.SiblingLine.init(this.ctx, pointsToRender, this.lineWidth);
    }
    drawTwinsLines(connection) {
        const twinA = connection.twinA;
        const twinB = connection.twinB;
        const parent = connection.parent;
        // Point where twins are connected
        const x1 = (twinA.calculateMiddle().x + twinB.calculateMiddle().x) / 2;
        // Middle of twin A
        const x21 = twinA.calculateMiddle().x;
        const y21 = twinA.calculateMiddle().y;
        // Middle of twin B
        const x22 = twinB.calculateMiddle().x;
        const y22 = twinB.calculateMiddle().y;
        // Calculate twin connection length
        const y1 = y21 - 100 | y22 - 100;
        // Connection to the parent
        if (!parent.marriagePartner) {
            const x3 = x1;
            const y3 = (y1 + (parent.y + parent.size / 2)) / 2;
            const x4 = parent.x + parent.size / 2;
            const y4 = y3;
            const x5 = x4;
            const y5 = parent.y + parent.size / 2;
            const pointsToRender = {
                x1: x1 + Camera_1.default.OffsetX,
                y1: y1 + Camera_1.default.OffsetY,
                x21: x21 + Camera_1.default.OffsetX,
                y21: y21 + Camera_1.default.OffsetY,
                x22: x22 + Camera_1.default.OffsetX,
                y22: y22 + Camera_1.default.OffsetY,
                x3: x3 + Camera_1.default.OffsetX,
                y3: y3 + Camera_1.default.OffsetY,
                x4: x4 + Camera_1.default.OffsetX,
                y4: y4 + Camera_1.default.OffsetY,
                x5: x5 + Camera_1.default.OffsetX,
                y5: y5 + Camera_1.default.OffsetY,
            };
            Lines_1.TwinsLine.init(this.ctx, pointsToRender, this.lineWidth);
        }
        else {
            const nodeA = parent;
            const nodeB = parent.marriagePartner;
            let shift = (nodeA.x - (nodeB.x + nodeB.size)) / 2;
            let x3;
            x3 = nodeB.x + nodeB.size + shift;
            if (nodeA.marriagePartner) {
                shift =
                    (nodeA.x - (nodeA.marriagePartner.x + nodeA.marriagePartner.size)) /
                        2;
                x3 = nodeA.marriagePartner.x + nodeA.marriagePartner.size + shift;
            }
            const y3 = y1;
            const x4 = x3;
            const y4 = parent.y + parent.size / 2;
            const x5 = parent.x + parent.size / 2;
            const y5 = y4;
            const pointsToRender = {
                x1: x1 + Camera_1.default.OffsetX,
                y1: y1 + Camera_1.default.OffsetY,
                x21: x21 + Camera_1.default.OffsetX,
                y21: y21 + Camera_1.default.OffsetY,
                x22: x22 + Camera_1.default.OffsetX,
                y22: y22 + Camera_1.default.OffsetY,
                x3: x3 + Camera_1.default.OffsetX,
                y3: y3 + Camera_1.default.OffsetY,
                x4: x4 + Camera_1.default.OffsetX,
                y4: y4 + Camera_1.default.OffsetY,
                x5: x5 + Camera_1.default.OffsetX,
                y5: y5 + Camera_1.default.OffsetY,
            };
            Lines_1.TwinsLine.init(this.ctx, pointsToRender, this.lineWidth);
        }
    }
    drawIdenticalTwinsLines(connection) {
        const twinA = connection.twinA;
        const twinB = connection.twinB;
        const parent = connection.parent;
        // Point where twins are connected
        const x1 = (twinA.calculateMiddle().x + twinB.calculateMiddle().x) / 2;
        // Middle of twin A
        const x21 = twinA.calculateMiddle().x;
        const y21 = twinA.calculateMiddle().y;
        // Middle of twin B
        const x22 = twinB.calculateMiddle().x;
        const y22 = twinB.calculateMiddle().y;
        // Calculate twin connection length
        const y1 = y21 - 100 | y22 - 100;
        // Connection to the parent
        if (!parent.marriagePartner) {
            const x3 = x1;
            const y3 = (y1 + (parent.y + parent.size / 2)) / 2;
            const x4 = parent.x + parent.size / 2;
            const y4 = y3;
            const x5 = x4;
            const y5 = parent.y + parent.size / 2;
            const points = {
                x1: x1 + Camera_1.default.OffsetX,
                y1: y1 + Camera_1.default.OffsetY,
                x21: x21 + Camera_1.default.OffsetX,
                y21: y21 + Camera_1.default.OffsetY,
                x22: x22 + Camera_1.default.OffsetX,
                y22: y22 + Camera_1.default.OffsetY,
                x3: x3 + Camera_1.default.OffsetX,
                y3: y3 + Camera_1.default.OffsetY,
                x4: x4 + Camera_1.default.OffsetX,
                y4: y4 + Camera_1.default.OffsetY,
                x5: x5 + Camera_1.default.OffsetX,
                y5: y5 + Camera_1.default.OffsetY,
            };
            Lines_1.IdenticalTwinsLine.init(this.ctx, points, this.lineWidth);
        }
        else {
            const nodeA = parent;
            const nodeB = parent.marriagePartner;
            let shift = (nodeA.x - (nodeB.x + nodeB.size)) / 2;
            let x3;
            x3 = nodeB.x + nodeB.size + shift;
            if (nodeA.marriagePartner) {
                shift =
                    (nodeA.x - (nodeA.marriagePartner.x + nodeA.marriagePartner.size)) /
                        2;
                x3 = nodeA.marriagePartner.x + nodeA.marriagePartner.size + shift;
            }
            const y3 = y1;
            const x4 = x3;
            const y4 = parent.y + parent.size / 2;
            const x5 = parent.x + parent.size / 2;
            const y5 = y4;
            const points = {
                x1: x1 + Camera_1.default.OffsetX,
                y1: y1 + Camera_1.default.OffsetY,
                x21: x21 + Camera_1.default.OffsetX,
                y21: y21 + Camera_1.default.OffsetY,
                x22: x22 + Camera_1.default.OffsetX,
                y22: y22 + Camera_1.default.OffsetY,
                x3: x3 + Camera_1.default.OffsetX,
                y3: y3 + Camera_1.default.OffsetY,
                x4: x4 + Camera_1.default.OffsetX,
                y4: y4 + Camera_1.default.OffsetY,
                x5: x5 + Camera_1.default.OffsetX,
                y5: y5 + Camera_1.default.OffsetY,
            };
            Lines_1.IdenticalTwinsLine.init(this.ctx, points, this.lineWidth);
        }
    }
}
exports.default = ConnectionsManager;
