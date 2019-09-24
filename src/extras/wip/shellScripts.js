// Proposals to add to Shell.js scripts to automatically clear app cache from terminal build commands

/**
 * Related Files
 * https://github.com/CommunityKit/yack-connector-builder/blob/master/webpack.config.js
 * https://github.com/CommunityKit/yack-connector-builder/blob/5776c29881a2dd0be46bb0813ab14df053f067a0/src/index.ts
 * 
 * Libraries
 * https://github.com/shelljs/shelljs
 * 
 * Docs
 * https://www.npmjs.com/package/shelljs
 * https://documentup.com/shelljs/shelljs#testexpression
 * https://devhints.io/shelljs
 * 
 * Runkit
 * https://npm.runkit.com/shelljs
 * 
 * Example Setting Shell Issue: https://github.com/shelljs/shelljs/issues/767
 */



// Windows: C:\Users\<user>\AppData\Roaming\<yourAppName>\Cache
// Linux: /home/<user>/.config/<yourAppName>/Cache
// OS X: /Users/<user>/Library/Application Support/<yourAppName>/Cache

// cd "$HOME/Library/Application Support/" && rm -R Yack-Staging
var shell = require("shelljs");

//TBD Yack-Staging folder may be different???


//Updates to yack-connector-builder index.ts
argParse.addArgument(["--clearCache"], {
    nargs: 0,
    help: "Clears local connector's cache files."
});
if(args.clearCache){
    // Conditionally test which operating system the app is currently running on

    if(shell.test('-e','C:/Users//AppData/Local/Yack-Staging')){
        // Is Windows
        // '/Users/<you>/AppData/Local/Yack-Staging'
        shell.rm('-R', 'C:/Users//AppData/Local/Yack-Staging');
    }else if(shell.test('-e','~/.config/Yack-Staging')){
        // Is Linux
        shell.rm('-R', '~/.config/Yack-Staging');
    }else if(shell.test('-e','~/Library/Application Support/Yack-Staging')){
        // Is MacOs
        shell.rm('-R', '~/Library/Application Support/Yack-Staging');
    }
}


// shell.cd('$HOME/Library/Application Support/')
// shell.rm('-R', '')


// Double check that developers can't use the `--publish` flag in terminal