function model(){
    this.array = []
    this.bindEvent = function(){
        var opens = document.querySelectorAll("[data-model-open]")
        var closes = document.querySelectorAll("[data-model-close]")
        var models = document.querySelectorAll("[data-model-id]")
        var self = this
        for(var i = 0; i < opens.length; i++){
            opens[i].addEventListener('click',function(){
                var id = this.getAttribute("data-model-open")
                if(id){
                    self.open(id)
                }
            },false)
        }
        for(var i = 0; i < closes.length; i++){
            closes[i].addEventListener('click',function(){
                var id = this.getAttribute("data-model-close")
                if(id){
                    self.close(id)
                }
            },false)
        }
        for(var i = 0; i < models.length; i++){
            models[i].addEventListener("click",function(e){
                var id = e.target.getAttribute('data-model-id')
                if(id){
                    self.close(id)
                }
            },false)
        }
    }
    this.findModel = function(id){
        return document.querySelector('[data-model-id='+id+']')
    }
    this.add = function(id){
        this.remove(id)
        this.array.push(id)
    }  
    this.remove = function(id){
        var index = this.array.indexOf(id)
        if(index !== -1){
            this.array.splice(index,1)
        }
    }   
    this.opening = function(model){
        var event = new CustomEvent('model-opening',{detail:{model:model}})
        model.dispatchEvent(event)
    }
    this.closing = function(model){
        var event = new CustomEvent('model-closing',{detail:{model:model}})
        model.dispatchEvent(event)
    }
    this.open = function(id){
        var myModel = this.findModel(id)
        if(myModel){
            this.opening(myModel)
            myModel.classList.add('opened')
            setTimeout(function(){
                myModel.classList.add('visible')
            })
            this.add(id)
            document.querySelector("html").classList.add('lock')
        }
    }
    this.close = function(id){
        var myModel = this.findModel(id)
        if(myModel){
            this.closing(myModel)
            myModel.classList.remove('visible')
            this.remove(id)
            if(!this.array.length){
                document.querySelector("html").classList.remove('lock')
            }
        }
    }
    this.bindEvent()
}