import Promise from "bluebird"
import gm from "gm"
import path from "path"
import fs from "fs-extra"
import props from "./helper"

let Private = props()

class PDF2IMG {
    constructor(options) {
        Private(this).quality = 100
        Private(this).format = options.format || "png"
        Private(this).size = options.size || 600
        Private(this).density = options.density || 200
        Private(this).savedir = options.savedir || undefined
        Private(this).savename = options.savename || undefined
        
        /**
         * GM command - identify
         * @access private
         * @param {String} file_path path to valid file
         * @param {Mixed} argument gm identify argument
         * @return {Promise} 
         */
        Private(this).identify = (file_path, argument = undefined) => {
            let image = gm(file_path)
            
            return new Promise((resolve, reject) => {
                if(argument)
                    image.identify(argument, (error, data) => {
                        if(error)
                            return reject(error)

                        return resolve(data)
                    })
                else
                    image.identify((error, data) => {
                        if(error)
                            return reject(error)

                        return resolve(data)
                    })  
            })
        }


        /**
         * GM command - write
         * @access private
         * @param {Stream} stream
         * @param {String} output
         * @param {String} filename
         * @param {Integer} page
         * @return {Promise} 
         */
        Private(this).writeImage = (stream, output, filename, page) => {
            return new Promise((resolve, reject) => {
                gm(stream, filename)
                    .density(Private(this).density, Private(this).density)
                    .resize(Private(this).size)
                    .quality(Private(this).quality)
                    .write(output, (error) => {
                        if(error)
                            return reject(error)

                        return resolve({
                            name: path.basename(output),
                            size: fs.statSync(output)['size'] / 1000.0,
                            path: output,
                            page
                        })
                  })
            })
        }

    }

    async convert(pdf_path, page = 1) {
        this.isValidPDF(pdf_path)
        this.fileExists(pdf_path)

        let stdout = []
        let output = path.basename(pdf_path, path.extname(path.basename(pdf_path)))

        // Set output dir
        if (this.get("savedir"))
            this.set("savedir", this.get("savedir") + path.sep)
        else
            this.set("savedir", output + path.sep)
        
        fs.mkdirsSync(this.get("savedir"))

        if(!this.get("savename"))
            this.set("savename", output)

        let pages = await this.getPageCount(pdf_path)

        if(page > pages)
            throw {error: "InvalidPageSelection", message: "Cannot convert non-existent page"}
        
        return await this.toImage(pdf_path, page)
    }

    /**
     * Get how many pages are there in the pdf file
     * @param {String} pdf_path path to file
     * @return {Integer} number of pages
     */
    async getPageCount(pdf_path) {
        let page = await Private(this).identify(pdf_path, "%p ")
        page = page.split(" ")
        
        return page.length
    }

    /**
     * Converts pdf to image
     * @param {String} pdf_path 
     * @param {Integer} page
     * @return {Promise} 
     */
    async toImage(pdf_path, page) {
        let iStream  = fs.createReadStream(pdf_path)
        let file     = `${this.get("savedir")}${this.get("savename")}_${page}.${this.get("format")}`
        let filename = this.getFilePath(iStream)

        return await Private(this).writeImage(iStream, file, filename, page)
    }

    /**
     * Get file path
     * @param {Stream} stream
     * @return {String} path
     */
    getFilePath(stream) {
        if(!stream)
            throw {error: "InvalidPath", message: "Invalid Path"}

        return stream.path
    }

    /**
     * Checks if the supplied file has the exact file format
     * @param {String} pdf_path path to file
     * @return {Mixed} file status
     */
    isValidPDF(pdf_path) {
        if (path.extname(path.basename(pdf_path)) != '.pdf') 
            throw {error: "InvalidPDF", message: "File supplied is not a valid PDF"}
        
        return true
    }

    /**
     * Checks if the supplied file has exists
     * @param {String} pdf_path path to file
     * @return {Mixed} file status
     */
    fileExists(pdf_path) {
        if(!fs.existsSync(pdf_path))
            throw {error: "FileNotFound", message: "File supplied cannot be found"}

        return true
    }

    /**
     * Get value from private property
     * @param {String} property
     * @return {Mixed} value of the property 
     */
    get(property) {
        return Private(this)[property]
    }

    /**
     * Add/set value as private property
     * @param {String} property 
     * @param {String} value
     * @return {Object} this 
     */
    set(property, value) {
        Private(this)[property] = value

        return this
    }
}

module.exports = PDF2IMG