define([
    'visor',
    'can/view/ejs',
    'can/control',
    'can/observe',
    'can/util/library',
], function(Visor, can) {
// Using ECMAScript 5 strict mode during development By default r.js will ignore that.
"use strict";


var PageController = can.Control(
{
    STATES: {
        VIEW: 0,
        SELECT: 1
    }

},{
    state: null,
    visor: null,

    init: function(el, options) {},

    start: function() {
        this.state = PageController.STATES.VIEW;
        this.element.html( can.view('graphics/page.ejs', {}) );

        this.dom = {
            output: this.element.find(".output"),
            out_text: this.element.find(".output .text"),
            visor   : this.element.find(".visor")
        };

        G.socket.on('trace', $.proxy(this.onTrace, this));

        this.visor = new Visor(this.dom.visor);
        this.visor.start();

        //this.dom.output.addClass("folded");
    },

    onTrace: function(data) {
        console.log("Info: ", data);

        var self = this;
        $.each(data, function(action) {
            self.dom.out_text.append(
                can.view('graphics/trace.ejs', {"msg": data[action], "action": action})
            );
        });
        
    },

    //DOM EVENTS
    'input keydown': function( el, ev ) {
         if (ev.keyCode == 13 && !ev.shiftKey) {
            var msg = el.val();
            if(msg.trim().length > 0) {

                el[0].disabled = true;
                $.post("/trace",
                    {
                        "action": "chat",
                        "msg": msg
                    }
                ).success(function(){
                    el.val("");
                }).error(function() {
                    alert("Error enviando el mensaje )=");
                }).always(function() {
                    el[0].disabled = false;
                });

            }
        }
    },

    //Private
    dom: null
});

return PageController;

});