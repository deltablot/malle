# How to contribute to malle

## Branches

The `master` branch corresponds to the latest stable version. You should work from and target the `dev` branch.

## Dev server

First, setup continuous build with `npm run watch` in a spare terminal/tmux pane, so changes in source code are immediatly visible in produced javascript files.

Then, if your user is in the `docker` group, start a dev server with `npm run dev-server`. This will start a webserver and you can then access the demo at http://localhost:4813/demo.

Run `npm run stop-dev` to stop the dev server and remove the container.

## Pre-commit hook

Go into .git/hooks. And `cp pre-commit.sample pre-commit`. Edit it and before the last line with the “exec”, add this:

~~~bash
# malle pre-commit hook
reset="\e[0m"
red="\e[0;31m"
set -e
if ! npm run pre-commit
then
    printf "${red}error${reset} Pre-commit script found a problem!.\n"
    exit 1
fi
~~~
