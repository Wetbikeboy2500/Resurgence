/*
MIT License

Copyright (c) 2018 Matt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
// ==UserScript==
// @name         ResurgenceUserscript
// @namespace    http://tampermonkey.net/
// @version      11
// @description  Tries to fix and improve certain aspects of Scratch
// @author       Wetbikeboy2500
// @match        https://scratch.mit.edu/*
// @match        https://projects.scratch.mit.edu/resurgence
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/2.5.0/jszip.min.js
// @require      https://cdn.rawgit.com/Stuk/jszip-utils/dfdd631c4249bc495d0c335727ee547702812aa5/dist/jszip-utils.min.js
// @require      https://raw.githubusercontent.com/pawelgrzybek/siema/master/dist/siema.min.js
// @require      https://cdn.jsdelivr.net/npm/vanilla-lazyload@10.19.0/dist/lazyload.min.js
// @resource     CSS https://raw.githubusercontent.com/Wetbikeboy2500/ScratchFixer/master/style.min.css
// @resource     CSSlight https://raw.githubusercontent.com/Wetbikeboy2500/ScratchFixer/master/style_light.min.css
// @resource     Modal http://localhost/Wetbikeboy2500/ScratchFixer/master/modal.html
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @updateURL    https://raw.githubusercontent.com/Wetbikeboy2500/ScratchFixer/master/ScratchFixer.user.js
// @run-at       document-start
// ==/UserScript==
(function () {
    'use strict';
    let url = location.protocol + '//' + location.host + location.pathname, users = [], userinfo = {}, style = null, style1 = null, currentVersion = GM_info.script.version, pageType = "", accountInfo = {}, themeTweakStyle = null;
    const getCookie = (cname) => {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };
    if (url.includes("projects.scratch.mit.edu/resurgence")) {
        //this is for when the userscipt loads in the different domain
        let projectId;
        const message = GM_getValue("Message", {});

        if (message) {
            let project = {
                "objName": "Stage",
                "costumes": [{
                    "costumeName": "backdrop1",
                    "baseLayerID": 1,
                    "baseLayerMD5": "b61b1077b0ea1931abee9dbbfa7903ff.png",
                    "bitmapResolution": 2,
                    "rotationCenterX": 480,
                    "rotationCenterY": 360
                }],
                "currentCostumeIndex": 0,
                "penLayerMD5": "5c81a336fab8be57adc039a8a2b33ca9.png",
                "penLayerID": 0,
                "tempoBPM": 60,
                "videoAlpha": 0.5,
                "children": [],
                "info": {
                    "scriptCount": 0,
                    "projectID": "238315885",
                    "userAgent": "Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/69.0.3497.12 Safari\/537.36",
                    "flashVersion": "WIN 30,0,0,149",
                    "spriteCount": 0,
                    "swfVersion": "v461",
                    "message": encodeURIComponent(message),
                    "videoOn": false
                }
            };

            let iteration = 0;
            let loadData = () => {
                //have a project to save the data in set
                projectId = GM_getValue("saveID", false);

                fetch("https://projects.scratch.mit.edu/internalapi/project/" + projectId + "/set/", {
                    method: "POST",
                    body: JSON.stringify(project),
                    headers: {
                        'Content-Type': 'application/json',
                        'scratchcsrftoken': getCookie("scratchcsrftoken"),
                        "X-Requested-With": 'ShockwaveFlash/31.0.0.108',
                    }
                })
                    .then(response => response.json())
                    .then(response => {
                        console.log('Success:', JSON.stringify(response));
                        window.close();
                    })
                    .catch(error => console.error('Error:', error));
            }, createNewSave = () => {
                console.log("create new");
                //creates a new project with the data already saved
                fetch("https://projects.scratch.mit.edu/internalapi/project/new/set/?title=dataSaverResurgence", {
                    method: "POST",
                    body: JSON.stringify(project),
                    headers: {
                        'Content-Type': 'application/json',
                        'scratchcsrftoken': getCookie("scratchcsrftoken"),
                        "X-Requested-With": 'ShockwaveFlash/31.0.0.108',
                    }
                })
                    .then(response => response.json())
                    .then(response => {
                        console.log('Success:', JSON.stringify(response));
                        GM_setValue("saveID", response["content-name"]);
                        loadData();
                    })
                    .catch(error => console.error('Error:', error));
            }, getProjects = () => {
                fetch("https://api.scratch.mit.edu/users/Wetbikeboy2500/projects/?limit=40&offset=" + iteration * 40)
                    .then(response => response.json())
                    .then(response => {
                        for (let a of response) {
                            console.log(a.title);
                            if (a.title.includes("dataSaverResurgence")) {
                                console.log("found project");
                                GM_setValue("saveID", a.id);
                                loadData();
                                break;
                            }
                        }
                        if (response.length == 40) {
                            iteration++;
                            getProjects();
                        } else {
                            createNewSave();
                        }
                    })
                    .catch(error => console.error('Error:', error));
            };

            if (GM_getValue("saveID", false)) {
                loadData();
            } else {
                getProjects();
            }
        } else {
            console.log("no message", GM_getValue("Message"));
        }
    } else if (inIframe() === false) {
        //adds my css to edit custom elements
        if (GM_getValue("theme", false) === "dark") {
            style1 = GM_addStyle(GM_getResourceText("CSS"));
        } else {
            GM_addStyle("#res-set > a {color: #fff} .box{background-color: #fff}}");
        }
        document.addEventListener("DOMContentLoaded", () => {
            load_account();
            load_userinfo();
            if (url == "https://scratch.mit.edu/" && GM_getValue("bannerOff", false)) {
                GM_addStyle(".title-banner{display:none;}");
            }
            if (url.includes("discuss") && url.includes("/topic")) {
                load_custombb();
                load_images();
                load_scratchblockcode();
                load_bbcode();
                add_bbbuttons();
            }
            if (url.includes("https://scratch.mit.edu/messages") && GM_getValue("messageTheme", false)) {
                GM_addStyle(`.messages-social {width: 700px; right: 446.5px; left: 235.5px; position: relative; border: 0.5px solid #F0F0F0; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; background-color: #F2F2F2; } .messages-header {font-size: 24px; padding-left: 10px;} select[name="messages.filter"] {right: 720px; top: 20px; font-size: 24px; position: relative; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; background-color: #F2F2F2; visibility: visible;} #___gcse_0 {display: none;} .messages-details {margin-top: 40px;} .mod-messages {visibility: hidden; height: 0px; padding: 0px; margin: 0px;} .messages-social-loadmore {width: calc(100% - 20px);}`);
            }
            if (url == "https://scratch.mit.edu/discuss/" || url == "https://scratch.mit.edu/discuss/#") {
                GM_addStyle(".forumicon {display: none;} td .tclcon {margin: 0px;} #idx1 > .box .box-head > h4 {width: 100%;} #djangobbwrap .box-head h4 {margin-left: 0px;}");//fixes style left by icons that don't exsist and the expand and retract icons are to the left of the forum
                load_draft();
            }
            let styleTip = 'span[style="color:reslarge"] {font-weight:bold; font-size:30px;} .postsignature {overflow: auto;} .ideas a span { display: none; position: absolute; } .ideas a:after { content: "' + GM_getValue("forumTitle", "Forums") + '"; visibility: visible; position: static; } .phosphorus { margin-left: 14px; margin-right: 14px; margin-top: 16px; } .my_select {height: 34px; line-height: 34px; vertical-align: middle; margin: 3px 0px 3px 0px; width: 110px;}';
            styleTip += `.svg-icon {width: 20px;height: 20px;}.svg-icon path,.svg-icon polygon,.svg-icon rect {fill: #554747;}.svg-icon circle {stroke: #554747;stroke-width: 1;}`;//svg styling
            GM_addStyle(styleTip);
            dark_theme();
            fix_nav();
            load_messages();
            add_player();
            add_search();
            load_extras();
            load_banner();
            load_newpage();
            theme_tweaks();
        });
    }
    function fix_nav () {
        //fixes navbar and adds bottom page link
        if (document.getElementById("navigation")) {
            //new theme
            pageType = "new";
            document.querySelector(".ideas").childNodes[0].setAttribute("href", "/discuss");
            element("dd")
                .append(element("a").a("href", "/resurgence").t("Resurgence Userscript"))
                .ap(document.querySelector(".lists").querySelectorAll("dl")[1]);
        } else {
            //old theme
            pageType = "old";
            let tips = document.getElementsByClassName("site-nav")[0].childNodes[3].childNodes[0];
            tips.setAttribute("href", "/discuss");
            tips.innerHTML = GM_getValue("forumTitle", "Forums");
            element("li")
                .append(element("a").a("href", "/resurgence").t("Resurgence Userscript"))
                .ap(document.querySelector(".footer-col").childNodes[3].childNodes[3]);
        }
    }
    //this handles the processing of the messages by having a standard key paired with data
    function setData (key, data) {
        getData((e) => {
            GM_setValue("Message", e);
            const saveData = data => {
                GM_setValue("Message", data);
                window.open('https://projects.scratch.mit.edu/resurgence',
                    'newwindow',
                    'width=300,height=250');
            };

            let current = GM_getValue("Message", {});

            /*current = JSON.parse(current);

            if (current == false) {
                current = {};
            }*/

            current[key] = data;
            let button = element("button").a("style", "visibitity: hidden;").a("class", "savedata")
                .e("click", (e) => {
                    saveData(JSON.stringify(current));
                    e.currentTarget.parentElement.removeChild(document.querySelector(".savedata"));
                })
                .apthis(document.body);
            button.click();
        });

    }

    function getData (back) {
        let projectId = GM_getValue("saveID", false);
        console.log("saveID", projectId);
        if (projectId) {
            fetch("https://projects.scratch.mit.edu/internalapi/project/" + projectId + "/get/")
                .then(response => response.json())
                .then(response => {
                    back(JSON.parse(decodeURIComponent(response.info.message)));
                })
                .catch(error => console.error('Error:', error));
        } else {
            let iteration = 0;
            let getProjects = () => {
                fetch("https://api.scratch.mit.edu/users/Wetbikeboy2500/projects/?limit=40&offset=" + iteration * 40)
                    .then(response => response.json())
                    .then(response => {
                        for (let a of response) {
                            //console.log(a.title);
                            if (a.title.includes("dataSaverResurgence")) {
                                console.log("found project");
                                GM_getValue("saveID", a.id);
                                projectId = GM_getValue("saveID", "");
                                fetch("https://projects.scratch.mit.edu/internalapi/project/" + projectId + "/get/")
                                    .then(response => response.json())
                                    .then(response => {
                                        back(JSON.parse(decodeURIComponent(response.info.message)));
                                    })
                                    .catch(error => console.error('Error:', error));
                                break;
                            }
                        }
                        if (response.length == 40) {
                            iteration++;
                            getProjects();
                        } else {
                            back({});
                        }
                    })
                    .catch(error => console.error('Error:', error));
            };
            getProjects();

        }
    }

    function load_account () {
        fetch("https://scratch.mit.edu/session/", {
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(response => response.json())
            .then(response => {
                accountInfo = response;
            })
            .catch(error => console.error('Error:', error));
    }

    //these are changes to the theme that are preferences rather than necessary to the overall experience of the user
    function theme_tweaks () {
        if (GM_getValue("tweakTheme", false) && themeTweakStyle == null) {
            //removes borders on boxes which I think looks better
            themeTweakStyle = GM_addStyle(".box {border: 0px; box-shadow: 1px 1.5px 1px rgba(0, 0, 0, 0.12);}");

            if (url == "https://scratch.mit.edu/") {
                //changes how projects are cycled through with them no longer using the same theme
                let load = setInterval(() => {
                    if (document.querySelector(".splash-header")) {
                        clearInterval(load);

                        fetch("https://api.scratch.mit.edu/proxy/featured")
                            .then((response) => response.json())
                            .then((json) => {
                                //this will process the different categories that will be displayed on the main page of scratch
                                element("div").a({ "class": "box", "id": "featuredProjects" })
                                    .add("div").a("class", "box-header").addDom(svg("leftCircle", { "style": "float: left; cursor: pointer;" }, (e) => { siema.prev(5); })).add("h4").t("Featured Projects").a("style", "padding: 1.5px 10px 0px 10px; user-select: none;").f().addDom(svg("rightCircle", { "style": "cursor: pointer;" }, (e) => { siema.next(5); })).f()
                                    .add("div").a({ "class": "box-content", "id": "customfeatured", "style": "height: 160px;" }).f()
                                    .apAfter(".splash-header");

                                element("div").a({ "class": "box", "id": "featuredStudios" })
                                    .add("div").a("class", "box-header").addDom(svg("leftCircle", { "style": "float: left; cursor: pointer;" }, (e) => { siema1.prev(5); })).add("h4").t("Featured Studios").a("style", "padding: 1.5px 10px 0px 10px; user-select: none;").f().addDom(svg("rightCircle", { "style": "cursor: pointer;" }, (e) => { siema1.next(5); })).f()
                                    .add("div").a({ "class": "box-content", "id": "featuredStudiosContent", "style": "height: 130px;" }).f()
                                    .apAfter("#featuredProjects");

                                element("div").a({ "class": "box", "id": "curatedProjects" })
                                    .add("div").a("class", "box-header").addDom(svg("leftCircle", { "style": "float: left; cursor: pointer;" }, (e) => { siema.prev(5); })).add("h4").t(`Projects Curated by ${json["curator_top_projects"][0]["curator_name"]}`).a("style", "padding: 1.5px 10px 0px 10px; user-select: none;").f().addDom(svg("rightCircle", { "style": "cursor: pointer;" }, (e) => { siema.next(5); })).f()
                                    .add("div").a({ "class": "box-content", "id": "customCuratedProjects", "style": "height: 160px;" }).f()
                                    .apAfter(".splash-header");

                                for (let a in json) {
                                    console.log(a, json[a]);
                                }

                                //add a container for these so they can pop out and still fill the screen ans see them
                                json["community_featured_projects"].forEach((a) => {
                                    element("div").a({ "style": "width: 156px; box-shadow: 1px 1.5px 1px rgba(0, 0, 0, 0.12); margin-left: -5px;" })
                                        .add("div").a({ "style": "width: 146px; height: 150px; padding: 5px;" })
                                        .add("a").a("href", `/projects/${a["id"]}/`)
                                        .add("img").a({ "data-src": a["thumbnail_url"], "alt": "...", "style": "width: 156px; height: 115px; position: relative; bottom: 5px; right: 5px; cursor: pointer;", "class": "lazy" }).f()
                                        .f()
                                        .add("a").t(a["title"]).a({ "href": `/projects/${a["id"]}/`, "title": a["title"], "style": "width: 100%; overflow: hidden; display: inline-block; height: 25px; line-height: 25px; white-space: nowrap; position: relative; bottom: 9px; float: left;" }).f()
                                        .add("a").t(a["creator"]).a({ "href": `/users/${a["creator"]}/`, "title": a["creator"], "style": "max-width: 100%; overflow: hidden; display: inline-block; font-size: .8462em; height: 20px; line-height: 20px; white-space: nowrap; position: relative; bottom: 12px; " }).f()
                                        .f()
                                        .apthis(document.querySelector("#customfeatured"));
                                });

                                json["community_featured_studios"].forEach((a) => {
                                    element("div").a({ "style": "width: 170px; box-shadow: 1px 1.5px 1px rgba(0, 0, 0, 0.12); margin-left: -10px;" })
                                        .add("div").a({ "style": "width: 160px; height: 120px; padding: 5px;" })
                                        .add("a").a("href", `/studios/${a["id"]}/`)
                                        .add("img").a({ "data-src": a["thumbnail_url"], "alt": "...", "style": "width: 170px; height: 100px; position: relative; bottom: 5px; right: 5px; cursor: pointer;", "class": "lazy" }).f()
                                        .f()
                                        .add("a").t(a["title"]).a({ "href": `/studios/${a["id"]}/`, "title": a["title"], "style": "max-width: 100%; overflow: hidden; display: inline-block; height: 25px; line-height: 25px; white-space: nowrap; position: relative; bottom: 9px; float: left;" }).f()
                                        .f()
                                        .apthis(document.querySelector("#featuredStudiosContent"));
                                });

                                //lightweight carousel for projects
                                let siema = new Siema({
                                    selector: "#customfeatured",
                                    perPage: 5,
                                    loop: false
                                });

                                let siema1 = new Siema({
                                    selector: "#featuredStudiosContent",
                                    perPage: 5,
                                    loop: false
                                })

                                //lazy loading for the images
                                let myLazyLoad = new LazyLoad({
                                    elements_selector: ".lazy"
                                });


                            })
                            .catch((e) => {
                                console.warn("An error occured in theme tweaks in fetch", e);
                            });
                    }
                }, 100);
            }

        } else if (themeTweakStyle) {
            themeTweakStyle.parentElement.removeChild(themeTweakStyle);
            themeTweakStyle = null;
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
                if (GM_getValue("extras", true)) {
                    $("#extrasIO").prop('checked', "checked");
                }
                if (GM_getValue("msg", true)) {
                    $("#msgIO").prop('checked', "checked");
                }
                if (GM_getValue("timer", true)) {
                    $("#timerIO").prop('checked', "checked");
                }
                if (GM_getValue("blockCode", true)) {
                    $("#blocksIO").prop('checked', "checked");
                }
                if (GM_getValue("embedFeature", true)) {
                    $("#embedIO").prop('checked', "checked");
                }
                if (GM_getValue("bannerOff", true)) {
                    $("#bannerIO").prop('checked', "checked");
                }
                if (GM_getValue("messageTheme", false)) {
                    $("#messageThemeIO").prop("checked", "checked");
                }
                if (GM_getValue("tweakTheme", false)) {
                    $("#tweakThemeIO").prop("checked", "checked");
                }
                $("#playerIO").val(GM_getValue("player", "D"));
                $("#themeIO").val(GM_getValue("theme", "light"));
                $("#posIO").val(GM_getValue("pos", "top"));
                $("#disText").val(GM_getValue("forumTitle", "Forums"));
                displaySettingsModal = true;
            }
        };
        //adds popup settings modal
        GM_addStyle('.modal-hidden {display:none;} #res-set-modal {position:fixed; background-color:#00000000; width:40%; height:80%; border-radius:5px; outline:none; left:30%; top:10%; z-index: 9999; color: black !important; padding:20px; text-align:center;} #res-set-modal-back {position:fixed; width: 100%; height: 100%; background-color:#212121; left:0; top:0; z-index:9998; opacity:.5;}');
        $('body').append('<div id="res-set-modal" class="modal-hidden" tabindex="1">');
        $('#res-set-modal').append(GM_getResourceText("Modal"));//use resources instead of direct loading to avoid cors issues and changing of data location

        $('body').append('<div id="res-set-modal-back" class="modal-hidden">');
        $('#res-set-modal-back').click(toggleModal);
        //IO for sliders
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
        $(document).on("click", "#timerIO", (event) => {
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
        $(document).on("click", "#embedIO", (event) => {
            if (GM_getValue("embedFeature", true)) {
                GM_setValue("embedFeature", false);
            } else {
                GM_setValue("embedFeature", true);
            }
        });
        $(document).on("click", "#bannerIO", (event) => {
            if (GM_getValue("bannerOff", true)) {
                GM_setValue("bannerOff", false);
            } else {
                GM_setValue("bannerOff", true);
            }
        });
        $(document).on("click", "#messageThemeIO", (event) => {
            if (GM_getValue("messageTheme", true)) {
                GM_setValue("messageTheme", false);
            } else {
                GM_setValue("messageTheme", true);
            }
        });
        $(document).on("click", "#tweakThemeIO", (event) => {
            if (GM_getValue("tweakTheme", true)) {
                GM_setValue("tweakTheme", false);
            } else {
                GM_setValue("tweakTheme", true);
            }
            theme_tweaks();
        });
        $(document).on("change", "#playerIO", (event) => {
            console.log(document.getElementById("playerIO").value);
            GM_setValue("player", document.getElementById("playerIO").value);
        });
        $(document).on("change", "#disText", (event) => {
            GM_setValue("forumTitle", document.getElementById("disText").value);
        });
        $(document).on("change", "#themeIO", (event) => {
            GM_setValue("theme", document.getElementById("themeIO").value);
            dark_theme();
        });
        $(document).on("change", "#posIO", (event) => {
            GM_setValue("pos", document.getElementById("posIO").value);
        });
        if (pageType === "new") {
            let test = setInterval(() => {
                if (document.querySelector(".dropdown")) {
                    $('.divider').before('<li id="res-set"><a>Resurgence Settings');
                    $('#res-set').click(toggleModal);
                    clearInterval(test);
                }
            }, 1000);
        } else {
            let test = setInterval(() => {
                if (document.getElementById("logout")) {
                    $('#logout').before('<li id="res-set"><a>Resurgence Settings');
                    $('#res-set').click(toggleModal);
                    clearInterval(test);
                }
            }, 1000);
        }
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
            element("p").t("Resurgence Userscript (previously named ScratchFixer until NitroCipher suggested its current name) was originally going to be a chrome extension, but I ended up going with a userscript since it was going to be easier to update and change. The userscript started out by just adding the forums button, messages to the main page, and letting you use the Phosphorus player for projects. Since then, more features have been added to the userscript with more to come in the future.")
                .ap(main);
            element("p")
                .append(element("a").t("Click this to go to the forum post").a("href", "http://scriftj.x10host.com/ScratchBrowser/userscripts/resurgence.html"))
                .ap(main);
            element("p")
                .append(element("a").t("Click this to go to the Github repo").a("href", "https://github.com/Wetbikeboy2500/ScratchFixer"))
                .ap(main);

            element("h3").t("Features").ap(main);

            element("ul")
                .append(element("li").t("Forums tab instead of ideas tab"))
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
                .append(element("li").t("Add extras BBcode Features"))
                .append(element("li").t("Embed Featured projects on user page"))
                .append(element("li").t("Embed Gist content"))
                .ap(main);

            element("h3").t("Special Features/Extras").ap(main);

            element("Extras")
                .append(element("li").t("Holiday countdown timer"))
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

        //embeds users featured project
        if (GM_getValue("embedFeature", true)) {
            if (url.includes("/users/")) {
                var featProject = $("#featured-project").attr("href").substr(9);
                var projectPlayer = '<iframe allowtransparency="true" width="282" height="220" src="//scratch.mit.edu/projects/embed' + featProject + '?autostart=false" frameborder="0" allowfullscreen>';
                $("div.stage").replaceWith(projectPlayer);
                //alert(featProject);
            }
        }
    }
    function add_player () {
        //adds the different players using a dropdown menu
        if (url.includes("projects") && !url.includes("all") && !url.includes("search") && !url.includes("studios")) {
            let change = (a) => {
                if (document.querySelector(".phosphorus")) {
                    document.querySelector(".phosphorus").parentNode.removeChild(document.querySelector(".phosphorus"));
                } else {
                    document.getElementById("player").style = "display: none;";
                }
                switch (a) {
                    case "D":
                        document.getElementById("player").style = "display: block;";
                        break;
                    case "P":
                        element("script").a("src", "https://phosphorus.github.io/embed.js?id=" + document.getElementById("project").getAttribute("data-project-id") + "&auto-start=false&light-content=false")
                            .ap(document.getElementsByClassName("stage")[0]);
                        break;
                    case "S":
                        element("script").a("src", "https://sulfurous.aau.at/js/embed.js?id=" + document.getElementById("project").getAttribute("data-project-id") + "&resolution-x=480&resolution-y=360&auto-start=true&light-content=false")
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
            };
            console.log("Project page");
            element("select").a("class", "my_select").e("change", (event) => {
                change(document.getElementsByClassName("my_select")[0].value);
            }, false)
                .o({
                    D: "Default",
                    P: "Phosphorus",
                    S: "Sulfurous",
                    "S3": "Scratch 3"
                }, GM_getValue("player", "D"))
                .ap(document.querySelector("#share-bar") ? document.querySelectorAll(".buttons")[1] : document.querySelector(".buttons"));
            change(GM_getValue("player", "D"));

            //add download button to page
            element("button").a("class", "my_select").t("Download").e("click", (event) => {
                //first going to get project id
                let projectID = url.split("/")[url.split("/").indexOf("projects") + 1];

                download_project(projectID);

                //Welcome to my own scratch project downloader
                var costumes = [], sounds = [], status = 0;
                function download_project (id = 211651365, return_value = false) {
                    costumes = [];
                    sounds = [];
                    status = 0;
                    let xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = () => {
                        if (xhttp.readyState == 4 && xhttp.status == 200) {
                            let zip = new JSZip(), return_array = [];

                            console.log(xhttp.responseText);
                            let json = JSON.parse(xhttp.responseText);
                            console.log(json);
                            //I only need yo get the coustumes and sounds that is in the satge and in the sprite children
                            genenerate_sounds(json);
                            //this is the order so the ids are correct for the svg and png images
                            //pen layer
                            costumes.push(json["penLayerMD5"]);
                            json["penLayerID"] = 0;
                            //all sprites
                            json["children"].forEach((a, i) => { //all the sprites
                                return_array = get_costumes(a, costumes);
                                a = return_array[1];
                                costumes = return_array[0];
                            });
                            return_array = get_costumes(json, costumes); //all the backdrops
                            costumes = return_array[0];
                            json = return_array[1];


                            //updated way to deal with sounds that are in the json
                            return_array = genenerate_sounds(json);
                            json = return_array[0];
                            sounds = return_array[1];

                            let batch = [];
                            costumes.forEach((a) => {
                                batch.push(load_resource(a));
                            });
                            Promise.all(batch)
                                .then((assets) => {
                                    assets.forEach((a) => {
                                        if (a !== null) {
                                            zip.file(costumes.indexOf(a.name) + a.name.slice(a.name.indexOf("."), a.name.length), a.file, { binary: true });
                                            console.log(costumes.indexOf(a.name) + a.name.slice(a.name.indexOf("."), a.name.length));
                                        }

                                    });
                                    status++;
                                    if (status == 2) {
                                        generateSB2(zip, json, id, return_value);
                                    }
                                })
                                .catch((e) => {
                                    console.warn(e);
                                });

                            batch = [];
                            sounds.forEach((a) => {
                                batch.push(load_resource(a));
                            });
                            Promise.all(batch)
                                .then((assets) => {
                                    assets.forEach((a) => {
                                        if (a !== null) {
                                            zip.file(sounds.indexOf(a.name) + a.name.slice(a.name.indexOf("."), a.name.length), a.file, { binary: true });
                                            console.log(sounds.indexOf(a.name) + a.name.slice(a.name.indexOf("."), a.name.length));
                                        }
                                    });
                                    status++;
                                    if (status == 2) {
                                        generateSB2(zip, json, id, return_value);
                                    }
                                })
                                .catch((e) => {
                                    console.warn(e);
                                });
                        }
                    }
                    xhttp.open("GET", "https://projects.scratch.mit.edu/internalapi/project/" + id + "/get/?format=json", true);
                    xhttp.send();
                }

                function get_costumes (json, array) {
                    let total_sprites = array;
                    if (json.hasOwnProperty("costumes")) {
                        //go through each layer a sprite has and get the id and layer
                        json["costumes"].forEach((a, i) => {
                            if (total_sprites.includes(a["baseLayerMD5"]) == false) {
                                total_sprites.push(a["baseLayerMD5"]);
                            }
                        });
                        //go through each layer and set its id
                        json["costumes"].forEach((a, i) => {
                            a["baseLayerID"] = total_sprites.indexOf(a["baseLayerMD5"]);
                        });
                    }
                    return [total_sprites, json];
                }

                function load_resource (name) {
                    return new Promise((resolve, reject) => {
                        JSZipUtils.getBinaryContent("https://cdn.assets.scratch.mit.edu/internalapi/asset/" + name + "/get/", (err, data) => {
                            if (err) {
                                resolve(null);
                            } else {
                                resolve({
                                    name: name,
                                    file: data
                                });
                            }
                        });
                    });
                }

                function load_project_info (id) {
                    return new Promise((resolve, reject) => {
                        let xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = () => {
                            if (xhttp.readyState == 4 && xhttp.status == 200) {
                                let json = JSON.parse(xhttp.responseText);
                                resolve(json.title + ".sb2");

                            }
                        }
                        xhttp.onerror = () => {
                            resolve("Untitled.sb2");
                        }
                        xhttp.open("GET", "https://api.scratch.mit.edu/projects/" + id, true);
                        xhttp.send();
                    });
                }

                function genenerate_sounds (json) { //take in pure json
                    let sound_list = [];
                    json["children"].forEach((a, i) => { //then going to go through each child element
                        if (a.hasOwnProperty("sounds")) {
                            a["sounds"].forEach((a1, i1) => { //go through sounds of each child element
                                if (sound_list.indexOf(a1["md5"]) == -1) {
                                    sound_list.push(a1["md5"]);
                                }
                                //set the id of that element
                                json["children"][i]["sounds"][i1]["soundID"] = sound_list.indexOf(a1["md5"]);
                            });
                        }
                    });
                    //then going to go through the sounds of the stage
                    if (json.hasOwnProperty("sounds")) {
                        json["sounds"].forEach((a, i) => {
                            if (sound_list.indexOf(a["md5"]) == -1) {
                                sound_list.push(a["md5"]);
                            }
                            //set the id of that element
                            console.log(sound_list.indexOf(a["md5"]));
                            json["sounds"][i]["soundID"] = sound_list.indexOf(a["md5"]);
                        });
                    }
                    return [json, sound_list];
                }

                function generateSB2 (zip, json, id, return_value) {
                    //turn json into a string
                    zip.file("project.json", JSON.stringify(json));

                    //generate final file
                    let sb2 = zip.generate({ type: "blob" });

                    load_project_info(id)
                        .then((a) => {
                            if (return_value == false) {
                                save(sb2, a);
                            } else {
                                save(sb2, a);
                                _generate_offline(sb2);
                            }
                        });
                }

                function save (file, name) {
                    let a = document.createElement("a");
                    a.setAttribute("download", name);
                    a.setAttribute("href", window.URL.createObjectURL(file));
                    document.body.appendChild(a);
                    a.addEventListener("click", () => {
                        document.body.removeChild(a);
                    });
                    a.click();
                }
            }).ap(document.getElementsByClassName("stats")[0]);
            document.getElementsByClassName("stats")[0].getElementsByClassName("last")[0].setAttribute("style", "padding: 5px 15px; border-right: 1px solid #bbb;");
            document.getElementsByClassName("stats")[0].getElementsByClassName("last")[0].getElementsByTagName("a")[0].setAttribute("style", "margin: -7px;");
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
        if (style !== null) { //remove any styles that are already in use
            style.parentElement.removeChild(style);
            if (style1 !== null) {
                style1.parentElement.removeChild(style1);
            }
            style = null;
        }
        if (GM_getValue("theme", false) === "dark") {
            //want dark theme
            style = GM_addStyle(GM_getResourceText("CSS"));
        } else if (GM_getValue("theme", false) === "newLight") {
            style = GM_addStyle(GM_getResourceText("CSSlight"));
        }
    }
    let messages = {
        //this should instead see if the newest messgae equals our newesst message
        check_unread: (user) => {
            return new Promise((resolve, reject) => {
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
                r.open("GET", "https://api.scratch.mit.edu/users/" + user.username + "/messages?limit=1&offset=0", true);
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
                    xhttp.open("GET", "https://api.scratch.mit.edu/users/" + user.username + "/messages?limit=40&offset=0", true);
                    xhttp.setRequestHeader("X-Token", user.token);
                    xhttp.send(null);
                } else { //load form presave
                    user.messages = GM_getValue("message", {});
                    resolve(user);
                }
            });
        }
    };

    //custom banner to display information that the user may want
    function load_banner () {
        if (url == "https://scratch.mit.edu/" && GM_getValue("pos", "top") != "none") {//on main page
            console.log("loading banner");
            let newsUpdatesExpanded = false;

            let svgCircle = svg("downCircle");
            svgCircle.setAttribute("style", "width: 20px; height: 20px; vertical-align: middle; padding-bottom: 2px;");
            svgCircle.setAttribute("id", "expandCollapse");

            //this displays the new changes that I made to element creation(the old stuff still works but is obsolete to this)
            let box = element("div").a("class", "box")
                .add("div").a("class", "box-header")
                .add("h4").t("Resurgence Userscript Info").f()
                .add("p").add("a").a("href", "https://github.com/Wetbikeboy2500/Resurgence").t("Resurgence Github").f().f()
                .f()

                .add("div").a("class", "box-content")
                .add("p").t("Current Version: " + currentVersion).a("style", "margin: 0px;").f()
                .add("p").a("style", "margin: 0;").t("Recent Version:").a("id", "recent_version").f()
                .f()
                .add("div").a({ "class": "box-content", "style": "padding: 0px; border-top: 1px solid #d9d9d9; text-align: center; user-select: none; cursor: pointer;" })
                .add("div").a({ "id": "newsUpdates", "style": "height: 0px; overflow: hidden;" })
                .add("div").a({ "style": "text-align: left; user-select: text; cursor: auto; border-bottom: 1px solid #d9d9d9; padding: 0px 20px 10px 20px; overflow: hidden;" })
                .add("h3").a("style", "margin: 0px; text-align: center;").t("Updates and News").f()
                .add("p").a("style", "margin: 0px;").t("Updates:").f()
                .add("ul").a("style", "margin: 0px;")
                .add("li").t("Change #1").a("style", "margin: 0px;").f()
                .f().f().f()
                .add("p").t("Read More").a("style", "margin: 0px; font-size: 15px; line-height: 20px; margin-top: 2px;").addDom(svgCircle)
                .e("click", (e) => {
                    if (!newsUpdatesExpanded) {
                        newsUpdatesExpanded = true;
                        let svgCircleUp = svg("upCircle");
                        svgCircleUp.setAttribute("style", "width: 20px; height: 20px; vertical-align: middle; padding-bottom: 2px;");
                        svgCircleUp.setAttribute("id", "expandCollapse");
                        document.querySelector("#expandCollapse").parentElement.replaceChild(svgCircleUp, document.querySelector("#expandCollapse"));

                        let target = document.querySelector("#newsUpdates");
                        target.style.borderBottom = "1px solid #d9d9d9";
                        target.style.display = "block";
                        const height = calculate_height_children(target);
                        let currentHeight = 0;
                        let interval = height * (10 / 500);
                        let time = setInterval(() => {
                            if (currentHeight >= height) {
                                clearInterval(time);
                                currentHeight = height;
                            } else {
                                currentHeight += interval;
                            }
                            target.style.height = currentHeight + "px";
                        }, 10);
                    } else {
                        newsUpdatesExpanded = false;
                        collapse_full(10, document.querySelector("#newsUpdates"), 500);
                        document.querySelector("#expandCollapse").parentElement.replaceChild(svgCircle, document.querySelector("#expandCollapse"));
                    }
                }).f()
                .f();
            if (GM_getValue("pos", "top") == "top") {
                document.getElementsByClassName("mod-splash")[0].insertBefore(box.dom, document.getElementsByClassName("mod-splash")[0].children[0]);
            } else {
                box.apthis(document.getElementsByClassName("mod-splash")[0]);
            }

            //gets the current version of the code from the github page
            fetch("https://raw.githubusercontent.com/Wetbikeboy2500/Resurgence/master/ScratchFixer.user.js")
                .then((response) => { return response.text() })
                .then((text) => {
                    const version = text.substring(text.indexOf("@version") + 9, text.indexOf("// @description") - 1);
                    let tmpVersion = Number(version);
                    if (tmpVersion != currentVersion) {
                        if (tmpVersion < GM_info.script.version) {
                            document.getElementById("recent_version").innerHTML = "Recent Version: " + version + " ";
                            element("a").a("href", "https://raw.githubusercontent.com/Wetbikeboy2500/Resurgence/master/ScratchFixer.user.js").t("Downgrade (Your version is too revolutionary)").apthis(document.getElementById("recent_version"));
                        } else {
                            document.getElementById("recent_version").innerHTML = "Recent Version: " + version + " ";
                            element("a").a("href", "https://raw.githubusercontent.com/Wetbikeboy2500/Resurgence/master/ScratchFixer.user.js").t("Update").apthis(document.getElementById("recent_version"));
                        }
                    } else {
                        document.getElementById("recent_version").innerHTML = "Recent Version: " + version;
                    }
                })
                .catch((e) => {
                    console.warn("An error occured while getting the version", e);
                });
        }
    }

    function load_messages () {
        if (url == "https://scratch.mit.edu/" && GM_getValue("msg", true)) {
            let load = setInterval(() => {
                if (document.querySelector(".activity") && accountInfo.hasOwnProperty("user")) {
                    clearInterval(load);
                    messages.check_unread({ token: accountInfo.user.token, username: accountInfo.user.username })
                        .then(user => messages.get_message(user))
                        .then(user => load_message(user))
                        .catch((error) => console.warn(error));
                }
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
        let ul = element("ul").a("id", "messages")
        for (let a of html) {
            let timePassed = calcSmallest(new Date(Date.parse(a.datetime_created)));
            switch (a.type) {
                case "forumpost":
                    ul.add("li")
                        .add("span").t("There are new posts in the forum: ").f()
                        .add("a").t(a.topic_title).a("href", "/discuss/topic/" + a.topic_id + "/unread/").f()
                        .add("span").t(timePassed).f()
                        .f();
                    break;
                case "studioactivity":
                    ul.add("li")
                        .add("span").t("There was new activity in ").f()
                        .add("a").t(a.title).a("href", "/studios/" + a.gallery_id).f()
                        .add("span").t(timePassed).f()
                        .f();
                    break;
                case "favoriteproject":
                    ul.add("li")
                        .add("a").t(a.actor_username).a("href", "/users/" + a.actor_username).a("class", "username_link").f()
                        .add("span").t(" favorited your project ").f()
                        .add("a").t(a.project_title).a("href", "/projects/" + a.project_id).f()
                        .add("span").t(timePassed).f()
                        .f();
                    break;
                case "loveproject":
                    ul.add("li")
                        .add("a").t(a.actor_username).a("href", "/users/" + a.actor_username).a("class", "username_link").f()
                        .add("span").t(" loved your project ").f()
                        .add("a").t(a.title).a("href", "/projects/" + a.project_id).f()
                        .add("span").t(timePassed).f()
                        .f();
                    break;
                case "followuser":
                    ul.add("li")
                        .add("a").t(a.actor_username).a("href", "/users/" + a.actor_username).a("class", "username_link").f()
                        .add("span").t(" followed you").f()
                        .add("span").t(timePassed).f()
                        .f();
                    break;
                case "remixproject":
                    ul.add("li")
                        .add("a").t(a.actor_username).a("href", "/users/" + a.actor_username).a("class", "username_link").f()
                        .add("span").t(" remixed your project ").f()
                        .add("a").t(a.parent_title).a("href", "/projects/" + a.parent_id).f()
                        .add("span").t(" as ").f()
                        .add("a").t(a.title).a("href", "/projects/" + a.project_id).f()
                        .add("span").t(timePassed).f()
                        .f();
                    break;
                case "addcomment":
                    if (a.comment_type === 0) { //project
                        ul.add("li")
                            .add("a").a("href", "/users/" + a.actor_username).a("class", "username_link").t(a.actor_username).f()
                            .add("span").t(' commented "' + decodetext(a.comment_fragment) + '" on your project ').f()
                            .add("a").a("href", "/projects/" + a.comment_obj_id + "/#comments-" + a.comment_id).t(a.comment_obj_title).f()
                            .add("span").t(timePassed).f()
                            .f();
                    } else if (a.comment_type === 1) { //profile page
                        ul.add("li")
                            .add("a").a("href", "/users/" + a.actor_username).a("class", "username_link").t(a.actor_username).f()
                            .add("span").t(' commented "' + decodetext(a.comment_fragment) + '" on your profile ').f()
                            .add("a").a("href", "/users/" + a.comment_obj_title + "/#comments-" + a.comment_id).t(a.comment_obj_title).f()
                            .add("span").t(timePassed).f()
                            .f();
                    } else if (a.comment_type === 2) {
                        ul.add("li")
                            .add("a").a("href", "/users/" + a.actor_username).a("class", "username_link").t(a.actor_username).f()
                            .add("span").t(' commented "' + decodetext(a.comment_fragment) + '" on your studio ').f()
                            .add("a").a("href", "/studios/" + a.comment_obj_id + "/#comments-" + a.comment_id).t(a.comment_obj_title).f()
                            .add("span").t(timePassed).f()
                            .f();
                    } else {
                        console.warn("Comment type not found");
                    }
                    break;
                case "curatorinvite":
                    ul.add("li")
                        .add("a").a("href", "/users/" + a.actor_username).a("class", "username_link").t(a.actor_username).f()
                        .add("span").t(' invited you to curate ').f()
                        .add("a").a("href", "/studios/" + a.gallery_id).t(a.gallery_title).f()
                        .add("span").t(timePassed).f()
                        .f();
                    break;
                case "becomeownerstudio":
                    ul.add("li")
                        .add("a").a("href", "/users/" + a.actor_username).a("class", "username_link").t(a.actor_username).f()
                        .add("span").t(' promoted you to manager in ').f()
                        .add("a").a("href", "/studios/" + a.gallery_id).t(a.gallery_title).f()
                        .add("span").t(timePassed).f()
                        .f();
                    break;
                case "userjoin":
                    ul.add("li")
                        .add("span").t('Welcome to Scratch').f()
                        .add("span").t(timePassed).f()
                        .f();
                    break;
                default:
                    console.warn(a, "Not Found");
            }
        }
        const activity = document.querySelector(".splash-header > .activity");//better conditions for selection
        const messageHeader = activity.querySelector(".box-header");
        messageHeader.querySelector("h4").innerHTML = "Messages";

        //clears current content
        const messageBody = activity.querySelector(".box-content");
        messageBody.removeChild(messageBody.querySelector("ul"));
        ul.ap(messageBody);

        set_unread(users);
    }

    function set_unread (user) {
        if (user.has_messages || true) {
            let x = new XMLHttpRequest();
            x.onreadystatechange = () => {
                if (x.readyState == 4 && x.status == 200) {
                    let count = JSON.parse(x.responseText).count;
                    let messages = document.getElementById("messages").getElementsByTagName("li");

                    if (count > 0) {///site-api/messages/messages-clear/

                        console.log(user.token)
                        console.log(getCookie("scratchcsrftoken"))
                        element("button").t("Clear Messages").a({ "style": "float: right;" })
                            .e("click", () => {
                                fetch("https://scratch.mit.edu/site-api/messages/messages-clear/", {
                                    method: "POST",
                                    headers: {
                                        'X-CSRFToken': getCookie("scratchcsrftoken")
                                    }
                                })
                                    .then((res) => res.text())
                                    .then((res) => console.log(res))
                                    .catch((err) => {
                                        console.warn(err);
                                    })
                            })
                            .apthis(document.querySelector(".activity > .box-header"));
                    }

                    for (let i = 0; i < count; i++) {
                        if (GM_getValue("theme", false) === "dark") {
                            messages[i].setAttribute("style", "background-color: #36393f; opacity: 1;");
                        } else {
                            messages[i].setAttribute("style", "background-color: #eed; opacity: 1;");
                        }

                    }
                }
            };
            x.open("GET", "https://api.scratch.mit.edu/users/" + user.username + "/messages/count", true);
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
                    } else {
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
                a.addEventListener("mouseenter", (e) => {
                    const info = userinfo[a.getAttribute("href")], date = new Date(Date.parse(info.history.joined)), dif = calcDate(new Date(), date);
                    element("div").a("class", "userwindow").a("style", (GM_getValue("theme", false) === "dark") ? `position: absolute; left: ${e.pageX}px; top: ${(e.pageY + 10)}px; width: inherit; height: 20px; line-height: 20px; background-color: #000` : `position: absolute; left: ${e.pageX}px; top: ${(e.pageY + 10)}px; width: inherit; height: 20px; line-height: 20px; background-color: #fff`)
                        .t(`${info.username} joined ${dif} from ${info.profile.country}`)
                        .ap(document.body);
                });
                a.addEventListener("mouseleave", (e) => {
                    if (document.querySelector(".userwindow")) {
                        document.querySelector(".userwindow").parentElement.removeChild(document.querySelector(".userwindow"));
                    }
                });
            }
        }
        console.log("Finished user info");
    }

    function calcDate (date1, date2) {
        let diff = Math.floor(date1.getTime() - date2.getTime());
        let day = 1000 * 60 * 60 * 24;
        let months = Math.ceil(Math.floor(diff / day) / 31);
        let years = Math.floor(months / 12);
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

    function calcSmallest (date2) {
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
            if (document.querySelector(".blocks")) {
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
                            if (a.querySelector(".blocks")) {
                                for (let l = 0; l < a.getElementsByClassName("blocks").length; l++) {
                                    blocks.push(a.querySelectorAll(".blocks")[l]);
                                }
                            }
                        }
                        for (let a of posts1) {
                            if (a.querySelector(".blocks")) {
                                for (let l = 0; l < a.getElementsByClassName("blocks").length; l++) {
                                    blocks1.push(a.querySelectorAll(".blocks")[l]);
                                }
                            }
                        }
                        if (blocks.length > 0) {
                            for (let i = 0; i < blocks1.length; i++) {
                                blocks[i].setAttribute("id", i);
                                blocks[i].setAttribute("style", "cursor: pointer;");
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
                            if (a.querySelector(".blocks")) {
                                for (let l = 0; l < a.getElementsByClassName("blocks").length; l++) {
                                    blocks2.push(a.querySelectorAll(".blocks")[l]);
                                }
                            }
                        }
                        for (let a of posts1) {
                            if (a.querySelector(".blocks")) {
                                for (let l = 0; l < a.getElementsByClassName("blocks").length; l++) {
                                    blocks3.push(a.querySelectorAll(".blocks")[l]);
                                }
                            }
                        }
                        if (blocks2.length > 0) {
                            for (let i = 0; i < blocks3.length; i++) {
                                blocks2[i].setAttribute("id", i);
                                blocks2[i].setAttribute("style", "cursor: pointer;");
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
        let posts = document.getElementsByClassName("blockpost");
        for (let a of posts) {
            fetch(`https://scratch.mit.edu${a.querySelector(".box-head").querySelector("a").getAttribute("href")}source/`)
                .then((response) => {
                    if (response.status === 200) {
                        return response.text();
                    } else {
                        throw new Error("Issue loading BBCode from server");
                    }
                })
                .then((text) => {
                    const originalText = text, originalHtml = a.querySelector(".post_body_html").innerHTML;
                    element("button").a("style", "height: 15px; line-height: 14px; margin-top: -1px;").a("data-text", "html").t("BBCode")
                        .e("click", (e) => {
                            if (e.currentTarget.getAttribute("data-text") === "html") {
                                e.currentTarget.setAttribute("data-text", "text");
                                e.currentTarget.innerHTML = "Original";
                                a.querySelector(".post_body_html").innerHTML = originalText;
                            } else {
                                e.currentTarget.setAttribute("data-text", "html");
                                e.currentTarget.innerHTML = "BBCode";
                                a.querySelector(".post_body_html").innerHTML = originalHtml;
                            }
                        })
                        .ap(a.querySelector(".box-head"));
                })
                .catch((e) => {
                    console.warn("Error in BBcode loading", e);
                });
        }
    }
    //enlarging images on scratch
    function load_images () {
        console.log("load images");

        GM_addStyle("#display_img {position: fixed; left: 0px; top: 50px; opacity: 0.6; background-color: #000; width: 100%; height: calc(100% - 50px); display: none;} .postright img {cursor: zoom-in;}");
        //adds the faded background
        let load = setInterval((e) => {
            if (document.querySelector("#pagewrapper")) {
                clearInterval(load);

                let div = element("div").a("id", "display_img").apthis(document.getElementById("pagewrapper"));
                //div that holds the image
                let div1 = document.createElement("div");
                div1.setAttribute("style", "position: fixed; left: 0px; top: 50px; width: 100%; height: calc(100% - 50px); text-align: center; display: none; cursor: zoom-out;");
                //the img element that will display the image
                let img = document.createElement("img");
                img.setAttribute("src", "");
                img.setAttribute("id", "display_img_img");
                div1.appendChild(img);
                //this causes the faded background and image to disappear
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
                            //gets current image size
                            let img_width = event.currentTarget.clientWidth;
                            let img_height = event.currentTarget.clientHeight;
                            //going to be used for the dialation
                            let scale_factor = 1.5;//this is the maximun a small image can be scalled up
                            const display_width = window.innerWidth;
                            const display_height = window.innerHeight - 50;
                            let final_height = 0, final_width = 0;

                            final_height = img_height * scale_factor;
                            final_width = img_width * scale_factor;

                            //this is the best solution to deal with all different screen sizes and images sizes
                            //It have tried making multilayer if/else statemanets but they don't work well for this
                            while (final_height > display_height || final_width > display_width) {
                                scale_factor -= 0.1;
                                final_height = img_height * scale_factor;
                                final_width = img_width * scale_factor;
                            }
                            //makes it cerntered vertically and makes sure it has right hieght and width
                            img.setAttribute("style", "width:" + final_width + "px; height:" + final_height + "px; position: relative; top:" + (((display_height) / 2) - (final_height / 2)) + "px;");

                            div.style.display = "block";
                            div1.style.display = "block";
                        });
                    }
                }
            }
        }, 100);
    }

    function timer () {
        const currentYear = new Date().getFullYear(), currentMonth = new Date().getMonth(), currentDay = new Date().getDate(), newEvents = [{ date: "Jan 1", name: "New Year's Day" }, { date: "Feb 14", name: "Valentine's Day" }, { date: "Mar 17", name: "St. Patrick's Day" }, { newDate: "May 12, 2019", name: "Mother's Day" }, { newDate: "Jun 6, 2019", name: "Father's Day" }, { date: "Oct 31", name: "Halloween" }, { newDate: "Nov 22, 2018", name: "Thanksgiving" }, { date: "Dec 25", name: "Christmas Day" }, { date: "Dec 31", name: "New Year's Eve" }];
        let ordered = newEvents.map((e) => {
            let holiDate = (e.hasOwnProperty("newDate")) ? new Date(e.newDate).getTime() : new Date(e.date).setFullYear(currentYear);
            return {
                name: e.name,
                date: holiDate,
                dif: holiDate - new Date(currentYear, currentMonth, currentDay)
            }
        });
        ordered = ordered.sort((a, b) => {
            return a.dif - b.dif;
        });
        let Holiday;
        for (let a of ordered) {
            if (a.dif >= 0) {
                Holiday = a;
                break;
            }
        }

        if (Holiday) {
            const holidayDate = Holiday.date, holidayName = Holiday.name;
            let load = setInterval(() => {
                if (document.querySelector(".box-header")) {
                    clearInterval(load);
                    let dateElement = element("span").a("style", "float: right; color: #f6660d; padding-right: 5px; font-size: .85rem; padding-top: 5px;").t("").apthis(document.querySelector(".box-header"));
                    let x = setInterval(() => {
                        const difference = holidayDate - new Date().getTime(),
                            days = Math.floor(difference / (1000 * 60 * 60 * 24)),
                            hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                            minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                            seconds = Math.floor((difference % (1000 * 60)) / 1000);

                        if (difference < 0) {
                            clearInterval(x);
                            dateElement.innerHTML = "It's " + holidayName;
                        } else {
                            dateElement.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s 'til " + holidayName;
                        }
                    }, 0);
                }
            }, 1000);
        } else {
            console.log("No holiday found");
        }
    }

    function create_falling (link, img, extreme, cursor = null, audio = false) {
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
                this.img.setAttribute("style", "position: absolute; width: 25px; height: 25px; left: " + this.px + "px; top:" + this.py + "px;");
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
                    this.img.setAttribute("style", "position: fixed; index: -1; width: 25px; height: 25px; left: " + this.px + "px; top:" + this.py + "px; transform: rotateX(" + this.x + "deg) rotateY(" + this.y + "deg) rotateZ(" + this.z + "deg);");

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
                GM_addStyle("body,a:-webkit-any-link{cursor:url(" + cursor + "),auto;cursor:url(" + cursor + "),pointer;}#pagewrapper{background:linear-gradient(top,#ff3232 0,#fcf528 16%,#28fc28 32%,#28fcf8 50%,#272ef9 66%,#ff28fb 82%,#ff3232 100%);background:-moz-linear-gradient(top,#ff3232 0,#fcf528 16%,#28fc28 32%,#28fcf8 50%,#272ef9 66%,#ff28fb 82%,#ff3232 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%,#ff3232),color-stop(16%,#fcf528),color-stop(32%,#28fc28),color-stop(50%,#28fcf8),color-stop(66%,#272ef9),color-stop(82%,#ff28fb),color-stop(100%,#ff3232));background:-webkit-linear-gradient(top,#ff3232 0,#fcf528 16%,#28fc28 32%,#28fcf8 50%,#272ef9 66%,#ff28fb 82%,#ff3232 100%);background-size:1000%;-moz-background-size:1000%;-webkit-background-size:1000%;animation-name:fun-time-awesome;animation-duration:15s;animation-timing-function:linear;animation-iteration-count:infinite;animation-direction:alternate;animation-play-state:running;-moz-animation-name:fun-time-awesome;-moz-animation-duration:15s;-moz-animation-timing-function:linear;-moz-animation-iteration-count:infinite;-moz-animation-direction:alternate;-moz-animation-play-state:running;-webkit-animation-name:fun-time-awesome;-webkit-animation-duration:20s;-webkit-animation-timing-function:linear;-webkit-animation-iteration-count:infinite;-webkit-animation-direction:alternate;-webkit-animation-play-state:running}@keyframes fun-time-awesome{0%{background-position:left top}100%{background-position:left bottom}}@-moz-keyframes fun-time-awesome{0%{background-position:left top}100%{background-position:left bottom}}@-webkit-keyframes fun-time-awesome{0%{background-position:left top}100%{background-position:left bottom}}");
            }
        }
    }

    function load_extras () {
        if (GM_getValue("extras", true)) {
            create_falling("https://scratch.mit.edu/users/DeleteThisAcount/", ["http://scriftj.x10host.com/2aa.png"], true, "http://i.cubeupload.com/gIEPOl.png", "http://scriftj.x10host.com/Vaporwave.mp3");
        }
        if (GM_getValue("timer", true)) {
            timer();
        }
    }
    //add custom bbcode tags
    function load_custombb () {
        document.querySelectorAll('span[style="color:resimg"]').forEach(e => {
            $(e).replaceWith(`<img src="https://${e.innerHTML}"></img>`);
        });
        document.querySelectorAll('span[style="color:reshighlight"]').forEach(e => {
            $(e).replaceWith(`<mark>${e.innerHTML}</mark>`);
        });
        document.querySelectorAll('span[style="color:resleft"]').forEach(e => {
            $(e).replaceWith(`<p align="left">${e.innerHTML}</p>`);
        });
        document.querySelectorAll('span[style="color:resright"]').forEach(e => {
            $(e).replaceWith(`<p align="right">${e.innerHTML}</p>`);
        });
        document.querySelectorAll('a[href^="https://gist.github.com/"]').forEach(e => {
            var url = encodeURI('data:text/html;charset=utf-8,<body><script src="' + $(e).attr("href") + ".js" + '"></script></body>');
            $(e).append(`<br><iframe src='` + url + `' width="100%" height="400" scrolling="auto" frameborder="no" align="center"></iframe>`);
        });
    }
    //add extras bbcode buttons
    function add_bbbuttons () {
        let values = ["_createNew", ""], previousValue = "", previousSelection = "";
        console.log("added BB Buttons", document.querySelector(".markItUpContainer"));
        let load = setInterval(e => {
            if (document.querySelector(".markItUpContainer")) {
                clearInterval(load);

                $(`<li class="markItUpButton" id="Res1"><a title="Color" style="background-image: url('https://png.icons8.com/color-wheel/office/14/000000');" >Color</a></li>`)
                    .on("click", (e) => {
                        let BBstart = prompt("Enter a hexadecimal color w/ #:", "#FF0000"), constBB = "[color=" + BBstart + "]" + document.stringyBB + "[/color]";
                        replaceIt($('textarea')[0], constBB);
                    })
                    .insertAfter(".markItUpButton7")
                $(`<li class="markItUpButton" id="Res2"><a title="Code" style="background-image: url('https://png.icons8.com/code/office/16/000000');" >Code</a></li>`)
                    .on("click", (e) => {
                        let BBstart = prompt("Enter a programming language:", ""), constBB = "[code=" + ((BBstart) ? BBstart : "") + "]" + document.stringyBB + "[/code]";
                        replaceIt($('textarea')[0], constBB);
                    })
                    .insertAfter(".markItUpButton11");
                $(`<li class="markItUpButton" id="Res3"><a title="Center" style="background-image: url('https://png.icons8.com/align-center/office/16/000000');" >Center</a></li>`)
                    .on("click", (e) => {
                        let constBB = "[center]" + document.stringyBB + "[/center]";
                        replaceIt($('textarea')[0], constBB);
                    })
                    .insertAfter(".markItUpButton4");
                $(`<li class="markItUpButton" id="Res4"><a title="Project link" style="background-image: url('https://png.icons8.com/prototype/office/16/000000');" >Project Link</a></li>`)
                    .on("click", (e) => {
                        let BBstart = prompt("Enter a project ID:", ""), constBB = "[url=https://scratch.mit.edu/projects/" + BBstart + "/][img]https://cdn2.scratch.mit.edu/get_image/project/" + BBstart + "_282x210.png[/img][/url]";
                        replaceIt($('textarea')[0], constBB);
                    })
                    .insertAfter(".markItUpButton14");
                $(`<li class="markItUpButton" id="Res5"><a title="Very large" style="background-image: url('https://png.icons8.com/enlarge/office/14/000000');" >Very Large</a></li>`)
                    .on("click", (e) => {
                        let constBB = "[color=res.large]" + document.stringyBB + "[/color]";
                        alert("This will only appear on the main page, not the preview");
                        replaceIt($('textarea')[0], constBB);
                    })
                    .insertAfter(".markItUpButton7");
                $(`<li class="markItUpButton" id="Res6"><a title="Other IMG" style="background-image: url('https://png.icons8.com/picture/office/14/000000');" >Other IMG</a></li>`)
                    .on("click", (e) => {
                        let BBstart = prompt("Enter an img URL without http tag:", ""), constBB = "[color=transparent][color=res.img]" + BBstart + "[/color][/color]";
                        alert("This will only appear on the main page, not the preview");
                        replaceIt($('textarea')[0], constBB);
                    })
                    .insertAfter(".markItUpButton5");
                $(`<li class="markItUpButton" id="Res7"><a title="Align Left" style="background-image: url('https://png.icons8.com/align-text-left/office/16/000000');" >Align Left</a></li>`)
                    .on("click", (e) => {
                        let constBB = "[color=res.left]" + document.stringyBB + "[/color]";
                        alert("This will only appear on the main page, not the preview");
                        replaceIt($('textarea')[0], constBB);
                    })
                    .insertAfter("#Res3");
                $(`<li class="markItUpButton" id="Res8"><a title="Align Right" style="background-image: url('https://png.icons8.com/align-text-right/office/16/000000');" >Align Right</a></li>`)
                    .on("click", (e) => {
                        let constBB = "[color=res.right]" + document.stringyBB + "[/color]";
                        alert("This will only appear on the main page, not the preview");
                        replaceIt($('textarea')[0], constBB);
                    })
                    .insertAfter("#Res7");
                $(`<li class="markItUpButton" id="Res9"><a title="Highlight" style="background-image: url('https://png.icons8.com/highlight/office/14/000000');" >Highlight</a></li>`)
                    .on("click", (e) => {
                        let constBB = "[color=res.highlight]" + document.stringyBB + "[/color]";
                        alert("This will only appear on the main page, not the preview");
                        replaceIt($('textarea')[0], constBB);
                    })
                    .insertAfter("#Res1");
                $(`<li class="markItUpButton" id="Res10"><p>Get </p></li>`)
                    .on("click", (e) => {
                        getText();
                    })
                    .insertAfter(".markItUpButton16");


                if (url.includes("topic/add")) {
                    element("div").a("class", "box-head")
                        .add("button").e("click", (e) => {
                            saveText($("#id_name").val(), $("#id_body").val(), { forum: url.substring(url.indexOf("discuss/") + 8, url.indexOf("/topic")) });
                        }).add("span").t("Save as Draft").f().f()
                        .apAfter("#reply > .box-content");


                    /*$("<button style='float: right;'><span>Save as Draft<span></button>")
                        .on("click", (e) => {
                            console.log("saved");
                            saveText($("#id_name").val(), getSelectionText(), {forum: url.substring(url.indexOf("discuss/") + 8, url.indexOf("/topic"))});
                        })
                        .insertAfter(document.querySelector());*/
                }

                /*$(`<select id="Res11"><option value="" selected>Saved/Create Text Selection</option><option value="_createNew">Create New</option></select>`)
                    .change((e) => {
                        let selection = e.currentTarget.value;
                        if (selection != "") {
                            if (selection === "_createNew") {
                                let newTitle = prompt("Enter the name to save under:", "default");
                                if (values.includes(newTitle)) {
                                    newTitle = prompt("You are about to overwrite a previous save. If you wish to continue, then click cancel. Otherwise enter a new unique title.", newTitle);
                                } else {
                                    values.push(newTitle);
                                }
                                saveText(newTitle, document.querySelector("textarea").value);
                                previousValue = document.querySelector("textarea").value;
                                $(`<option value="${newTitle}">${newTitle}</option>`).appendTo("#Res11");
                                document.querySelector("#Res11").value = newTitle;
                            } else {
                                if (document.querySelector("textarea").value != previousValue) {
                                    let saveCurrent = confirm("Do you want to save current text?");
                                    if (saveCurrent == true) {
                                        let newTitle = prompt("Enter the name to save under(Should be already filled out):", previousSelection);
                                        saveText(newTitle, document.querySelector("textarea").value);
                                    }
                                }
                                getData((back) => {
                                    if (back.hasOwnProperty("message") && back["message"].length > 0) {
                                        let found = false;
                                        for (let a of back["message"]) {
                                            if (a.title == selection) {
                                                document.querySelector("textarea").value = a.body;
                                                previousValue = a.body;
                                                found = true;
                                                break;
                                            }
                                        }
                                        if (!found) {
                                            document.querySelector("textarea").value = "";
                                            previousValue = "";
                                        }
                                    }
                                });
                            }
                        }
                        previousSelection = "";
                    })
                    .insertAfter("#Res10");


                $(`<button id="Res12">Delete</button>`)
                    .on("click", (e) => {
                        deleteText(document.querySelector("#Res11").value);
                        values.splice(values.indexOf(document.querySelector("#Res11").value), 1);
                        $(`#Res11[value="${document.querySelector("#Res11").value}"]`).remove();
                        document.querySelector("#Res11").value = "";
                        previousValue = "";

                    })
                    .insertAfter(".linksb");

                    $(`<button id="Res10">Save</button>`)
                    .on("click", (e) => {
                        let name = document.querySelector("#Res11").value;
                        if (name == "") {
                            name = prompt("Enter the name to save under:", "default");
                        }
                        previousValue = document.querySelector("textarea").value;
                        saveText(name, document.querySelector("textarea").value);
                    })
                    .insertAfter(".linksb");*/

                document.onselectionchange = () => {
                    document.stringyBB = getSelectionText();
                };

                //adds the seection for the new text
                /*getData((back) => {
                    if (back.hasOwnProperty("message") && back["message"].length > 0) {
                        for (let a of back["message"]) {
                            if (!values.includes(a.title)) {
                                values.push(a.title);
                                let title = a.title;
                                $("#Res11").append($(`<option value="${title}">${title}</option>`));
                            }
                        }
                    }
                });*/
            }
        }, 100);
    }
    function getSelectionText () {
        if (window.getSelection) {
            try {
                var ta = $('textarea').get(0);
                return ta.value.substring(ta.selectionStart, ta.selectionEnd);
            } catch (e) {
                console.log('Cant get selection text')
            }
        }
        // For IE
        if (document.selection && document.selection.type != "Control") {
            return document.selection.createRange().text;
        }
    }
    function replaceIt (txtarea, newtxt) {
        $(txtarea).val(
            $(txtarea).val().substring(0, txtarea.selectionStart) +
            newtxt +
            $(txtarea).val().substring(txtarea.selectionEnd)
        );
    }
    function getText () {
        let info;
        getData((data) => {
            info = data;
            console.log(info, data);
        });
    }
    function load_draft () {
        let load = setInterval(() => {
            if (document.getElementById("category_body_4")) {
                console.log("load Draft");
                clearInterval(load);

                //these will always be out of one second
                const fade = (speed, element, time) => {
                    let opacity = 1;
                    const iteration = 1 * (speed / time);
                    let fading = setInterval(() => {
                        if (opacity > 0) {
                            opacity -= iteration;
                        } else {
                            opacity = 0;
                            clearInterval(fading);
                        }
                        element.style.opacity = opacity;
                    }, speed);
                };

                let opened = false;

                //adds new drafts forum location
                let draftTitle = element("div").a("class", "box").a("style", "cursor: pointer; user-select: none;").a("id", "drafts")
                    .append(
                        element("div").a("class", "box-head")
                            .e("click", (event) => {
                                if (!opened) {
                                    opened = true;
                                    let elements = [document.getElementById("category_body_4"), document.getElementById("category_body_2"), document.getElementById("category_body_5"), document.getElementById("category_body_6"), document.getElementById("category_body_7")];
                                    let totalTime = 500;
                                    elements.forEach((a) => {
                                        fade(10, a, totalTime);//refresh rate per total time, dom element, total time to execute
                                        collapse_full(10, a, totalTime);
                                    });
                                    setTimeout(() => {
                                        let element = document.getElementById("draftsTable");
                                        element.setAttribute("style", "height: 0px;");
                                        const elementNames = ["marginBottom", "paddingBottom", "height", "paddingTop", "marginTop"];
                                        const target = document.querySelector("#draftsTable table");
                                        let height = 0;
                                        for (let a of elementNames) {
                                            if (target.style.hasOwnProperty(a)) {
                                                height += Number(window.getComputedStyle(target, null)[a].slice(0, -2)) || 0;
                                            }
                                        }
                                        console.log(height);
                                        const speed = 10;
                                        const interval = height * (speed / 500);
                                        let currentHeight = 0;
                                        let time = setInterval(() => {
                                            if (currentHeight >= height) {
                                                clearInterval(time);
                                                currentHeight = height;
                                            } else {
                                                currentHeight += interval;
                                            }
                                            element.style.height = currentHeight + "px";
                                        }, 10);

                                        let svgElement = draftTitle.querySelector(".box-head h4 svg");
                                        svgElement.setAttribute("style", "opacity: 0; display: block; float: right;");
                                        let change = 1 * (speed / 500);
                                        let opacity = 0;

                                        let time2 = setInterval(() => {
                                            if (opacity >= 1) {
                                                clearInterval(time2);
                                                opacity = 1;
                                            } else {
                                                opacity += change;
                                            }
                                            svgElement.style.opacity = opacity;
                                        }, 10);
                                    }, totalTime + 250);
                                }
                            })
                            .append(
                                element("h4").t("Drafts")
                            )
                    )
                    .apAfter("#category_body_4");

                let svgWrite = svg("write");
                svgWrite.addEventListener("click", (e) => {
                    element("div").a({ "class": "box", "style": "padding: 5px 20px;" })
                        .add("div").a({ "class": "box-content" }).add("input").a({ "style": "width: calc(100% - 10px);", "placeholder": "Title" }).f().f()
                        .apAfter("#drafts");
                });
                svgWrite.setAttribute("style", "display: none; float: right;");
                draftTitle.querySelector(".box-head h4").appendChild(svgWrite);


                element("div").a("class", "box-content").a("style", "height: 0px; display: none;").a("id", "draftsTable")
                    .append(element("table").a("style", "margin-bottom: 20px; box-shadow: 0 2px 3px rgba(34,25,25,0.3);")
                        .append(element("thead")
                            .append(element("tr")
                                .append(element("td").t("Name"))
                                .append(element("td").t("Forum"))
                            )
                        )
                        .append(element("tbody").a("id", "draftTable")
                        ))
                    .apAfter("#drafts");

                getData((data) => {
                    if (data.hasOwnProperty("message")) {
                        let target = document.getElementById("draftTable");
                        data["message"].forEach((a) => {
                            element("tr")
                                .append(element("td").t(a.title))
                                .append(element("td").t(a.meta.forum))
                                .ap(target);
                        });
                    }
                });

                GM_addStyle("#draftTable td {border: 1px solid #e0e0e0}");
            }
        }, 100);
    }

    function saveText (title, textbody, metaData) {
        //console.log(document.querySelector("textarea").value);
        let info;
        getData((data) => {
            console.log(data);
            info = data;
            if (info.hasOwnProperty("message")) {
                let found = false;
                for (let a of info["message"]) {
                    if (a.title == title) {
                        a.body = textbody;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    info["message"].push({
                        title: title,
                        body: textbody,
                        meta: metaData
                    });
                }
            } else {
                info["message"] = [];
                info["message"].push({
                    title: title,
                    body: textbody,
                    meta: metaData
                });
            }
            setData("message", info["message"]);
        });
    }

    function deleteText (title) {
        getData((info) => {
            if (info.hasOwnProperty("message") && info["message"].length > 0) {
                info["message"] = info["message"].filter((e) => {
                    return e.title != title;
                });
                setData("message", info["message"]);
                console.log(info["message"]);
            }
        });
    }
    function inIframe () {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }
    //Tansitions and other cool functions
    function collapse_full (speed, element, time) { //this function will collapse margin, padding, and width in order (this will ignore the border)
        const totalTime = time;
        let totalHeight = element.getBoundingClientRect().height;
        //sets up data for each layer
        const elementNames = ["marginBottom", "paddingBottom", "height", "paddingTop", "marginTop"];
        let heights = elementNames.map((a) => {
            return window.getComputedStyle(element, null)[a].slice(0, -2);
        });
        let newElementNames = [];
        heights = heights.filter((a, i) => {
            if (a > 0) {
                newElementNames.push(elementNames[i]);
            }
            return a > 0;
        })
        let percentageTime = heights.map((a) => {
            return a / totalHeight;
        });
        let runTime = percentageTime.map((a) => {
            return totalTime * a;
        });
        let intervalSpeeds = runTime.map((a, i) => {
            return heights[i] * (speed / a) || 0;
        });

        console.log(newElementNames, heights, percentageTime, runTime, intervalSpeeds);

        if (newElementNames.length > 0) {
            let run = (id) => {
                let height = heights[id];
                let running = setInterval(() => {
                    height -= intervalSpeeds[id];
                    element.style[newElementNames[id]] = height + "px";
                }, speed);
                setTimeout(() => {
                    clearInterval(running);
                    height = 0;
                    element.style[newElementNames[id]] = height + "px";
                    id += 1;
                    if (id > newElementNames.length) {
                        element.style.display = "none";
                    } else {
                        run(id);
                    }
                }, runTime[id]);
            };
            run(0);
        } else {
            element.style.display = "none";
        }
    }

    function calculate_height_children (domElement) {
        let height = 0;
        let children = domElement.children;
        for (let a of children) {
            const elementNames = ["marginBottom", "paddingBottom", "height", "paddingTop", "marginTop"];
            elementNames.forEach((b) => {
                if (a.style.hasOwnProperty(b)) {
                    height += Number(window.getComputedStyle(a, null)[b].slice(0, -2)) || 0;
                }
            });
        }

        return height;
    }
    //this function is for svg elements
    function svg (name, attr, action) {
        const svgMap = new Map([
            ["write", `<svg class="svg-icon" viewBox="0 0 20 20"><path d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"></path></svg>`]
            , ["downCircle", `<svg class="svg-icon" viewBox="0 0 20 20"><path d="M13.962,8.885l-3.736,3.739c-0.086,0.086-0.201,0.13-0.314,0.13S9.686,12.71,9.6,12.624l-3.562-3.56C5.863,8.892,5.863,8.611,6.036,8.438c0.175-0.173,0.454-0.173,0.626,0l3.25,3.247l3.426-3.424c0.173-0.172,0.451-0.172,0.624,0C14.137,8.434,14.137,8.712,13.962,8.885 M18.406,10c0,4.644-3.763,8.406-8.406,8.406S1.594,14.644,1.594,10S5.356,1.594,10,1.594S18.406,5.356,18.406,10 M17.521,10c0-4.148-3.373-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.147,3.374,7.521,7.521,7.521C14.148,17.521,17.521,14.147,17.521,10"></path></svg>`]
            , ["upCircle", `<svg class="svg-icon" viewBox="0 0 20 20"><path d="M13.889,11.611c-0.17,0.17-0.443,0.17-0.612,0l-3.189-3.187l-3.363,3.36c-0.171,0.171-0.441,0.171-0.612,0c-0.172-0.169-0.172-0.443,0-0.611l3.667-3.669c0.17-0.17,0.445-0.172,0.614,0l3.496,3.493C14.058,11.167,14.061,11.443,13.889,11.611 M18.25,10c0,4.558-3.693,8.25-8.25,8.25c-4.557,0-8.25-3.692-8.25-8.25c0-4.557,3.693-8.25,8.25-8.25C14.557,1.75,18.25,5.443,18.25,10 M17.383,10c0-4.07-3.312-7.382-7.383-7.382S2.618,5.93,2.618,10S5.93,17.381,10,17.381S17.383,14.07,17.383,10"></path></svg>`]
            , ["rightCircle", `<svg class="svg-icon" viewBox="0 0 20 20"><path d="M12.522,10.4l-3.559,3.562c-0.172,0.173-0.451,0.176-0.625,0c-0.173-0.173-0.173-0.451,0-0.624l3.248-3.25L8.161,6.662c-0.173-0.173-0.173-0.452,0-0.624c0.172-0.175,0.451-0.175,0.624,0l3.738,3.736C12.695,9.947,12.695,10.228,12.522,10.4 M18.406,10c0,4.644-3.764,8.406-8.406,8.406c-4.644,0-8.406-3.763-8.406-8.406S5.356,1.594,10,1.594C14.643,1.594,18.406,5.356,18.406,10M17.521,10c0-4.148-3.374-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.147,3.374,7.521,7.521,7.521C14.147,17.521,17.521,14.147,17.521,10"></path></svg>`]
            , ["leftCircle", `<svg class="svg-icon" viewBox="0 0 20 20"><path d="M11.739,13.962c-0.087,0.086-0.199,0.131-0.312,0.131c-0.112,0-0.226-0.045-0.312-0.131l-3.738-3.736c-0.173-0.173-0.173-0.454,0-0.626l3.559-3.562c0.173-0.175,0.454-0.173,0.626,0c0.173,0.172,0.173,0.451,0,0.624l-3.248,3.25l3.425,3.426C11.911,13.511,11.911,13.789,11.739,13.962 M18.406,10c0,4.644-3.763,8.406-8.406,8.406S1.594,14.644,1.594,10S5.356,1.594,10,1.594S18.406,5.356,18.406,10 M17.521,10c0-4.148-3.373-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.148,3.374,7.521,7.521,7.521C14.147,17.521,17.521,14.148,17.521,10"></path></svg>`]
        ]);

        let dom = document.createRange().createContextualFragment(svgMap.get(name)).firstChild;

        if (attr && attr.constructor === {}.constructor) {
            for (let a in attr) {
                dom.setAttribute(a, attr[a]);
            }
        }

        if (action) {
            dom.addEventListener("click", action);
        }

        return dom;
    }

    //the following is my own custom dom creation object that I continue to improve as I use it
    function element (name) {
        return new _element(name);
    }
    class _element {
        //eventually add arguments for function inputs
        constructor(name) {
            this.dom = document.createElement(name);
        }
        a (name, value = "") {
            if (name.constructor === {}.constructor) {
                for (let a in name) {
                    this.dom.setAttribute(a, name[a]);
                }
            } else {
                this.dom.setAttribute(name, value);
            }
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
        add (elementName) {
            let newElement = element(elementName);
            newElement.pointer = this;
            return newElement;
        }
        addDom (domElement) {
            this.dom.appendChild(domElement);
            return this;
        }
        f () {
            this.pointer.append(this);
            return this.pointer;
        }
        apAfter (target) {
            target = document.querySelector(target);
            target.parentElement.insertBefore(this.dom, target.nextSibling);
            return this.dom;
        }
    }
})();
