// ==UserScript==
// @name         ResurgenceUserscript
// @namespace    http://tampermonkey.net/
// @version      5.13
// @description  Tries to fix and improve certain aspects of Scratch
// @author       Wetbikeboy2500
// @match        https://scratch.mit.edu/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @resource     CSS https://raw.githubusercontent.com/Wetbikeboy2500/ScratchFixer/master/style.min.css
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @updateURL    https://raw.githubusercontent.com/Wetbikeboy2500/ScratchFixer/master/ScratchFixer.user.js
// @run-at       document-start
// ==/UserScript==
(function () {
    'use strict';
    window.addEventListener("load", () => {
        if (ran_code == false) {
            console.log("window loaded");
            ran_code = true;
            run();
        }
    }, false);
    //make sure code runs if window loading dosn't work
    setTimeout (() => {
        if (ran_code == false) {
            console.log("load interval");
            ran_code = true;
            run();
        }
    },5000);//5 second wait for the page

    function run () {
        load_userinfo();
        if (url.includes("discuss")) {
            load_images();
            load_scratchblockcode();
            load_bbcode();
        }
    }

    let url = window.location.href, users = [], userinfo = {}, l, ran_code = false, style = null, style1 = null;
    //adds my css to edit custom elements
    if (GM_getValue("theme", false) === "dark") {
        style1 = GM_addStyle(GM_getResourceText("CSS"));
    } 
    document.addEventListener("DOMContentLoaded", () => {
        var styleTip ='.tips a span { display: none; position: absolute; } .tips a:after { content: "' + GM_getValue("forumTitle", "Forums") + '"; visibility: visible; position: static; } .phosphorus { margin-left: 14px; margin-right: 14px; margin-top: 16px; } .my_select {height: 34px; line-height: 34px; vertical-align: middle; margin: 3px 0px 3px 0px; width: 110px;} .messages-social {width: 700px; right: 446.5px; left: 235.5px; position: relative; border: 0.5px solid #F0F0F0; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; background-color: #F2F2F2; } .messages-header {font-size: 24px; padding-left: 10px;} select[name="messages.filter"] {right: 720px; top: 20px; font-size: 24px; position: relative; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; background-color: #F2F2F2; visibility: visible;} #___gcse_0 {display: none;} .messages-details {margin-top: 40px;} .mod-messages {visibility: hidden; height: 0px; padding: 0px; margin: 0px;}';
        GM_addStyle(styleTip);
        dark_theme();
        fix_nav();
        load_newpage();
        add_player();
        add_search();
        load_extras();
        load_messages();
    });

    function fix_nav () {
        //fixes navbar
        if (document.getElementById("navigation") !== null) {
            document.getElementsByClassName("tips")[0].childNodes[0].setAttribute("href", "/discuss");
            console.log("New Theme");
        } else {
            let tips = document.getElementsByClassName("site-nav")[0].childNodes[3].childNodes[0];
            tips.setAttribute("href", "/discuss");
            tips.innerHTML = GM_getValue("forumTitle", "Forums");
            console.log("Old Theme");
        }
    }
    function load_newpage () {
        console.log("load newpage");
        let displaySettingsModal = false, toggleModal = () => {
            if (displaySettingsModal) {
                $('body').attr('style', 'overflow-y:scroll;');
                $('#res-set-modal').hide(500);
                $('#res-set-modal-back').toggleClass('modal-hidden');
                displaySettingsModal = false;
            } else {
                $('body').attr('style', 'overflow-y:hidden;');
                $('#res-set-modal').show(500);
                $('#res-set-modal-back').toggleClass('modal-hidden');
                if (GM_getValue("theme", false) === "dark") {
                    $("#themeIO").prop('checked', "checked");
                }
                if (GM_getValue("extras", true)) {
                    $("#extrasIO").prop('checked', "checked");
                }
                if (GM_getValue("msg", true)) {
                    $("#msgIO").prop('checked', "checked");
                }
                if (GM_getValue("timer", true)) {
                    $("#halloweenIO").prop('checked', "checked");
                }
                if (GM_getValue("blockCode", true)) {
                    $("#blocksIO").prop('checked', "checked");
                }
                $("#playerIO").val(GM_getValue("player", "D"));
                $("#disText").val(GM_getValue("forumTitle", "Forums"));
                displaySettingsModal = true;
            }
        }
        //adds link at bottom of page and adds settings button to menu
        if (document.getElementsByClassName("lists").length > 0) {
            element("dd")
                .append(element("a").a("href", "/resurgence").t("Resurgence Userscript"))
                .ap(document.getElementsByClassName("lists")[0].getElementsByTagName("dl")[1]);
            let test = setInterval(() => {
                if (document.getElementsByClassName("ul.dropdown.production") != null) {
                    $('.divider').before('<li id="res-set"><a>Resurgence Settings');
                    $('#res-set').click(toggleModal);
                    clearInterval(test);
                }
            }, 1000);
        } else if (document.getElementsByClassName("footer-col").length > 0) {
            element("li")
                .append(element("a").a("href", "/resurgence").t("Resurgence Userscript"))
                .ap(document.getElementsByClassName("footer-col")[0].childNodes[3].childNodes[3]);
            let test = setInterval(() => {
                if (document.getElementById("logout") != null) {
                    $('#logout').before('<li id="res-set"><a>Resurgence Settings');
                    $('#res-set').click(toggleModal);
                    clearInterval(test);
                }
            }, 1000);
        }
        //adds popup settings modal
        GM_addStyle('.modal-hidden {display:none;} #res-set-modal {position:fixed; background-color:#00000000; width:40%; height:80%; border-radius:5px; outline:none; left:30%; top:10%; z-index: 9999; color: black !important; padding:20px; text-align:center;} #res-set-modal-back {position:fixed; width: 100%; height: 100%; background-color:#212121; left:0; top:0; z-index:9998; opacity:.5;}');
        $('body').append('<div id="res-set-modal" class="modal-hidden" tabindex="1">');
        $('#res-set-modal').load("https://raw.githubusercontent.com/Wetbikeboy2500/ScratchFixer/master/modal.html");

        $('body').append('<div id="res-set-modal-back" class="modal-hidden">');
        $('#res-set-modal-back').click(toggleModal);
        //IO for sliders
        $(document).on("click", "#themeIO", (event) => {
            if (GM_getValue("theme", false) === "dark") {
                GM_setValue("theme", "light");
            } else {
                GM_setValue("theme", "dark");
            }
            dark_theme();
        });
        $(document).on("click", "#extrasIO", (event) => {
            if (GM_getValue("extras", true)) {
                GM_setValue("extras", false);
            } else {
                GM_setValue("extras", true);
            }
        });
        $(document).on("click", "#msgIO", (event) => {
            if (GM_getValue("msg", true)) {
                GM_setValue("msg", false);
            } else {
                GM_setValue("msg", true);
            }
        });
        $(document).on("click", "#halloweenIO", (event) => {
            if (GM_getValue("timer", true)) {
                GM_setValue("timer", false);
            } else {
                GM_setValue("timer", true);
            }
        });
        $(document).on("click", "#blocksIO", (event) => {
            if (GM_getValue("blockCode", true)) {
                GM_setValue("blockCode", false);
            } else {
                GM_setValue("blockCode", true);
            }
        });
        $(document).on("change", "#playerIO", (event) => {
            console.log(document.getElementById("playerIO").value);
            GM_setValue("player", document.getElementById("playerIO").value);        
        });
        $(document).on("change", "#disText", (event) => {
            console.log(document.getElementById("playerIO").value);
            GM_setValue("forumTitle", document.getElementById("disText").value);
        });

        //adds the new page
        if ("https://scratch.mit.edu/resurgence" === url) {
            GM_addStyle('.box-content li {width: 50%; position: relative; left: 25%; text-align: left;} .box-content {padding-bottom: 10px;}');
            let main = document.getElementsByClassName("box-content")[0];
            main.innerHTML = "";
            element("h4").t("Resurgence Userscript")
                .ap(document.getElementsByClassName("box-head")[0]).setAttribute("style", "padding: 10px 0px 0px 7px !important;");

            element("p").t("Made By ")
                .append(element("a").t("Wetbikeboy2500").a("href", "https://scratch.mit.edu/users/Wetbikeboy2500/"))
                .ap(main);
            element("p").t("Special thanks to ")
                .append(element("a").t("NitroCipher").a("href", "https://scratch.mit.edu/users/NitroCipher/"))
                .ap(main);
            element("p").t("Resurgence Userscript (previously named ScratchFixer until NitroCipher suggested its current name) was originally going to be a chrome extension but I decided that a userscript was going to be easier to update and change. The userscript started out by just adding the forums button, messages to the main page, and letting you use the Phosphorus player for projects. Since then, more features have been added to the userscipt with more to come in the future.")
                .ap(main);
            element("p")
                .append(element("a").t("Click this to go to the forum post").a("href", "https://scratch.mit.edu/discuss/topic/274665/"))
                .ap(main);
            element("p")
                .append(element("a").t("Click this to go to the Github repo").a("href", "https://github.com/Wetbikeboy2500/ScratchFixer"))
                .ap(main);

            element("h3").t("Features").ap(main);

            element("ul")
                .append(element("li").t("Forums tab instead of tips tab"))
                .append(element("li").t("Customization of Forum tab name"))
                .append(element("li").t("Adds messages to the main page"))
                .append(element("li").t("Switch between Scratch player, Phosphorus player, Sulfurous player, and the Scratch 3 player"))
                .append(element("li").t("Adds google search so you can search the whole Scratch site with google"))
                .append(element("li").t("Quick info when hovering over usernames"))
                .append(element("li").t("When you click on Scratch Blocks in the forums it will show the original Scrachblock code"))
                .append(element("li").t("Click on a new button “BBCode” to switch between the BBCode and the original post"))
                .append(element("li").t("Changes the messages area to look like how it use to look"))
                .append(element("li").t("Adds this page to Scratch"))
                .append(element("li").t("Adds option for Dark Theme for Scratch"))
                .append(element("li").t("Enlarge photos in forum posts"))
                .append(element("li").t("Settings pop-up on all pages"))
                .ap(main);

            element("h3").t("Special Features/Extras").ap(main);

            element("Extras")
                .append(element("li").t("Halloween countdown timer"))
                .append(element("li").t("Falling leaves on the homepage"))
                .append(element("li")
                        .append(element("a").t("DeleteThisAcount").a("href", "https://scratch.mit.edu/users/DeleteThisAcount/")))
                .ap(main);

            element("button").t("Extras").a("title", "Enables/disables display of leaves/deletos")
                .e("click", () => {
                if (GM_getValue("extras", true)) {
                    GM_setValue("extras", false);
                    alert('Extras are now disabled.');
                } else {
                    GM_setValue("extras", true);
                    alert('Extras are now enabled.');
                }
            }).ap(main);

            element("button").a("title", "Must refresh page for theme change to take effect").t("Switch Theme")
                .e("click", () => {
                if (GM_getValue("theme", false) === "dark") {
                    GM_setValue("theme", "light");
                } else {
                    GM_setValue("theme", "dark");
                }
                dark_theme();
            }).ap(main);

            element("select").a("style", "color: #fff !important; border-color: #1f2227!important; background-color: #2d3035!important; height: 30px;")
                .e("change", (event) => {
                GM_setValue("player", event.currentTarget.value);
            })
                .o({
                D: "Default",
                P: "Phosphorus",
                S: "Sulfurous",
                "S3": "Scratch 3"
            }, GM_getValue("player", "D"))
                .ap(main);
        }
    }
    function add_player () {
        //adds the different players using a dropdown menu
        if (url.includes("projects") && !url.includes("all") && !url.includes("search") && !url.includes("studios")) {
            let menu, change = (a) => {
                if (document.getElementsByClassName("phosphorus")[0] != null) {
                    document.getElementsByClassName("phosphorus")[0].parentNode.removeChild(document.getElementsByClassName("phosphorus")[0]);
                } else {
                    document.getElementById("player").style = "display: none;";
                }
                switch (a) {
                    case "D":
                        document.getElementById("player").style = "display: block;";
                        break;
                    case "P":
                        element("script").a("src", "https://phosphorus.github.io/embed.js?id="+ document.getElementById("project").getAttribute("data-project-id") +"&auto-start=false&light-content=false")
                            .ap(document.getElementsByClassName("stage")[0]);
                        break;
                    case "S":
                        element("script").a("src", "https://sulfurous.aau.at/js/embed.js?id="+ document.getElementById("project").getAttribute("data-project-id") +"&resolution-x=480&resolution-y=360&auto-start=true&light-content=false")
                            .ap(document.getElementsByClassName("stage")[0]);
                        break;
                    case "S3":
                        element("div").a("id", "player").a("style", "width:500px;height:410px;overflow:hidden;position:relative;left:7px;top:7px; margin: 0px;").a("class", "phosphorus")
                            .append(element("object").a("style", "position:absolute;top:-51px;left:-2065px").a("class", "int-player").a("width", "2560").a("height", "1440").a("data", "https://llk.github.io/scratch-gui/#" + document.getElementById("project").getAttribute("data-project-id")).a("scrolling", "no"))
                            .ap(document.getElementsByClassName("stage")[0]);
                        break;
                    default:
                        document.getElementById("player").style = "display: block;";
                        break;
                }
            }; //0 is default, 1 is phosphorous, 2 is sulforus
            console.log("Project page");
            if (document.getElementById("share-bar") === null) {
                menu = document.getElementsByClassName("buttons")[0];
            } else {
                menu = document.getElementsByClassName("buttons")[1];
            }
            element("select").a("class", "my_select").e("change", (event) => {
                change(document.getElementsByClassName("my_select")[0].value);
            }, false)
                .o({
                D: "Default",
                P: "Phosphorus",
                S: "Sulfurous",
                "S3": "Scratch 3"
            }, GM_getValue("player", "D"))
                .ap(menu);
            change(GM_getValue("player", "D"));
        }
    }
    function add_search () {
        //adds google to the search
        if (url.includes("/search/")) {
            console.log("search");
            //first load new search
            let search = document.createElement("gcse:searchresults-only");
            let display = document.getElementById("projectBox");
            display.appendChild(search);

            let cx = '005257552979626070807:ejqzgnmerl0';
            let gcse = document.createElement('script');
            gcse.type = 'text/javascript';
            gcse.async = true;
            gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
            let s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(gcse, s);

            element("a").e("click", () => {
                //make button look selected
                document.getElementsByClassName("active")[0].removeAttribute("class");
                document.getElementById("active").setAttribute("class", "active");
                //need to clear current searches
                display.childNodes[0].style.display = "none";
                display.childNodes[1].style.display = "none";
                document.getElementById("___gcse_0").style.display = "block";
            }, false)
                .append(element("li").a("id", "active")
                        .append(element("img").a("class", "tab-icon").a("style", "height: 24px;"))
                        .append(element("span").t("Google")))
                .ap(document.getElementsByClassName("sub-nav tabs")[0]);
        }
    }
    //adds dark theme button
    function dark_theme () {
        console.log(GM_getValue("theme", false));
        if (GM_getValue("theme", false) === "dark") {
            //want dark theme
            style = GM_addStyle(GM_getResourceText("CSS"));
        } else if (style !== null) {
            style.parentElement.removeChild(style);
            if (style1 != null) {
                style1.parentElement.removeChild(style1);
            }
            style = null;
        }
    }
    let messages = {
        get_session: () => {
            return new Promise ((resolve, reject) => {
                let xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = () => {
                    if (xhttp.status == 200 && xhttp.readyState == 4) {
                        let html  = xhttp.responseText;
                        let js = JSON.parse(html);
                        resolve({
                            token: js.user.token,
                            username: js.user.username
                        });
                    }
                };
                xhttp.onerror = (err) => {
                    reject("Error getting userinfo " + err);
                };
                xhttp.open("GET", "https://scratch.mit.edu/session/", true);
                xhttp.send(null);
            });
        },
        //this should instead see if the newest messgae equals our newesst message
        check_unread: (user) => {
            return new Promise ((resolve, reject) => {
                let r = new XMLHttpRequest();
                r.onreadystatechange = () => {
                    if (r.status == 200 && r.readyState == 4) {
                        let rec = JSON.parse(r.responseText);
                        let mes = JSON.parse(GM_getValue("message", true));
                        user.has_messages = GM_getValue("message", true) === true || GM_getValue("username", true) != user.username || mes[0].datetime_created !== rec[0].datetime_created;
                        resolve(user);
                    }
                };
                r.onerror = (error) => {
                    reject("Error checking unread messgaes" + error);
                };
                r.open("GET", "https://api.scratch.mit.edu/users/"+user.username+"/messages?limit=1&offset=0", true);
                r.setRequestHeader("X-Token", user.token);
                r.send(null);
            });
        },
        get_message: (user) => {
            return new Promise((resolve, reject) => {
                if (user.has_messages) { //load new messages
                    let xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = () => {
                        if (xhttp.status == 200 && xhttp.readyState == 4) {
                            user.messages = xhttp.responseText;
                            resolve(user);
                        }
                    };
                    xhttp.onerror = (error) => {
                        reject("Error loading messages" + error);
                    };
                    xhttp.open("GET", "https://api.scratch.mit.edu/users/"+user.username+"/messages?limit=40&offset=0", true);
                    xhttp.setRequestHeader("X-Token", user.token);
                    xhttp.send(null);
                } else { //load form presave
                    user.messages = GM_getValue("message", {});
                    resolve(user);
                }
            });
        }
    };

    function load_messages () {
        if (url == "https://scratch.mit.edu/" && GM_getValue("msg", true)) {
            let load = setInterval(() => {
                if (document.getElementsByClassName("box activity")[0] !== null) {
                    messages.get_session()
                        .then(user => messages.check_unread(user))
                        .then(user => messages.get_message(user))
                        .then(user => load_message(user))
                        .catch((error) => console.warn(error));
                }
                clearInterval(load);
            }, 1000);

        }
    }

    function load_message (users) {
        GM_addStyle(".activity .box-content{ overflow-y: scroll; height: 248px;} .username_link {cursor: pointer; color: #6b6b6b !important; text-decoration: none;}");
        let html = JSON.parse(users.messages);
        let decodetext = (text) => {
            let txt = element("textarea").dom;
            txt.innerHTML = text;
            return txt.value;
        };
        GM_setValue("username", users.username);
        GM_setValue("message", users.messages);
        let ul = element("ul");
        for (let a of html) {
            switch (a.type) {
                case "forumpost":
                    ul.append(element("li")
                              .append(element("span").t("There are new posts in the forum: "))
                              .append(element("a").t(a.topic_title).a("href", "/discuss/topic/"+a.topic_id+"/unread/"))
                              .append(element("span").t(calcSmallest(new Date(Date.parse(a.datetime_created))))));
                    break;
                case "studioactivity":
                    ul.append(element("li")
                              .append(element("span").t("There was new activity in "))
                              .append(element("a").t(a.title).a("href", "/studios/"+a.gallery_id))
                              .append(element("span").t(calcSmallest(new Date(Date.parse(a.datetime_created))))));
                    break;
                case "favoriteproject":
                    ul.append(element("li")
                              .append(element("a").t(a.actor_username).a("href", "/users/" + a.actor_username).a("class", "username_link"))
                              .append(element("span").t(" favorited your project "))
                              .append(element("a").t(a.project_title).a("href", "/projects/"+a.project_id))
                              .append(element("span").t(calcSmallest(new Date(Date.parse(a.datetime_created))))));
                    break;
                case "loveproject":
                    ul.append(element("li")
                              .append(element("a").t(a.actor_username).a("href", "/users/" + a.actor_username).a("class", "username_link"))
                              .append(element("span").t(" loved your project "))
                              .append(element("a").t(a.title).a("href", "/projects/"+a.project_id))
                              .append(element("span").t(calcSmallest(new Date(Date.parse(a.datetime_created))))));
                    break;
                case "followuser":
                    ul.append(element("li")
                              .append(element("a").t(a.actor_username).a("href", "/users/" + a.actor_username).a("class", "username_link"))
                              .append(element("span").t(" followed you"))
                              .append(element("span").t(calcSmallest(new Date(Date.parse(a.datetime_created))))));
                    break;
                case "remixproject":
                    ul.append(element("li")
                              .append(element("a").t(a.actor_username).a("href", "/users/" + a.actor_username).a("class", "username_link"))
                              .append(element("span").t(" remixed your project "))
                              .append(element("a").t(a.parent_title).a("href", "/projects/"+a.parent_id))
                              .append(element("span").t(" as "))
                              .append(element("a").t(a.title).a("href", "/projects/"+a.project_id))
                              .append(element("span").t(calcSmallest(new Date(Date.parse(a.datetime_created))))));
                    break;
                case "addcomment":
                    if (a.comment_type === 0) { //project
                        ul.append(element("li")
                                  .append(element("a").a("href", "/users/" + a.actor_username).a("class", "username_link").t(a.actor_username))
                                  .append(element("span").t(' commented "'+decodetext(a.comment_fragment)+'" on your project '))
                                  .append(element("a").a("href", "/projects/"+a.comment_obj_id+"/#comments-"+a.comment_id).t(a.comment_obj_title))
                                  .append(element("span").t(calcSmallest(new Date(Date.parse(a.datetime_created))))));
                    } else if (a.comment_type === 1) { //profile page
                        ul.append(element("li")
                                  .append(element("a").a("href", "/users/" + a.actor_username).a("class", "username_link").t(a.actor_username))
                                  .append(element("span").t(' commented "'+decodetext(a.comment_fragment)+'" on your profile '))
                                  .append(element("a").a("href", "/users/"+a.comment_obj_title+"/#comments-"+a.comment_id).t(a.comment_obj_title))
                                  .append(element("span").t(calcSmallest(new Date(Date.parse(a.datetime_created))))));
                    } else if (a.comment_type === 2) {
                        ul.append(element("li")
                                  .append(element("a").a("href", "/users/" + a.actor_username).a("class", "username_link").t(a.actor_username))
                                  .append(element("span").t(' commented "'+decodetext(a.comment_fragment)+'" on your studio '))
                                  .append(element("a").a("href", "/studios/"+a.comment_obj_id+"/#comments-"+a.comment_id).t(a.comment_obj_title))
                                  .append(element("span").t(calcSmallest(new Date(Date.parse(a.datetime_created))))));
                    } else {
                        console.warn("Comment type not found");
                    }
                    break;
                case "curatorinvite":
                    ul.append(element("li")
                              .append(element("a").a("href", "/users/" + a.actor_username).a("class", "username_link").a(a.actor_username))
                              .append(element("span").t(' invited you to curate '))
                              .append(element("a").a("href", "/studios/"+a.gallery_id).t(a.title))
                              .append(element("span").t(calcSmallest(new Date(Date.parse(a.datetime_created))))));
                    break;
                case "becomeownerstudio":
                    ul.append(element("li")
                              .append(element("a").a("href", "/users/" + a.actor_username).a("class", "username_link").a(a.actor_username))
                              .append(element("span").t(' promoted you to manager in '))
                              .append(element("a").a("href", "/studios/"+a.gallery_id).t(a.title))
                              .append(element("span").t(calcSmallest(new Date(Date.parse(a.datetime_created))))));
                    break;
                case "userjoin":
                    ul.append(element("li")
                              .append("span").t('Welcome to Scratch')
                              .append(element("span").t(calcSmallest(new Date(Date.parse(a.datetime_created))))));
                    break;
                default:
                    console.warn(a, "Not Found");
            }
        }
        let happening = document.getElementsByClassName("box activity")[0];
        happening.childNodes[0].childNodes[0].innerHTML = "Messages";
        happening.childNodes[1].childNodes[0].style.display = "none";
        ul.a("id", "messages").ap(happening.childNodes[1]);

        set_unread(users);
    }

    function set_unread (user) {
        if (user.has_messages) {
            let x = new XMLHttpRequest();
            x.onreadystatechange = () => {
                if (x.readyState == 4 && x.status == 200) {
                    let count = JSON.parse(x.responseText).count;
                    let messages = document.getElementById("messages").getElementsByTagName("li");
                    for (let i = 0; i < count; i++) {
                        if (GM_getValue("theme", false) === "dark") {
                            messages[i].setAttribute("style", "background-color: #36393f; opacity: 1;");
                        } else {
                            messages[i].setAttribute("style", "background-color: #eed; opacity: 1;");
                        }

                    }
                }
            };
            x.open("GET", "https://api.scratch.mit.edu/users/"+user.username+"/messages/count", true);
            x.send();
        }
    }

    function load_userinfo () {
        if (document.getElementsByTagName("a").length !== 0) {
            let userlinks = false;
            userinfo = GM_getValue("user", {});
            console.log("New profile loader");
            let links = document.getElementsByTagName("a");
            for (let a of links) {
                if (a.hasAttribute("href") && a.getAttribute("href").includes("/users/")) {
                    userlinks = true;
                    if (!users.includes(a.getAttribute("href")) && !userinfo.hasOwnProperty(a.getAttribute("href"))) {
                        users.push(a.getAttribute("href"));
                        console.log("load new user info");
                    }
                }
            }

            userinfo.fulllength = users.length;
            userinfo.length = 0;
            if (!userlinks) {
                console.log("No user links");
            } else if (users.length === 0) {
                set_userinfo(links);
            } else {
                for (let i = 0; i < users.length; i++) {
                    let xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = () => {
                        if (xhttp.status == 200 && xhttp.readyState == 4) {
                            userinfo.length += 1;
                            userinfo[String(users[i])] = JSON.parse(xhttp.responseText);
                            if (userinfo.fulllength === userinfo.length) {
                                set_userinfo(links);
                            }
                        }
                    };
                    let string = users[i];
                    if (users[i].lastIndexOf("/") + 1 === users[i].length) {
                        string = string.slice(0, -1);
                    }
                    if (users[i].includes("https://scratch.mit.edu/users/") || users[i].includes("http://scratch.mit.edu/users/")) {
                        xhttp.open("GET", "https://api.scratch.mit.edu/users/" + string.substring(string.indexOf("/users/") + 7), true);
                    } else  {
                        xhttp.open("GET", "https://api.scratch.mit.edu" + string, true);
                    }
                    xhttp.send(null);
                }
            }
        }
    }

    function set_userinfo (links) {
        GM_setValue("user", userinfo);
        //run final code here
        for (let a of links) {
            if (userinfo.hasOwnProperty(a.getAttribute("href")) && !a.getAttribute("href").includes(GM_getValue("username", ""))) {
                a.addEventListener("mouseenter", (event) => {
                    let div = document.createElement("div");
                    div.setAttribute("class", "userwindow");
                    if (GM_getValue("theme", false) === "dark") {
                        div.setAttribute("style", "position: absolute; left: "+ event.pageX +"px; top: "+ (event.pageY + 10) +"px; width: inherit; height: 20px; background-color: #000;");
                    } else {
                        div.setAttribute("style", "position: absolute; left: "+ event.pageX +"px; top: "+ (event.pageY + 10) +"px; width: inherit; height: 20px; background-color: white;");
                    }
                    let info = userinfo[a.getAttribute("href")];
                    let date = new Date(Date.parse(info.history.joined));
                    let dif = calcDate(new Date(), date);
                    div.appendChild(document.createTextNode(info.username + " joined " + dif +" from " + info.profile.country));
                    document.body.appendChild(div);
                }, false);
                a.addEventListener("mouseleave", (event) => {
                    if (document.body.getElementsByClassName("userwindow")[0] !== null) {
                        document.body.removeChild(document.body.getElementsByClassName("userwindow")[0]);
                    }
                }, false);
            }
        }
        console.log("Finished user info");
    }

    function calcDate(date1,date2) {
        let diff = Math.floor(date1.getTime() - date2.getTime());
        let day = 1000 * 60 * 60 * 24;
        let months = Math.ceil(Math.floor(diff/day)/31);
        let years = Math.floor(months/12);
        months -= years * 12;
        let message = "";
        if (years > 0) {
            if (years == 1) {
                message += "1 year";
            } else {
                message += years + " years";
            }
            if (months > 0) {
                message += ", "
            }
        }
        if (months > 0) {
            if (months == 1) {
                message += "1 month";
            } else {
                message += months + " months";
            }
        } else if (years == 0) {
            message += "1 month";
        }

        message += " ago";
        return message;
    }

    function calcSmallest(date2) {
        let date1 = new Date(), time, unit;
        if (date1.getFullYear() == date2.getFullYear()) {
            if (date1.getMonth() == date2.getMonth()) {
                if (date1.getDate() == date2.getDate()) {
                    if (date1.getHours() == date2.getHours()) {
                        time = date1.getMinutes() - date2.getMinutes();
                        unit = " minute";
                    } else {
                        time = date1.getHours() - date2.getHours();
                        unit = " hour";
                    }
                } else {
                    time = date1.getDate() - date2.getDate();
                    unit = " day";
                }
            } else {
                time = date1.getMonth() - date2.getMonth();
                unit = " month";
            }
        } else {
            time = date1.getFullYear() - date2.getFullYear();
            unit = " year";
        }
        if (time == 1) {
            return " " + time + unit + " ago"; 
        } else {
            return " " + time + unit + "s ago";
        }

    }
    //adds scratchblockcode load support
    function load_scratchblockcode () {
        if (GM_getValue("blockCode", true)) {
            if (document.getElementsByClassName("blocks")[0] !== null) {
                let blocks = [], blocks1 = [], blocks2 = [], blocks3 = [];
                console.log("contains scratch blocks");
                let xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = () => {
                    if (xhttp.status == 200 && xhttp.readyState == 4) {
                        let doc = xhttp.responseXML;
                        //only do the elements in post body html
                        let posts = document.getElementsByClassName("post_body_html");
                        let posts1 = doc.getElementsByClassName("post_body_html");
                        for (let a of posts) {
                            if (a.getElementsByClassName("blocks") !== null) {
                                for (let l = 0; l < a.getElementsByClassName("blocks").length; l++) {
                                    blocks.push(a.getElementsByClassName("blocks")[l]);
                                }
                            }
                        }
                        for (let a of posts1) {
                            if (a.getElementsByClassName("blocks") !== null) {
                                for (let l = 0; l < a.getElementsByClassName("blocks").length; l++) {
                                    blocks1.push(a.getElementsByClassName("blocks")[l]);
                                }
                            }
                        }
                        if (blocks.length > 0) {
                            for (let i = 0; i < blocks1.length; i++) {
                                blocks[i].setAttribute("id", i);
                                blocks[i].addEventListener("click", (event) => {
                                    let target = event.currentTarget;
                                    target.parentElement.replaceChild(blocks1[target.id], blocks[target.id]);
                                }, false);
                            }
                        }
                        //do elements for signatures
                        posts = document.getElementsByClassName("postsignature");
                        posts1 = doc.getElementsByClassName("postsignature");
                        for (let a of posts) {
                            if (a.getElementsByClassName("blocks") !== null) {
                                for (let l = 0; l < a.getElementsByClassName("blocks").length; l++) {
                                    blocks2.push(a.getElementsByClassName("blocks")[l]);
                                }
                            }
                        }
                        for (let a of posts1) {
                            if (a.getElementsByClassName("blocks") !== null) {
                                for (let l = 0; l < a.getElementsByClassName("blocks").length; l++) {
                                    blocks3.push(a.getElementsByClassName("blocks")[l]);
                                }
                            }
                        }
                        if (blocks2.length > 0) {
                            for (let i = 0; i < blocks3.length; i++) {
                                blocks2[i].setAttribute("id", i);
                                blocks2[i].addEventListener("click", (event) => {
                                    let target = event.currentTarget;
                                    target.parentElement.replaceChild(blocks3[target.id], blocks2[target.id]);
                                }, false);
                            }
                        }
                        console.log("Finished ScratchBlocks");
                    }
                };
                xhttp.open("GET", url, true);
                xhttp.responseType = "document";
                xhttp.send(null);
            }
        }
    }

    function load_bbcode () {
        console.log("load bbcode");
        let bbarr = [];
        let posts = document.getElementsByClassName("blockpost");
        for (let a of posts) {
            bbarr.push(load_mcode({
                url: a.getElementsByClassName("box-head")[0].getElementsByTagName("a")[0].getAttribute("href"),
                index: posts[bbarr.length]
            }));
        }
        Promise.all(bbarr)
            .then((post) => {
            post.forEach ((post) => {
                let current = post.index.getElementsByClassName("post_body_html")[0].innerHTML;
                element("button").a("style", "height: 15px; line-height: 14px;").t("BBCode")
                    .e("click", (event) => {
                    if (event.currentTarget.innerHTML === "BBCode") {
                        post.index.getElementsByClassName("post_body_html")[0].innerText = post.response;
                        event.currentTarget.innerHTML = "Original";
                    } else {
                        post.index.getElementsByClassName("post_body_html")[0].innerHTML = current;
                        event.currentTarget.innerHTML = "BBCode";
                    }
                })
                    .ap(post.index.getElementsByClassName("box-head")[0]);
            });
        })
            .catch(error => console.warn(error));
    }
    //using promises
    function load_mcode (post) {
        return new Promise((resolve, reject) => {
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = () => {
                if (xhttp.status == 200 && xhttp.readyState == 4) {
                    post.response = xhttp.responseText;
                    resolve(post);
                }
            };
            xhttp.onerror = (error) => {
                reject("Error loading BBCode"+error);
            };
            xhttp.open("GET", "https://scratch.mit.edu" + post.url + "source/", true);
            xhttp.send(null);
        });
    }
    //enlarging images on scratch
    function load_images () {
        console.log("load images");

        GM_addStyle("#display_img {position: fixed; left: 0px; top: 51px; opacity: 0.6; background-color: #000; width: 100%; height: calc(100% - 51px); display: none;} #display_img_img {height: 100%; max-width: 100%;} .postright img {cursor: zoom-in;}");
        //adds the faded background
        let div = document.createElement("div");
        div.setAttribute("id", "display_img");
        document.getElementById("pagewrapper").appendChild(div);

        let div1 = document.createElement("div");
        div1.setAttribute("style", "position: fixed; left: 0px; top: 52px; width: 100%; height: calc(100% - 52px); text-align: center; display: none; cursor: zoom-out;");
        let img = document.createElement("img");
        img.setAttribute("src", "");
        img.setAttribute("id", "display_img_img");
        div1.appendChild(img);
        document.getElementById("pagewrapper").appendChild(div1);
        div1.addEventListener("click", (event) => {
            div.style.display = "none";
            div1.style.display = "none";
        });

        let posts = document.getElementsByClassName("postright");
        for (let a of posts) {
            let imgs = a.getElementsByTagName("img");
            for (let b of imgs) {
                b.addEventListener("click", (event) => {
                    img.setAttribute("src", event.currentTarget.src);
                    div.style.display = "block";
                    div1.style.display = "block";
                });
            }
        }
    }

    function timer () {
        let event = new Date("Oct 31, 2017").getTime();
        let span = element("span").a("style", "float: right; color: #f6660d;").t("Halloween").dom;
        let load = setInterval(() => {
            if (document.getElementsByClassName("box-header")[0] != null) {
                document.getElementsByClassName("box-header")[0].appendChild(span);
                let x = setInterval(() => {
                    let distance = event - new Date().getTime();

                    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

                    span.innerHTML = days + "d " + hours + "h "+ minutes + "m " + seconds + "s 'til Halloween";
                    if (distance < 0) {
                        clearInterval(x);
                        if (days <= -2) {
                            span.parentElement.removeChild(span);
                        } else {
                            span.innerHTML = "Its Halloween";
                        }
                    }
                });
                clearInterval(load);
            }
        }, 1000);
    }

    function create_falling(link, img, extreme, cursor = null, audio = false) {
        if (url == link) {
            let we = [];
            let leaves = function (i) {
                this.x = Math.random() * 90;
                this.y = Math.random() * 90;
                this.z = Math.random() * 90;
                this.px = Math.random() * window.innerWidth;
                this.py = 40 * Math.random() * -1;
                this.r = true;
                this.index = i;

                this.img = document.createElement("img");
                this.img.src = img[Math.floor(Math.random() * img.length)];
                this.img.setAttribute("style", "position: absolute; width: 25px; height: 25px; left: "+this.px+"px; top:"+this.py+"px;");
                document.body.appendChild(this.img);
                this.render = () => {
                    if (this.py > window.innerHeight) {
                        this.r = false;
                        document.body.removeChild(this.img);
                    }
                    this.x += Math.random() * 0.5;
                    this.y += Math.random() * 0.5;
                    this.z += Math.random() * 0.5;
                    this.py += Math.random() * 0.5;
                    this.img.setAttribute("style", "position: fixed; index: -1; width: 25px; height: 25px; left: "+this.px+"px; top:"+this.py+"px; transform: rotateX("+this.x+"deg) rotateY("+this.y+"deg) rotateZ("+this.z+"deg);");

                };
            };
            let create = true;
            window.addEventListener("blur", () => {
                create = false;
            });
            window.addEventListener("focus", () => {
                create = true;
            });
            setInterval(() => {
                if (create) {
                    for (let i = 0; i < 5; i++) {
                        we.push(new leaves(we.length));
                    }
                }
            }, 1000);
            setInterval(() => {
                we.forEach((a) => {
                    if (a.r) {
                        a.render();
                    }
                });
            }, 1);

            if (extreme) {
                if (audio) {
                    let d = new Audio(audio);
                    d.play();
                    d.addEventListener("ended", () => {
                        d.play();
                    });
                }
                GM_addStyle("body,a:-webkit-any-link{cursor:url("+cursor+"),auto;cursor:url("+cursor+"),pointer;}#pagewrapper{background:linear-gradient(top,#ff3232 0,#fcf528 16%,#28fc28 32%,#28fcf8 50%,#272ef9 66%,#ff28fb 82%,#ff3232 100%);background:-moz-linear-gradient(top,#ff3232 0,#fcf528 16%,#28fc28 32%,#28fcf8 50%,#272ef9 66%,#ff28fb 82%,#ff3232 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%,#ff3232),color-stop(16%,#fcf528),color-stop(32%,#28fc28),color-stop(50%,#28fcf8),color-stop(66%,#272ef9),color-stop(82%,#ff28fb),color-stop(100%,#ff3232));background:-webkit-linear-gradient(top,#ff3232 0,#fcf528 16%,#28fc28 32%,#28fcf8 50%,#272ef9 66%,#ff28fb 82%,#ff3232 100%);background-size:1000%;-moz-background-size:1000%;-webkit-background-size:1000%;animation-name:fun-time-awesome;animation-duration:15s;animation-timing-function:linear;animation-iteration-count:infinite;animation-direction:alternate;animation-play-state:running;-moz-animation-name:fun-time-awesome;-moz-animation-duration:15s;-moz-animation-timing-function:linear;-moz-animation-iteration-count:infinite;-moz-animation-direction:alternate;-moz-animation-play-state:running;-webkit-animation-name:fun-time-awesome;-webkit-animation-duration:20s;-webkit-animation-timing-function:linear;-webkit-animation-iteration-count:infinite;-webkit-animation-direction:alternate;-webkit-animation-play-state:running}@keyframes fun-time-awesome{0%{background-position:left top}100%{background-position:left bottom}}@-moz-keyframes fun-time-awesome{0%{background-position:left top}100%{background-position:left bottom}}@-webkit-keyframes fun-time-awesome{0%{background-position:left top}100%{background-position:left bottom}}");
            }
        }
    }

    function load_extras () {
        if (GM_getValue("extras", true)) {
            create_falling("https://scratch.mit.edu/", ["https://fthmb.tqn.com/Gp0yG59mcxZVY8ZDqzxd8rUy18k=/768x0/filters:no_upscale()/fall-leaves-57a8aa143df78cf4590d2362.png"], false);
            create_falling("https://scratch.mit.edu/users/DeleteThisAcount/", ["http://scriftj.x10host.com/2aa.png"], true, "http://i.cubeupload.com/gIEPOl.png", "http://scriftj.x10host.com/Vaporwave.mp3");
            //create_falling("https://scratch.mit.edu/users/DeleteThisAcount/", ["http://scriftj.x10host.com/2aa.png"], true, "http://i.cubeupload.com/gIEPOl.png", "http://scriftj.x10host.com/Vaporwave.mp3");
        }
        if (GM_getValue("timer", true)) {
            timer();
        }
    }

    function element (name) {
        return new _element(name);
    }
    class _element {
        constructor (name) {
            this.dom = document.createElement(name);
        }
        a (name, value) {
            this.dom.setAttribute(name, value);
            return this;
        }
        t (text) {
            this.dom.appendChild(document.createTextNode(text));
            return this;
        }
        e (trigger, callback) {
            this.dom.addEventListener(trigger, callback);
            return this;
        }
        append (element2) {
            this.dom.appendChild(element2.dom);
            return this;
        }
        ap (dom) {
            dom.appendChild(this.dom);
            return dom;
        }
        apthis (dom) {
            dom.appendChild(this.dom);
            return this.dom;
        }
        o (options, selected) {
            for (let a in options) {
                if (options.hasOwnProperty(a)) {
                    console.log(a, options[a]);
                    let b = document.createElement("option");
                    b.setAttribute("value", a);
                    b.appendChild(document.createTextNode(options[a]));
                    if (selected == a) {
                        b.setAttribute("selected", true);
                    }
                    this.dom.appendChild(b);
                } 
            }
            return this;
        }
    }
})();
