"use strict";

function build(buildJson) {
    var buildDiv = $('<div></div>').addClass('progress-bar'),
        barDiv   = $('<div></div>');
        
    function updateProgress(percent) {
        barDiv.setAttribute('style', 'width: ' + build.progress + '%');
    }
    
    function refresh(newBuildJson) {
        updateProgress(newBuildJson.progress);
    }
    
    buildDiv.appendChild(barDiv);
    refresh(buildJson);
    
    return {
        updateFrom: refresh,
        getContent: function() { return buildDiv; },
        getId: function() { return "buildId"; }
    };
}

function target(targetJson) {
    var currentTargetJson = {},
        targetDiv = $('<div></div>').addClass('target');
    
    function refresh(newTargetJson) {
        var lastTargetJson = currentTargetJson;
        
        currentTargetJson = newTargetJson;
        if (lastTargetJson.status !== newTargetJson.status) {
            targetDiv.removeClass(lastTargetJson.status);
            targetDiv.addClass(newTargetJson.status);
        }
        
        $(targetDiv).children('.progress-bar').remove();
        for (i in newTargetJson.builds) {
            targetDiv.appendChild(build(newTargetJson.builds[i]).getContent());
        }
    }
    
    refresh(targetJson);
    
    return {
        updateFrom: refresh,
        getContent: function() { return targetDiv; },
        getId: function() { return targetJson.id; }
    };
}

function addBuild(targetDiv, build) {
     var buildDiv = document.createElement('div'),
         barDiv   = document.createElement('div');
     
     buildDiv.setAttribute('class', 'progress-bar');
     barDiv.setAttribute('style', 'width: ' + build.progress + '%');
     buildDiv.appendChild(barDiv);
     targetDiv.appendChild(buildDiv);
}

function updateTarget(radiatorDiv, target) {
    var targetDivId = 'target_' + target.id,
        targetDiv = document.getElementById(targetDivId);
    
    if (!targetDiv) {
        targetDiv = document.createElement('div');
        targetDiv.setAttribute('id', targetDivId);
        targetDiv.innerHTML = '<span>' + target.name + '</span>';
    }
  
    targetDiv.setAttribute('class', 'target ' + target.status);
    $(targetDiv).children('.progress-bar').remove();
    
    for (i in target.builds) {
        addBuild(targetDiv, target.builds[i]);
    }
    radiatorDiv.appendChild(targetDiv);
}

function refreshTargets(radiatorDiv) {
    $.getJSON('landscapeobservation.json', { landscapeName: 'HIP' }, function(targetList) {
        var targets = targetList.targets.sort(function(a, b) {
            if (a.status === b.status) {
                return (a.builds.length > b.builds.length) ? -1 : (a.builds.length < b.builds.length) ? 1 : 0;
            }
            if (a.status === 'BROKEN') {
                return -1;
            }
            return 1;
        });
        
        for (i in targets) {
            updateTarget(radiatorDiv, targets[i]);
        }
    });
}

function start() {
    var radiatorDiv = document.getElementById('radiator');
    refreshTargets(radiatorDiv);
    setInterval(function(){ refreshTargets(radiatorDiv); }, 1000);
}

window.onload = start;
