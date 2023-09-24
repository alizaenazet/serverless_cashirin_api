class createMerchantAccountSchema {
    username
    name
    address = ""
    phone = ""
    logo_url = ""
    banner_url = ""
    image_collection = []
    constructor(username,name,address,phone,logo_url,baner_url){
        this.username = username;
        this.name = name
        this.address = address
        this.phone = phone
        this.logo_url = logo_url
        this.banner_url = baner_url
    }
    addImageCollection(title,description,imageUrl){
        const tempObj = {
            title,
            description,
            imageUrl
        }
        image_collection.push(tempObj);
    }
    getAsSchemaObj(){
        return{
            username:this.username,
            name:this.name,
            address:this.address,
            phone:this.phone,
            logo_url:this.logo_url,
            banner_url: this.banner_url,
            image_collection : this.image_collection
        }
    }
}


class merchantImageCollectionSchema{
    title
    description
    image_url
    constructor(title,description,image_url){
        this.title = title;
        this.description = description;
        this.image_url = image_url
    }

    getAsSchemaObj(){
        return{
            title:this.title,
            description:this.description,
            image_url:this.image_url
        }
    }
}

module.exports = {createMerchantAccountSchema,merchantImageCollectionSchema}