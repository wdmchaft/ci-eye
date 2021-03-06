"use strict";
(function($) {
    var style = {
            "announcementStyle": {
                "position": "absolute",
                "z-index": "500"
            },
            "shadowStyle": {
                "backgroundColor": "#000000",
                "position": "absolute",
                "opacity": "0.4",
                "z-index": "499"
            },
            "titleBarStyle": {
                "padding": "1px",
                "margin": "0",
                "backgroundColor": "#ffffff",
                "border": "1px solid #999",
                "height": "16px"
            },
            "contentStyle": {
                "color": "#000000",
                "padding": "1px",
                "margin": "0",
                "backgroundColor": "#ffffff",
                "border": "1px solid #999",
                "font-family": "Verdana,sans-serif",
                "font-size": "3em"
            },
            "closeButtonStyle": {
                "color": "#000000",
                "float": "right",
                "padding": "0 1px 0 0",
                "cursor": "pointer",
                "font-family": "Verdana,sans-serif",
                "font-size": "0.8em"
            }
        },
        announcement = $("<div></div>")
                   .hide()
                   .css(style.announcementStyle)
                   .bind("click", function(event) {
                        event.stopPropagation();
                   }),
        shadow = $("<div></div>")
                     .hide()
                     .css(style.shadowStyle),
        titleBar = $("<div></div>")
                       .css(style.titleBarStyle)
                       .appendTo(announcement),
        closeButton = $("<a>X</a>")
                          .css(style.closeButtonStyle)
                          .appendTo(titleBar),
        content = $("<div></div>")
                      .css(style.contentStyle)
                      .appendTo(announcement);
    
    function hideAnnouncement() {
        announcement.hide();
        shadow.hide();
    }
    
    function announce(message) {
        content.text(message);
        
        announcement.css({
                        "left": "50%",
                        "margin-left": announcement.width() / -2,
                        "top": 50})
                    .show();
        
        shadow.css({
                  "width": announcement.width(),
                  "height": announcement.height(),
                  "left": "50%",
                  "margin-left": (announcement.width() / -2) +2,
                  "top": 52})
              .show();
    }
    
    $(document).ready(function() {
        announcement.appendTo("body");
        shadow.appendTo("body");
        closeButton.click(hideAnnouncement);
    });
    
    $.fn.announcer = function(action, message) {
        if ("announce" === action) {
            announce(message);
        }
        if ("hide" === action) {
            hideAnnouncement();
        }
        return this;
    };
})(jQuery);