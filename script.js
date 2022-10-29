var comps = getComps()
var footageItems = getFootage()

// UI
var mainWindow = new Window('palette', 'Label and Remove Unused Items', undefined)
mainWindow.orientation = 'row'
var labelBtn = mainWindow.add('button', undefined, 'Label used & unused')
var removeAllBtn = mainWindow.add('button', undefined, 'Remove all unused')

labelBtn.onClick = function() {
    labelFootage(comps, footageItems)
}

removeAllBtn.onClick = function() {
    removeUnusedFootage(comps, footageItems)
}

mainWindow.center()
mainWindow.show()

// Logic
function labelFootage(comps, footages) {
    app.beginUndoGroup('Identify Used Footage')
    for (var i = 0; i < comps.length; i++) {
        for (var l = 1; l <= comps[i].numLayers; l++) { // iterates the comp layers
            if (comps[i].layer(l).source) { // if layers has a source
                for (var f = 0; f < footages.length; f++) { // iterates footage items & compares each one to see if it exists
                    if (comps[i].layer(l).source == footages[f]) {
                        comps[i].layer(l).source.label = 9 // add green label
                    }
                }
            }
        }
    }
    // iterates the footage items. if any are not orange (used), turns them purple (unused)
    for (var i = 0; i < footages.length; i++) {
        if(footages[i].label != 9) {
            footages[i].label = 1 // add red label
        }
    }
    app.endUndoGroup();
}

function removeUnusedFootage(comps, footages) {
    app.beginUndoGroup('Remove Unused Footage')
    for (var i = 0; i < comps.length; i++) {
        for (var l = 1; l <= comps[i].numLayers; l++) { // iterates the comp layers
            if (comps[i].layer(l).source) { // if layers has a source
                for (var f = 0; f < footages.length; f++) { // iterates footage items & compares each one to see if it exists
                    if (comps[i].layer(l).source == footages[f]) {
                        comps[i].layer(l).source.label = 9 // add green label
                    }
                }
            }
        }
    }
    // iterates the footage items. if any are not orange (used), removes them
    for (var i = 0; i < footages.length; i++) {
        if(footages[i].label != 9) {
            footages[i].remove()
        }
    }
    app.endUndoGroup();
}

function getComps() {
    var array = []
    for (var i = 1; i <= app.project.numItems; i++) {
        if(app.project.item(i) instanceof CompItem) {
            array.push(app.project.item(i))
        }
    }
    return array
}

function getFootage() {
    var array = []
    for (var i = 1; i <= app.project.numItems; i++) {
        if(app.project.item(i).mainSource) {
            if (app.project.item(i).mainSource.file) {
                array.push(app.project.item(i))
            }
        }
    }
    return array
}