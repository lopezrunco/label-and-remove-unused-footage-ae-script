var comps = getComps()
var footageItems = getFootage()

// UI
var mainWindow = new Window('palette', 'Label and Remove Unused Items', undefined)
mainWindow.orientation = 'row'
var labelBtn = mainWindow.add('button', undefined, 'Label used & unused')
var removeAllBtn = mainWindow.add('button', undefined, 'Remove unused files')
var removeImagesBtn = mainWindow.add('button', undefined, 'Remove unused images')
var removeVideosBtn = mainWindow.add('button', undefined, 'Remove unused videos')
var removeAudioBtn = mainWindow.add('button', undefined, 'Remove unused audio')

labelBtn.onClick = function() {
    labelFootage(comps, footageItems)
}
removeAllBtn.onClick = function() {
    removeUnusedFootage(comps, footageItems)
}
removeImagesBtn.onClick = function() {
    removeUnusedImages(comps, footageItems)
}
removeVideosBtn.onClick = function() {
    removeUnusedVideos(comps, footageItems)
}
removeAudioBtn.onClick = function() {
    removeUnusedAudio(comps, footageItems)
}

mainWindow.center()
mainWindow.show()

// Logic
function labelFootage(comps, footages) {
    app.beginUndoGroup('Identify Used Footage')
    commentUsed(comps, footages)
    // add 'Unused' comment
    for (var i = 0; i < footages.length; i++) {
        if(footages[i].comment != 'On use') {
            footages[i].comment = 'Unused'
        }
    }
    app.endUndoGroup();
}

function removeUnusedFootage(comps, footages) {
    app.beginUndoGroup('Remove Unused Footage')
    commentUsed(comps, footages)
    // delete unused footage
    for (var i = 0; i < footages.length; i++) {
        if(footages[i].comment != 'On use') {
            footages[i].remove()
        }
    }
    app.endUndoGroup();
}

function removeUnusedImages(comps, footages) {
    app.beginUndoGroup('Remove Unused Images')
    commentUsed(comps, footages)
    removeByType(footages, 'jpg')
    removeByType(footages, 'png')
    app.endUndoGroup();
}

function removeUnusedVideos(comps, footages) {
    app.beginUndoGroup('Remove Unused Videos')
    commentUsed(comps, footages)
    removeByType(footages, 'mp4')
    removeByType(footages, 'mov')
    app.endUndoGroup();
}

function removeUnusedAudio(comps, footages) {
    app.beginUndoGroup('Remove Unused Audio')
    commentUsed(comps, footages)
    removeByType(footages, 'mp3')
    removeByType(footages, 'wav')
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

function commentUsed(comps, footages) {
    for (var i = 0; i < comps.length; i++) {
        for (var l = 1; l <= comps[i].numLayers; l++) { // iterate the comp layers
            if (comps[i].layer(l).source) { // if layers has a source
                for (var f = 0; f < footages.length; f++) { // iterate footage items & compare each one to see if it exists, if true, add an 'On use' comment
                    if (comps[i].layer(l).source == footages[f]) {
                        comps[i].layer(l).source.comment = 'On use'
                    }
                }
            }
        }
    }
}

function removeByType(footages, type) {
    for (var i = 0; i < footages.length; i++) {
        if(footages[i].comment != 'On use') {
            var item = footages[i]
            if (item.name.substring(item.name.length-3, item.name.length).toLowerCase() == type) {
                footages[i].remove()
            }
        }
    }
}