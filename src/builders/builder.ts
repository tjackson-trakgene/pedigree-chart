import { StyleConfig } from "../interfaces"
import { PedigreeUtils } from "./pedigreeBuilder"
import generator from "../idGenerator"

abstract class Builder {
    utils = new PedigreeUtils()
    abstract createPedigree()
    
    setPregnacy(pedigree: HTMLElement): HTMLElement {
        const pregnacyIcon = document.createElement("p")
        pregnacyIcon.textContent = "P"
        pregnacyIcon.style.position = "absolute"
        pregnacyIcon.style.lineHeight = "0rem"
        pregnacyIcon.style.top = `34%`
        pregnacyIcon.style.left = `44%`
        pedigree.childNodes[0].appendChild(pregnacyIcon)
        return pedigree
    }

    setAffected(pedigree: HTMLElement, config: StyleConfig): HTMLElement {
        const affectedLine = document.createElement("span")
        affectedLine.style.display = "block"
        affectedLine.style.height = `${config.border}px`
        if(config.sex === 'unknown') {
            affectedLine.style.width = `${(config.size / Math.sqrt(2)) + 30}px`
        }
        else if(config.sex === 'male') {
            affectedLine.style.width = `${(config.size * Math.sqrt(2)) + 30}px`
        } 
        else {
            affectedLine.style.width = `${config.size + 30}px`
        }
        affectedLine.style.backgroundColor = "black"
        affectedLine.style.position = "absolute"
        affectedLine.style.top = `calc(50% - ${config.border}px)`
        affectedLine.style.left = `-15px`
        affectedLine.style.transformOrigin = `center`
        if(config.sex === 'unknown') {
            affectedLine.style.transform = `rotate(0deg)`
        } else {
            affectedLine.style.transform = `rotate(45deg)`
        }
        pedigree.childNodes[0].appendChild(affectedLine)
        return pedigree
    }
}

export class PedigreeBuilderDirector {
    builder: Builder
    config: StyleConfig
    pedigreeId = generator.randomId()

    constructor(config: StyleConfig) {
        this.config = config
        this.setBuilder()
    }
    setBuilder() {
        switch (this.config.sex) {
            case 'male': {
                this.builder = new MaleBuilder(this.config); break;
            }
            case 'female': {
                this.builder = new FemaleBuilder(this.config); break;
            }
            case 'unknown': {
                this.builder = new UnknownBuilder(this.config); break;
            }   
        }
    }
    createPedigree() {
        const pedigree = this.builder.createPedigree()
        pedigree.id = this.pedigreeId
        return pedigree
    }
    recreatePedigree(config: StyleConfig) {
        this.config = config
        this.setBuilder()
        return { 
            id: this.pedigreeId, 
            pedigree: this.createPedigree() 
        }
    }
}

class MaleBuilder extends Builder {
    pedigree: HTMLElement
    config: StyleConfig

    constructor(config: StyleConfig) {
        super()
        this.config = config
    }

    setMaleSex() {
        this.pedigree.style.width = `${this.config.size}px`
        this.pedigree.style.height = `${this.config.size}px`
        this.pedigree.childNodes.forEach((node: any) => {
            if (node.className = "pedigree") {
                node.childNodes[0].style.borderRadius = "0"
                node.childNodes[1].style.borderRadius = "0"
            }
        })
    }

    createPedigree() {
        this.pedigree = this.utils.createPedigree(this.config)
        this.setMaleSex()
        switch(this.config.type) {
            case 'pregnacy': 
            this.pedigree = this.setPregnacy(this.pedigree); 
            break;
            case 'affected': this.setAffected(this.pedigree, this.config); break;
        }
        return this.pedigree
    }
}

class FemaleBuilder extends Builder {
    pedigree: HTMLElement
    config: StyleConfig

    constructor(config: StyleConfig) {
        super()
        this.config = config
    }

    setFemaleSex() {
        this.pedigree.style.width = `${this.config.size}px`
        this.pedigree.style.height = `${this.config.size}px`
        this.pedigree.childNodes.forEach((node: any) => {
            if (node.className = "pedigree") {
                node.childNodes[0].style.borderRadius = "100px 100px 0% 0%"
                node.childNodes[1].style.borderRadius = "0% 0% 100px 100px"
                node.style.transform = "rotate(0deg)"
            }
        })
    }

    createPedigree() {
        this.pedigree = this.utils.createPedigree(this.config)
        this.setFemaleSex()
        switch(this.config.type) {
            case 'pregnacy': 
            this.pedigree = this.setPregnacy(this.pedigree); 
            break;
            case 'affected': 
            this.pedigree = this.setAffected(this.pedigree, this.config); 
            break;
            // case 'affecte': this.setPregnacy(); break;
        }
        return this.pedigree
    }
}

class UnknownBuilder extends Builder {
    pedigree: HTMLElement
    config: StyleConfig

    constructor(config: StyleConfig) {
        super()
        this.config = config
    }

    setUnknownSex() {
        this.pedigree.childNodes.forEach((node: any) => {
            if (node.className = "pedigree") {
                node.style.width = `${this.config.size / Math.sqrt(2)}px`
                node.style.height = `${this.config.size / Math.sqrt(2)}px`
                node.style.transform = "rotate(45deg)"
                this.pedigree.style.display = "flex"
                this.pedigree.style.justifyContent = "center"
                this.pedigree.style.alignItems = "center"
            }
        })
    }

    createPedigree() {
        this.pedigree = this.utils.createPedigree(this.config)
        this.setUnknownSex()
        switch(this.config.type) {
            case 'pregnacy': 
            this.pedigree = this.setPregnacy(this.pedigree); 
            break;
            case 'affected': 
            this.pedigree = this.setAffected(this.pedigree, this.config); 
            break;
        }
        return this.pedigree
    }
}